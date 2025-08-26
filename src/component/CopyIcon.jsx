import { FaRegCopy } from "react-icons/fa";

const CopyIcon = ({ textToCopy, className = 'w-4 h-4 ml-1 text-slate-400 hover:text-blue-500 cursor-pointer', onCopySuccess }) => {
    const handleClick = async (e) => {
        e.stopPropagation(); // 부모 요소(tr)의 클릭 이벤트 방지
        try {
            await navigator.clipboard.writeText(textToCopy);
            onCopySuccess && onCopySuccess(); // 복사 성공 콜백 호출
        } catch (err) {
            console.error('클립보드 복사 실패:', err);
        }
    };

    return (
        <FaRegCopy
            className={className}
            onClick={handleClick}
        />
    );
};

export default CopyIcon;