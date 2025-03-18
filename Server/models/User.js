import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        trim: true,
    },
    lastName: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        trim: true,
    },
    emailHash:{
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    avatar: {
        type: String,
        required: true,
    },
    token: {
        type: String,
    },
    documents:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"Document",
        }
    ],
    
});

const User = mongoose.model('User', userSchema);

export default User;  