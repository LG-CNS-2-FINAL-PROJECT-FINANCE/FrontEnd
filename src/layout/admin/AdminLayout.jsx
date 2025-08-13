import { Outlet } from 'react-router-dom';
import AdminHeader from './AdminHeader';
import AdminFooter from './AdminFooter';
import AdminSidebar from "../../pages/admin/adminComponent/AdminSidebar";

function AdminLayout() {
    return (
        //style={{minHeight: '100vh'}}
        <div className="min-h-screen flex flex-col">
            <div className="w-full">
                <AdminHeader/>
            </div>

            <div className="flex flex-1 py-4">
                <aside className="w-64 border-r bg-white">
                    <AdminSidebar />
                </aside>

                <main className="flex-1">
                    <Outlet />
                </main>
            </div>

            <AdminFooter/>
        </div>
    );
}

export default AdminLayout;