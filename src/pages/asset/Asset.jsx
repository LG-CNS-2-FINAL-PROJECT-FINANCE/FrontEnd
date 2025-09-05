import AssetHome from "./AssetHome";
import MyAsset from "./MyAsset";
import { useQuery } from "@tanstack/react-query";
import { getMyAccount, getMyWallet } from "../../api/asset_api";
import { useTranslation } from 'react-i18next';

function Asset() {

  const { t } = useTranslation();

  const { data:account, isLoading:accountLoading, isError:accountError } = useQuery({
    queryKey: ["account"],
    queryFn: getMyAccount,
    retry: false,
  });
  const { data:wallet, isLoading:walletLoading, isError:walletError } = useQuery({
    queryKey: ["wallet"],
    queryFn: getMyWallet,
    retry: false,
  });

  //로딩 상태
  const overallLoading = accountLoading || walletLoading;
  //에러 상태
  const overallError = accountError || walletError;

  if (overallLoading) {
    return (
        <div className="w-full h-screen flex flex-col items-center justify-center gap-8 py-20">
          <div className="flex flex-col items-center gap-4">
            <div className="w-16 h-16 rounded-full border-4 border-red-400 border-t-transparent animate-spin" aria-label={t('asset_loading_aria_label')} role="status" />
            <p className="text-xl font-semibold text-gray-600 tracking-wide">
              {t('asset_loading_message1')}
            </p>
            <p className="text-sm text-gray-400">
              {t('asset_loading_message2')}
            </p>
          </div>
        </div>
    );
  }

  if (overallError || !account || !wallet) {
    return <AssetHome />;
  }
  return <MyAsset account={account} wallet={wallet} />;
}

export default Asset;