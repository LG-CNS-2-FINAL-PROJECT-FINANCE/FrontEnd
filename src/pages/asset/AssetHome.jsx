import CardSwap, { Card } from "./CardSwap";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createMyAccount,createMyWallet } from "../../api/asset_api";
import { toast } from "react-toastify";

function AssetHome() {
  const queryClient = useQueryClient();
  // const accountMutation = useMutation({
  //   mutationFn: createMyAccount,
  //   onSuccess: async () => {
  //     toast.success("계좌가 생성되었습니다! 🎉", {
  //       position: "bottom-right",
  //     });
  //     // account 캐시 최신화
  //     await queryClient.refetchQueries({ queryKey: ["account"] });
  //   },
  //   onError: (err) => {
  //     const msg =
  //       err?.response?.data?.message ||
  //       "계좌 생성에 실패했어요. 다시 시도해 주세요.😢";
  //     toast.error(msg, { position: "bottom-right" });
  //   },
  // });
  // const walletMutation = useMutation({
  //   mutationFn: createMyWallet,
  //   onSuccess: async() => {
  //     toast.success("지갑이 생성되었습니다! 🎉", {
  //       position: "bottom-right",
  //     });
  //     // wallet 캐시 최신화
  //     await queryClient.refetchQueries({ queryKey: ["wallet"] });
  //   },
  //   onError: (err) => {
  //     const msg =
  //       err?.response?.data?.message ||
  //       "지갑 생성에 실패했어요. 다시 시도해 주세요.😢";
  //     toast.error(msg, { position: "bottom-right" });
  //   },
  // });

  // const handleClick = () => {
  //   // 계좌 생성 로직
  //   console.log("계좌 및 지갑 생성");
  //   try{
  //       accountMutation.mutate();
  //       walletMutation.mutate();
  //   } catch (error) {
  //     console.error("Error creating account and wallet:", error);
  //   }
  // };
  const setupMutation = useMutation({
    mutationFn: async () => {
      const account = await createMyAccount();
      const wallet = await createMyWallet();
      return { account, wallet };
    },
    onSuccess: ({ account, wallet }) => {
      queryClient.refetchQueries({ queryKey: ["account"] });
      queryClient.refetchQueries({ queryKey: ["wallet"] });
      toast.success("계좌 및 지갑 생성 완료! 🎉", { position: "bottom-right" });
    },
    onError: (err) => {
      console.error("Asset creation error:", err); // Log the actual error for debugging
      toast.error(
        <div>
          <div>로그인이 필요합니다.</div>
          <div>로그인 후 이용해 주세요.</div>
        </div>,
        { position: "bottom-right" }
      );
    },
  });

  const handleClick = () => {
    if (setupMutation.isPending) return;
    setupMutation.mutate();
  };

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
        <button onClick={handleClick} className="bg-red-500 text-white px-6 py-3 rounded-lg font-bold">
          계좌 및 지갑 생성하기
        </button>
      </div>
    </div>
  );
}

export default AssetHome;
