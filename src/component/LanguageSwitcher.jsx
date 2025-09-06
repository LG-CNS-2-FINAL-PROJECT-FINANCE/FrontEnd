// src/components/LanguageSwitcher.jsx (앞서 제공해 드린 내용)

import React from 'react';
import { useTranslation } from 'react-i18next';

function LanguageSwitcher() {
    const { i18n } = useTranslation();

    const changeLanguage = (lng) => {
        i18n.changeLanguage(lng);
    };

    return (
        <div className="space-x-2 flex items-center"> {/* flex와 items-center 추가하여 버튼들을 가운데 정렬 */}
            <button
                onClick={() => changeLanguage('ko')}
                className={`px-3 py-1 rounded-md text-sm font-medium transition-colors duration-200 ${i18n.language === 'ko' ? 'bg-red-600 text-white shadow' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
            >
                한국어
            </button>
            <button
                onClick={() => changeLanguage('en')}
                className={`px-3 py-1 rounded-md text-sm font-medium transition-colors duration-200 ${i18n.language === 'en' ? 'bg-red-600 text-white shadow' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
            >
                English
            </button>
        </div>
    );
}

export default LanguageSwitcher;