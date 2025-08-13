import React from 'react';
import InvestmentCard from '../../../component/InvestmentCard';

const FavoriteList = ({ favorites }) => {
    return (
        <div>
            {/* Favorites List Title */}
            <h2 className="text-2xl font-bold mb-4">즐겨찾기</h2>
            
            {/* Full Favorites List with Thin Gray Border - full width */}
            <div 
                className="border border-gray-200 rounded-lg p-6 w-full"
            >
                {/* Favorites Grid - shows all items */}
                <div className="grid grid-cols-4 gap-2">
                    {favorites.map((favorite) => (
                        <div key={favorite.id} className="transform scale-90">
                            <InvestmentCard project={favorite} />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default FavoriteList;
