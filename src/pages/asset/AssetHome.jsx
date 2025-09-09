import React, { useState } from 'react';
import CardSwap, { Card } from "./CardSwap";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createMyAccount,createMyWallet } from "../../api/asset_api";
import { toast } from "react-toastify";
import KycVerificationModal from './modals/KycVerificationModal';
import { useTranslation } from 'react-i18next';

function AssetHome() {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

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
      toast.success(t('asset_home_success_toast'), { position: "bottom-right" });
    },
    onError: (err) => {
      console.error("Asset creation error:", err);
      toast.error(
          <div>
            <div>{t('asset_home_login_required_toast_1')}</div>
            <div>{t('asset_home_login_required_toast_2')}</div>
          </div>,
          { position: "bottom-right" }
      );
    },
  });

  const handleClick = () => {
    if (setupMutation.isPending) return;
    setIsKycModalOpen(true);
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
          {/* <<<< 텍스트 번역 키 사용 */}
          <h1 className="text-4xl font-bold mb-4">{t('asset_home_title')}</h1>
          <p className="text-lg text-gray-500 mb-6">{t('asset_home_description')}</p>
          <button
              onClick={handleClick}
              disabled={setupMutation.isPending}
              className="bg-red-500 text-white px-6 py-3 rounded-lg font-bold"
          >
            {/* <<<< 버튼 텍스트 번역 키 사용 */}
            {setupMutation.isPending ? t('asset_home_creating_text') : t('asset_home_create_button_text')}
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