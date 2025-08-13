import React from 'react';
import { useNavigate } from 'react-router-dom';
import { IoIosAdd } from "react-icons/io";
import InvestmentCard from '../../../component/InvestmentCard';

const InvestmentPreview = ({ investments }) => {
    const navigate = useNavigate();
    
    // Always show only first 5 items for preview
    const displayedInvestments = investments.slice(0, 5);

    const handleMoreClick = () => {
        navigate('/my-investments');
    };

    return (
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

                {/* Investment Grid - shows only preview (5 items) */}
                <div className="grid grid-cols-4">
                    {displayedInvestments.map((investment) => (
                        <div key={investment.id} className="transform scale-90">
                            <InvestmentCard project={investment} />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default InvestmentPreview;
