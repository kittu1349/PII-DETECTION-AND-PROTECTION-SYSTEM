
// import React, { useState } from "react";
// import "./uploadDocuments.css";
// import { useDispatch, useSelector } from "react-redux";
// import { uploadDocument } from "../../services/operations/authAPI";
// import { Link, useNavigate } from "react-router-dom";
// import Navbar from "../common/Navbar/Navbar";

// const UploadDocuments = () => {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const { token } = useSelector((state) => state.auth);
//   console.log("Token:", token);
//   const { user } = useSelector((state) => state.profile);
//   const [selectedFile, setSelectedFile] = useState(null);

//   const handleFileUpload = (e) => {
//     setSelectedFile(e.target.files[0]);
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     if (selectedFile) {
//       // Instead of dispatching the upload action, we'll navigate to the preview page
//       navigate("/preview-document", { state: { image: selectedFile } });
//     }
//   };

//   const handleLogout = () => {
//     // Implement logout logic here
//     // For example: dispatch(logout());
//     navigate("/login");
//   };

//   return (
    
//     <div>
//       {/* Upload Section */}
//       <div className="upload-page">
//         <div className="sidebar">
//           <h4>Uploaded Documents</h4>
//           <ul>
//             {user.documents && user.documents.map((doc, index) => (
//               <li key={index}>{doc.documentUrl}</li>
//             ))}
//           </ul>
//         </div>
//         <div className="upload-section">
//           <h1>Upload your documents here</h1>
//           <form onSubmit={handleSubmit} className="uploadForm">
//             <input
//               type="file"
//               onChange={handleFileUpload}
//               className="file-input"
//             />
//             <button type="submit" className="btn btn-black">
//               Upload
//             </button>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default UploadDocuments;
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { uploadDocument } from "../../services/operations/authAPI";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FiUpload, FiFile, FiX } from "react-icons/fi";

const UploadDocuments = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { token } = useSelector((state) => state.auth);
  const { user } = useSelector((state) => state.profile);
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    if (!selectedFile) {
      setPreview(null);
      return;
    }

    const objectUrl = URL.createObjectURL(selectedFile);
    setPreview(objectUrl);

    // Free memory when component unmounts
    return () => URL.revokeObjectURL(objectUrl);
  }, [selectedFile]);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (selectedFile) {
      navigate("/preview-document", { state: { image: selectedFile } });
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setPreview(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-purple-200 via-pink-100 to-indigo-200">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full md:w-1/3 bg-white rounded-lg shadow-xl p-6"
          >
            <h4 className="text-2xl font-bold mb-4 text-gray-800">Uploaded Documents</h4>
            <ul className="space-y-2">
              {user.documents && user.documents.map((doc, index) => (
                <motion.li
                  key={index}
                  whileHover={{ scale: 1.05 }}
                  className="flex items-center text-gray-700 hover:text-indigo-600 transition duration-200"
                >
                  <FiFile className="mr-2" />
                  <span className="truncate">{doc.documentUrl}</span>
                </motion.li>
              ))}
            </ul>
            {preview && (
              <div className="mt-6">
                <h5 className="text-lg font-semibold mb-2">Selected Document Preview</h5>
                <div className="relative">
                  <img src={preview} alt="Preview" className="w-full h-auto rounded-lg shadow-md" />
                  <button
                    onClick={handleRemoveFile}
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition duration-200"
                  >
                    <FiX />
                  </button>
                </div>
                <p className="mt-2 text-sm text-gray-600">{selectedFile?.name}</p>
              </div>
            )}
          </motion.div>

          {/* Upload Section */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full md:w-2/3 bg-white rounded-lg shadow-xl p-8"
          >
            <h1 className="text-3xl font-bold mb-6 text-gray-800">Upload your documents here</h1>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="flex items-center justify-center w-full">
                <label
                  htmlFor="dropzone-file"
                  className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition duration-300 ease-in-out"
                >
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <FiUpload className="w-10 h-10 mb-3 text-gray-400" />
                    <p className="mb-2 text-sm text-gray-500">
                      <span className="font-semibold">Click to upload</span> or drag and drop
                    </p>
                    <p className="text-xs text-gray-500">SVG, PNG, JPG or GIF (MAX. 800x400px)</p>
                  </div>
                  <input
                    id="dropzone-file"
                    type="file"
                    className="hidden"
                    onChange={handleFileUpload}
                    accept="image/*,.pdf"
                  />
                </label>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="submit"
                className="w-full bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-bold py-3 px-4 rounded-lg hover:from-purple-600 hover:to-indigo-700 transition duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-lg"
                disabled={!selectedFile}
              >
                Upload
              </motion.button>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default UploadDocuments;