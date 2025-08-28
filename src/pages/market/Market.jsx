import { useQuery, useQueryClient } from "@tanstack/react-query";
import Ballpit from "../../component/Ballpit";
import MarketCard from "../../component/MarketCard";
import { getMarketProducts } from "../../api/market_api";

function Market() {
    const { data: products, isLoading: productsLoading, isError: productsError } = useQuery({
      queryKey: ["products"],
      queryFn: getMarketProducts,
      retry: false,
    });
    const queryClient = useQueryClient();

  return (
    <div>
      {/* Hero Section */}
      <div className="relative min-h-[320px] flex justify-center items-center mb-8 overflow-hidden rounded-xl">
        {/* Ballpit Background */}
        <div className="absolute inset-0 -z-10">
              
          <Ballpit
            count={100}
            gravity={0.01}
            friction={0.99}
            wallBounce={0.95}
            followCursor={false}
            colors={["#FCEF91", "#FB9E3A", "#E6521F", "#EA2F14"]}
            zIndex={0}
          />
        </div>

        {/* Soft Overlay (Glass + Gradient) */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/40 via-white/10 to-white/40  -z-0 pointer-events-none" />

        {/* Content */}
        <div className="relative z-10 flex flex-col items-center text-center px-6">
          <div className="relative">
            <span className="absolute -inset-2 rounded-3xl bg-gradient-to-r from-orange-400/40 via-amber-300/30 to-yellow-300/40 blur-xl" aria-hidden="true"></span>
            <h1 className="relative text-4xl md:text-5xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-orange-600 via-amber-500 to-yellow-400 drop-shadow-sm">
              2차 거래 시장
            </h1>
          </div>
          <p className="mt-4 text-sm md:text-base text-neutral-600 font-medium">
            블록체인을 활용한 사용자간의 거래
          </p>
          <div className="mt-6 h-1 w-40 rounded-full bg-gradient-to-r from-orange-500 via-amber-400 to-yellow-300 animate-pulse" />
        </div>
      </div>
      {/* End Hero */}

      <h2 className="text-2xl font-bold">상품 리스트</h2>
      {/* Products Section */}
      {productsLoading && (
        // Skeleton
        <div className="mt-4 mb-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="animate-pulse rounded-xl border border-neutral-200 p-4 shadow-sm"
            >
              <div className="h-40 w-full rounded-lg bg-neutral-200/70 mb-4" />
              <div className="h-4 w-3/4 bg-neutral-200/80 rounded mb-2" />
              <div className="h-4 w-1/2 bg-neutral-200/60 rounded" />
            </div>
          ))}
        </div>
      )}

      {productsError && (
        <div className="mt-4 mb-12 rounded-lg border border-red-200 bg-red-50 p-6 text-sm text-red-700">
          <p className="font-lg mb-2">상품을 불러오지 못했습니다.</p>
          <p className="mb-4">{"알 수 없는 오류가 발생했습니다."}</p>
          <button
            onClick={() => queryClient.invalidateQueries({ queryKey: ["products"] })}
            className="px-4 py-2 rounded-md bg-red-600 text-white text-sm hover:bg-red-700"
          >
            다시 시도
          </button>
        </div>
      )}

      {!productsLoading && !productsError && products?.length === 0 && (
        <div className="mt-4 mb-12 rounded-lg border border-neutral-200 p-10 text-center text-neutral-500">
          등록된 상품이 없습니다.
        </div>
      )}

      {!productsLoading && !productsError && products?.length > 0 && (
        <div className="mb-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-4">
          {products.map((item) => (
            <MarketCard key={item.projectId} project={item} />
          ))}
        </div>
      )}
    </div>
  );
}

export default Market;
