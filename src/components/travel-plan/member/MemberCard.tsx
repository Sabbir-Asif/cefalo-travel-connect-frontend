import { useEffect, useState } from "react";
import { useAuth } from "../../../context/useAuth";
import type { TravelPlan } from "../../../types/TravelPlan";
import type { UserResponse } from "../../../types/User";
import { AiFillDelete } from "react-icons/ai";
import { getTravelPlanByIdAPI, removeMemberFromTravelPlan } from "../../../utils/api/travel-plan";
import { toast } from "react-toastify";

interface MemberCardProps {
    member: UserResponse;
    travelPlanId: string;
    onDelete?: (id: string) => void;
}

const MemberCard: React.FC<MemberCardProps> = ({ member, travelPlanId, onDelete }) => {
    const { user } = useAuth();
    const [travelPlan, setTravelPlan] = useState<TravelPlan>({} as TravelPlan);
    const [loading, setLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        const fetchTravelPlan = async () => {
            setLoading(true);
            const data = await getTravelPlanByIdAPI(travelPlanId);
            setTravelPlan(data);
            setLoading(false);
        };
        fetchTravelPlan();
    }, [travelPlanId]);

    const handleDelete = async () => {
        setIsDeleting(true);
        try {
            const status = await removeMemberFromTravelPlan(travelPlanId, member.id);
            if (status === 204) {
                toast.success("Member removed successfully");
                onDelete?.(member.id);
                setIsModalOpen(false);
            } else {
                toast.error("Failed to remove member");
            }
        } catch (err) {
            console.error(err);
            toast.error("Error removing member");
        } finally {
            setIsDeleting(false);
        }
    };

    if (!user) return <div>Forbidden!</div>;
    if (loading) return <div>Loading...</div>

    return (
        <div className="font-nunito max-w-sm bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 p-4 mb-4">
            <div className="flex items-start gap-4">
                <div className="h-16 w-16 rounded-full overflow-hidden bg-gray-100 flex-shrink-0">
                    <img
                        src={member.displayPicture || ""}
                        alt="picture"
                        className="w-full h-full object-cover rounded-full"
                    />
                </div>
                <div className="flex-1 min-w-0 space-y-1">
                    <h3 className="font-semibold text-gray-900 text-base truncate">{member.name}</h3>
                    <p className="text-sm text-gray-600 truncate">
                        <span className="font-medium">Phone:</span> {member.phone_number}
                    </p>
                    <p className="text-sm text-gray-600 truncate">
                        <span className="font-medium">Email:</span> {member.email}
                    </p>
                </div>
            </div>

            {travelPlan.planner_id === user.id && (
                <div className="flex justify-end">
                    <button onClick={() => setIsModalOpen(true)}>
                        <AiFillDelete className="text-2xl hover:text-red-600" />
                    </button>
                </div>
            )}

            {isModalOpen && (
                <dialog className="modal modal-open">
                    <div className="modal-box">
                        <h3 className="font-bold text-lg">Confirm Deletion</h3>
                        <p className="py-4">Are you sure you want to remove this member from the travel plan?</p>
                        <div className="modal-action">
                            <button
                                className="btn btn-error"
                                onClick={handleDelete}
                                disabled={isDeleting}
                            >
                                {isDeleting ? "Removing..." : "Confirm"}
                            </button>
                            <button
                                className="btn"
                                onClick={() => setIsModalOpen(false)}
                                disabled={isDeleting}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </dialog>
            )}
        </div>
    );
};

export default MemberCard;
