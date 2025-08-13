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
import RoleSelectionPage from "./pages/Role/RoleSelectionPage";
import AdminLogin from "./pages/admin/login/AdminLogin";
import UserManagement from "./pages/admin/UserManagement";

function App() {
  return (
    <BrowserRouter>
      <div className="flex flex-col">
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
          </Route>

          {/*관리자 로그인 페이지*/}{/*얘는 헤더가 없음*/}
          <Route path="/admin/login" element={<AdminLogin />} />
          {/*관리자 페이지 헤더*/}
          <Route path="/admin" element={<AdminLayout />}>
            <Route path="user" element={<UserManagement />}></Route>

          </Route>
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
