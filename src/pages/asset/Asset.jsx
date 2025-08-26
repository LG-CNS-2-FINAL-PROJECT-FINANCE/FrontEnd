import AssetHome from "./AssetHome";
import MyAsset from "./MyAsset";
import { useQuery } from "@tanstack/react-query";
import { getMyAccount, getMyWallet } from "../../api/asset_api";
import { toast } from "react-toastify";

function Asset() {
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

 return accountLoading || walletLoading ? (
    <div className="w-full h-screen flex flex-col items-center justify-center gap-8 py-20">
      {/* 로딩 인디케이터 */}
      <div className="flex flex-col items-center gap-4">
        <div
          className="w-16 h-16 rounded-full border-4 border-red-400 border-t-transparent animate-spin"
          aria-label="로딩 중"
          role="status"
        />
        <p className="text-xl font-semibold text-gray-600 tracking-wide">
          자산 정보를 불러오는 중...
        </p>
        <p className="text-sm text-gray-400">
          잠시만 기다려 주세요
        </p>
      </div>

    </div>
  ) : accountError || walletError ? (
    // ERROR
    <AssetHome />
  ) : (
    // NO ERROR
    <MyAsset account={account} wallet={wallet} />
  );
}

export default Asset;