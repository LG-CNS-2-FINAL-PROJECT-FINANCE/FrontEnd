import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import TiltedCard from "../investment/InvestmentComponent/TiltedCard";

function RoleSelectionPage() {
  const navigate = useNavigate();
  const [currentRole, setCurrentRole] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("jwtToken");
    if (token) {
      try {
        const decodedToken = JSON.parse(token);
        if (decodedToken.role) {
          setCurrentRole(decodedToken.role);
        }
      } catch (error) {
        console.error("토큰 디코딩/파싱 오류:", error);
        localStorage.removeItem("jwtToken");
        setCurrentRole("");
      }
    }
  }, []);

  const handleRoleSelect = (selectedRole) => {
    if (selectedRole === currentRole) {
      alert(`이미 ${selectedRole} 역할입니다.`);
      return;
    }

    let token = {};
    try {
      token = JSON.parse(localStorage.getItem("jwtToken")) || {};
    } catch (e) {
      console.error("Failed to parse token from localStorage", e);
    }

    token.role = selectedRole;
    localStorage.setItem("jwtToken", JSON.stringify(token));

    alert(`역할이 ${selectedRole}으로 변경되었습니다.`);
    setCurrentRole(selectedRole);

    if (selectedRole === "투자자") {
      navigate("/investment");
    } else if (selectedRole === "창작자") {
      navigate("/creation");
    } else {
      navigate("/");
    }
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
              // captionText="투자자" // 툴팁 텍스트
              containerHeight="320px" // 이미지와 텍스트를 담을 컨테이너 높이
              containerWidth="100%" // 부모 컨테이너 너비에 맞춤
              imageHeight="256px" // 이미지 자체의 크기
              imageWidth="256px" // 이미지 자체의 크기
              rotateAmplitude={12}
              scaleOnHover={1.15}
              showMobileWarning={false}
              showTooltip={true} // 툴팁 활성화
              displayOverlayContent={true} // 오버레이 콘텐츠 표시
              overlayContent={false}
              onClick={() => handleRoleSelect("투자자")}
              isDisabled={currentRole === "투자자"}
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
              // captionText="창작자"
              containerHeight="320px"
              containerWidth="100%"
              imageHeight="256px"
              imageWidth="256px"
              rotateAmplitude={12}
              scaleOnHover={1.15}
              showMobileWarning={false}
              showTooltip={true}
              displayOverlayContent={true}
              overlayContent={
                false
                /*<div className="inset-0 flex flex-col items-end justify-start">
                                    <span className="font-extrabold mb-2 text-2xl text-blue-500">창작자</span>
                                </div>*/
              }
              onClick={() => handleRoleSelect("창작자")}
              isDisabled={currentRole === "창작자"}
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
