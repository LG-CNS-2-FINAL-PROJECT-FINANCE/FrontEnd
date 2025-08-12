import { FiArrowRight } from "react-icons/fi";
import { RiKakaoTalkFill } from "react-icons/ri";
import { useLocation, useNavigate } from "react-router-dom";

function LoginDetail_6() {
  const navigate = useNavigate();
  const location = useLocation();
  const { name, nickname, gender, age } = location.state || {};

  console.log("User Details:", { name, nickname, gender, age });

  return (
    <div className="h-screen flex flex-col items-center justify-center">
      <img
        src="/assets/dancing_bull.gif"
        alt="dancing bull"
        className="w-[500px] h-[500px]"
      />
      <h1 className="text-3xl font-bold text-center mt-4">
        "쪼개"님 쪼개몰에 오신걸 환영해요!
      </h1>
      <button
        className="mt-6 bg-red-400 text-white px-6 py-2 rounded-lg flex items-center justify-center hover:bg-red-500 transition-colors"
        onClick={() => {
          navigate("/select-role");
        }}
      >
        시작하기
      </button>
    </div>
  );
}
export default LoginDetail_6;
