

import User from '../models/User.js';
import { decrypt } from '../utils/Hashing.js';

// Function to safely decrypt fields
const safeDecrypt = (encryptedText, key, fieldName) => {
  if (!encryptedText) {
    console.warn(`Missing data for decryption: ${fieldName}`);
    return '';
  }
  try {
    const decrypted = decrypt(encryptedText, key);
    if (!decrypted) {
      console.warn(`Decryption resulted in empty string for ${fieldName}`);
    }
    return decrypted || '';
  } catch (error) {
    console.error(`Decryption error for ${fieldName}:`, error.message);
    return '';
  }
};

// Function to decrypt user fields
const decryptUserFields = (user, encryptionKey) => {
  return {
    _id: user._id,
    firstName: safeDecrypt(user.firstName, encryptionKey, 'firstName'),
    lastName: safeDecrypt(user.lastName, encryptionKey, 'lastName'),
    email: safeDecrypt(user.email, encryptionKey, 'email'),
    avatar: safeDecrypt(user.avatar, encryptionKey, 'avatar'),
    documents: user.documents.map((doc, index) => ({
      _id: doc._id,
      documentUrl: safeDecrypt(doc.documentUrl, encryptionKey, `document[${index}].documentUrl`)
    }))
  };
};

// Function to get all users
export const getAllUsers = async (req, res) => {
  try {
    // Fetch users with only necessary fields and populate documents if needed
    const users = await User.find()
      .select("firstName lastName email avatar documents")
      .populate({
        path: "documents",
        select: "documentUrl"
      });

    if (!users || users.length === 0) {
      return res.status(404).json({ success: false, message: "No users found" });
    }

    const encryptionKey = process.env.ENCRYPTION_SECRET;
    if (!encryptionKey) {
      throw new Error('Encryption key is not set');
    }

    // Decrypt user data in parallel
    const decryptedUsers = await Promise.all(users.map(user => decryptUserFields(user, encryptionKey)));

    // Log summary of empty fields
    // const emptySummary = decryptedUsers.reduce((acc, user) => {
    //   const emptyFields = Object.entries(user)
    //     .filter(([key, value]) => value === '' && key !== '_id')
    //     .map(([key]) => key);
      
    //   user.documents.forEach((doc, docIndex) => {
    //     if (doc.documentUrl === '') {
    //       emptyFields.push(`document[${docIndex}].documentUrl`);
    //     }
    //   });

    //   if (emptyFields.length > 0) {
    //     acc[user._id] = emptyFields;
    //   }
    //   return acc;
    // }, {});

    // console.log('Summary of empty fields after decryption:', emptySummary);

    return res.status(200).json({
      success: true,
      message: "Users fetched and decrypted successfully",
      data: decryptedUsers
    });
  } catch (error) {
    console.error('Error in getAllUsers:', error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while fetching users",
      error: error.message
    });
  }
};


// import User from '../models/User.js';
// import { decrypt } from '../utils/Hashing.js';

// const safeDecrypt = (encryptedText, key, fieldName) => {
//   if (!encryptedText) {
//     console.warn(`Missing data for decryption: ${fieldName}`);
//     return '';
//   }
//   try {
//     const decrypted = decrypt(encryptedText, key);
//     if (!decrypted) {
//       console.warn(`Decryption resulted in empty string for ${fieldName}`);
//     }
//     return decrypted || '';
//   } catch (error) {
//     console.error(`Decryption error for ${fieldName}:`, error.message);
//     return '';
//   }
// };

// const decryptUserFields = (user, encryptionKey) => ({
//   _id: user._id,
//   firstName: safeDecrypt(user.firstName, encryptionKey, 'firstName'),
//   lastName: safeDecrypt(user.lastName, encryptionKey, 'lastName'),
//   email: safeDecrypt(user.email, encryptionKey, 'email'),
//   // Only decrypt avatar and documents if specifically requested
//   ...(user.avatar && { avatar: safeDecrypt(user.avatar, encryptionKey, 'avatar') }),
//   ...(user.documents && {
//     documents: user.documents.map((doc, index) => ({
//       _id: doc._id,
//       documentUrl: safeDecrypt(doc.documentUrl, encryptionKey, `document[${index}].documentUrl`)
//     }))
//   })
// });

// export const getAllUsers = async (req, res) => {
//   const startTime = Date.now();
//   try {
//     const page = parseInt(req.query.page) || 1;
//     const limit = parseInt(req.query.limit) || 20;
//     const skip = (page - 1) * limit;
//     const includeDocuments = req.query.includeDocuments === 'true';

//     console.log(`Fetching users - Page: ${page}, Limit: ${limit}, Include Documents: ${includeDocuments}`);

//     let query = User.find()
//       .select("firstName lastName email")
//       .skip(skip)
//       .limit(limit);

//     if (includeDocuments) {
//       query = query.select("+avatar +documents")
//         .populate({
//           path: "documents",
//           select: "documentUrl"
//         });
//     }

//     const users = await query.lean();

//     if (!users || users.length === 0) {
//       console.log('No users found');
//       return res.status(404).json({ success: false, message: "No users found" });
//     }

//     const encryptionKey = process.env.ENCRYPTION_SECRET;
//     if (!encryptionKey) {
//       throw new Error('Encryption key is not set');
//     }

//     console.log(`Decrypting data for ${users.length} users`);
//     const decryptedUsers = users.map(user => decryptUserFields(user, encryptionKey));

//     const totalUsers = await User.countDocuments();

//     const response = {
//       success: true,
//       message: "Users fetched and decrypted successfully",
//       data: decryptedUsers,
//       page,
//       limit,
//       total: totalUsers,
//       totalPages: Math.ceil(totalUsers / limit)
//     };

//     const endTime = Date.now();
//     console.log(`Request completed in ${endTime - startTime}ms`);

//     return res.status(200).json(response);
//   } catch (error) {
//     console.error('Error in getAllUsers:', error);
//     return res.status(500).json({
//       success: false,
//       message: "An error occurred while fetching users",
//       error: error.message
//     });
//   }
// };