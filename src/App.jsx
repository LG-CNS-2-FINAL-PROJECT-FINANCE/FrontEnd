import { BrowserRouter, Routes, Route } from "react-router-dom";

import ScrollToTop from "./pages/common/ScrollToTop.js";
import Layout from "./layout/user/Layout.jsx";
import AdminLayout from "./layout/admin/AdminLayout.jsx";
import Home from "./pages/Home.jsx";
import Login from "./pages/login/Login.jsx";
import InvestmentListPage from "./pages/investment/investmentList.jsx";
import InvestmentDetail from "./pages/investment/investmentDetail.jsx";
import Market from "./pages/market/Market.jsx";
import MarketDetail from "./pages/market/MarketDetail.jsx";
import { ToastContainer } from "react-toastify";
import Asset from "./pages/asset/Asset.jsx";
import RoleSelectionPage from "./pages/Role/RoleSelectionPage";


function App() {
  return (
    <BrowserRouter>
      <div className="flex flex-col">
        {/* 전역 토스트 컨테이너 */}
        <ToastContainer position="bottom-right" />
        <ScrollToTop />
        <Routes>
          {/*헤더, 푸터 고정 설정*/}
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />}></Route>
            {/*로그인 페이지*/}
            <Route path="/login/:id" element={<Login />}></Route>
            {/*역할 선택 페이지*/}
            <Route path="/select-role" element={<RoleSelectionPage />} />

            {/*Investment*/}
            <Route path="investment" element={<InvestmentListPage />} />
            <Route path="investment/:id" element={<InvestmentDetail />} />

            {/*Market*/}
            <Route path="/market" element={<Market />} />
            <Route path="/market/:id" element={<MarketDetail />} />

            {/*Asset*/}
            <Route path="/asset" element={<Asset />} />
          </Route>

          {/*관리자 페이지 헤더*/}
          <Route path="/admin" element={<AdminLayout />}></Route>
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
