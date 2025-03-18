import { toast } from "react-hot-toast";
import { setLoading, setToken } from "../../slices/authSlice";
import { setUser } from "../../slices/profileSlice";
import { endpoints } from "../apis";
import { apiConnector } from "../apiConnector";
import { setDashboardData, setError, setLoading as setAdminLoading } from '../../slices/adminSlice';


const { SIGNUP_API, LOGIN_API, UPLOAD_DOCUMENT_API,ADMIN_DASHBOARD } = endpoints;

export function signUp(firstName, lastName, email, password, avatar, navigate) {
  return async (dispatch) => {
    const toastId = toast.loading("Loading...");
    dispatch(setLoading(true));
    try {
      const formData = new FormData();
      formData.append("firstName", firstName);
      formData.append("lastName", lastName);
      formData.append("email", email);
      formData.append("password", password);
      if (avatar) {
        formData.append("avatar", avatar, avatar.name);
      }

      const response = await apiConnector("POST", SIGNUP_API, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (!response.success) {
        throw new Error(response.message);
      }

      toast.success("Signup Successful");
      navigate("/login");
    } catch (error) {
      console.error("SIGNUP API ERROR:", error);
      toast.error(error.response?.data?.message || "Signup Failed");
    } finally {
      dispatch(setLoading(false));
      toast.dismiss(toastId);
    }
  };
}

export function login(email, password, navigate) {
  return async (dispatch) => {
    const toastId = toast.loading("Loading...");
    dispatch(setLoading(true));
    try {
      const response = await apiConnector("POST", LOGIN_API, {
        email,
        password,
      });

      if (!response.success) {
        throw new Error(response.message);
      }

      toast.success(response.message || "Login Successful");
      dispatch(setToken(response.token));

      const userImage = response.user.avatar || `https://api.dicebear.com/5.x/initials/svg?seed=${response.user.firstName} ${response.user.lastName}`;
      dispatch(setUser({ ...response.user, image: userImage }));

      localStorage.setItem("user", JSON.stringify(response.user));
      localStorage.setItem("token", JSON.stringify(response.token));

      navigate("/upload-documents");
    } catch (error) {
      console.error("LOGIN API ERROR:", error);
      toast.error(error.response?.data?.message || "Login Failed");
    } finally {
      dispatch(setLoading(false));
      toast.dismiss(toastId);
    }
  };
}

export function uploadDocument(file) {
  return async (dispatch) => {
    const token = JSON.parse(localStorage.getItem("token"));
    if (!token) {
      toast.error("You are not authenticated. Please log in.");
      return;
    }

    const toastId = toast.loading("Uploading document...");
    dispatch(setLoading(true));

    try {
      const formData = new FormData();
      formData.append("documentImage", file);

      const response = await apiConnector("POST", UPLOAD_DOCUMENT_API, formData, {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data'
      });

      if (!response.success) {
        throw new Error(response.message);
      }

      toast.success("Document uploaded successfully");
    } catch (error) {
      console.error("UPLOAD DOCUMENT API ERROR:", error);
      if (error.response?.status === 401) {
        toast.error("Unauthorized. Please log in again.");
        // Optionally, redirect to login or perform additional actions here
        dispatch(setToken(null)); // Clear the token
        localStorage.removeItem("token"); // Remove token from localStorage
        // You might want to redirect to login page here
      } else {
        toast.error(error.response?.data?.message || "Failed to upload document");
      }
    } finally {
      dispatch(setLoading(false));
      toast.dismiss(toastId);
    }
  };
}

export function fetchAdminDashboard() {
  return async (dispatch) => {
    dispatch(setAdminLoading(true));
    console.log("Starting admin dashboard fetch...");
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("You are not authenticated. Please log in.");
      }

      console.log("Token retrieved, making API call...");
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Request timed out')), 60000)
      );
      const responsePromise = apiConnector("GET", ADMIN_DASHBOARD, null, {
        Authorization: `Bearer ${token}`,
      });
      console.log("API call made, waiting for response...");
      const response = await Promise.race([timeoutPromise, responsePromise]);

      console.log("Response received:", JSON.stringify(response, null, 2));

      if (!response) {
        throw new Error("No response received from the server");
      }

      let responseData = response;
      
      // If the response is a string, try to parse it as JSON
      if (typeof response === 'string') {
        try {
          responseData = JSON.parse(response);
        } catch (e) {
          console.error("Failed to parse response as JSON:", e);
          throw new Error("Invalid response format: not valid JSON");
        }
      }

      console.log("Parsed response data:", responseData);
      console.log("responseData.success:", responseData.success);
      console.log("Array.isArray(responseData.data):", Array.isArray(responseData.data));

      if (responseData.success && Array.isArray(responseData.data)) {
        dispatch(setDashboardData(responseData.data));
        console.log("Dashboard data successfully set");
      } else {
        console.error("Invalid response structure:", responseData);
        throw new Error("Invalid response format: unexpected structure");
      }
    } catch (error) {
      console.error("ADMIN DASHBOARD API ERROR:", error);
      dispatch(setError(error.message));
      throw error;
    } finally {
      dispatch(setAdminLoading(false));
      console.log("Admin dashboard fetch completed.");
    }
  };
}

// export function fetchAdminDashboard(page = 1, limit = 20, includeDocuments = false) {
//   return async (dispatch) => {
//     dispatch(setAdminLoading(true));
//     console.log(`Starting admin dashboard fetch for page ${page}...`);
//     try {
//       const token = localStorage.getItem("token");
//       if (!token) {
//         throw new Error("You are not authenticated. Please log in.");
//       }

//       console.log("Token retrieved, making API call...");
//       const url = `${ADMIN_DASHBOARD}?page=${page}&limit=${limit}&includeDocuments=${includeDocuments}`;
//       const response = await apiConnector("GET", url, null, {
//         Authorization: `Bearer ${token}`,
//       });

//       console.log("Response received:", JSON.stringify(response, null, 2));

//       if (!response || !response.data) {
//         throw new Error("Invalid response received from the server");
//       }

//       const { data, total, totalPages } = response.data;

//       // dispatch(setDashboardData(data));
//       // dispatch(setTotalUsers(total));
//       // dispatch(setTotalPages(totalPages));
//       console.log("Dashboard data successfully set");
//     } catch (error) {
//       console.error("ADMIN DASHBOARD API ERROR:", error);
//       dispatch(setError(error.message));
//       throw error;
//     } finally {
//       dispatch(setAdminLoading(false));
//       console.log("Admin dashboard fetch completed.");
//     }
//   };
// }