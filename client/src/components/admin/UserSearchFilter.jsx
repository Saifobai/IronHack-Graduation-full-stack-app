const UserSearchFilter = ({ searchTerm, setSearchTerm }) => {
  return (
    <div className="mb-6 flex justify-end">
      <input
        type="text"
        placeholder="Search by username or email..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="px-4 py-2 rounded-lg bg-gray-800 border border-gray-600 text-white"
      />
    </div>
  );
};

export default UserSearchFilter;
