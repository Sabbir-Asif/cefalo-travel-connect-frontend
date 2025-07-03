import { useState } from "react";
import type { TravelRequestWithUsers } from "../../types/TravelRequest";
import RequestModal from "./RequestModal";


const RequestCard: React.FC<{ request: TravelRequestWithUsers, type: string }> = ({ request, type }) => {
    const [open, setOpen] = useState(false);

    return (
        <div className="my-2">
            <div
                onClick={() => setOpen(true)}
                className="cursor-pointer border rounded-lg p-4 shadow hover:shadow-md transition duration-200 bg-white"
            >
                <p className="font-medium text-gray-800">{request.title}</p>
                <p className="text-sm text-gray-500">To: {request.to_user.name}</p>
            </div>

            {open && (
                <RequestModal 
                request={request} 
                onClose={() => setOpen(false)}
                type={type}
                />
            )}
        </div>
    );
};

export default RequestCard;
