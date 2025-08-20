import React from 'react';
import { useNavigate } from 'react-router-dom';
import { IoIosAdd } from "react-icons/io";
import InvestmentCard from '../../../component/InvestmentCard';

const RegisterProduct = ({ products }) => {
    const navigate = useNavigate();
    
    // Always show only first 8 items for preview
    const displayedProducts = products.slice(0, 8);

    const handleMoreClick = () => {
        // Navigate to the MyProduct page showing all products
        navigate('/my-product');
    };

    return (
        <div>
            {/* Product List Title - outside the rectangle */}
            <h2 className="text-2xl font-bold mb-4">상품 등록 내역</h2>
            
            {/* Product List with Thin Gray Border - full width */}
            <div 
                className="border border-gray-200 rounded-lg p-6 relative w-full"
            >
                {/* Add More Button - positioned at top right */}
                {products.length > 8 && (
                    <button
                        className="absolute top-4 right-6 cursor-pointer transition-colors duration-200 hover:text-gray-800"
                        onClick={handleMoreClick}
                        title="더 보기"
                    >
                        <IoIosAdd className="text-2xl text-gray-600" />
                    </button>
                )}

                {/* Product Grid - shows only preview (8 items) */}
                {products.length > 0 ? (
                    <div className="grid grid-cols-4">
                        {displayedProducts.map((product) => (
                            <div key={product.id} className="transform scale-90">
                                <InvestmentCard project={product} />
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-12 text-gray-500">
                        <div className="text-lg mb-2">등록된 상품이 없습니다</div>
                        <div className="text-sm">새로운 상품을 등록해보세요!</div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default RegisterProduct;
