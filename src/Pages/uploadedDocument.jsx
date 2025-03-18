import { useSelector } from "react-redux";
 import UploadedDocumentComponent from "../components/uploadDocuments/UploadDocuments";
import Navbar from "../components/common/Navbar/Navbar";

function UploadedDocumentPage() {
    const {loading} = useSelector((state)=>state.auth);
    return (
     <div>
       <Navbar/>
       <UploadedDocumentComponent/>
     </div>
      )
    
  }
  
  export default UploadedDocumentPage;