import React from 'react';
import InvestmentCard from '../../../component/InvestmentCard';

const ProductList = ({ products }) => {
    // Separate products by status
    const pendingProducts = products.filter(product => product.status === '대기중');
    const approvedProducts = products.filter(product => product.status === '승인완료');

    const StatusSection = ({ title, products, statusColor }) => (
        <div className="mb-8">
            <div className="flex items-center mb-4">
                <h3 className="text-xl font-semibold mr-3">{title}</h3>
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${statusColor}`}>
                    {products.length}건
                </span>
            </div>
            
            <div className="border border-gray-200 rounded-lg p-6 w-full">
                {products.length > 0 ? (
                    <div className="grid grid-cols-4 gap-2">
                        {products.map((product) => (
                            <div key={product.id} className="transform scale-90">
                                <InvestmentCard project={product} />
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-8 text-gray-400">
                        <div className="text-base">해당 상태의 상품이 없습니다</div>
                    </div>
                )}
            </div>
        </div>
    );

    return (
        <div>
            {/* Main Product List Title */}
            <h2 className="text-2xl font-bold mb-6">상품 등록 내역</h2>
            
            {products.length > 0 ? (
                <>
                    {/* Pending Products Section */}
                    <StatusSection 
                        title="대기중" 
                        products={pendingProducts} 
                        statusColor="bg-amber-100 text-amber-800"
                    />
                    
                    {/* Approved Products Section */}
                    <StatusSection 
                        title="승인완료" 
                        products={approvedProducts} 
                        statusColor="bg-green-100 text-green-800"
                    />
                </>
            ) : (
                /* Overall Empty state */
                <div className="border border-gray-200 rounded-lg p-6 w-full">
                    <div className="flex flex-col items-center justify-center py-12 text-gray-500">
                        <div className="text-lg mb-2">등록된 상품이 없습니다</div>
                        <div className="text-sm">새로운 상품을 등록해보세요!</div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProductList;
