import User from "../models/User.js";
import Document from "../models/Document.js";
import { encrypt } from "../utils/Hashing.js";
import { uploadToIPFS } from "../utils/ipfsUploader.js"; 
import axios from 'axios';

export const createDocument = async (req, res) => {
    try {
        console.log("User from request:", req.user);
        console.log("Files:", req.files);

        if (!req.user || !req.user.id) {
            console.log("Auth error. Headers:", req.headers);
            console.log("Auth error. User:", req.user);
            return res.status(401).json({
                success: false,
                message: "Authentication required",
            });
        }

        const userId = req.user.id;
        const documentImage = req.files?.documentImage;

        if (!documentImage) {
            return res.status(400).json({
                success: false,
                message: "Document image is mandatory",
            });
        }

        const ipfsHash = await uploadToIPFS(documentImage);
        if (!ipfsHash) {
            return res.status(500).json({
                success: false,
                message: "Failed to upload document to IPFS",
            });
        }

        console.log("Uploaded to IPFS. CID:", ipfsHash);

        let blockchainAccounts;
        try {
            const accountsResponse = await axios.get('http://localhost:8082/get-accounts');
            blockchainAccounts = accountsResponse.data.accounts;
            console.log("Available blockchain accounts:", blockchainAccounts);
        } catch (accountsError) {
            console.error("Error fetching blockchain accounts:", accountsError.message);
            blockchainAccounts = [];
        }

        let blockchainResponse;
        try {
            const sender = blockchainAccounts && blockchainAccounts.length > 0 
                ? blockchainAccounts[0] 
                : null;
            
            blockchainResponse = await axios.post('http://localhost:8082/store-cid', {
                cid: ipfsHash,
                sender: sender
            });
            
            console.log("Full blockchain response:", JSON.stringify(blockchainResponse?.data, null, 2));
            console.log(`CID stored on blockchain using account: ${blockchainResponse?.data?.fromAddress}`);
        } catch (blockchainError) {
            console.error("Error storing CID on blockchain:", blockchainError.message);
        }

        const secretKey = process.env.ENCRYPTION_SECRET;
        const encryptedCID = encrypt(ipfsHash, secretKey);

        const newDocument = await Document.create({
            documentUrl: encryptedCID,
            ipfsHash: ipfsHash,
            blockchainTxHash: blockchainResponse?.data?.transactionHash || null,
            blockchainAddress: blockchainResponse?.data?.fromAddress || null
        });

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { $push: { documents: newDocument._id } },
            { new: true }
        ).populate("documents");

        if (!updatedUser) {
            return res.status(404).json({
                success: false,
                message: "User not found or document couldn't be added",
            });
        }

        res.status(200).json({
            success: true,
            data: newDocument,
            message: "Document uploaded successfully to IPFS" + 
                    (blockchainResponse ? " and stored on blockchain" : ""),
            blockchainStatus: blockchainResponse ? "success" : "failed",
            blockchainAddress: blockchainResponse?.data?.fromAddress || null
        });
    } catch (error) {
        console.error("Error in createDocument:", error);
        res.status(500).json({
            success: false,
            message: "Failed to upload Document",
            error: error.message,
        });
    }
};