// import React, { useEffect, useState } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { fetchAdminDashboard } from '../../services/operations/authAPI';
// import { motion } from 'framer-motion';
// import { FiEdit2, FiTrash2, FiEye, FiUserPlus, FiAlertCircle, FiX } from 'react-icons/fi';
// import logo from '../../Images/logo.png';

// const AdminDashboard = () => {
//   const dispatch = useDispatch();
//   const { dashboardData, loading, error } = useSelector(state => state.admin);
//   const [localError, setLocalError] = useState(null);
//   const [selectedDocument, setSelectedDocument] = useState(null);
//   const [retryCount, setRetryCount] = useState(0);

//   useEffect(() => {
//     const loadDashboard = async () => {
//       try {
//         setLocalError(null);
//         await dispatch(fetchAdminDashboard());
//       } catch (error) {
//         console.error("Failed to load admin dashboard:", error);
//         setLocalError(error.message || "Failed to load dashboard. Please try again later.");
//         if (retryCount < 3) {
//           setTimeout(() => {
//             setRetryCount(prev => prev + 1);
//           }, 5000); // Retry after 5 seconds
//         }
//       }
//     };
//     loadDashboard();
//   }, [dispatch, retryCount]);

//   const openDocumentModal = (documentUrl) => {
//     setSelectedDocument(documentUrl);
//   };

//   const closeDocumentModal = () => {
//     setSelectedDocument(null);
//   };

//   if (loading) return (
//     <div className="flex items-center justify-center h-screen bg-gradient-to-r from-purple-200 via-pink-100 to-indigo-200">
//       <div className="text-2xl font-bold text-gray-700">Loading...</div>
//     </div>
//   );

//   if (error || localError) return (
//     <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-r from-purple-200 via-pink-100 to-indigo-200">
//       <FiAlertCircle className="text-red-500 w-16 h-16 mb-4" />
//       <div className="text-xl font-bold text-red-700">Error: {error || localError}</div>
//       <button 
//         onClick={() => setRetryCount(prev => prev + 1)} 
//         className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition duration-300"
//       >
//         Retry
//       </button>
//     </div>
//   );

//   if (!dashboardData || dashboardData.length === 0) return (
//     <div className="flex items-center justify-center h-screen bg-gradient-to-r from-purple-200 via-pink-100 to-indigo-200">
//       <div className="text-2xl font-bold text-gray-700">No users found</div>
//     </div>
//   );

//   return (
//     <div className="min-h-screen bg-gradient-to-r from-purple-200 via-pink-100 to-indigo-200">
//       <div className="container mx-auto px-4 py-8">
//         <motion.div
//           initial={{ opacity: 0, y: -50 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.5 }}
//           className="bg-white rounded-lg shadow-xl p-6 mb-8"
//         >
//           <div className="flex justify-between items-center mb-6">
//             <div className="flex items-center space-x-4">
//               <img src={logo} alt="logo" className="w-12 h-12" />
//               <h1 className="text-3xl font-bold text-gray-800">PII Detection & Protection System</h1>
//             </div>
//           </div>
//           <div className="flex justify-between items-center mb-6">
//             <h2 className="text-2xl font-bold text-gray-700">Users</h2>
//             <motion.button
//               whileHover={{ scale: 1.05 }}
//               whileTap={{ scale: 0.95 }}
//               className="flex items-center space-x-2 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition duration-300"
//             >
//               <FiUserPlus />
//               <span>Add User</span>
//             </motion.button>
//           </div>
//           <div className="overflow-x-auto">
//             <table className="w-full table-auto">
//               <thead>
//                 <tr className="bg-gray-100">
//                   <th className="px-4 py-2 text-left">Avatar</th>
//                   <th className="px-4 py-2 text-left">Name</th>
//                   <th className="px-4 py-2 text-left">Email</th>
//                   <th className="px-4 py-2 text-left">Documents</th>
//                   <th className="px-4 py-2 text-left">Action</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {dashboardData.map(user => (
//                   <tr key={user._id} className="border-b border-gray-200 hover:bg-gray-50">
//                     <td className="px-4 py-2">
//                       <img
//                         src={user.avatar || 'https://via.placeholder.com/40'}
//                         alt={${user.firstName} ${user.lastName}}
//                         className="w-10 h-10 rounded-full"
//                       />
//                     </td>
//                     <td className="px-4 py-2">{${user.firstName} ${user.lastName}}</td>
//                     <td className="px-4 py-2">{user.email}</td>
//                     <td className="px-4 py-2">
//                       {user.documents.length > 0 ? (
//                         <motion.button
//                           whileHover={{ scale: 1.05 }}
//                           whileTap={{ scale: 0.95 }}
//                           className="flex items-center space-x-2 bg-blue-500 text-white px-3 py-1 rounded-lg hover:bg-blue-600 transition duration-300"
//                           onClick={() => openDocumentModal(user.documents[0].documentUrl)}
//                         >
//                           <FiEye />
//                           <span>View</span>
//                         </motion.button>
//                       ) : 'No documents'}
//                     </td>
//                     <td className="px-4 py-2">
//                       <div className="flex space-x-2">
//                         <motion.button
//                           whileHover={{ scale: 1.05 }}
//                           whileTap={{ scale: 0.95 }}
//                           className="bg-yellow-500 text-white p-2 rounded-lg hover:bg-yellow-600 transition duration-300"
//                         >
//                           <FiEdit2 />
//                         </motion.button>
//                         <motion.button
//                           whileHover={{ scale: 1.05 }}
//                           whileTap={{ scale: 0.95 }}
//                           className="bg-red-500 text-white p-2 rounded-lg hover:bg-red-600 transition duration-300"
//                         >
//                           <FiTrash2 />
//                         </motion.button>
//                       </div>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </motion.div>
//       </div>
//       {selectedDocument && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
//           <div className="bg-white rounded-lg p-6 max-w-3xl w-full">
//             <div className="flex justify-between items-center mb-4">
//               <h3 className="text-xl font-bold">Document Preview</h3>
//               <button onClick={closeDocumentModal} className="text-gray-500 hover:text-gray-700">
//                 <FiX className="w-6 h-6" />
//               </button>
//             </div>
//             <img src={selectedDocument} alt="Document Preview" className="w-full h-auto" />
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default AdminDashboard;



