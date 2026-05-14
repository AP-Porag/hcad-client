import { X } from "lucide-react";

export default function UserDetailModal({
                                            isOpen,
                                            onClose,
                                            user,
                                        }) {
    if (!isOpen || !user) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="w-full max-w-lg rounded-2xl bg-white shadow-2xl">
                <div className="flex items-center justify-between border-b px-6 py-4">
                    <h2 className="text-xl font-semibold">
                        User Details
                    </h2>

                    <button
                        onClick={onClose}
                        className="rounded-lg p-2 hover:bg-gray-100"
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="space-y-5 p-6">
                    <div>
                        <p className="mb-1 text-sm text-gray-500">
                            Name
                        </p>

                        <p className="font-medium">
                            {user.name}
                        </p>
                    </div>

                    <div>
                        <p className="mb-1 text-sm text-gray-500">
                            Email
                        </p>

                        <p className="font-medium">
                            {user.email}
                        </p>
                    </div>

                    <div>
                        <p className="mb-1 text-sm text-gray-500">
                            Created Date
                        </p>

                        <p className="font-medium">
                            {new Date(user.createdAt).toLocaleString()}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
