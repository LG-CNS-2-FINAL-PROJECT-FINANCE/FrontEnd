import { Outlet } from 'react-router-dom';
import Header from './Header/Header';
import Footer from './Footer/Footer';

function Layout() {
    return (
        // 레이아웃 최대높이 (사이트 최소높이 브라우저 창 크기 - 필요시 변경 가능)
        //style={{minHeight: '100vh'}}
        <div className="flex flex-col min-h-screen">
            <Header />

            <main className="flex-grow px-[10%] ">
            <Outlet />
            </main>

            <Footer />
        </div>
    );
}

export default Layout;