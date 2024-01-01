import Navbar from "./components/Navbar";
import DashboardData from "./components/DashboardData";
const Dashboard = () => {
  return (
    <div>
      <Navbar />
      <div className="container">
        <DashboardData />
      </div>
    </div>
  );
};

export default Dashboard;
