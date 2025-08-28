import React from 'react';
import { useNavigate } from 'react-router-dom';
import { IoIosAdd } from "react-icons/io";
import InvestmentCard from '../../../component/InvestmentCard';
import useUser from "../../../lib/useUser";

const InvestmentPreview = ({ investments }) => {
    const navigate = useNavigate();

    // Always show only first 8 items for preview
    const displayedInvestments = investments.slice(0, 8);

    const handleMoreClick = () => {
        navigate('/my-investments');
    };

    const { user } = useUser();

    const userRole = user?.role;
    const CREATOR = "CREATOR"

    return (
        <>
            {userRole === CREATOR ? (
                //창작자일경우
                <div>
                    {/* Investment List Title - outside the rectangle */}
                    <h2 className="text-2xl font-bold mb-4">상품 등록 내역</h2>

                    {/* Investment List with Thin Gray Border - full width */}
                    <div
                        className="border border-gray-200 rounded-lg p-6 relative w-full"
                    >
                        {/* Add More Button - positioned at top right */}
                        {investments.length > 5 && (
                            <button
                                className="absolute top-4 right-6 cursor-pointer transition-colors duration-200 hover:text-gray-800"
                                onClick={handleMoreClick}
                            >
                                <IoIosAdd className="text-2xl text-gray-600" />
                            </button>
                        )}

                        {/* Investment Grid - shows only preview (8 items) */}
                        <div className="grid grid-cols-4">
                            {displayedInvestments.map((investment) => (
                                <div key={investment.id} className="transform scale-90">
                                    <InvestmentCard project={investment} />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

            ) : (
                //투자자일경우
                <div>
                    {/* Investment List Title - outside the rectangle */}
                    <h2 className="text-2xl font-bold mb-4">투자 내역</h2>

                    {/* Investment List with Thin Gray Border - full width */}
                    <div
                        className="border border-gray-200 rounded-lg p-6 relative w-full"
                    >
                        {/* Add More Button - positioned at top right */}
                        {investments.length > 5 && (
                            <button
                                className="absolute top-4 right-6 cursor-pointer transition-colors duration-200 hover:text-gray-800"
                                onClick={handleMoreClick}
                            >
                                <IoIosAdd className="text-2xl text-gray-600" />
                            </button>
                        )}

                        {/* Investment Grid - shows only preview (8 items) */}
                        <div className="grid grid-cols-4">
                            {displayedInvestments.map((investment) => (
                                <div key={investment.id} className="transform scale-90">
                                    <InvestmentCard project={investment} />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default InvestmentPreview;
