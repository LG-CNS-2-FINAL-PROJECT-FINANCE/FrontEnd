import { useEffect, useRef, useState } from "react";
import { FiArrowLeft, FiArrowRight, FiCalendar } from "react-icons/fi";
import { RiKakaoTalkFill } from "react-icons/ri";
import { useLocation, useNavigate } from "react-router-dom";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

function LoginDetail_5() {
  const navigate = useNavigate();
  const location = useLocation();
  const { userName, nickname, gender } = location.state || {};
  const [open, setOpen] = useState(false);
  const boxRef = useRef(null);
  // 바깥 클릭 시 닫기 (선택사항)
  useEffect(() => {
    function onClickOutside(e) {
      if (open && boxRef.current && !boxRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, [open]);

  function formatYmd(date) {
    if (!date) return "날짜 선택";
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
  }

  const [birthDate, setBirthDate] = useState(new Date());

  return (
    <div className="w-[100%] h-screen flex flex-row items-center justify-between bg-white">
      {/* 텍스트 영역 */}
      <button
        className="p-3 bg-white rounded-full border border-red-500 text-red-500 hover:bg-red-300 transition"
        onClick={() => navigate("/login/4")}
      >
        <FiArrowLeft className="text-2xl" />
      </button>
      <div>
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-4">
            "{nickname}"님 생년월일이 어떻게 되시나요?
          </h1>
        </div>

        {/* 입력 필드 */}
        <div
          className="flex justify-center align-center gap-4 relative inline-block"
          ref={boxRef}
        >
          {/* 버튼: 선택한 날짜를 YYYY-MM-DD로 표시 */}
          <span className="px-12 py-2 rounded-lg border border-gray-300 bg-white shadow-sm text-gray-800 select-none">
            {formatYmd(birthDate)}
          </span>

          {/* 토글 버튼 (캘린더 열기/닫기) */}
          <button
            type="button"
            aria-expanded={open}
            aria-controls="birth-calendar"
            onClick={() => setOpen((p) => !p)}
            className="p-2 rounded-lg border border-gray-300 bg-white hover:bg-gray-50 shadow-sm"
            title="달력 열기"
          >
            <FiCalendar className="text-xl" />
          </button>

          {/* 달력: 버튼 아래로 펼쳐지기 */}
          {open && (
            <div className="absolute left-8 top-12 mt-2 z-50 bg-white rounded-xl shadow-lg p-2">
              <Calendar
                onChange={(date) => {
                  // react-calendar 기본 타입이 Date | Date[] 이라서 단일 선택만 처리
                  if (date instanceof Date) {
                    setBirthDate(date);
                    setOpen(false); // 날짜 선택하면 자동으로 닫기 (원하면 삭제)
                  }
                }}
                value={birthDate ?? undefined}
                // 보기 좋게 약간의 스타일 보정 (필요하면 더 커스텀 가능)
                className="react-calendar rounded-xl"
              />
            </div>
          )}
        </div>
      </div>

      <button
        className="p-3 bg-white rounded-full border border-red-500 text-red-500 hover:bg-red-300 transition"
        onClick={() =>
          navigate("/login/6", {
            state: {
              userName,
              nickname,
              gender,
              birthDate: formatYmd(birthDate),
            },
          })
        }
      >
        <FiArrowRight className="text-2xl" />
      </button>
    </div>
  );
}
export default LoginDetail_5;
