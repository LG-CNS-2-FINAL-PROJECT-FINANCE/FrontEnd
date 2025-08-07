import { useNavigate } from "react-router-dom";

function Header() {
  const navigate = useNavigate();

  return (
    <div
      className="
            flex
            justify-between
            items-center
            w-full
            bg-white
            py-2
            px-[10%]
        "
    >
      <div
        className="
                flex
                items-center
                space-x-6
            "
      >
        <div>
          <img
            src="/assets/logo.png"
            alt="로고"
            className="w-20 h-10 min-h-1 min-w-1 hover:cursor-pointer"
            onClick={() => navigate("/")}
          />
        </div>
        <div>
          <span
            className="hover:cursor-pointer"
            onClick={() => navigate("/asset")}
          >
            자산 조회
          </span>
        </div>{" "}
        {/*주소 나중에 변경*/}
        <div>
          <span
            className="hover:cursor-pointer"
            onClick={() => navigate("/investment")}
          >
            투자 상품
          </span>
        </div>{" "}
        {/*주소 나중에 변경*/}
        <div>
          <span
            className="hover:cursor-pointer"
            onClick={() => navigate("/market")}
          >
            토큰 거래
          </span>
        </div>{" "}
        {/*주소 나중에 변경*/}
      </div>
      <div
        className="
                flex
                items-center
                space-x-4
            "
      >
        <div>
          <button className="bg-red-500 px-5 py-3 rounded-full text-amber-50">
            투자자
          </button>
        </div>
        <div>
          <img
            src="/assets/bull.png"
            alt="투자자"
            className="w-16 h-16 hover:cursor-pointer"
            onClick={() => navigate("/login/1")}
          />
        </div>
      </div>
    </div>
  );
}

export default Header;
