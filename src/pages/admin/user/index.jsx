import { useEffect, useState } from "react";

import {
    Plus,
    Loader2,
} from "lucide-react";

import { toast } from "sonner";

import {
    createUser,
    deleteUser,
    getUsers,
    updateUser,
} from "./services/user.service.js";

import UserFormModal from "./components/UserFormModal";
import UserDeleteModal from "./components/UserDeleteModal";
import UserActionDropdown from "./components/UserActionDropdown";
import UserDetailModal from "./components/UserDetailModal";

export default function UserIndexPage() {
    const [users, setUsers] = useState([]);

    const [loading, setLoading] = useState(false);

    const [formModalOpen, setFormModalOpen] =
        useState(false);

    const [deleteModalOpen, setDeleteModalOpen] =
        useState(false);

    const [detailModalOpen, setDetailModalOpen] =
        useState(false);

    const [modalMode, setModalMode] =
        useState("create");

    const [selectedUser, setSelectedUser] =
        useState(null);

    const fetchUsers = async () => {
        try {
            setLoading(true);

            const response = await getUsers();

            setUsers(response.data || []);
        } catch (error) {
            toast.error("Failed to fetch users");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleCreate = async (payload) => {
        try {
            setLoading(true);

            await createUser(payload);

            toast.success("User created successfully");

            setFormModalOpen(false);

            fetchUsers();
        } catch (error) {
            toast.error(
                error?.response?.data?.message ||
                "Failed to create user"
            );
        } finally {
            setLoading(false);
        }
    };

    const handleUpdate = async (payload) => {
        try {
            setLoading(true);

            await updateUser(selectedUser._id, payload);

            toast.success("User updated successfully");

            setFormModalOpen(false);

            fetchUsers();
        } catch (error) {
            toast.error(
                error?.response?.data?.message ||
                "Failed to update user"
            );
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        try {
            setLoading(true);

            await deleteUser(selectedUser._id);

            toast.success("User deleted successfully");

            setDeleteModalOpen(false);

            fetchUsers();
        } catch (error) {
            toast.error("Failed to delete user");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6">
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold">
                        Users
                    </h1>

                    <p className="mt-1 text-sm text-gray-500">
                        Manage platform users
                    </p>
                </div>

                <button
                    onClick={() => {
                        setSelectedUser(null);
                        setModalMode("create");
                        setFormModalOpen(true);
                    }}
                    className="flex items-center gap-2 rounded-xl bg-black px-5 py-3 text-white"
                >
                    <Plus size={18} />
                    Create User
                </button>
            </div>

            <div className="overflow-visible rounded-2xl border bg-white">
                <div className="overflow-visible">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-4 text-left text-sm font-semibold">
                                Name
                            </th>

                            <th className="px-6 py-4 text-left text-sm font-semibold">
                                Email
                            </th>

                            <th className="px-6 py-4 text-left text-sm font-semibold">
                                Created Date
                            </th>

                            <th className="px-6 py-4 text-right text-sm font-semibold">
                                Actions
                            </th>
                        </tr>
                        </thead>

                        <tbody>
                        {loading ? (
                            <tr>
                                <td
                                    colSpan={4}
                                    className="py-16 text-center"
                                >
                                    <div className="flex items-center justify-center">
                                        <Loader2 className="animate-spin" />
                                    </div>
                                </td>
                            </tr>
                        ) : users.length === 0 ? (
                            <tr>
                                <td
                                    colSpan={4}
                                    className="py-16 text-center text-gray-500"
                                >
                                    No users found
                                </td>
                            </tr>
                        ) : (
                            users.map((user) => (
                                <tr
                                    key={user._id}
                                    className="border-t overflow-visible"
                                >
                                    <td className="px-6 py-4 font-medium">
                                        {user.name}
                                    </td>

                                    <td className="px-6 py-4">
                                        {user.email}
                                    </td>

                                    <td className="px-6 py-4">
                                        {new Date(
                                            user.createdAt
                                        ).toLocaleDateString()}
                                    </td>

                                    <td className="px-6 py-4 text-right">
                                        <div className="flex justify-end">
                                            <UserActionDropdown
                                                onView={() => {
                                                    setSelectedUser(user);
                                                    setDetailModalOpen(true);
                                                }}
                                                onEdit={() => {
                                                    setSelectedUser(user);
                                                    setModalMode("edit");
                                                    setFormModalOpen(true);
                                                }}
                                                onDelete={() => {
                                                    setSelectedUser(user);
                                                    setDeleteModalOpen(true);
                                                }}
                                            />
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                        </tbody>
                    </table>
                </div>
            </div>

            <UserFormModal
                isOpen={formModalOpen}
                onClose={() => setFormModalOpen(false)}
                onSubmit={
                    modalMode === "create"
                        ? handleCreate
                        : handleUpdate
                }
                loading={loading}
                mode={modalMode}
                selectedUser={selectedUser}
            />

            <UserDeleteModal
                isOpen={deleteModalOpen}
                onClose={() => setDeleteModalOpen(false)}
                onConfirm={handleDelete}
                loading={loading}
                selectedUser={selectedUser}
            />

            <UserDetailModal
                isOpen={detailModalOpen}
                onClose={() => setDetailModalOpen(false)}
                user={selectedUser}
            />
        </div>
    );
}
