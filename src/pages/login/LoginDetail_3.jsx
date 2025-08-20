import { useState } from "react";
import { FiArrowLeft, FiArrowRight } from "react-icons/fi";
import { RiKakaoTalkFill } from "react-icons/ri";
import { useLocation, useNavigate } from "react-router-dom";

function LoginDetail_3() {
  const navigate = useNavigate();
  const [nickname, setNickname] = useState("");
  const [error, setError] = useState(false);
  const location = useLocation();
  const { userName } = location.state || {};

  const handleNext = () => {
    if (nickname.trim() === "") {
      // 입력값이 비어 있으면 에러 표시
      setError(true);
    } else {
      // 입력값이 유효하면 다음 페이지로 이동
      setError(false);
      navigate("/login/4", { state: { userName, nickname } });
    }
  };

  return (
    <div className="w-[100%] h-screen flex flex-row items-center justify-between bg-white">
      {/* 텍스트 영역 */}
      <button
        className="p-3 bg-white rounded-full border border-red-500 text-red-500 hover:bg-red-300 transition"
        onClick={() => navigate("/login/2", { state: { userName } })}
      >
        <FiArrowLeft className="text-2xl" />
      </button>
      <div>
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-4">
            {userName}님! 쪼개몰에서 사용하실 닉네임을 설정해주세요!
          </h1>
          <p className="text-lg text-gray-500">
            다른 사용자에게 보여지며 수정 가능합니다.{" "}
          </p>
        </div>

        {/* 입력 필드 */}
        <div className="flex items-center">
          <input
            type="text"
            placeholder="닉네임을 입력하세요"
            className={`w-[500px] h-[50px] px-4 border ${
              error ? "border-red-500" : "border-gray-300"
            } rounded-lg shadow-sm focus:outline-none focus:ring-2 ${
              error ? "focus:ring-red-500" : "focus:ring-red-300"
            }`}
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
          />
        </div>
        {error && (
          <p className="text-red-500 text-sm mt-2">닉네임을 입력해주세요.</p>
        )}
      </div>

      <button
        className="p-3 bg-white rounded-full border border-red-500 text-red-500 hover:bg-red-300 transition"
        onClick={handleNext}
      >
        <FiArrowRight className="text-2xl" />
      </button>
    </div>
  );
}
export default LoginDetail_3;
