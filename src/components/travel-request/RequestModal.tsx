import { useState } from "react";
import type { TravelRequestWithUsers } from "../../types/TravelRequest";
import { updateTravelrequestAPI } from "../../utils/api/travel-request";
import { createTourMemberAPI } from "../../utils/api/travel-plan";
import { useAuth } from "../../context/useAuth";

interface Props {
    request: TravelRequestWithUsers;
    onClose: () => void;
    type: string
}

const RequestModal: React.FC<Props> = ({ request, onClose, type }) => {
    const [loading, setLoading] = useState(false);
    const { user } = useAuth();

    if (!user?.id) return;

    const createTourMemberData = {
        user_id: user.id,
        travelplan_id: request.travel_plan_id
    }

    const updateStatusAndAddMember = async () => {
        setLoading(true);
        await updateTravelrequestAPI(request.id, { status: "ACCEPTED" });
        await createTourMemberAPI(createTourMemberData)
        setLoading(false);
    }

    const updateStatus = async () => {
        setLoading(true);
        await updateTravelrequestAPI(request.id, { status: "REJECTED" });
        setLoading(false);
    }

    const handleAccept = () => {
        try {
            updateStatusAndAddMember();
            alert('Status updated');
            onClose();
        } catch (err) {
            console.log(err);
            alert('error updating status');
        }
    }

    const handleCancel = () => {
        try {
            updateStatus();
            alert('Request Rejected');
            onClose();
        } catch (err) {
            console.log(err);
            alert('error updating status');
        }
    }

    if (loading) {
        return <div>
            Updating status ...
        </div>
    }
    return (
        <dialog className="modal modal-open">
            <div className="modal-box relative">
                <h3 className="font-bold text-lg mb-2">{request.title}</h3>
                <button onClick={onClose} className="btn btn-sm btn-outline absolute right-4 top-4">Close</button>

                <div className="mb-4">
                    <p className="text-sm text-gray-500">To: {request.to_user.name}</p>
                </div>

                <div className="space-y-2">
                    <p><span className="font-semibold">Message:</span> {request.message}</p>
                    <p><span className="font-semibold">Status:</span> {request.status}</p>
                    <p><span className="font-semibold">Created At:</span> {new Date(request.created_at).toLocaleString()}</p>
                </div>
                <div className="mt-2">
                    {
                        (type === "recieved" && request.status === "PENDING") && (
                            <div className="flex justify-between">
                                <button
                                    className="btn bg-red-600"
                                    onClick={handleCancel}
                                >
                                    Cancel
                                </button>
                                <button
                                    className="btn bg-green-600"
                                    onClick={handleAccept}
                                >
                                    Accept
                                </button>
                            </div>
                        )
                    }
                </div>
            </div>
        </dialog>
    );
};

export default RequestModal;
