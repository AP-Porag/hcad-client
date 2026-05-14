import { useEffect, useState } from "react";
import { X, Loader2 } from "lucide-react";

export default function UserFormModal({
                                          isOpen,
                                          onClose,
                                          onSubmit,
                                          loading,
                                          mode = "create",
                                          selectedUser = null,
                                      }) {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
    });

    useEffect(() => {
        if (selectedUser) {
            setFormData({
                name: selectedUser.name || "",
                email: selectedUser.email || "",
            });
        } else {
            setFormData({
                name: "",
                email: "",
            });
        }
    }, [selectedUser]);

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="w-full max-w-lg rounded-2xl bg-white shadow-2xl">
                <div className="flex items-center justify-between border-b px-6 py-4">
                    <h2 className="text-xl font-semibold">
                        {mode === "create" ? "Create User" : "Edit User"}
                    </h2>

                    <button
                        onClick={onClose}
                        className="rounded-lg p-2 hover:bg-gray-100"
                    >
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="space-y-5 p-6">
                        <div>
                            <label className="mb-2 block text-sm font-medium">
                                Name
                            </label>

                            <input
                                type="text"
                                required
                                value={formData.name}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        name: e.target.value,
                                    })
                                }
                                className="w-full rounded-xl border px-4 py-3 outline-none focus:border-black"
                                placeholder="Enter name"
                            />
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-medium">
                                Email
                            </label>

                            <input
                                type="email"
                                required
                                value={formData.email}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        email: e.target.value,
                                    })
                                }
                                className="w-full rounded-xl border px-4 py-3 outline-none focus:border-black"
                                placeholder="Enter email"
                            />
                        </div>

                        <div className="rounded-xl border border-blue-100 bg-blue-50 p-4 text-sm text-blue-700">
                            Password will be automatically generated as:
                            <span className="ml-2 font-semibold">12345678</span>
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 border-t px-6 py-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="rounded-xl border px-5 py-2.5 font-medium"
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            disabled={loading}
                            className="flex items-center gap-2 rounded-xl bg-black px-5 py-2.5 font-medium text-white"
                        >
                            {loading && <Loader2 className="animate-spin" size={18} />}

                            {mode === "create" ? "Create User" : "Update User"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
