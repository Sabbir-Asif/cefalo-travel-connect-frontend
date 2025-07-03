import { Outlet } from "react-router";
import RequestPageNav from "./RequestPageNav";

const RequestPage: React.FC = () => {
  
    return (
        <div>
            <RequestPageNav />
            <Outlet />
        </div>
    );
};

export default RequestPage;