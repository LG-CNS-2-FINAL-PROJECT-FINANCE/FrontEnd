import { BrowserRouter, Routes, Route } from 'react-router-dom';

import ScrollToTop from './pages/common/ScrollToTop.js'
import Layout from "./layout/Layout";
import AdminLayout from "./layout/AdminLayout";

function App() {
  return (
    <BrowserRouter>
        <div className="flex flex-col min-h-screen">
            <ScrollToTop />
            <Routes>
                <Route path='/' element={<Layout />}> {/*헤더, 푸터 고정 설정*/}



                </Route>

                {/*관리자 페이지 헤더*/}
                <Route path='/admin' element={<AdminLayout />}>

                </Route>
            </Routes>
        </div>
    </BrowserRouter>
  );
}

export default App;
