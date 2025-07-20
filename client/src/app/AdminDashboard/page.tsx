import AdminHeader from './admin-header';
import AdminSidebar from './admin-sidebar';
import AdminHome from './admin-home';

export default function AdminDashboardPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-900 to-slate-800">
      <AdminHeader />
      <div className="flex flex-1">
        <AdminSidebar />
        <main className="flex-1 p-6 md:p-10">
          <AdminHome />
        </main>
      </div>
    </div>
  );
}
