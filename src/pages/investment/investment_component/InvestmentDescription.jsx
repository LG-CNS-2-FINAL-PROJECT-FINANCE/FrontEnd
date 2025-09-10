import React, { useState, useEffect } from "react";
import { FaChevronLeft, FaChevronRight, FaImage, FaInfoCircle, FaFileAlt } from "react-icons/fa";
import { useTranslation } from 'react-i18next';
import { useTheme } from "../../../context/ThemeContext";

function InvestmentDescription({ imageUrl, summary, description }) {
    const { t } = useTranslation();
    const { themeColors, role } = useTheme();

    const [currentIndex, setCurrentIndex] = useState(0);
    const [isImageLoaded, setIsImageLoaded] = useState(false);

    const images = imageUrl;
    const hasImages = images && Array.isArray(images) && images.length > 0;
    const currentImageSrc = hasImages ? images[currentIndex] : null;

    //자동 이미지 전환 - 필요 시 주석 해제하기
/*    useEffect(() => {
        if (!hasImages || images.length <= 1) {
            return;
        }

        const intervalId = setInterval(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
        }, 10000);

        return () => clearInterval(intervalId);
    }, [images, hasImages]);*/

    const handlePrev = () => {
        setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
        setIsImageLoaded(false);
    };

    const handleNext = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
        setIsImageLoaded(false);
    };

    const handleImageLoad = () => {
        setIsImageLoaded(true);
    };

    return (
        <div className="bg-gradient-to-br from-white to-gray-50 shadow-xl rounded-2xl border border-gray-200 overflow-hidden mt-10">
            {/* Header Section */}
            <div className={`px-8 py-6 ${role === 'CREATOR' ? 'bg-blue-600' : 'bg-red-600'}`}>
                <h2 className="text-3xl font-bold text-white flex items-center gap-3">
                    <FaInfoCircle className="text-slate-300" />
                    {t('investment_detail_project_detail_title')}
                </h2>
                <div className="w-20 h-1 bg-white/30 rounded-full mt-2"></div>
            </div>

            <div className="p-8">
                {/* Image Gallery Section */}
                {hasImages ? (
                    <div className="mb-10">
                        <div className="relative w-full bg-gray-100 rounded-2xl overflow-hidden shadow-lg group">
                            {/* Loading Skeleton */}
                            {!isImageLoaded && (
                                <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center">
                                    <FaImage className="text-gray-400 text-4xl" />
                                </div>
                            )}
                            
                            <img
                                src={currentImageSrc.startsWith('http') ? currentImageSrc : `/${currentImageSrc}`}
                                alt={t('investment_detail_project_image_alt')}
                                onLoad={handleImageLoad}
                                className={`w-full h-96 object-cover transition-all duration-500 ${
                                    isImageLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
                                }`}
                            />
                            
                            {/* Image Navigation */}
                            {images.length > 1 && (
                                <>
                                    <button
                                        onClick={handlePrev}
                                        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 p-3 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        <FaChevronLeft className="text-lg" />
                                    </button>
                                    <button
                                        onClick={handleNext}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 p-3 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        <FaChevronRight className="text-lg" />
                                    </button>
                                </>
                            )}
                            
                            {/* Image Indicators */}
                            {images.length > 1 && (
                                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2 bg-black/20 rounded-full px-3 py-2 backdrop-blur-sm">
                                    {images.map((_, index) => (
                                        <button
                                            key={index}
                                            onClick={() => {
                                                setCurrentIndex(index);
                                                setIsImageLoaded(false);
                                            }}
                                            className={`h-2 w-2 rounded-full transition-all duration-300 ${
                                                index === currentIndex 
                                                    ? 'bg-white w-6' 
                                                    : 'bg-white/60 hover:bg-white/80'
                                            }`}
                                        />
                                    ))}
                                </div>
                            )}
                            
                            {/* Image Counter */}
                            {images.length > 1 && (
                                <div className="absolute top-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm font-medium backdrop-blur-sm">
                                    {currentIndex + 1} / {images.length}
                                </div>
                            )}
                        </div>
                    </div>
                ) : (
                    <div className="mb-10 bg-gray-50 border-2 border-dashed border-gray-300 rounded-2xl p-12 text-center">
                        <FaImage className="text-gray-400 text-5xl mx-auto mb-4" />
                        <p className="text-gray-600 text-lg font-medium">{t('investment_detail_no_image_message')}</p>
                    </div>
                )}

                {/* Summary Section */}
                <div className="mb-10">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 rounded-lg">
                            <FaInfoCircle className={`${role === 'CREATOR' ? 'text-blue-600' : 'text-red-600'} text-xl`} />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-800">{t('investment_detail_summary_title')}</h3>
                    </div>
                    <div className={`bg-blue-50 border-l-4 ${role === 'CREATOR' ? 'border-blue-500' : 'border-red-500'} rounded-r-xl p-6 shadow-sm`}>
                        <p className="text-gray-700 leading-relaxed text-lg font-medium">{summary}</p>
                    </div>
                </div>

                {/* Description Section */}
                <div>
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2rounded-lg">
                            <FaFileAlt className="text-purple-600 text-xl" />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-800">{t('investment_detail_description_title')}</h3>
                    </div>
                    <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                        <p className="text-gray-700 leading-relaxed text-lg whitespace-pre-wrap">
                            {description}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default InvestmentDescription;