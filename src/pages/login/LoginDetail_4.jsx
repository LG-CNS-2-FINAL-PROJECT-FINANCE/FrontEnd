import { FaArrowLeft } from "react-icons/fa";
import { FiArrowLeft, FiArrowRight } from "react-icons/fi";
import { RiKakaoTalkFill } from "react-icons/ri";
import { useLocation, useNavigate } from "react-router-dom";
import { IoManOutline, IoWomanOutline } from "react-icons/io5";
import { motion } from "motion/react";
import { useState } from "react";

function LoginDetail_4() {
  const navigate = useNavigate();
  const [gender, setGender] = useState(null);
  const [error, setError] = useState(false);
  const location = useLocation();
  const { userName, nickname } = location.state || {};
  const handleNext = () => {
    if (!gender) {
      setError(true);
    } else {
      setError(false);
      navigate("/login/5", { state: { gender, userName, nickname } });
    }
  };

  return (
    <div className="w-[100%] h-screen flex flex-row items-center justify-between bg-white">
      <button
        className="p-3 bg-white rounded-full border border-red-500 text-red-500 hover:bg-red-300 transition"
        onClick={() => navigate("/login/3")}
      >
        <FiArrowLeft className="text-2xl" />
      </button>
      {/* 텍스트 영역 */}
      <div className="flex-col items-center justify-center">
        <h1 className="text-3xl font-bold mb-20 text-center">
          성별을 선택해주세요
        </h1>

        <div className="flex space-x-4">
          <motion.div
            onClick={() => setGender("MALE")}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <IoManOutline
              className={`text-[300px] ${
                gender === "MALE" ? "text-red-500" : "text-black"
              }`}
            />
          </motion.div>
          <motion.div
            onClick={() => setGender("FEMALE")}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <IoWomanOutline
              className={`text-[300px] ${
                gender === "FEMALE" ? "text-red-500" : "text-black"
              }`}
            />
          </motion.div>
        </div>
      </div>

      <button
        className="ml-12 p-3 bg-white rounded-full border border-red-500 text-red-500 hover:bg-red-300 transition"
        onClick={handleNext}
      >
        <FiArrowRight className="text-2xl" />
      </button>
    </div>
  );
}
export default LoginDetail_4;
