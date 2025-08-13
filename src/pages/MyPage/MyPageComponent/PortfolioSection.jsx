import React from 'react';

const PortfolioSection = () => {
    return (
        <div 
            className="bg-gray-100 border-2 border-dashed border-gray-200 rounded-lg mb-8 flex items-center justify-center w-full"
            style={{ height: '281px' }}
        >
            <div className="text-center text-gray-500">
                <div className="text-4xl mb-2">📊</div>
                <p className="text-lg">Portfolio Image</p>
                <p className="text-sm">Full Width x 281</p>
            </div>
        </div>
    );
};

export default PortfolioSection;
