import { useMutation, useQueryClient } from "@tanstack/react-query";
import { FiArrowRight } from "react-icons/fi";
import { RiKakaoTalkFill } from "react-icons/ri";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { registerUserInfo } from "../../api/user_api";
import useUser from "../../lib/useUser";

function LoginDetail_6() {
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();
  const { userLoading, user, isLoggedIn } = useUser();
  console.log(user);

  const { userName, nickname, gender, birthDate } = location.state || {};
  console.log("userInfo", { userName, nickname, gender, birthDate });

  const mutation = useMutation({
    mutationFn: registerUserInfo,
    onSuccess: async () => {
      toast.success("프로필이 저장되었습니다! 🎉", {
        position: "bottom-right",
      });
      // me 캐시 최신화
      await queryClient.refetchQueries({ queryKey: ["me"] });
      navigate("/select-role", { replace: true });
    },
    onError: (err) => {
      const msg =
        err?.response?.data?.message ||
        "저장에 실패했어요. 다시 시도해 주세요.";
      toast.error(msg, { position: "bottom-right" });
    },
  });

  const handleStart = () => {
    // 중복 클릭 방지
    if (mutation.isPending) return;

    // 서버가 기대하는 스키마에 맞추어 보냄
    mutation.mutate({
      userName,
      nickname,
      gender,
      birthDate,
      email: user.email,
    });
  };

  return (
    <div className="h-screen flex flex-col items-center justify-center">
      <img
        src="/assets/dancing_bull.gif"
        alt="dancing bull"
        className="w-[500px] h-[500px]"
      />
      <h1 className="text-3xl font-bold text-center mt-4">
        "{nickname}"님 쪼개몰에 오신걸 환영해요!
      </h1>
      <button
        className={`mt-6 bg-red-400 text-white px-6 py-2 rounded-lg flex items-center justify-center hover:bg-red-500 transition-colors disabled:opacity-60`}
        onClick={handleStart}
        disabled={mutation.isPending}
      >
        {mutation.isPending ? "저장 중..." : "시작하기"}
        <FiArrowRight className="ml-2" />
      </button>
    </div>
  );
}
export default LoginDetail_6;
