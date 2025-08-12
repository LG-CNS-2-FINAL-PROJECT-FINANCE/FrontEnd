import React from 'react';
import { useNavigate } from 'react-router-dom';
import { IoIosAdd } from "react-icons/io";
import InvestmentCard from '../../../component/InvestmentCard';

const FavoritePreview = ({ favorites }) => {
    const navigate = useNavigate();
    
    // Always show only first 5 items for preview
    const displayedFavorites = favorites.slice(0, 5);

    const handleMoreClick = () => {
        navigate('/my-favorites');
    };

    return (
        <div>
            {/* Favorites List Title - outside the rectangle */}
            <h2 className="text-2xl font-bold mb-4">즐겨찾기</h2>
            
            {/* Favorites List with Thin Gray Border - full width */}
            <div 
                className="border border-gray-300 rounded-lg p-6 relative w-full"
            >
                {/* Add More Button - positioned at top right */}
                {favorites.length > 5 && (
                    <button
                        className="absolute top-4 right-6 cursor-pointer transition-colors duration-200 hover:text-gray-800"
                        onClick={handleMoreClick}
                    >
                        <IoIosAdd className="text-2xl text-gray-600" />
                    </button>
                )}

                {/* Favorites Grid - shows only preview (5 items) */}
                <div className="grid grid-cols-3 gap-4">
                    {displayedFavorites.map((favorite) => (
                        <div key={favorite.id} className="transform scale-75">
                            <InvestmentCard project={favorite} />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default FavoritePreview;
