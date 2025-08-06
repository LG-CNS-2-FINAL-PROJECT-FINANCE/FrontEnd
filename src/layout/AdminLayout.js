import { Outlet } from 'react-router-dom';
import AdminHeader from './Header/AdminHeader';
import AdminFooter from './Footer/AdminFooter';

function AdminLayout() {
    return (
        //style={{minHeight: '100vh'}}
        <div>
            <AdminHeader/>

            <main className="flex-grow">
            <Outlet />
            </main>

            <AdminFooter/>
        </div>
    );
}

export default AdminLayout;