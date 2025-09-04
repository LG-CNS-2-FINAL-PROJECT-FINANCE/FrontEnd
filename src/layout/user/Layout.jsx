import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';

function Layout() {
    return (
        // 레이아웃 최대높이 (사이트 최소높이 브라우저 창 크기 - 필요시 변경 가능)
        //style={{minHeight: '100vh'}}
        <div className="flex flex-col min-h-screen">
            <header className="fixed top-0 left-0 w-full z-50 drop-shadow-md">
                <Header />
            </header>

            <main className="flex-grow px-[10%] pt-16 bg-slate-50">
                <Outlet />
            </main>
            
            <Footer />
        </div>
    );
}

export default Layout;