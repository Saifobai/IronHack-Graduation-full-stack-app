// const UserTable = ({ users, onEdit, onDelete, sortConfig, setSortConfig }) => {
//   const requestSort = (key) => {
//     let direction = "asc";
//     if (sortConfig.key === key && sortConfig.direction === "asc") {
//       direction = "desc";
//     }
//     setSortConfig({ key, direction });
//   };

//   return (
//     <div className="overflow-x-auto mb-10">
//       <table className="w-full bg-gray-800 rounded-xl shadow-xl overflow-hidden">
//         <thead>
//           <tr className="bg-gray-700 text-left">
//             <th className="p-3">Username</th>
//             <th className="p-3">Email</th>
//             <th className="p-3">Role</th>
//             <th
//               className="p-3 cursor-pointer"
//               onClick={() => requestSort("credits")}
//             >
//               Credits{" "}
//               {sortConfig.key === "credits" &&
//                 (sortConfig.direction === "asc" ? "⬆️" : "⬇️")}
//             </th>
//             <th
//               className="p-3 cursor-pointer"
//               onClick={() => requestSort("createdAt")}
//             >
//               Registered{" "}
//               {sortConfig.key === "createdAt" &&
//                 (sortConfig.direction === "asc" ? "⬆️" : "⬇️")}
//             </th>
//             <th className="p-3 text-center">Actions</th>
//           </tr>
//         </thead>
//         <tbody>
//           {users.map((u) => (
//             <tr
//               key={u._id}
//               className="border-b border-gray-700 hover:bg-gray-700 transition"
//             >
//               <td className="p-3">{u.username}</td>
//               <td className="p-3">{u.email}</td>
//               <td className="p-3">
//                 {u.role === "admin" ? "👑 Admin" : "👤 User"}
//               </td>
//               <td className="p-3">{u.credits}</td>
//               <td className="p-3">
//                 {new Date(u.createdAt).toLocaleDateString()}
//               </td>
//               <td className="p-3 flex gap-3 justify-center">
//                 <button
//                   onClick={() => onEdit(u)}
//                   className="bg-gradient-to-r from-cyan-500 to-purple-600 px-3 py-1 rounded-lg hover:shadow-lg hover:scale-105 transition"
//                 >
//                   Edit
//                 </button>
//                 <button
//                   onClick={() => onDelete(u._id)}
//                   className="bg-gradient-to-r from-red-500 to-pink-600 px-3 py-1 rounded-lg hover:shadow-lg hover:scale-105 transition"
//                 >
//                   Delete
//                 </button>
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// export default UserTable;

//=======================================================
//================ USING TANKSTACK REACT TABLE===========
//=======================================================

import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  flexRender,
} from "@tanstack/react-table";
import { useState, useMemo } from "react";

const UserTable = ({ users, onEdit, onDelete }) => {
  const [sorting, setSorting] = useState([]);
  const [globalFilter, setGlobalFilter] = useState("");

  // Define table columns
  const columns = useMemo(
    () => [
      {
        header: "Username",
        accessorKey: "username",
        cell: (info) => info.getValue(),
      },
      {
        header: "Email",
        accessorKey: "email",
        cell: (info) => info.getValue(),
      },
      {
        header: "Role",
        accessorKey: "role",
        cell: (info) => (info.getValue() === "admin" ? "👑 Admin" : "👤 User"),
      },
      {
        header: "Credits",
        accessorKey: "credits",
      },
      {
        header: "Registered",
        accessorKey: "createdAt",
        cell: (info) =>
          new Date(info.getValue()).toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          }),
      },
      {
        header: "Actions",
        id: "actions",
        cell: ({ row }) => (
          <div className="flex gap-3 justify-center">
            <button
              onClick={() => onEdit(row.original)}
              className="bg-gradient-to-r from-cyan-500 to-purple-600 px-3 py-1 rounded-lg hover:shadow-lg hover:scale-105 transition"
            >
              Edit
            </button>
            <button
              onClick={() => onDelete(row.original._id)}
              className="bg-gradient-to-r from-red-500 to-pink-600 px-3 py-1 rounded-lg hover:shadow-lg hover:scale-105 transition"
            >
              Delete
            </button>
          </div>
        ),
      },
    ],
    [onEdit, onDelete]
  );

  // Table setup
  const table = useReactTable({
    data: users,
    columns,
    state: {
      sorting,
      globalFilter,
    },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <div className="overflow-x-auto mb-10">
      {/* Global Search */}
      <div className="mb-4 flex justify-end">
        <input
          type="text"
          placeholder="Search users..."
          value={globalFilter ?? ""}
          onChange={(e) => setGlobalFilter(e.target.value)}
          className="px-4 py-2 rounded-lg bg-gray-800 border border-gray-600 text-white"
        />
      </div>

      {/* Table */}
      <table className="w-full bg-gray-800 rounded-xl shadow-xl overflow-hidden">
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id} className="bg-gray-700 text-left">
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  onClick={header.column.getToggleSortingHandler()}
                  className="p-3 cursor-pointer select-none"
                >
                  {flexRender(
                    header.column.columnDef.header,
                    header.getContext()
                  )}
                  {{
                    asc: " ⬆️",
                    desc: " ⬇️",
                  }[header.column.getIsSorted()] ?? null}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.length > 0 ? (
            table.getRowModel().rows.map((row) => (
              <tr
                key={row.id}
                className="border-b border-gray-700 hover:bg-gray-700 transition"
              >
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="p-3">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan={columns.length}
                className="text-center p-6 text-gray-400"
              >
                No users found
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Pagination Controls */}
      <div className="flex justify-between items-center mt-4">
        <div>
          Page {table.getState().pagination.pageIndex + 1} of{" "}
          {table.getPageCount()}
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="px-3 py-1 bg-gray-700 rounded disabled:opacity-50"
          >
            Prev
          </button>
          <button
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="px-3 py-1 bg-gray-700 rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserTable;
