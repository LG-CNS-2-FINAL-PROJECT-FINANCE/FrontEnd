import React, { useState, useEffect } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

function InvestmentDescription({ imageUrl, summary, description }) {
    const [currentIndex, setCurrentIndex] = useState(0);

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
    };

    const handleNext = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    };

    return (
        <div className="bg-white py-6 rounded-lg mt-10">
            <h2 className="text-2xl font-bold mb-4">프로젝트 상세</h2>

            {hasImages ? (
                <div className="relative w-full mb-6">
                    <img
                        src={currentImageSrc.startsWith('http') ? currentImageSrc : `/assets/${currentImageSrc}`}
                        alt="프로젝트 이미지"
                        className="w-full rounded-lg max-h-96 object-contain mx-auto"
                    />
                    {images.length > 1 && (
                        <>
                            <button
                                onClick={handlePrev}
                                className="absolute left-0 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full ml-2 focus:outline-none"
                            >
                                <FaChevronLeft />
                            </button>
                            <button
                                onClick={handleNext}
                                className="absolute right-0 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full mr-2 focus:outline-none"
                            >
                                <FaChevronRight />
                            </button>
                        </>
                    )}
                    {images.length > 1 && (
                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
                            {images.map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => setCurrentIndex(index)}
                                    className={`h-3 w-3 rounded-full ${
                                        index === currentIndex ? 'bg-white' : 'bg-gray-500'
                                    }`}
                                />
                            ))}
                        </div>
                    )}
                </div>
            ) : (
                <p className="text-gray-600 mb-6 text-center">표시할 이미지가 없습니다.</p>
            )}

            <h3 className="text-xl font-semibold mb-3">프로젝트 요약</h3>
            <p className="text-gray-700 leading-relaxed mb-6">{summary}</p>

            <h3 className="text-xl font-semibold mb-3">상세 설명</h3>
            <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                {description}
            </p>
        </div>
    );
}

export default InvestmentDescription;