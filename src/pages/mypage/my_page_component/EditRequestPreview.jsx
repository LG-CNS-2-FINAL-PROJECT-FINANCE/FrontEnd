import React from 'react';
import { useNavigate } from 'react-router-dom';
import { IoIosAdd } from "react-icons/io";
import InvestmentCard from '../../../component/InvestmentCard';

const EditRequestPreview = ({ editRequests = [] }) => {
    const navigate = useNavigate();
    
    // Transform edit request data to match InvestmentCard expected format
    const transformedRequests = editRequests.map(request => ({
        id: request.id,
        requestId: request.id,
        title: request.projectTitle,
        amount: request.requestType, // Use request type as amount field
        document: 'default_image.jpg', // Default image for edit requests
        viewCount: request.priority === '높음' ? 100 : request.priority === '보통' ? 50 : 25,
        status: request.status, // Use the request status
        startDate: request.requestDate,
        endDate: request.estimatedCompletion || request.completedDate,
        percent: request.status === '처리완료' ? 100 : request.status === '진행중' ? 50 : 0,
        deadline: request.requestDate,
        description: request.description
    }));

    // Always show only first 8 items for preview
    const displayedRequests = transformedRequests.slice(0, 8);

    const handleMoreClick = () => {
        // Navigate to the MyEditRequest page showing all edit requests
        navigate('/my-edit-request');
    };

    return (
        <div className="mt-8">
            {/* Edit Request List Title - outside the rectangle */}
            <h2 className="text-2xl font-bold mb-4">수정 요청 내역</h2>
            
            {/* Edit Request List with Thin Gray Border - full width */}
            <div 
                className="border border-gray-200 rounded-lg p-6 relative w-full"
            >
                {/* Add More Button - positioned at top right */}
                {editRequests.length > 8 && (
                    <button
                        className="absolute top-4 right-6 cursor-pointer transition-colors duration-200 hover:text-gray-800"
                        onClick={handleMoreClick}
                        title="더 보기"
                    >
                        <IoIosAdd className="text-2xl text-gray-600" />
                    </button>
                )}

                {/* Edit Request Grid - shows only preview (8 items) using InvestmentCard */}
                {editRequests.length > 0 ? (
                    <div className="grid grid-cols-4">
                        {displayedRequests.map((request) => (
                            <div key={request.id} className="transform scale-90">
                                <InvestmentCard project={request} />
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-12 text-gray-500">
                        <div className="text-lg mb-2">수정 요청 내역이 없습니다</div>
                        <div className="text-sm">요청사항이 있을 때 표시됩니다.</div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default EditRequestPreview;
