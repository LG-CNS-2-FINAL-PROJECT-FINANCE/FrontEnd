// KakaoConfirm.tsx (또는 .jsx)
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { kakaologin } from "../../api/user_api"; // 카카오 로그인 API 함수

export default function KakaoConfirm() {
  const { search } = useLocation();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const params = new URLSearchParams(search);
  const code = params.get("code"); // 코드 가져오기

  const mutation = useMutation({
    mutationFn: kakaologin,
    onSuccess: async (data) => {
      toast.success("😊 환영합니다! 😊", {
        position: "bottom-right",
      });
      // 로그인 후 사용자 정보 새로고침
      await queryClient.refetchQueries({ queryKey: ["me"] });
      // 새로고침된 user 데이터 확인
      const user = queryClient.getQueryData(["me"]);

      if (user?.nickName === null || user?.nickName === undefined) {
        // nickName이 없으면 추가 정보 입력 페이지로 이동
        navigate("/login/2", { replace: true, state: {} });
      } else {
        // nickName 있으면 홈으로 이동
        navigate("/", { replace: true });
      }
    },
    onError: () => {
      toast.error("Login failed 😭 Please check your Kakao account", {
        position: "bottom-right",
      });
      navigate("/", { replace: true });
    },
  });

  useEffect(() => {
    if (code) {
      mutation.mutate({ code });
    }
  }, [code]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="mt-72 flex flex-col items-center justify-center text-center">
      <h1 className="text-3xl font-bold">Confirming Kakao..</h1>
      <p className="mt-1 text-gray-600">😝 Don't go anywhere! 😝</p>

      {/* Tailwind 로딩 스피너 */}
      <div className="mt-4 h-10 w-10 animate-spin rounded-full border-4 border-gray-300 border-t-gray-700" />
    </div>
  );
}
