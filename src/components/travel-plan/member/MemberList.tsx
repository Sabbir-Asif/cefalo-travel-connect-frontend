import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { type UserResponse } from "../../../types/User";
import { getMembersForTravelPlanAPI } from "../../../utils/api/travel-plan";
import MemberCard from "./MemberCard";
import CreateTravelRequestModal from "./CreateTravelRequestModal";

const MemberList: React.FC = () => {
    const { travelPlanId } = useParams();
    const [members, setMembers] = useState<UserResponse[]>([]);
    const [loading, setLoading] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);

    const handleAdd = () => setModalOpen(true);

    useEffect(() => {
        if (!travelPlanId) return;

        const fetchData = async () => {
            setLoading(true);
            try {
                const data = await getMembersForTravelPlanAPI(travelPlanId);
                setMembers(data);
            } catch (error) {
                console.error("Failed to fetch members:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [travelPlanId]);

    const handleDelete = (deletedId: string) => {
        setMembers(prev => prev.filter(member => member.id !== deletedId));
    };

    return (
        <div>
            <button className="btn btn-primary mb-2" onClick={handleAdd}>Add Member</button>

            {loading ? (
                <div>Loading...</div>
            ) : members.length === 0 ? (
                <div className="text-base-content/70 mb-2">
                    No members found!
                </div>
            ) : (
                <div className="space-y-2">
                    {members.map(user => (
                        <MemberCard
                            key={user.id}
                            travelPlanId={travelPlanId!}
                            member={user}
                            onDelete={handleDelete}
                        />
                    ))}
                </div>
            )}

            {modalOpen && (
                <CreateTravelRequestModal
                    travelPlanId={travelPlanId}
                    onClose={() => setModalOpen(false)}
                />
            )}
        </div>
    );
};

export default MemberList;
