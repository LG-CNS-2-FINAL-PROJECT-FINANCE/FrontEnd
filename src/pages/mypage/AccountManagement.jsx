import UserProfile from "./my_page_component/UserProfile";
import { useNavigate } from "react-router-dom";
import { MdReportGmailerrorred } from "react-icons/md";
import { MdOutlineLogout } from "react-icons/md";
import { MdOutlineManageAccounts } from "react-icons/md";
import { LuUserPen } from "react-icons/lu";
import { logout, secessionUser } from "../../api/user_api";
import { useQueryClient } from "@tanstack/react-query";
import useUser from "../../lib/useUser";
import { toast } from "react-toastify";
import {useState} from "react";

const EditInfo = () => {
  const navigate = useNavigate();

  const queryClient = useQueryClient();

  const [showSecessionModal, setShowSecessionModal] = useState(false);

  const handleNavigation = (path) => {
    navigate(path);
  };

  const handleSecession = async () => {
    try {
      await secessionUser();
      toast.success("회원 탈퇴가 완료되었습니다.");
      logout();
      queryClient.removeQueries({ queryKey: ["me"] });
      navigate("/login/1");
    } catch (error) {
      toast.warn("회원 탈퇴 중 오류가 발생했습니다.");
      console.error(error);
    } finally {
      setShowSecessionModal(false);
    }
  };

  const { user } = useUser();

  return (
    <div className="flex min-h-screen relative">
      {/* Gray vertical line at 220px */}
      <div className="absolute left-[220px] top-0 bottom-0 w-px bg-gray-200 z-10"></div>

      {/* Left side - Sticky Bull image area*/}
      <div className="w-[220px] sticky top-0 h-screen">
        <UserProfile />
      </div>

      {/* Right side - Edit Info Form */}
      <div className="flex-1 bg-white p-6 flex justify-center">
        {/* Edit Info Rectangle */}
        <div className="border border-gray-300 rounded-lg p-8 w-full max-w-md">
          <div className="flex flex-col items-center space-y-6">
            {/* Bull Image */}
            <img
                src={user?.role === "CREATOR" ? "/assets/pig.png" : "/assets/bull.png"}
                alt={user?.role === "CREATOR" ? "Pig" : "Bull"}
              className="object-cover rounded-full shadow-lg"
              style={{ width: "120px", height: "120px" }}
            />

            {/* Nickname Display */}
            <div className="text-xl font-bold text-gray-800">{user?.nickname}</div>

            {/* Form Fields */}
            <div className="w-full space-y-4 mt-8">
              <div
                className="w-full py-2 pl-4 pr-4 text-gray-900 font-bold border-b border-gray-800 flex justify-between items-center cursor-pointer hover:bg-gray-100"
                onClick={() => handleNavigation("/edit-info")}
              >
                회원 정보 수정
                <LuUserPen className="text-gray-600" size={20} />
              </div>
              <div
                className="w-full py-2 pl-4 pr-4 text-gray-900 font-bold border-b border-gray-800 flex justify-between items-center cursor-pointer hover:bg-gray-100"
                onClick={() => handleNavigation("/my-reports")}
              >
                신고내역
                <MdReportGmailerrorred className="text-gray-600" size={20} />
              </div>
              <div onClick={() => { logout(); queryClient.removeQueries({queryKey:["me"]}); navigate("/login/1"); }} className="w-full py-2 pl-4 pr-4 text-gray-900 font-bold border-b border-gray-800 flex justify-between items-center cursor-pointer hover:bg-gray-100">
                로그아웃
                <MdOutlineLogout className="text-gray-600" size={20} />
              </div>
              <div onClick={() => setShowSecessionModal(true)} className="w-full py-2 pl-4 pr-4 text-gray-900 font-bold border-b border-gray-800 flex justify-between items-center cursor-pointer hover:bg-gray-100">
                회원탈퇴
                <MdOutlineManageAccounts className="text-gray-600" size={20} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {showSecessionModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
            <div className="bg-white rounded-lg p-6 w-96">
              <h2 className="text-lg font-bold mb-4">정말 탈퇴하시겠습니까?</h2>
              <p className="mb-6 text-gray-600">탈퇴하면 모든 데이터가 삭제됩니다.</p>
              <div className="flex justify-end gap-2">
                <button
                    className="px-4 py-2 bg-gray-200 rounded"
                    onClick={() => setShowSecessionModal(false)}
                >
                  취소
                </button>
                <button
                    className="px-4 py-2 bg-red-500 text-white rounded"
                    onClick={handleSecession}
                >
                  탈퇴
                </button>
              </div>
            </div>
          </div>
      )}

    </div>
  );
};

export default EditInfo;
