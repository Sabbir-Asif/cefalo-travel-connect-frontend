import type { DiscussionWithSender } from "../../../types/Discussion";

const DiscussionCard: React.FC<{ discussion: DiscussionWithSender }> = ({ discussion }) => {
    const formatTime = (dateInput: string | Date) => {
        const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
        const now = new Date();
        const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));

        if (diffInMinutes < 1) return 'Just now';
        if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
        if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;

        return date.toLocaleDateString();
    };

    const getInitials = (name: string) => {
        return name
            .split(' ')
            .map(word => word[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    return (
        <div className="flex items-start gap-3 p-3 hover:bg-gray-200 transition-colors font-nunito">
            <div className="avatar placeholder">
                <div className="bg-neutral text-neutral-content rounded-full w-10 h-10">
                    {
                        (discussion.sender.displayPicture)
                            ? <img src={discussion.sender.displayPicture} alt="" />
                            : <span className="text-xs">{getInitials(discussion.sender.name)}</span>
                    }


                </div>
            </div>

            <div className="flex-1 min-w-0">
                <div className="flex items-baseline gap-2 mb-1">
                    <span className="font-semibold text-sm text-base-content">
                        {discussion.sender.name}
                    </span>
                    <span className="text-xs text-base-content/60">
                        {formatTime(discussion.created_at)}
                    </span>
                </div>

                <p className="text-sm text-base-content break-words">
                    {discussion.content}
                </p>
            </div>
        </div>
    );
};

export default DiscussionCard;