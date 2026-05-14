// import { useEffect, useRef, useState } from "react";
// import {
//     EllipsisVertical,
//     Eye,
//     Pencil,
//     Trash2,
// } from "lucide-react";
//
// export default function UserActionDropdown({
//                                                onView,
//                                                onEdit,
//                                                onDelete,
//                                            }) {
//     const [open, setOpen] = useState(false);
//
//     const dropdownRef = useRef(null);
//
//     useEffect(() => {
//         const handleOutside = (e) => {
//             if (
//                 dropdownRef.current &&
//                 !dropdownRef.current.contains(e.target)
//             ) {
//                 setOpen(false);
//             }
//         };
//
//         document.addEventListener("mousedown", handleOutside);
//
//         return () => {
//             document.removeEventListener(
//                 "mousedown",
//                 handleOutside
//             );
//         };
//     }, []);
//
//     return (
//         <div
//             className="relative overflow-visible"
//             ref={dropdownRef}
//         >
//             <button
//                 onClick={() => setOpen(!open)}
//                 className="rounded-lg p-2 hover:bg-gray-100"
//             >
//                 <EllipsisVertical size={18} />
//             </button>
//
//             {open && (
//                 <div className="absolute right-0 top-full z-[9999] mt-2 w-44 rounded-xl border border-gray-200 bg-white py-2 shadow-xl">
//                     <button
//                         onClick={() => {
//                             onView();
//                             setOpen(false);
//                         }}
//                         className="flex w-full items-center gap-2 px-4 py-2 text-sm hover:bg-gray-100"
//                     >
//                         <Eye size={16} />
//                         View Details
//                     </button>
//
//                     <button
//                         onClick={() => {
//                             onEdit();
//                             setOpen(false);
//                         }}
//                         className="flex w-full items-center gap-2 px-4 py-2 text-sm hover:bg-gray-100"
//                     >
//                         <Pencil size={16} />
//                         Edit User
//                     </button>
//
//                     <button
//                         onClick={() => {
//                             onDelete();
//                             setOpen(false);
//                         }}
//                         className="flex w-full items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
//                     >
//                         <Trash2 size={16} />
//                         Delete User
//                     </button>
//                 </div>
//             )}
//         </div>
//     );
// }

import { useEffect, useRef, useState } from "react";
import {
    EllipsisVertical,
    Eye,
    Pencil,
    Trash2,
} from "lucide-react";

export default function UserActionDropdown({
                                               onView,
                                               onEdit,
                                               onDelete,
                                           }) {
    const [open, setOpen] = useState(false);

    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleOutside = (e) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(e.target)
            ) {
                setOpen(false);
            }
        };

        document.addEventListener("mousedown", handleOutside);

        return () => {
            document.removeEventListener(
                "mousedown",
                handleOutside
            );
        };
    }, []);

    return (
        <div
            className="relative"
            ref={dropdownRef}
        >
            <button
                onClick={() => setOpen(!open)}
                className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-100 hover:bg-gray-200"
            >
                <EllipsisVertical size={18} />
            </button>

            {open && (
                <div className="absolute right-0 top-[110%] z-[99999] w-52 rounded-2xl border border-gray-200 bg-white p-2 shadow-2xl">
                    <button
                        onClick={() => {
                            onView();
                            setOpen(false);
                        }}
                        className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm hover:bg-gray-100"
                    >
                        <Eye size={16} />
                        View Details
                    </button>

                    <button
                        onClick={() => {
                            onEdit();
                            setOpen(false);
                        }}
                        className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm hover:bg-gray-100"
                    >
                        <Pencil size={16} />
                        Edit User
                    </button>

                    <button
                        onClick={() => {
                            onDelete();
                            setOpen(false);
                        }}
                        className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm text-red-600 hover:bg-red-50"
                    >
                        <Trash2 size={16} />
                        Delete User
                    </button>
                </div>
            )}
        </div>
    );
}
