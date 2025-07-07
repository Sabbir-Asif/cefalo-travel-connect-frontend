import { useEffect, useState } from "react";
import type { UserResponse } from "../../../types/User";
import { useAuth } from "../../../context/useAuth";
import { SuggestedMembersAPI } from "../../../utils/api/travel-plan";
import SuggestedMemberCard from "./SuggestedMemberCard";

const SuggestedMemberList = () => {
    const [members, setMembers] = useState<UserResponse[]>([]);
    const [loading, setLoading] = useState(false);

    const { user } = useAuth();

    useEffect(() => {
        if (!user?.id) return;

        const fetchData = async () => {
            setLoading(true);
            const data = await SuggestedMembersAPI(user.id);
            setMembers(data);
            setLoading(false);
        };

        fetchData();
    }, [user?.id]);

    if (loading) {
        return <div>Loading...</div>
    }

    return (
        <div className="space-y-2">
            {members.map((user) => (
                <SuggestedMemberCard
                    key={user.id}
                    member={user}
                />
            ))}
        </div>
    );
};

export default SuggestedMemberList;