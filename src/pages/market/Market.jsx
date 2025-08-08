import Ballpit from "../../component/Ballpit";
import MarketCard from "../../component/MarketCard";

function Market() {
  const products = [
    {
      id: 1,
      name: "프로젝트A",
      price: "100,010,200",
    },
    {
      id: 2,
      name: "프로젝트B",
      price: "200,500,000",
    },
    {
      id: 3,
      name: "프로젝트C",
      price: "50,000,000",
    },
    {
      id: 4,
      name: "프로젝트D",
      price: "300,123,456",
    },
    {
      id: 5,
      name: "프로젝트E",
      price: "80,000,000",
    },
    {
      id: 6,
      name: "프로젝트F",
      price: "150,000,000",
    },
  ];
  return (
    <div>
      <div className="relative min-h-[500px] flex justify-center items-center mb-8">
        <h1 className="z-10 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-4xl font-bold text-black p-6   text-center">
          2차 거래 시장
        </h1>
        <h3></h3>

        <div className="bg-white rounded-lg min-h-[300px] max-h-[500px] h-full w-full overflow-hidden">
          <Ballpit
            count={150}
            gravity={0.01}
            friction={0.99}
            wallBounce={0.95}
            followCursor={false}
            colors={["#FCEF91", "#FB9E3A", "#E6521F", "#EA2F14"]}
            zIndex={0} // 또는 className="z-0"
          />
        </div>
      </div>
      <h2 className="text-2xl font-bold">상품 리스트</h2>
      <div className="mb-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-4">
        {products.map((item) => (
          <MarketCard key={item.id} project={item} />
        ))}
      </div>
    </div>
  );
}

export default Market;
