import { useState } from "react";
import { toast } from "react-toastify";
import { AiFillDelete } from "react-icons/ai";
import type { Transport } from "../../../types/Transport";
import { deleteBlogTransportAPI } from "../../../utils/api/blog";

interface TransportCardProps {
    blogId: string
    transport: Transport;
    onDelete?: (id: string) => void;
}

const TransportCard: React.FC<TransportCardProps> = ({ blogId, transport, onDelete }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const formatDateTime = (dateValue: string | Date | null) => {
        if (!dateValue) {
            return { date: "", time: "" };
        }
        const date = typeof dateValue === "string" ? new Date(dateValue) : dateValue;
        if (isNaN(date.getTime())) {
            return { date: "Invalid date", time: "" };
        }
        return {
            date: date.toLocaleDateString("en-US", {
                weekday: "short",
                year: "numeric",
                month: "short",
                day: "numeric",
            }),
            time: date.toLocaleTimeString("en-US", {
                hour: "2-digit",
                minute: "2-digit",
            }),
        };
    };

    const departure = formatDateTime(transport.departure_time);
    const arrival = formatDateTime(transport.arrival_time);

    const handleDelete = async () => {
        setIsDeleting(true);
        try {
            const status = await deleteBlogTransportAPI(blogId, transport.id);
            if (status === 204) {
                toast.success("Transport removed successfully");
                onDelete?.(transport.id);
            } else {
                toast.error("Failed to delete transport");
            }
        } catch (err) {
            console.log(err);
            toast.error("Error deleting transport");
        } finally {
            setIsDeleting(false);
            setIsModalOpen(false);
        }
    };

    return (
        <>
            <div className="card w-96 bg-basegray-50 shadow-xl font-nunito">
                <div className="card-body">
                    <div className="flex justify-between items-start mb-4">
                        <h2 className="card-title text-xl font-bold">{transport.name}</h2>
                        <div className="badge badge-primary badge-outline">{transport.type}</div>
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="text-center">
                                <div className="font-semibold text-lg">{transport.starting_location}</div>
                                <div className="text-sm text-base-content/70">{departure.date}</div>
                                <div className="text-sm font-medium">{departure.time}</div>
                            </div>

                            <div className="flex-1 mx-4">
                                <div className="flex items-center">
                                    <div className="w-3 h-3 bg-primary rounded-full"></div>
                                    <div className="flex-1 h-0.5 bg-base-300 mx-2"></div>
                                    <div className="w-3 h-3 bg-primary rounded-full"></div>
                                </div>
                            </div>

                            <div className="text-center">
                                <div className="font-semibold text-lg">{transport.destination}</div>
                                <div className="text-sm text-base-content/70">{arrival.date}</div>
                                <div className="text-sm font-medium">{arrival.time}</div>
                            </div>
                        </div>

                        <div className="divider"></div>
                        <div className="flex justify-between items-center">
                            <span className="text-base-content/70">Fare</span>
                            <span className="text-lg font-bold text-primary">{transport.fare}</span>
                        </div>
                    </div>

                    <div className="flex justify-end">
                        <button onClick={() => setIsModalOpen(true)}>
                            <AiFillDelete className="text-2xl hover:text-red-600" />
                        </button>
                    </div>
                </div>
            </div>

            {isModalOpen && (
                <dialog className="modal modal-open">
                    <div className="modal-box">
                        <h3 className="font-bold text-lg">Confirm Deletion</h3>
                        <p className="py-4">Are you sure you want to delete this transport?</p>
                        <div className="modal-action">
                            <button
                                className="btn btn-error"
                                onClick={handleDelete}
                                disabled={isDeleting}
                            >
                                {isDeleting ? "Deleting..." : "Confirm"}
                            </button>
                            <button className="btn" onClick={() => setIsModalOpen(false)} disabled={isDeleting}>
                                Cancel
                            </button>
                        </div>
                    </div>
                </dialog>
            )}
        </>
    );
};

export default TransportCard;
