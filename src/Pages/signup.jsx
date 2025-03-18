import { useSelector } from "react-redux";
 import SignupComponent from "../components/signup/Signup";

function SignupPage() {
    const {loading} = useSelector((state)=>state.auth);
    return (
      <div>
       
        <SignupComponent/>
      </div>
      )
    
  }
  
  export default SignupPage;