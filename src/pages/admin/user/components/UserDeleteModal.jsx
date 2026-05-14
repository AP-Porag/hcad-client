import { AlertTriangle, Loader2, X } from "lucide-react";

export default function UserDeleteModal({
                                            isOpen,
                                            onClose,
                                            onConfirm,
                                            loading,
                                            selectedUser,
                                        }) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl">
                <div className="flex items-center justify-between border-b px-6 py-4">
                    <h2 className="text-lg font-semibold">
                        Delete User
                    </h2>

                    <button
                        onClick={onClose}
                        className="rounded-lg p-2 hover:bg-gray-100"
                    >
                        <X size={18} />
                    </button>
                </div>

                <div className="p-6">
                    <div className="mb-5 flex items-center gap-3 rounded-xl bg-red-50 p-4 text-red-600">
                        <AlertTriangle />
                        <span>
              This action cannot be undone.
            </span>
                    </div>

                    <p className="text-gray-700">
                        Are you sure you want to delete:
                    </p>

                    <p className="mt-2 font-semibold">
                        {selectedUser?.name}
                    </p>
                </div>

                <div className="flex justify-end gap-3 border-t px-6 py-4">
                    <button
                        onClick={onClose}
                        className="rounded-xl border px-5 py-2.5"
                    >
                        Cancel
                    </button>

                    <button
                        onClick={onConfirm}
                        disabled={loading}
                        className="flex items-center gap-2 rounded-xl bg-red-600 px-5 py-2.5 text-white"
                    >
                        {loading && (
                            <Loader2 className="animate-spin" size={18} />
                        )}

                        Delete User
                    </button>
                </div>
            </div>
        </div>
    );
}
