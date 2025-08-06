import { Outlet } from 'react-router-dom';
import AdminHeader from './Header/AdminHeader';
import AdminFooter from './Footer/AdminFooter';

function AdminLayout() {
    return (
        //style={{minHeight: '100vh'}}
        <div>
            <AdminHeader/>
            <Outlet />
            <AdminFooter/>
        </div>
    );
}

export default AdminLayout;