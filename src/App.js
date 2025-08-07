import { BrowserRouter, Routes, Route } from "react-router-dom";

import ScrollToTop from "./pages/common/ScrollToTop.js";
import Layout from "./layout/Layout";
import AdminLayout from "./layout/AdminLayout";
import Home from "./pages/Home";
import Login from "./pages/Login";

function App() {
  return (
    <BrowserRouter>
      <div className="flex flex-col">
        <ScrollToTop />
        <Routes>
          {/*헤더, 푸터 고정 설정*/}
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />}></Route>
            <Route path="/login/:id" element={<Login />}></Route>
          </Route>

          {/*관리자 페이지 헤더*/}
          <Route path="/admin" element={<AdminLayout />}></Route>
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
