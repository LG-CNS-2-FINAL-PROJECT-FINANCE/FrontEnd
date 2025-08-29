import { BrowserRouter, Routes, Route } from "react-router-dom";

import ScrollToTop from "./pages/common/ScrollToTop.js";
import Layout from "./layout/user/Layout.jsx";
import AdminLayout from "./layout/admin/AdminLayout.jsx";
import Home from "./pages/home/Home.jsx";
import Login from "./pages/login/Login.jsx";
import InvestmentListPage from "./pages/investment/investmentList.jsx";
import InvestmentDetail from "./pages/investment/investmentDetail.jsx";
import Market from "./pages/market/Market.jsx";
import MarketDetail from "./pages/market/MarketDetail.jsx";
import { ToastContainer } from "react-toastify";
import Asset from "./pages/asset/Asset.jsx";
import RoleSelectionPage from "./pages/role/RoleSelectionPage";
import AdminLogin from "./pages/admin/login/AdminLogin";
import UserManagement from "./pages/admin/userManagement/UserManagement";
import MyPage from "./pages/mypage/MyPage.jsx";
import MyInvestments from "./pages/mypage/MyInvestments.jsx";
import MyFavorites from "./pages/mypage/MyFavorites.jsx";
import AccountManagement from "./pages/mypage/AccountManagement.jsx";
import EditInfo from "./pages/mypage/EditInfo.jsx";
import MyReports from "./pages/mypage/MyReports.jsx";
import MyEditRequest from "./pages/mypage/MyEditRequest.jsx";
import ReportManagement from "./pages/admin/ReportManagement";
import PostManagement from "./pages/admin/postManagement/PostManagement";
import Aml from "./pages/admin/Aml";
import FraudDetection from "./pages/admin/FraudDetection";
import Setting from "./pages/admin/Setting";
import SystemMonitoring from "./pages/admin/SystemMonitoring";
import ProductRegistration from "./pages/product/ProductRegistration.jsx";
import { ThemeProvider } from "./context/ThemeContext.jsx";
import MyProduct from "./pages/mypage/MyProduct.jsx";
import KakaoConfirm from "./pages/login/KakaoConfirm.jsx";
import { useQueryClient } from "@tanstack/react-query";



function App() {
  return (
    <ThemeProvider>
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
              <Route path="/login/kakaoConfirm" element={<KakaoConfirm />}></Route>
              {/*역할 선택 페이지*/}
              <Route path="/select-role" element={<RoleSelectionPage />} />

              {/*Investment*/}
              <Route path="investment" element={<InvestmentListPage />} />
              <Route path="investment/:id" element={<InvestmentDetail />} />

              {/*Product Registration*/}
              {<Route path="/product-registration" element={<ProductRegistration />} />}

              {/*Market*/}
              <Route path="/market" element={<Market />} />
              <Route path="/market/:id" element={<MarketDetail />} />

              {/*MyPage*/}
              <Route path="/my-profile" element={<MyPage />} />
              <Route path="/my-investments" element={<MyInvestments />} />
              <Route path="/my-favorites" element={<MyFavorites />} />
              <Route path="/account-management" element={<AccountManagement />} />
              <Route path="/edit-info" element={<EditInfo />} />
              <Route path="/my-reports" element={<MyReports />} />
              <Route path="/my-edit-request" element={<MyEditRequest />} />
              <Route path="/my-product" element={<MyProduct />} />

              {/*Asset*/}
              <Route path="/asset" element={<Asset />} />

            </Route>

            {/*관리자 로그인 페이지*/}{/*얘는 헤더가 없음*/}
            <Route path="/admin/login" element={<AdminLogin />} />
            {/*관리자 페이지 헤더*/}
            <Route path="/admin" element={<AdminLayout />}>
              <Route path="user" element={<UserManagement />}></Route>
              <Route path="reports" element={<ReportManagement />}></Route>
              <Route path="posts" element={<PostManagement />}></Route>
              <Route path="aml" element={<Aml />}></Route>
              <Route path="frauddetection" element={<FraudDetection />}></Route>
              <Route path="settings" element={<Setting />}></Route>
              <Route path="systemmonitoring" element={<SystemMonitoring />}></Route>

            </Route>
          </Routes>
        </div>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
