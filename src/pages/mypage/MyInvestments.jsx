import React, { useState, useEffect } from "react";
import UserProfile from "./my_page_component/UserProfile";
import InvestmentList from "./my_page_component/InvestmentList";
import { investmentData } from "./my_page_component/data/investmentData";

const MyInvestments = () => {
  const [investments, setInvestments] = useState([]);

  useEffect(() => {
    setInvestments(investmentData);
  }, []);

  return (
    <div className="flex min-h-screen relative">
      {/* Gray vertical line at 220px */}
      <div className="absolute left-[220px] top-0 bottom-0 w-px bg-gray-200 z-10"></div>

      {/* Left side - Sticky Bull image area (same as MyPage) */}
      <div className="w-[220px] sticky top-0 h-screen">
        <UserProfile />
      </div>

      {/* Right side - Scrollable Full Investment list area (no portfolio rectangle) */}
      <div className="flex-1 bg-white p-6">
        {/* Full Investment List */}
        <InvestmentList investments={investments} />
      </div>
    </div>
  );
};

export default MyInvestments;
