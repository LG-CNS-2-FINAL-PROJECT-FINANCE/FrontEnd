import { useState } from "react";
import { FiArrowRight } from "react-icons/fi";
import { RiKakaoTalkFill } from "react-icons/ri";
import { useLocation, useNavigate } from "react-router-dom";

function LoginDetail_2() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [error, setError] = useState(false);
  const handleNext = () => {
    if (name.trim() === "") {
      // 입력값이 비어 있으면 에러 표시
      setError(true);
    } else {
      // 입력값이 유효하면 다음 페이지로 이동
      setError(false);
      navigate("/login/3", { state: { name } });
    }
  };
  return (
    <div className="w-[100%] h-screen flex flex-row justify-between items-center bg-white">
      {/* 텍스트 영역 */}
      <div className="w-[50px]"></div>
      <div className="flex-col items-center justify-center">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-4">이름을 입력해주세요!</h1>
          <p className="text-lg text-gray-500">
            다른 사용자에게 보여지며 수정 가능합니다.
          </p>
        </div>

        {/* 입력 필드 */}
        <div className="flex items-center">
          <input
            type="text"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              setError(false);
            }}
            placeholder="이름을 입력하세요"
            className={`w-[500px] h-[50px] px-4 border ${
              error ? "border-red-500" : "border-gray-300"
            } rounded-lg shadow-sm focus:outline-none focus:ring-2 ${
              error ? "focus:ring-red-500" : "focus:ring-red-300"
            }`}
          />
        </div>
        {error && (
          <p className="text-red-500 text-sm mt-2">이름을 입력해주세요.</p>
        )}
      </div>
      <div>
        <button
          className="ml-12 p-3 bg-white rounded-full border border-red-500 text-red-500 hover:bg-red-300 transition"
          onClick={handleNext}
        >
          <FiArrowRight className="text-2xl" />
        </button>
      </div>
    </div>
  );
}
export default LoginDetail_2;
