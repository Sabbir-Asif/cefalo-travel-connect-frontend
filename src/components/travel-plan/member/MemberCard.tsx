import type { UserResponse } from "../../../types/User";

const MemberCard: React.FC<{user: UserResponse}> = ({ user }) => {
    return (
        <div className="font-nunito max-w-96 text-sm p-2 bg-gray-300 rounded-sm shadow-md mb-2">
            <p>{user.name}</p>
            <p>Phone: {user.phone_number}</p>
            <p>Email: {user.email}</p>
        </div>
    );
};

export default MemberCard;