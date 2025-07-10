import { useState } from "react";
import { getUserByEmailAPI } from "../../../utils/api/user";
import { createTravelRequestAPI } from "../../../utils/api/travel-request";
import { toast } from "react-toastify";
import { type CreateTravelRequest } from "../../../types/TravelRequest";

interface Props {
    travelPlanId?: string;
    onClose: () => void;
}

const CreateTravelRequestModal: React.FC<Props> = ({ travelPlanId, onClose }) => {
    const [email, setEmail] = useState("");
    const [title, setTitle] = useState("");
    const [message, setMessage] = useState("");
    const [matchingUser, setMatchingUser] = useState<{ id: string; name: string; email: string } | null>(null);
    const [loading, setLoading] = useState(false);

    const handleEmailSearch = async () => {
        if (!email) return;
        try {
            const results = await getUserByEmailAPI(email);
            setMatchingUser(results?.[0] || null);
        } catch (error) {
            console.error(error);
        }
    };

    const handleUserSelect = () => {
        if (matchingUser) setEmail(matchingUser.email);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!travelPlanId) {
            toast.error("Travel plan not found!");
            return;
        }

        if (!matchingUser?.id || !title || !message) {
            toast.error("Please fill all fields and select a valid user.");
            return;
        }

        const data: CreateTravelRequest = {
            travel_plan_id: travelPlanId,
            user_to: matchingUser.id,
            title,
            message
        };

        try {
            setLoading(true);
            await createTravelRequestAPI(data);
            toast.success("Travel request created");
            onClose();
        } catch (err) {
            console.error(err);
            toast.error("Failed to create travel request");
        } finally {
            setLoading(false);
        }
    };

    return (
        <dialog className="modal modal-open">
            <div className="modal-box">
                <h3 className="font-bold text-lg mb-4">Create Travel Request</h3>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="label">User Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            onBlur={handleEmailSearch}
                            className="input input-bordered w-full"
                            required
                        />
                        {matchingUser && (
                            <div
                                className="mt-2 cursor-pointer text-sm text-blue-600 hover:underline"
                                onClick={handleUserSelect}
                            >
                                {matchingUser.name} ({matchingUser.email})
                            </div>
                        )}
                    </div>

                    <div>
                        <label className="label">Title</label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="input input-bordered w-full"
                            required
                        />
                    </div>

                    <div>
                        <label className="label">Message</label>
                        <textarea
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            className="textarea textarea-bordered w-full"
                            required
                        />
                    </div>

                    <div className="modal-action">
                        <button
                            type="submit"
                            className="btn btn-primary"
                            disabled={loading}
                        >
                            {loading ? "Sending..." : "Send Request"}
                        </button>
                        <button
                            type="button"
                            onClick={onClose}
                            className="btn btn-outline"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </dialog>
    );
};

export default CreateTravelRequestModal;
