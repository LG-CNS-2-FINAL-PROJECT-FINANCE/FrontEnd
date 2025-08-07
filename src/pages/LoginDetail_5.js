import { useState } from "react";
import { FiArrowLeft, FiArrowRight } from "react-icons/fi";
import { RiKakaoTalkFill } from "react-icons/ri";
import { useLocation, useNavigate } from "react-router-dom";

function LoginDetail_5() {
  const navigate = useNavigate();
  const location = useLocation();
  const { name, nickname, gender } = location.state || {};

  const [age, setAge] = useState("");

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
            "쪼개"님 나이가 어떻게 되시나요?
          </h1>
        </div>

        {/* 입력 필드 */}
        <div className="flex items-center">
          <input
            type="text"
            placeholder="나이를 입력하세요"
            className="w-[500px] h-[50px] px-4 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500"
            value={age}
            onChange={(e) => setAge(e.target.value)}
          />
        </div>
      </div>

      <button
        className="p-3 bg-white rounded-full border border-red-500 text-red-500 hover:bg-red-300 transition"
        onClick={() =>
          navigate("/login/6", { state: { name, nickname, gender, age } })
        }
      >
        <FiArrowRight className="text-2xl" />
      </button>
    </div>
  );
}
export default LoginDetail_5;
