import React, { useState, useEffect } from 'react';

const EditRequestList = ({ editRequests }) => {
    const [localEditRequests, setLocalEditRequests] = useState([]);

    // Update local state when props change
    useEffect(() => {
        setLocalEditRequests(editRequests || []);
    }, [editRequests]);

    const handleCancelRequest = (requestId) => {
        // Remove the request from the list (this will be replaced by API call later)
        setLocalEditRequests(prevRequests => 
            prevRequests.filter(request => request.id !== requestId)
        );
        console.log(`Request ${requestId} cancelled and removed from list`);
    };
    return (
        <div className="w-full">
            <div className="border border-gray-300 rounded-lg p-6 bg-white">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">수정 요청 내역</h2>
                
                <div className="space-y-4">
                    {localEditRequests && localEditRequests.length > 0 ? (
                        localEditRequests.map((request) => (
                            <div key={request.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="text-lg font-semibold text-gray-800">{request.projectTitle}</h3>
                                    <button 
                                        className="px-3 py-1 text-sm bg-red-100 text-red-600 rounded-md hover:bg-red-200 transition-colors"
                                        onClick={() => handleCancelRequest(request.id)}
                                    >
                                        요청취소
                                    </button>
                                </div>
                                
                                <div className="text-sm text-gray-600 mb-2">
                                    <p><span className="font-medium">요청 유형:</span> {request.requestType}</p>
                                    <p><span className="font-medium">요청자:</span> {request.requestedBy}</p>
                                    {request.description && (
                                        <p className="mt-2"><span className="font-medium">상세 내용:</span></p>
                                    )}
                                </div>
                                
                                {request.description && (
                                    <div className="text-sm text-gray-700 mb-3 bg-gray-50 p-3 rounded-md">
                                        {request.description}
                                    </div>
                                )}
                                
                                <div className="flex justify-between items-center text-xs text-gray-500">
                                    <span>요청일: {request.requestDate}</span>
                                    <div className="flex gap-4">
                                        {request.completedDate && (
                                            <span>완료일: {request.completedDate}</span>
                                        )}
                                        {request.estimatedCompletion && !request.completedDate && (
                                            <span>예상 완료일: {request.estimatedCompletion}</span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-8 text-gray-500">
                            수정 요청 내역이 없습니다.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default EditRequestList;
