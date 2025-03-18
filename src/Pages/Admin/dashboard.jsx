import { useSelector } from "react-redux";
 import AdminDashboardComponent from "../../components/AdminDashboard/AdminDashboard";


function AdminDashboardPage() {
    const {loading} = useSelector((state)=>state.auth);
    return (
      <div>
        <AdminDashboardComponent/>
      </div>
      )
    
  }
  
  export default AdminDashboardPage;