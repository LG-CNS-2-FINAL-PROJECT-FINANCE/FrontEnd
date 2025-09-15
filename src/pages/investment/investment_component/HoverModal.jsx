import React, { useState, useRef, useEffect } from 'react';

function HoverModal({ children, content, position = 'bottom-center' }) {
    const [isHovered, setIsHovered] = useState(false);
    const [isVisible, setIsVisible] = useState(false); // 애니메이션 제어용
    const timerRef = useRef(null); // 지연 시간 제어용 타이머

    // isVisible 상태에 따라 DOM에서 요소를 렌더링/제거하기 위한 상태
    const [showOnDOM, setShowOnDOM] = useState(false);

    // 모달 표시 시작 (delay 후 fade-in 시작)
    const handleMouseEnter = () => {
        clearTimeout(timerRef.current); // 이전 타이머 클리어
        setIsHovered(true); // 호버 상태 활성화
        timerRef.current = setTimeout(() => {
            setIsVisible(true); // fade-in 시작
        }, 100); // 마우스 진입 후 약간의 지연 (원한다면 제거 가능)
    };

    // 모달 숨기기 시작 (delay 후 fade-out 시작)
    const handleMouseLeave = () => {
        clearTimeout(timerRef.current); // 이전 타이머 클리어
        setIsHovered(false); // 호버 상태 비활성화
        timerRef.current = setTimeout(() => {
            setIsVisible(false); // fade-out 시작
        }, 300); // 마우스 이탈 후 약간의 지연 (fade-out 애니메이션 시간과 일치시키는 것이 좋음)
    };

    useEffect(() => {
        if (isVisible) {
            setShowOnDOM(true);
        } else {
            const timeoutId = setTimeout(() => setShowOnDOM(false), 200); // CSS transition duration과 일치
            return () => clearTimeout(timeoutId);
        }
    }, [isVisible]);


    let positionClasses = '';
    if (position === 'bottom-center') {
        positionClasses = 'left-1/2 -translate-x-1/2 mt-2';
    } else if (position === 'right') {
        positionClasses = 'left-full ml-2 top-1/2 -translate-y-1/2';
    }

    return (
        <div
            className="relative inline-block"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            {children}

            {showOnDOM && (
                <div
                    className={`
                        absolute z-50 p-3 bg-white border border-gray-200 rounded-lg shadow-lg
                        transform transition-all duration-200 ease-out
                        ${isVisible ? 'opacity-100 scale-100 pointer-events-auto' : 'opacity-0 scale-95 pointer-events-none'}
                        ${positionClasses}
                         w-[500px] h-[500px]
                    `}
                >
                    {content}
                </div>
            )}
        </div>
    );
}

export default HoverModal;