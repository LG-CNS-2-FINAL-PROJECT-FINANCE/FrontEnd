import React, { useState, useEffect } from 'react';
import UserProfile from './MyPageComponent/UserProfile';
import InvestmentList from './MyPageComponent/InvestmentList';
import { investmentData } from './MyPageComponent/data/investmentData';

const MyInvestments = () => {
    const [investments, setInvestments] = useState([]);

    useEffect(() => {
        setInvestments(investmentData);
    }, []);

    return (
        <div className="flex min-h-screen relative">
            {/* Gray vertical line at 220px */}
            <div className="absolute left-[220px] top-0 bottom-0 w-px bg-gray-300 z-10"></div>
            
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
