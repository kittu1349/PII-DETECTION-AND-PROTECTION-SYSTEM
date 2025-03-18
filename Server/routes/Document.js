// In routes/Document.js
import express from "express";
import { auth } from "../middlewares/auth.js";
import { createDocument } from "../controllers/documents.js";

const router = express.Router();

router.post('/upload-documents', auth, createDocument);

export default router;