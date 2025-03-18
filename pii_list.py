import easyocr
import numpy as np
import io
from PIL import Image
import re
import cv2
import warnings
from pyzbar.pyzbar import decode
from datetime import datetime
from concurrent.futures import ThreadPoolExecutor

class PIIDetector:
    PII_PATTERNS = {
        "Permanent Account Number": r'\b[A-Z]{5}[0-9]{4}[A-Z]\b',
        "Aadhaar Number": r'\b\d{12}\b|\b\d{4}[\s\n]?\d{4}[\s\n]?\d{4}\b',  # Updated regex
        "Driving License Number": r'\b[A-Za-z0-9]{4}[- ]?\d{9,13}\b',
        "Passport Number": r'\b[A-Z]{1}[0-9]{7,9}\b',
        "Voter ID": r'[A-Z]{2,3}[0-9]{7,8}',
        "Credit Card": r'\b\d{4}\s\d{4}\s\d{4}\s\d{4}\b'
    }
    
    def __init__(self):
        warnings.filterwarnings("ignore", category=FutureWarning, module="easyocr")
        warnings.filterwarnings("ignore", category=DeprecationWarning, module="PIL")
        warnings.filterwarnings("ignore", category=RuntimeWarning, module="pyzbar")
        self.reader = easyocr.Reader(['en'], gpu=True)

    def correct_pan(self, text):
        if len(text) == 10:
            first_five = text[:5].replace('0', 'O').replace('5','S').replace('7','T').replace('1','I').upper()
            next_four = text[5:9].replace('O', '0').replace('S','5').replace('T','7').replace('I','1').replace('Z','7')
            last_char = text[9].replace('8','B')
            corrected_text = first_five + next_four + last_char
            return corrected_text
        return text

    def combine_aadhaar_groups(self, results):
        aadhaar_groups = []
        combined_aadhaar = []
        for (bbox, text, prob) in results:
            if re.match(r'^\d{4}$', text):
                aadhaar_groups.append((bbox, text, prob))
        aadhaar_groups.sort(key=lambda x: (x[0][0][1], x[0][0][0]))
        if len(aadhaar_groups) == 3:
            combined_text = ''.join([group[1] for group in aadhaar_groups])
            combined_bbox = [
                aadhaar_groups[0][0][0],
                aadhaar_groups[2][0][1],
                aadhaar_groups[2][0][2],
                aadhaar_groups[0][0][3]
            ]
            combined_prob = min([group[2] for group in aadhaar_groups])
            combined_aadhaar.append((combined_bbox, combined_text, combined_prob))

        return combined_aadhaar

    def filter_results(self, results, patterns):
        filtered_results = []
        combined_aadhaar = self.combine_aadhaar_groups(results)
        if combined_aadhaar:
            filtered_results.extend(combined_aadhaar)
        for (bbox, text, prob) in results:
            for pattern_name, pattern in patterns.items():
                if pattern_name == "Permanent Account Number":
                    text = self.correct_pan(text)
                if re.search(pattern, text):
                    filtered_results.append((bbox, text, prob))
                    break
        return filtered_results

    def extract_text_from_image(self, image):
        try:
            data = self.reader.readtext(np.array(image))
            filtered_data = self.filter_results(data, self.PII_PATTERNS)
            return filtered_data
        except Exception as e:
            print(f"Error extracting text from image: {e}")
            return None

    def load_names(self, name_file_path):
        with open(name_file_path, 'r') as file:
            names = {line.strip().lower() for line in file.readlines()}
        return names
    
    def load_ignore_words(self, ignore_file_path):
        with open(ignore_file_path, 'r') as file:
            ignore_words = {line.strip().lower() for line in file.readlines()}
        return ignore_words

    def _process_word(self, word, bbox, names, ignore_words):
        if word in ignore_words:
            return None
        if word in names:
            return (bbox, word)
        return None

    def detect_names(self, image, names, ignore_words):
        detected_names = []
        try:
            data = self.reader.readtext(np.array(image))
            with ThreadPoolExecutor() as executor:
                futures = [
                    executor.submit(self._process_word, word, bbox, names, ignore_words)
                    for (bbox, text, _) in data for word in text.lower().strip().split()
                ]
                for future in futures:
                    result = future.result()
                    if result:
                        detected_names.append(result)
            return detected_names
        except Exception as e:
            print(f"Error detecting names: {e}")
            return []

    def detect_years(self, results):
        detected_years = []
        current_year = datetime.now().year
        for (bbox, text, prob) in results:
            if re.match(r'^(19[0-9]{2}|20[0-2][0-9])$', text) and (1900 <= int(text) <= current_year):
                detected_years.append((bbox, text, prob))
            date_match = re.match(r'(\d{2})/(\d{2})/(\d{4})', text)
            if date_match:
                year = date_match.group(3)
                if 1900 <= int(year) <= current_year:
                    detected_years.append((bbox, year, prob))
        return detected_years

    def detect_qr_positions(self, image_np):
        qr_positions = []
        qr_codes = decode(image_np)
        for qr in qr_codes:
            x, y, w, h = qr.rect
            qr_positions.append((x, y, x + w, y + h))
        return qr_positions

    def detect_pii_info(self, image_bytes):
        try:
            image = Image.open(io.BytesIO(image_bytes))
            image_np = np.array(image)
            filtered_data = self.extract_text_from_image(image)
            if filtered_data is None:
                return {}

            pii_info = {}
            for label, pattern in self.PII_PATTERNS.items():
                matches = []
                for (bbox, text, _) in filtered_data:
                    if re.search(pattern, text):
                        matches.append(text)
                if matches:
                    pii_info[label] = matches

            name_file_path = 'names.txt'
            ignore_file_path = 'ignore.txt'
            names = self.load_names(name_file_path)
            ignore_words = self.load_ignore_words(ignore_file_path)
            detected_names = self.detect_names(image, names, ignore_words)
            if detected_names:
                pii_info["Name/Address"] = [name[1] for name in detected_names]
            
            results = self.reader.readtext(np.array(image))
            detected_years = self.detect_years(results)
            if detected_years:
                pii_info["Year"] = [year[1] for year in detected_years]
            return pii_info
        except Exception as e:
            print(f"Error detecting PII: {e}")
            return {}

    def calculate_pii_positions(self, image_np, dont_blur_option):
        positions = []
        detected_pii = {}
        required_pii_types = set(dont_blur_option.keys()) 
        missing_pii_types = set(required_pii_types)

        qr_positions = self.detect_qr_positions(image_np)
        positions.extend(qr_positions)

        try:
            image_bytes = io.BytesIO()
            Image.fromarray(image_np).save(image_bytes, format='PNG')
            pii_info = self.detect_pii_info(image_bytes.getvalue())

            for pii_type in required_pii_types:
                if pii_type in pii_info:
                    missing_pii_types.discard(pii_type)

            if missing_pii_types:
                return None, {"error": f"Required PII types not found in the image: {', '.join(missing_pii_types)}"}

            for pii_type, values in pii_info.items():
                if pii_type not in dont_blur_option:
                    data = self.reader.readtext(image_np)
                    for (bbox, text, _) in data:
                        if any(value in text for value in values):
                            x1, y1 = int(bbox[0][0]), int(bbox[0][1])
                            x2, y2 = int(bbox[2][0]), int(bbox[2][1])
                            positions.append((x1, y1, x2, y2))
                            detected_pii[pii_type] = True

            if "Aadhaar Number" not in dont_blur_option and "Aadhaar Number" in pii_info:
                for (bbox, text, _) in self.reader.readtext(image_np):
                    if re.match(r'^\d{4}$', text):
                        for aadhaar in pii_info['Aadhaar Number']:
                            if text in aadhaar:
                                x1, y1 = int(bbox[0][0]), int(bbox[0][1])
                                x2, y2 = int(bbox[2][0]), int(bbox[2][1])
                                positions.append((x1, y1, x2, y2))
                                detected_pii["Aadhaar Number"] = True

            if "Name/Address" not in dont_blur_option and "Name/Address" in pii_info:
                name_file_path = 'names.txt'
                ignore_file_path = 'ignore.txt'
                names = self.load_names(name_file_path)
                ignore_words = self.load_ignore_words(ignore_file_path)
                data = self.reader.readtext(image_np)
                for (bbox, text, _) in data:
                    normalized_text = text.lower().strip()
                    words = normalized_text.split()
                    for word in words:
                        if word in ignore_words:
                            continue
                        if word in names:
                            x1, y1 = int(bbox[0][0]), int(bbox[0][1])
                            x2, y2 = int(bbox[2][0]), int(bbox[2][1])
                            positions.append((x1, y1, x2, y2))
                            detected_pii["Name/Address"] = True
                            break

            if "Year" not in dont_blur_option and "Year" in pii_info:
                data = self.reader.readtext(image_np)
                detected_years = self.detect_years(data)
                for (bbox, _, _) in detected_years:
                    x1, y1 = int(bbox[0][0]), int(bbox[0][1])
                    x2, y2 = int(bbox[2][0]), int(bbox[2][1])
                    positions.append((x1, y1, x2, y2))
                    detected_pii["Year"] = True

        except Exception as e:
            print(f"Error calculating positions: {e}")
            return None, {"error": f"An error occurred while processing the image: {str(e)}"}

        return positions, detected_pii

    def blur_pii(self, image, positions):
        try:
            image = np.array(image)
            for (x1, y1, x2, y2) in positions:
                x1, y1 = max(0, x1), max(0, y1)
                x2, y2 = min(image.shape[1], x2), min(image.shape[0], y2)
                if x2 > x1 and y2 > y1:
                    roi = image[y1:y2, x1:x2]
                    roi = cv2.GaussianBlur(roi, (75, 75), 25)
                    image[y1:y2, x1:x2] = roi
            return Image.fromarray(np.uint8(image))
        except Exception as e:
            print(f"Error blurring PII regions: {e}")
            return image