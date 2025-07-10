import { Outlet } from "react-router";
import Navbar from "../../components/general/Navbar";
import DashboardNav from "../../components/dashboard/user-dashboard/DashboardNav";
import Footer from "../../components/general/Footer";

const DashboardLayout = () => {
    return (
        <div>
            <div className="container mx-auto max-w-6xl space-y-12 mt-4 min-h-screen">
                <div id="global-toast-container" className="toast toast-top toast-end z-50" />
                <Navbar />
                <DashboardNav />
                <Outlet />
            </div>
            <Footer />
        </div>
    );
};

export default DashboardLayout;