// -----------------------------------------------version with IPFS-------------------------
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAdminDashboard } from '../../services/operations/authAPI';
import { motion } from 'framer-motion';
import { FiEdit2, FiTrash2, FiEye, FiUserPlus, FiAlertCircle, FiX } from 'react-icons/fi';
import logo from '../../Images/logo.png';

const AdminDashboard = () => {
  const dispatch = useDispatch();
  const { dashboardData, loading, error } = useSelector(state => state.admin);
  const [localError, setLocalError] = useState(null);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        setLocalError(null);
        await dispatch(fetchAdminDashboard());
      } catch (error) {
        console.error("Failed to load admin dashboard:", error);
        setLocalError(error.message || "Failed to load dashboard. Please try again later.");
        if (retryCount < 3) {
          setTimeout(() => {
            setRetryCount(prev => prev + 1);
          }, 5000); // Retry after 5 seconds
        }
      }
    };
    loadDashboard();
  }, [dispatch, retryCount]);

  const formatIPFSUrl = (cid) => {
    // Remove any existing protocol or gateway prefix if present
    const cleanCid = cid.replace(/^ipfs:\/\/|^https?:\/\/[^/]+\/ipfs\//, '');
    return `https://ipfs.io/ipfs/${cleanCid}`;
  };

  const openDocumentModal = (documentUrl) => {
    // Convert the documentUrl to an IPFS gateway URL
    const ipfsUrl = formatIPFSUrl(documentUrl);
    setSelectedDocument(ipfsUrl);
  };

  const closeDocumentModal = () => {
    setSelectedDocument(null);
  };

  if (loading) return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-r from-purple-200 via-pink-100 to-indigo-200">
      <div className="text-2xl font-bold text-gray-700">Loading...</div>
    </div>
  );

  if (error || localError) return (
    <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-r from-purple-200 via-pink-100 to-indigo-200">
      <FiAlertCircle className="text-red-500 w-16 h-16 mb-4" />
      <div className="text-xl font-bold text-red-700">Error: {error || localError}</div>
      <button 
        onClick={() => setRetryCount(prev => prev + 1)} 
        className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition duration-300"
      >
        Retry
      </button>
    </div>
  );

  if (!dashboardData || dashboardData.length === 0) return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-r from-purple-200 via-pink-100 to-indigo-200">
      <div className="text-2xl font-bold text-gray-700">No users found</div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-r from-purple-200 via-pink-100 to-indigo-200">
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-lg shadow-xl p-6 mb-8"
        >
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center space-x-4">
              <img src={logo} alt="logo" className="w-12 h-12" />
              <h1 className="text-3xl font-bold text-gray-800">PII Detection & Protection System</h1>
            </div>
          </div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-700">Users</h2>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center space-x-2 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition duration-300"
            >
              <FiUserPlus />
              <span>Add User</span>
            </motion.button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full table-auto">
              <thead>
                <tr className="bg-gray-100">
                  <th className="px-4 py-2 text-left">Avatar</th>
                  <th className="px-4 py-2 text-left">Name</th>
                  <th className="px-4 py-2 text-left">Email</th>
                  <th className="px-4 py-2 text-left">Documents</th>
                  <th className="px-4 py-2 text-left">Action</th>
                </tr>
              </thead>
              <tbody>
                {dashboardData.map(user => (
                  <tr key={user._id} className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="px-4 py-2">
                      <img
                        src={user.avatar || 'https://via.placeholder.com/40'}
                        alt={`${user.firstName} ${user.lastName}`}
                        className="w-10 h-10 rounded-full"
                      />
                    </td>
                    <td className="px-4 py-2">{`${user.firstName} ${user.lastName}`}</td>
                    <td className="px-4 py-2">{user.email}</td>
                    <td className="px-4 py-2">
                      {user.documents.length > 0 ? (
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="flex items-center space-x-2 bg-blue-500 text-white px-3 py-1 rounded-lg hover:bg-blue-600 transition duration-300"
                          onClick={() => openDocumentModal(user.documents[0].documentUrl)}
                        >
                          <FiEye />
                          <span>View</span>
                        </motion.button>
                      ) : 'No documents'}
                    </td>
                    <td className="px-4 py-2">
                      <div className="flex space-x-2">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="bg-yellow-500 text-white p-2 rounded-lg hover:bg-yellow-600 transition duration-300"
                        >
                          <FiEdit2 />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="bg-red-500 text-white p-2 rounded-lg hover:bg-red-600 transition duration-300"
                        >
                          <FiTrash2 />
                        </motion.button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
      {selectedDocument && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-3xl w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">Document Preview</h3>
              <button onClick={closeDocumentModal} className="text-gray-500 hover:text-gray-700">
                <FiX className="w-6 h-6" />
              </button>
            </div>
            <img src={selectedDocument} alt="Document Preview" className="w-full h-auto" />
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;