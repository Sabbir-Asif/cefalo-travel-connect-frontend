import type { UserResponse } from "../../types/User";

interface Props {
    user: UserResponse | null;
    onClose: () => void;
}
const UserModal: React.FC<Props> = ({ user, onClose }) => {
    if (!user) return null;

    return (
        <dialog id="user_modal" className="modal modal-open">
            <div className="modal-box">
                <h3 className="font-bold text-lg mb-4">User Details</h3>
                <p><b>Name:</b> {user.name}</p>
                <p><b>Email:</b> {user.email}</p>
                <p><b>Role:</b> {user.role}</p>
                <p><b>Verified:</b> {user.is_verified ? "Yes" : "No"}</p>
                <p className="truncate"><b>Bio:</b> {user.bio ?? "—"}</p>
                <div className="modal-action">
                    <button className="btn" onClick={onClose}>Close</button>
                </div>
            </div>
        </dialog>
    );
};
export default UserModal;
