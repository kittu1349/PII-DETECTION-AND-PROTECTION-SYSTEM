import axios from "axios";
import FormData from "form-data";
import crypto from "crypto";
import fs from "fs";
import path from "path";
import util from "util";
 
export const uploadToIPFS = async (file) => {
    try {
        // Check if file exists
        if (!file) {
            throw new Error("File is missing!");
        }
 
        // Log file details for debugging
        console.log("File received in backend:", { 
            name: file.name, 
            size: file.size, 
            mimetype: file.mimetype,
            tempFilePath: file.tempFilePath ? "Exists" : "Missing",
            dataLength: file.data ? file.data.length : "No data buffer"
        });
 
        // The issue is that express-fileupload creates a tempFilePath
        // but doesn't populate the data buffer correctly
        if (!file.tempFilePath || !fs.existsSync(file.tempFilePath)) {
            throw new Error("File data is missing or empty!");
        }
 
        // Generate a unique ID for this file upload, making it longer to ensure uniqueness
        const uniqueId = crypto.randomBytes(16).toString('hex');
 
        // Generate a proper extension based on mimetype
        let fileExtension = '';
        if (file.mimetype) {
            switch(file.mimetype) {
                case 'image/jpeg':
                    fileExtension = '.jpg';
                    break;
                case 'image/png':
                    fileExtension = '.png';
                    break;
                case 'image/gif':
                    fileExtension = '.gif';
                    break;
                case 'application/pdf':
                    fileExtension = '.pdf';
                    break;
                default:
                    // Extract extension from mimetype
                    fileExtension = '.' + file.mimetype.split('/').pop();
            }
        } else if (file.name) {
            // Get extension from original filename if mimetype isn't available
            fileExtension = path.extname(file.name);
        }
 
        // Create a truly unique filename combining timestamp, random UUID, and a random number
        const randomSuffix = Math.floor(Math.random() * 10000);
        const uniqueFilename = `file_${Date.now()}_${uniqueId}_${randomSuffix}${fileExtension}`;
 
        // Create form data
        const formData = new FormData();
 
        // Use the temporary file created by express-fileupload
        const fileStream = fs.createReadStream(file.tempFilePath);
 
        // Add file to form data - critical: use the UNIQUE filename here
        formData.append("file", fileStream, uniqueFilename);
 
        // Create metadata with detailed information including the file size
        const fileStats = fs.statSync(file.tempFilePath);
 
        const metadata = JSON.stringify({
            name: uniqueFilename, // Use the unique filename in metadata
            keyvalues: {
                fileSize: fileStats.size,
                fileType: file.mimetype || "application/octet-stream",
                uniqueId: uniqueId,
                uploadDate: new Date().toISOString(),
                application: "PII_Detection_System",
                originalName: file.name || file.originalname || "unknown"
            }
        });
        formData.append("pinataMetadata", metadata);
 
        // Set options to ensure we get CIDv1 and avoid duplicate detection
        const options = JSON.stringify({
            cidVersion: 1,
            wrapWithDirectory: false, // Don't wrap in directory
            customPinPolicy: {
                regions: [
                    {
                        id: "FRA1",
                        desiredReplicationCount: 1
                    }
                ]
            }
        });
        formData.append("pinataOptions", options);
 
        console.log(`Uploading to IPFS with name: ${uniqueFilename} Size: ${fileStats.size} bytes`);
 
        const response = await axios.post(
            "https://api.pinata.cloud/pinning/pinFileToIPFS",
            formData,
            {
                headers: {
                    ...formData.getHeaders(),
                    "pinata_api_key": process.env.PINATA_API_KEY,
                    "pinata_secret_api_key": process.env.PINATA_SECRET_API_KEY,
                },
                maxContentLength: Infinity,
                maxBodyLength: Infinity
            }
        );
 
        console.log("IPFS Upload Success:", response.data);
 
        // Return just the IPFS hash string as your existing code expects
        return response.data.IpfsHash;
    } catch (error) {
        console.error("IPFS Upload Error:", error.response?.data || error.message);
        throw new Error("Failed to upload to IPFS: " + (error.response?.data?.error || error.message));
    }
};