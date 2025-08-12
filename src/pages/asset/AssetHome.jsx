import CardSwap, { Card } from "./CardSwap";

function AssetHome() {
  return (
    <div className="relative rounded-lg h-screen flex items-center justify-center">
      {/* CardSwap 컴포넌트 */}
      <div className="flex-1">
        <CardSwap
          cardDistance={40}
          verticalDistance={20}
          delay={3000}
          pauseOnHover={false}
        >
          <Card altText="Card 1">
            <img
              src="/assets/startingpage_1.jpg"
              alt="Card 1"
              className="w-full h-full object-cover rounded-xl"
            />
          </Card>
          <Card>
            <img
              src="/assets/startingpage_2.jpg"
              alt="Card 2"
              className="w-full h-full object-cover rounded-xl"
            />
          </Card>
          <Card>
            <img
              src="/assets/startingpage_3.jpg"
              alt="Card 3"
              className="w-full h-full object-cover rounded-xl"
            />
          </Card>
        </CardSwap>
      </div>

      {/* 텍스트 영역 */}
      <div className="flex-2 text-center">
        <h1 className="text-4xl font-bold mb-4">조각투자가 처음이신가요?</h1>
        <p className="text-lg text-gray-500 mb-6">
          쪼개몰에서 쉽고 간단하고 안전하게 시작하세요.
        </p>
        <button className="bg-red-500 text-white px-6 py-3 rounded-lg font-bold">
          계좌 생성하기
        </button>
      </div>
    </div>
  );
}

export default AssetHome;
