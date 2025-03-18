import { useSelector } from "react-redux";
 import LoginComponent from "../components/login/Login";
 import Navbar from "../components/common/Navbar/Navbar"
 
function LoginPage() {
    const {loading} = useSelector((state)=>state.auth);
    return (
     <div>
       
       <LoginComponent/>
     </div>
      )
    
  }
  
  export default LoginPage;