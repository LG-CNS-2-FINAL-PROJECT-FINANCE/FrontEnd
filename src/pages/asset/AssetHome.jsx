import React, { useState } from 'react';
import CardSwap, { Card } from "./CardSwap";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createMyAccount,createMyWallet } from "../../api/asset_api";
import { toast } from "react-toastify";
import KycVerificationModal from './modals/KycVerificationModal';

function AssetHome() {
  const queryClient = useQueryClient();

  const [isKycModalOpen, setIsKycModalOpen] = useState(false);

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
      const msg =
        err?.response?.data?.message ||
        "생성 중 오류가 발생했습니다. 다시 시도해 주세요.";
      toast.error(msg, { position: "bottom-right" });
    },
  });

  const handleClick = () => {
    if (setupMutation.isPending) return;
    setIsKycModalOpen(true);
    // setupMutation.mutate();
  };

  const handleKycSuccess = async () => {
    setIsKycModalOpen(false);
    setupMutation.mutate();
  };

  const handleCloseKycModal = () => {
    setIsKycModalOpen(false);
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
        <h1 className="text-4xl font-bold mb-4">조각투가가 처음이신가요?</h1>
        <p className="text-lg text-gray-500 mb-6">
          쪼개몰에서 쉽고 간단하고 안전하게 시작하세요.
        </p>
        <button
            onClick={handleClick}
            disabled={setupMutation.isPending}
            className="bg-red-500 text-white px-6 py-3 rounded-lg font-bold"
        >
          {setupMutation.isPending ? "생성 요청 중..." : "계좌 및 지갑 생성하기"}
        </button>
      </div>

      {isKycModalOpen && (
          <KycVerificationModal
              open={isKycModalOpen}
              onClose={handleCloseKycModal}
              onKycSuccess={handleKycSuccess}
          />
      )}

    </div>
  );
}

export default AssetHome;
