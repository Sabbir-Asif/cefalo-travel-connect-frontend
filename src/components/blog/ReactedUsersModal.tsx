import React from 'react';
import type { UserResponse } from '../../types/User';
import { formatDistanceToNow } from 'date-fns';

interface ReactedUsersModalProps {
    isOpen: boolean;
    onClose: () => void;
    users: UserResponse[];
}

const ReactedUsersModal: React.FC<ReactedUsersModalProps> = ({ isOpen, onClose, users }) => {
    if (!isOpen) return null;

    return (
        <dialog className="modal modal-open">
            <div className="modal-box">
                <h3 className="font-bold text-lg mb-4">People who reacted</h3>
                <div className="space-y-4 max-h-96 overflow-y-auto">
                    {users.map((user) => (
                        <div key={user.id} className="flex items-center gap-3 border-1 border-gray-500 rounded-md p-2">
                            <div className="h-12 w-12 rounded-full overflow-hidden">
                                {user.displayPicture && (
                                    <img
                                        src={user.displayPicture}
                                        alt="user"
                                        className="h-12 w-12 object-cover rounded-full"
                                    />
                                )}
                            </div>
                            <div>
                                <p className="text-lg font-extrabold font-nunito text-gray-900 hover:text-blue-600">
                                    {user.name}
                                </p>
                                <p className="text-sm text-gray-500">
                                    {formatDistanceToNow(new Date(user.createdAt), { addSuffix: true })}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="modal-action">
                    <button className="btn btn-sm btn-ghost" onClick={onClose}>
                        Close
                    </button>
                </div>
            </div>
        </dialog>
    );
};

export default ReactedUsersModal;
