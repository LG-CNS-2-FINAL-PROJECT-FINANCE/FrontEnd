import React, { useState, useEffect } from 'react';
import PortfolioSection from './my_page_component/PortfolioSection';
import InvestmentPreview from './my_page_component/InvestmentPreview';
import FavoritePreview from './my_page_component/FavoritePreview';
import ProductPreview from './my_page_component/ProductPreview';
import { investmentData } from './my_page_component/data/investmentData';
import { favoriteData } from './my_page_component/data/favoriteData';
import { productData } from './my_page_component/data/productData';
import UserProfile from './my_page_component/UserProfile';
import { useTheme } from '../../context/ThemeContext';

const MyPage = () => {
    const [investments, setInvestments] = useState([]);
    const [favorites, setFavorites] = useState([]);
    const [products, setProducts] = useState([]);
    const { role } = useTheme(); // Get user role from theme context

    useEffect(() => {
        setInvestments(investmentData);
        setFavorites(favoriteData);
        setProducts(productData);
    }, []);

    return (
        <div className="flex min-h-screen relative">
            {/* Gray vertical line at 220px */}
            <div className="absolute left-[220px] top-0 bottom-0 w-px bg-gray-200 z-10"></div>
            
            {/* Left side - Sticky Bull image area */}
            <div className="w-[220px] sticky top-0 h-screen">
                <UserProfile />
            </div>
            
            {/* Right side - Scrollable Portfolio and Investment list area */}
            <div className="flex-1 bg-white p-6">
                {/* Portfolio Rectangle */}
                <PortfolioSection />

                {/* Conditional Content based on role */}
                {role === '창작자' ? (
                    <ProductPreview products={products} />
                ) : (
                    /* Investor view - Show Investment Preview and Favorites */
                    <>
                        {/* Investment Preview */}
                        <InvestmentPreview investments={investments} />

                        {/* Favorites Preview */}
                        <div className="mt-8">
                            <FavoritePreview favorites={favorites} />
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default MyPage;
