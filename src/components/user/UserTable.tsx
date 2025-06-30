import { useEffect, useState } from "react";
import { getAllUsers } from "../../utils/api/user";
import UserRow from "./UserRow";
import UserModal from "./UserModal";
import type { UserResponse } from "../../types/User";

const UserTable = () => {
    const [users, setUsers] = useState<UserResponse[]>([]);
    const [selectedUser, setSelectedUser] = useState<UserResponse | null>(null);
    const [loading, setLoading] = useState(true);

    const loadUsers = async () => {
        setLoading(true);
        setUsers(await getAllUsers());
        setLoading(false);
    };

    useEffect(() => {
        loadUsers();
    }, []);

    if (loading) return <div className="p-4">Loading...</div>;

    return (
        <>
            <div className="overflow-x-auto">
                <table className="table w-full">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Role</th>
                            <th>Update Role</th>
                            <th>Delete</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((u) => (
                            <UserRow
                                key={u.id}
                                user={u}
                                onSelect={setSelectedUser}
                                refresh={loadUsers}
                            />
                        ))}
                    </tbody>
                </table>
            </div>

            {selectedUser && (
                <UserModal
                    user={selectedUser}
                    onClose={() => setSelectedUser(null)}
                />
            )}
        </>
    );
};

export default UserTable;
