# PII Detection and Protection System

## Overview

A comprehensive Web3-based solution for detecting and protecting Personally Identifiable Information (PII) in digital documents and data. This system leverages blockchain technology, decentralized storage, and machine learning to ensure secure handling of sensitive information.

## Problem Statement

In today's digital age, protecting personally identifiable information (PII) has become increasingly critical. Organizations frequently handle documents containing sensitive government-issued IDs and personal data, creating significant privacy and security risks when this information is mishandled or leaked.

## Our Solution

We have developed a Web3-based machine learning solution that tackles data breaches and leaks of sensitive information. Our system leverages decentralization, encryption, and blockchain technology to detect, manage, and secure PII in digital documents, with a focus on government-issued IDs such as Aadhaar, PAN, and Driving Licenses.

### Core Features

1. **Automatic PII Detection**
   - The system scans uploaded documents to identify PII such as Aadhaar numbers, PAN cards, driving licenses, and other sensitive information.
   - AI-driven anomaly detection checks for document tampering or fraudulent modifications.

2. **Automatic Masking of PII not required by organisation**
   - After detection, system can automatically masked PII which is not requested by the organisation.
   - Ensures only essential information is shared while protecting personal data.

3. **Secure Storage Architecture**
   - **AES Encryption**: Documents are encrypted using AES encryption before storage.
   - **Decentralized IPFS Storage**: Encrypted documents are stored on IPFS, generating a unique Content Identifier (CID).
   - **Blockchain Integration**: The CID is further encrypted and stored on Ethereum, creating tamper-proof records.
   - **Encrypted Database**: User details and document links are encrypted before being stored in database.

4. **Enhanced Authentication & Security**
   - Secure Admin Access with Two-Factor Authentication (2FA) using Google Authenticator.
   - User authentication data is securely logged in the blockchain.

5. **Compliance & Audit Support**
   - Helps organizations comply with data protection regulations.
   - Creates immutable audit trails for all document processing events.

## Technology Stack

### Frontend
- React.js

### Backend
- Node.js
- Express.js

### Processing & Security
- Python for PII detection algorithms
- AES encryption for secure data handling
- JWT for authentication

### Blockchain & Decentralized Storage
- Ethereum (Ganache for local development)
- IPFS for decentralized document storage
- Smart contracts for secure logging

### Features in Development
- Google Authenticator for 2FA

## Installation and Setup Guide

### Prerequisites
- Node.js and npm
- Python 3.x
- Ganache (Ethereum local blockchain)
- Remix IDE (for smart contract deployment)

### Step 1: Clone the Repository
```bash
git clone https://github.com/kittu1349/PII-DETECTION-AND-PROTECTION-SYSTEM.git
cd PII-DETECTION-AND-PROTECTION-SYSTEM
```

### Step 2: Install Dependencies
```bash
npm i
pip install -r requirements.txt
```

### Step 3: Blockchain Setup
1. Install and initialize Ganache
2. Open Remix IDE and create a new contract with the provided smart contract code
3. Compile the contract and copy the ABI data
4. Paste the ABI data into `blockchain-middleware/index.js` and `admin.js`
5. In Remix's deploy section, connect to injected Web3 using the Ganache address (127.0.0.1:7545)
6. Deploy the contract
7. Copy the contract address and paste it into the same files as above

### Step 4: Start the Services
```bash
# Start the blockchain middleware
node index.js
node admin.js

# Start the MERN application
npm run dev

# Run the PII detection service
python pii_web.py "required pii"
```

## System Workflow

1. **Document Upload & PII Detection**:
   - Users upload documents through the web interface
   - The system automatically scans and identifies any PII within the document
   - AI detection flags any document tampering

2. **PII Masking & Processing**:
   - Detected PII is automatically masked .
   - The system applies AES encryption to the masked document 

3. **Decentralized Storage**:
   - The encrypted document is stored on IPFS
   - IPFS generates a unique Content Identifier (CID)
   - The CID is encrypted and stored on the Ethereum blockchain

4. **Secure Access**:
   - Admins can access system controls through 2FA-protected interfaces

## Screenshots and Demo

![Screenshot 2024-09-18 000605](https://github.com/user-attachments/assets/898d9703-b3ca-4cd1-85b0-2dc36c511c21)
![Screenshot 2024-09-18 001302](https://github.com/user-attachments/assets/e707a202-be7d-49f2-9448-0791bbed87cd)
![Screenshot 2024-09-18 000624](https://github.com/user-attachments/assets/f75c53fc-dcbe-4cff-9b4d-7c89a52ceac2)
![Screenshot 2024-09-18 000804](https://github.com/user-attachments/assets/44609631-3b9f-4887-ba66-7e74362840da)
![Screenshot 2024-09-18 000847](https://github.com/user-attachments/assets/042fc99b-6462-4664-b18e-f43b037ee958)
![Screenshot 2024-09-18 002139](https://github.com/user-attachments/assets/437ba8c3-6fe1-4289-9743-3571484fd7fc)
![Screenshot 2024-09-18 000859](https://github.com/user-attachments/assets/2190d515-ca3f-444b-b9fb-c6f5cc438deb)
![Screenshot 2024-09-18 000938](https://github.com/user-attachments/assets/15d1931d-34b5-4b7a-8683-2af035905bce)
![Screenshot 2024-09-18 001040](https://github.com/user-attachments/assets/b2083073-e880-495b-a6d4-2be70e5eacb8)
![Screenshot 2024-09-18 003040](https://github.com/user-attachments/assets/46619e23-ce7c-46c1-a0e6-d2978513be8d)
![Screenshot 2024-09-18 003104](https://github.com/user-attachments/assets/37d96ad6-ce9c-4e91-bf1b-00bb68e56794)

## Benefits

✅ **Enhanced Security & Privacy** – By using decentralized storage (IPFS), blockchain transparency (Ethereum), and encryption (AES), we ensure maximum security while giving users control over their personal data.

✅ **Tamper-Proof & Immutable** – Every PII document upload and storage event is logged immutably on the blockchain, ensuring auditability, compliance, and accountability.

✅ **Regulatory Compliance** – Designed to meet the requirements of data protection regulations by incorporating proper data handling practices, encryption, and access controls.

✅ **Fraud Prevention** – Our anomaly detection system ensures only authentic, untampered documents are processed, preventing fraudulent activities.

## Future Developments

- Completion of Two-Factor Authentication (2FA) for enhanced admin panel security
- Enhancement of blockchain integration for tamper-evident audit trails
- Expansion of PII detection capabilities to cover more document types and data formats
- Enhanced reporting and analytics features for better insights into PII management

## Contact

- Team - Invincibles
- Email - saharicky20@gmail.com

---

This next-generation Web3 security solution provides comprehensive PII protection by integrating machine learning, decentralized storage, blockchain technology, and cryptographic encryption, ensuring that sensitive documents remain secure, user privacy is upheld, and compliance with regulatory requirements is maintained. 🚀
