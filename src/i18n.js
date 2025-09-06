// src/i18n.js

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector'; // 언어 감지 플러그인
import HttpBackend from 'i18next-http-backend'; // <<<< HTTP 백엔드 로더 추가


i18n
    // <<<< HTTP 백엔드 (번역 파일을 HTTP 요청으로 로드) 사용
    .use(HttpBackend)
    // <<<< 브라우저 언어 감지 플러그인 사용 (로컬 스토리지, 쿠키, 브라우저 설정 등)
    .use(LanguageDetector)
    // <<<< react-i18next 바인딩
    .use(initReactI18next)
    // <<<< 설정 초기화
    .init({
        // 번역 파일이 있는 경로 설정 (public/locales 아래의 파일들을 가져옵니다.)
        backend: {
            loadPath: '/locales/{{lng}}/translation.json', // public 폴더 기준 상대 경로
        },

        // 기본 언어 설정 (fallbackLng는 해당 언어의 번역이 없을 때 대체될 언어)
        fallbackLng: 'ko', // 한국어 번역이 없으면 한국어
        lng: 'ko', // 초기 로드 시 기본 언어 (브라우저 감지보다 우선할 수 있음)

        // 사용 가능한 언어 목록 (명시적으로 정의하면 좋습니다.)
        supportedLngs: ['en', 'ko'],

        // 네임스페이스 설정 (기본적으로 'translation' 사용)
        ns: ['translation'],
        defaultNS: 'translation',

        interpolation: {
            escapeValue: false, // React는 이미 XSS 방어를 제공하므로 불필요
        },

        // 개발 중 디버깅을 위해 설정 (배포 시에는 false로 변경)
        debug: false,

        // 언어 감지 플러그인 설정 (언어를 감지하는 순서 및 캐시 방법)
        detection: {
            order: ['localStorage', 'navigator'], // 로컬 스토리지 -> 브라우저 설정 순서로 감지
            caches: ['localStorage'], // 감지된 언어를 로컬 스토리지에 저장하여 다음 방문 시 기억
        },
    });

export default i18n;