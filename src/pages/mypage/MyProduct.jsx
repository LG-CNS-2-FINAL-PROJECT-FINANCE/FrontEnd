import React, { useState, useEffect } from 'react';
import UserProfile from './my_page_component/UserProfile';
import ProductList from './my_page_component/ProductList';
import { productData } from './my_page_component/data/productData';

const MyProduct = () => {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        setProducts(productData);
    }, []);

    return (
        <div className="flex min-h-screen relative">
            {/* Gray vertical line at 220px */}
            <div className="absolute left-[220px] top-0 bottom-0 w-px bg-gray-200 z-10"></div>
            
            {/* Left side - Sticky Bull image area (same as MyPage) */}
            <div className="w-[220px] sticky top-0 h-screen">
                <UserProfile />
            </div>
            
            {/* Right side - Scrollable Full Product list area (no portfolio rectangle) */}
            <div className="flex-1 bg-white p-6">
                {/* Full Product List */}
                <ProductList products={products} />
            </div>
        </div>
    );
};

export default MyProduct;
