import type { UserResponse } from "../../../types/User";

interface SuggestedMemberCardProps {
    member: UserResponse;
}

const SuggestedMemberCard: React.FC<SuggestedMemberCardProps> = ({ member }) => {

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
        </div>
    );
};

export default SuggestedMemberCard;
