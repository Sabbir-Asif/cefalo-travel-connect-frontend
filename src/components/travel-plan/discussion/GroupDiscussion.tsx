import { useState, useEffect, useRef, useCallback } from 'react';
import { Send, Minus, MessageCircle } from 'lucide-react';
import { useParams } from 'react-router';
import { createDiscussionAPI, getDiscussionsForTravelPlanAPI } from '../../../utils/api/discussion';
import type { DiscussionWithSender } from '../../../types/Discussion';
import DiscussionCard from './DiscussionCard';

const GroupDiscussion = () => {
    const [discussions, setDiscussions] = useState<DiscussionWithSender[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [isSending, setIsSending] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement | null>(null);
    const [showChat, setShowChat] = useState(true);
    const { travelPlanId } = useParams();

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    const loadDiscussions = useCallback(async () => {
        if (!travelPlanId) {
            setIsLoading(false);
            return;
        }
        try {
            setIsLoading(true);
            const data = await getDiscussionsForTravelPlanAPI(travelPlanId);
            setDiscussions(data);
        } catch (error) {
            console.error('Error loading discussions:', error);
        } finally {
            setIsLoading(false);
        }
    }, [travelPlanId]);

    useEffect(() => {
        loadDiscussions();
    }, [loadDiscussions]);

    useEffect(() => {
        if (showChat) {
            scrollToBottom();
        }
    }, [discussions, showChat]);

    const handleSendMessage = async () => {
        if (!newMessage.trim() || isSending) return;
        if (!travelPlanId) return;

        try {
            setIsSending(true);

            const discussionData = {
                travel_plan_id: travelPlanId,
                content: newMessage.trim()
            };

            await createDiscussionAPI(discussionData);

            await loadDiscussions();
            setNewMessage('');

        } catch (error) {
            console.error('Error sending message:', error);
        } finally {
            setIsSending(false);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    const toggleChat = () => {
        setShowChat(!showChat);
    };

    return (
        <div className={`card bg-base-100 shadow-lg max-w-96 flex flex-col font-nunito transition-all duration-300 ${showChat ? 'h-96' : 'h-auto'
            }`}>
            <div className="flex-shrink-0">
                <div className="flex justify-between items-center">
                    <h2 className="mt-2 ml-2 text-lg font-bold">
                        Group Discussion
                    </h2>
                    <button
                        onClick={toggleChat}
                        className="btn btn-ghost btn-sm btn-square hover:bg-base-200"
                        title={showChat ? "Hide chat" : "Show chat"}
                    >
                        {showChat ? <Minus size={16} /> : <MessageCircle size={16} />}
                    </button>
                </div>
                {showChat && <div className="divider my-1"></div>}
            </div>

            {showChat && (
                <>
                    <div className="flex-1 overflow-y-auto px-4">
                        {isLoading ? (
                            <div className="flex justify-center items-center h-full">
                                <span className="loading loading-spinner loading-md"></span>
                            </div>
                        ) : discussions.length === 0 ? (
                            <div className="flex justify-center items-center h-full text-base-content/60">
                                <p>No messages yet. Start the conversation!</p>
                            </div>
                        ) : (
                            <div className="space-y-1">
                                {discussions.map((discussion) => (
                                    <DiscussionCard key={discussion.id} discussion={discussion} />
                                ))}
                                <div ref={messagesEndRef} />
                            </div>
                        )}
                    </div>

                    <div className="p-4 pt-0 flex-shrink-0">
                        <div className="flex gap-2">
                            <textarea
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                onKeyPress={handleKeyPress}
                                placeholder="Type a message..."
                                className="textarea textarea-bordered flex-1 resize-none min-h-10 max-h-20"
                                rows={1}
                                disabled={isSending}
                            />
                            <button
                                onClick={handleSendMessage}
                                disabled={!newMessage.trim() || isSending}
                                className="btn bg-black text-white btn-square"
                            >
                                {isSending ? (
                                    <span className="loading loading-spinner loading-sm"></span>
                                ) : (
                                    <Send size={16} />
                                )}
                            </button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default GroupDiscussion;