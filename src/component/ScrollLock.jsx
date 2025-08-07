import {useEffect} from 'react';

function useScrollLock(isLocked) {
    useEffect(() => {
        // isLocked가 true일 때만 스크롤을 잠금
        if (isLocked) {
            const scrollY = window.scrollY; // 현재 스크롤 위치 저장

            // body 스타일에 직접 접근하여 스크롤 잠금
            document.body.style.cssText = `
                position: fixed;
                top: -${scrollY}px; /* 현재 스크롤 위치를 고정 */
                overflow-y: scroll; /* 스크롤바를 유지하여 화면 너비 변경 방지 */
                width: 100%; /* 너비 고정 */
            `;

            //isLocked가 false가 되거나, 컴포넌트가 언마운트될 때 실행
            return () => {
                const scrollYRestore = document.body.style.top; // fixed로 인해 body.style.top에 저장된 값 가져오기
                document.body.style.cssText = ''; // body 스타일 초기화 (fixed, top, overflow, width 등 제거)

                // 원래 스크롤 위치로 이동
                // parseInt(scrollYRestore || '0', 10) : top 값('-123px')을 숫자 '123'으로 변환
                // -1 : 저장된 값이 음수여서 원래 스크롤 위치로 가기 위해 양수로 변환
                window.scrollTo(0, parseInt(scrollYRestore || '0', 10) * -1);
            };
        }
        // isLocked 상태가 변경될 때마다 이펙트가 실행
        // 만약 isLocked가 false가 되면 이전 이펙트의 클린업 함수가 실행되어 스크롤이 해제
    }, [isLocked]);
}

export default useScrollLock;