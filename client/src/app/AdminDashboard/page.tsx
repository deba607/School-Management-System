import AdminHeader from './admin-header';
import AdminSidebar from './admin-sidebar';
import AdminHome from './admin-home';
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { jwtDecode } from "jwt-decode";

export default function AdminDashboardPage() {
  const router = useRouter();
  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (!token) {
      router.push('/Login');
      return;
    }
    let decoded;
    try {
      decoded = jwtDecode(token);
    } catch {
      localStorage.removeItem('token');
      router.push('/Login');
      return;
    }
    if (!decoded || (decoded as any).role !== 'Admin') {
      localStorage.removeItem('token');
      router.push('/Login');
      return;
    }
  }, [router]);
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-900 to-slate-800">
      <AdminHeader />
      <div className="flex flex-1">
        <AdminSidebar />
        <main className="flex-1 p-3 sm:p-4 md:p-6 lg:p-8 xl:p-10">
          <AdminHome />
        </main>
      </div>
    </div>
  );
}
