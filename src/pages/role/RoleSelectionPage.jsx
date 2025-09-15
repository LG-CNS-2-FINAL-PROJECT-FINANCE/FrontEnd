import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import TiltedCard from "../investment/investment_component/TiltedCard";
import { useTheme } from "../../context/ThemeContext";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { selectRole } from "../../api/user_api";
import { toast } from "react-toastify";
import useUser from "../../lib/useUser";

function RoleSelectionPage() {
  const queryClient = useQueryClient();
  const { user } = useUser();
  const navigate = useNavigate();
  const [currentRole, setCurrentRole] = useState(user.role || "USER");
  const { updateRole } = useTheme();

  const mutation = useMutation({
    mutationFn: selectRole,
    currentRole,
    onSuccess: async () => {
      // 역할 변경 성공 시 처리
      toast.success(`역할이 ${currentRole}로 변경되었습니다! 🎉`, {
        position: "bottom-right",
      });
      await queryClient.refetchQueries({ queryKey: ["me"] });
      setCurrentRole("USER");
      navigate("/");
    },
    onError: (error) => {
      console.error("역할 변경 오류:", error);
    },
  });
  const handleRoleSelect = (selectedRole) => {
    if (selectedRole === currentRole) {
      return;
    }

    let token = {};
    try {
      token = JSON.parse(localStorage.getItem("jwtToken")) || {};
    } catch (e) {
      console.error("Failed to parse token from localStorage", e);
    }

    token.role = selectedRole;

    // 테마 업데이트
    updateRole(selectedRole);
    setCurrentRole(selectedRole);
    mutation.mutate(selectedRole);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="bg-white p-8 rounded-lg max-w-md w-full text-center">
        <h1 className="text-3xl font-bold mb-4 text-gray-800">역할 변경</h1>
        {currentRole ? (
          <p className="text-gray-700 text-lg mb-2">
            현재 역할:{" "}
            <span className="font-extrabold text-red-500">{currentRole}</span>
          </p>
        ) : (
          <p className="text-gray-700 text-lg mb-2">역할을 선택해주세요.</p>
        )}
        <p className="py-4">역할 변경은 오른쪽 상단에서 변경 가능합니다.</p>

        <div className="flex space-x-32">
          {/* ✨ 투자자 TiltedCard */}
          <div className="flex-1 min-w-[150px] flex items-center justify-center">
            {" "}
            {/* TiltedCard를 감싸는 컨테이너 */}
            <TiltedCard
              imageSrc="/assets/bull.png"
              altText="투자자"
              containerHeight="320px"
              containerWidth="100%"
              imageHeight="256px"
              imageWidth="256px"
              rotateAmplitude={12}
              scaleOnHover={1.15}
              showMobileWarning={false}
              showTooltip={true}
              displayOverlayContent={true}
              overlayContent={false}
              onClick={() => handleRoleSelect("USER")}
              // ✅ USER 역할일 때 비활성화
              isDisabled={currentRole === "USER"}
              nonTiltingContent={
                <span className="font-extrabold text-4xl text-red-500">
                  투자자
                </span>
              }
            />
          </div>

          {/* ✨ 창작자 TiltedCard */}
          <div className="flex-1 min-w-[150px] flex items-center justify-center">
            {" "}
            {/* TiltedCard를 감싸는 컨테이너 */}
            <TiltedCard
              imageSrc="/assets/pig.png"
              altText="창작자"
              containerHeight="320px"
              containerWidth="100%"
              imageHeight="256px"
              imageWidth="256px"
              rotateAmplitude={12}
              scaleOnHover={1.15}
              showMobileWarning={false}
              showTooltip={true}
              displayOverlayContent={true}
              overlayContent={false}
              onClick={() => handleRoleSelect("CREATOR")}
              // ✅ CREATOR 역할일 때 비활성화
              isDisabled={currentRole === "CREATOR"}
              nonTiltingContent={
                <span className="font-extrabold text-4xl text-blue-500">
                  창작자
                </span>
              }
            />
          </div>
        </div>

        {/*뒤로가기 버튼인데 일단 필요한지 필요 없는지 모르겠어서 일단 비활성화 해둠*/}
        {/*<button
                    onClick={() => navigate(-1)}
                    className="mt-6 text-gray-600 hover:text-gray-800 font-semibold"
                >
                    &larr; 뒤로 가기
                </button>*/}
      </div>
    </div>
  );
}

export default RoleSelectionPage;
