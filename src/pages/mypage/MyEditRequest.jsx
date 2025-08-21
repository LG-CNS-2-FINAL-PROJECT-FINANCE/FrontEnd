import React, { useState, useEffect } from 'react';
import UserProfile from './my_page_component/UserProfile';
import EditRequestList from './my_page_component/EditRequestList';
import { editRequestData } from './my_page_component/data/editRequestData';

const MyEditRequest = () => {
    const [editRequests, setEditRequests] = useState([]);

    useEffect(() => {
        setEditRequests(editRequestData);
    }, []);

    return (
        <div className="flex min-h-screen relative">
            {/* Gray vertical line at 220px */}
            <div className="absolute left-[220px] top-0 bottom-0 w-px bg-gray-200 z-10"></div>
            
            {/* Left side - Sticky Bull image area */}
            <div className="w-[220px] sticky top-0 h-screen">
                <UserProfile />
            </div>
            
            {/* Right side - Edit requests list area */}
            <div className="flex-1 bg-white p-6">
                <EditRequestList editRequests={editRequests} />
            </div>
        </div>
    );
};

export default MyEditRequest;
