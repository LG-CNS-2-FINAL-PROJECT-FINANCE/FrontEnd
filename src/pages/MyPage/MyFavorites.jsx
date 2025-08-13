import React, { useState, useEffect } from 'react';
import UserProfile from './MyPageComponent/UserProfile';
import FavoriteList from './MyPageComponent/FavoriteList';
import { favoriteData } from './MyPageComponent/data/favoriteData';

const MyFavorites = () => {
    const [favorites, setFavorites] = useState([]);

    useEffect(() => {
        setFavorites(favoriteData);
    }, []);

    return (
        <div className="flex min-h-screen relative">
            {/* Gray vertical line at 220px */}
            <div className="absolute left-[220px] top-0 bottom-0 w-px bg-gray-200 z-10"></div>
            
            {/* Left side - Sticky Bull image area (same as MyPage) */}
            <div className="w-[220px] sticky top-0 h-screen">
                <UserProfile />
            </div>
            
            {/* Right side - Scrollable Full Favorites list area (no portfolio rectangle) */}
            <div className="flex-1 bg-white p-6">
                {/* Full Favorites List */}
                <FavoriteList favorites={favorites} />
            </div>
        </div>
    );
};

export default MyFavorites;
