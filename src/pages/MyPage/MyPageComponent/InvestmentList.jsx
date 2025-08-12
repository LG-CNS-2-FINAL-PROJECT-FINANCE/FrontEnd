import React from 'react';
import InvestmentCard from '../../../component/InvestmentCard';

const InvestmentList = ({ investments }) => {
    return (
        <div>
            {/* Investment List Title */}
            <h2 className="text-2xl font-bold mb-4">투자 내역</h2>
            
            {/* Full Investment List with Thin Gray Border - full width */}
            <div 
                className="border border-gray-300 rounded-lg p-6 w-full"
            >
                {/* Investment Grid - shows all items */}
                <div className="grid grid-cols-3 gap-4">
                    {investments.map((investment) => (
                        <div key={investment.id} className="transform scale-75">
                            <InvestmentCard project={investment} />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default InvestmentList;
