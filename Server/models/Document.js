import mongoose from "mongoose";

const documentSchema = new mongoose.Schema({
    documentUrl: {
        type: String,
        required: true,
    },
    // You can add more fields here if needed
});

const Document = mongoose.model('Document', documentSchema);

export default Document;