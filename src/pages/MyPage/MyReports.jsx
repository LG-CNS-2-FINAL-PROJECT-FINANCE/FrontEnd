import React, { useState, useEffect } from 'react';
import UserProfile from './MyPageComponent/UserProfile';
import ReportList from './MyPageComponent/ReportList';
import { reportData } from './MyPageComponent/data/reportData';

const MyReports = () => {
    const [reports, setReports] = useState([]);

    useEffect(() => {
        setReports(reportData);
    }, []);

    return (
        <div className="flex min-h-screen relative">
            {/* Gray vertical line at 220px */}
            <div className="absolute left-[220px] top-0 bottom-0 w-px bg-gray-200 z-10"></div>
            
            {/* Left side - Sticky Bull image area */}
            <div className="w-[220px] sticky top-0 h-screen">
                <UserProfile />
            </div>
            
            {/* Right side - Reports list area */}
            <div className="flex-1 bg-white p-6">
                <ReportList reports={reports} />
            </div>
        </div>
    );
};

export default MyReports;
