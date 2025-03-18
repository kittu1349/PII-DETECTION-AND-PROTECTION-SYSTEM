import React from "react";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Signup from "./Pages/signup";
import Login from "./Pages/login";
import UploadDocuments from "./Pages/uploadedDocument";
import AdminDashboard from "./Pages/Admin/dashboard";
import Home from "./Pages/Home";
import "./App.css";
import PreviewDocument from "./Pages/PreviewDocument";

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Home />
    },
    {
      path: "/signup",
      element: <Signup />,
    },
    {
      path: "/login",
      element: <Login />,
    },
    {
      path: "/upload-documents",
      element: <UploadDocuments />,
    },
    {
      path: "/admin-dashboard",
      element: <AdminDashboard />,
    },
    {
      path: "/preview-document",
      element: <PreviewDocument/>,
    },
  ]);

  return (
    <div className="App">
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
