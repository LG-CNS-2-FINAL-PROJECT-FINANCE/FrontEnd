import { RiKakaoTalkFill } from "react-icons/ri";

function LoginDetail_1() {
  const kakaoParams = {
    client_id: "b4b2d8c256a781c939214bc2360fef37",
    redirect_uri: "http://127.0.0.1:3000/login/kakaoConfirm",
    response_type: "code",
    //prompt: "login", -> 나중에 배포 시 추가
  };
  const kakaoAuthUrl = `https://kauth.kakao.com/oauth/authorize?${new URLSearchParams(
    kakaoParams
  ).toString()}`;

  return (
    <div className="w-[100%] h-screen flex items-center justify-center bg-white">
      {/* 왼쪽: 이미지 영역 */}
      <div className="w-[900px] h-screen flex flex-col items-center justify-center relative">
        {/* 그래프 */}
        <img
          src="/assets/graph.png"
          alt="graph"
          className="left-[12px] absolute w-[800px] h-[720px] z-0"
        />
        {/* 돼지 */}
        <img
          src="/assets/pig.png"
          alt="pig"
          className="absolute left-10 top-[10px] w-[480px] h-[480px] z-10"
        />
        {/* 소 */}
        <img
          src="/assets/bull.png"
          alt="bull"
          className="absolute right-[20px] top-[200px] w-[540px] h-[540px] z-20"
        />
      </div>
      {/* 오른쪽: 텍스트/로고/버튼 */}
      <div className="w-[400px] flex flex-col items-start justify-center">
        {/* 로고 */}
        <img src="/assets/logo.png" alt="logo" className="w-[400px] mb-8" />
        {/* 카카오 로그인 버튼 */}
        <a
          href={kakaoAuthUrl}
          className="w-[100%] flex items-center bg-[#FEE500] hover:bg-yellow-400 transition px-8 py-4 rounded-xl shadow text-lg font-bold"
        >
          <div className="flex items-center w-full">
            <RiKakaoTalkFill className="text-4xl text-black" />
            <div className="w-full flex justify-center">
              <span className="text-2xl">카카오 로그인</span>
            </div>
          </div>
        </a>
      </div>
    </div>
  );
}
export default LoginDetail_1;
