import Navbar from './components/Navbar'
import DashboardData from "./components/DashboardData";
const Dashboard = () => {
  return (
    <>
    <Navbar />
    <div className="container">
     <DashboardData />
    </div>
    </>
  );
};

export default Dashboard;
