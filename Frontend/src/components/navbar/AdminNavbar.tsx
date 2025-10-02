import UserAvatar from "../shared/UserAvatar";

const AdminNavbar = () => {
  return (
    <div className="flex items-center justify-end border-b-2 border-gray-400">
      <div className="p-2">
        <UserAvatar to="/admin/dashboard" />
      </div>
    </div>
  );
};

export default AdminNavbar;
