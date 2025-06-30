import type { UserResponse } from "../../types/User";
import { updateUserRole, deleteUser } from "../../utils/api/user";

interface Props {
    user: UserResponse;
    onSelect: (u: UserResponse) => void;
    refresh: () => void;
}
const UserRow: React.FC<Props> = ({ user, onSelect, refresh }) => {
    const handleRoleToggle = async () => {
        const newRole = user.role === "ADMIN" ? "EXPLORER" : "ADMIN";
        await updateUserRole(user.id, newRole);
        refresh();
    };

    const handleDelete = async () => {
        if (!confirm("Delete this user?")) return;
        await deleteUser(user.id);
        refresh();
    };

    return (
        <tr className="hover">
            <td onClick={() => onSelect(user)}>{user.name}</td>
            <td onClick={() => onSelect(user)}>{user.email}</td>
            <td>{user.role}</td>
            <td>
                <button className="btn btn-xs" onClick={handleRoleToggle}>
                    Set {user.role === "ADMIN" ? "EXPLORER" : "ADMIN"}
                </button>
            </td>
            <td>
                <button className="btn btn-xs btn-error" onClick={handleDelete}>
                    Delete
                </button>
            </td>
        </tr>
    );
};
export default UserRow;
