import { useState } from "react";
import { FaRegCopy } from "react-icons/fa";
import AssetDepositModal from "./modals/AssetDepositModal";
import AssetWithdrawModal from "./modals/AssetWithdrawModal";
import { toast } from "react-toastify";
import AssetCheckModal from "./modals/AssetCheckModal";
import { getAccountAllHistory, getWalletToken } from "../../api/asset_api";
import { useQuery } from "@tanstack/react-query";
import { toKSTDateTime } from "../../lib/toKSTDateTime";
import { getTokenTradeDoneHistoryByUserId } from "../../api/market_api";


function MyAsset({ account, wallet }) {
  const { data:accountAllHistory, isLoading:accountAllHistoryLoading, isError:accountAllHistoryError } = useQuery({
    queryKey: ["accountAllHistory"],
    queryFn: getAccountAllHistory,
    retry: false,
  });
const { data:walletToken, isLoading:walletTokenLoading, isError:walletTokenError } = useQuery({
    queryKey: ["walletToken"],
    queryFn: getWalletToken,
    retry: false,
  });
  const { data:walletTokenTradeHistory, isLoading:walletTokenTradeHistoryLoading, isError:walletTokenTradeHistoryError } = useQuery({
    queryKey: ["walletTokenTradeHistory"],
    queryFn: getTokenTradeDoneHistoryByUserId,
    retry: false,
  });
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState(""); // "입금" 또는 "출금"
  const [activeTab, setActiveTab] = useState("계좌 정보");

  const [isCheckOpen, setIsCheckOpen] = useState(false);
  const [depositAmount, setDepositAmount] = useState(null);
  const [withdrawAmount, setWithdrawAmount] = useState(null);

  const openModal = (type) => {
    setModalType(type);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleDepositConfirm = (amount) => {
    setDepositAmount(amount); // 입금 출금 금액
    setIsCheckOpen(true); // 확인 모달 열기
  };
  const handleWithdrawConfirm = (amount) => {
    setWithdrawAmount(amount);
    setIsCheckOpen(true);
  };

  // 계좌번호, 지갑번호 복사 기능
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    console.log(`Copied to clipboard: ${text}`);
  };

  const notify = () => toast("Copied to clipboard!");
  const formatNumber = (digits) => digits.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

  return (
    <div className="mt-8 mb-16">
      <h1 className="text-3xl font-bold mb-2">자산 조회</h1>
      <p className="text-gray-500 mb-6">
        View detailed information about your account.
      </p>

      <div className="flex items-center gap-12 mb-6">
        <div className="flex-col items-center gap-2">
          <span className="text-gray-500 text-sm">계좌 번호</span>
          <div className="flex items-center gap-2">
            <p className="text-md">{account.bankNumber}</p>
            <button
              onClick={() => {
                copyToClipboard(account.bankNumber);
                notify();
              }}
              className="text-gray-400 hover:text-gray-600"
            >
              <FaRegCopy />
            </button>
          </div>
        </div>
        <div className="flex-col items-center gap-2">
          <span className="text-gray-500 text-sm">지갑 번호</span>
          <div className="flex items-center gap-2">
            <p className="text-md">{wallet}</p>
            <button
              onClick={() => {
                copyToClipboard(wallet);
                notify();
              }}
              className="text-gray-400 hover:text-gray-600"
            >
              <FaRegCopy />
            </button>
          </div>
        </div>
      </div>

      {/* 탭 메뉴 */}
      <div className="flex border-b mb-6">
        <button
          className={`px-4 py-2 font-bold ${
            activeTab === "계좌 정보"
              ? "text-red-500 border-b-2 border-red-500"
              : "text-gray-400"
          }`}
          onClick={() => setActiveTab("계좌 정보")}
        >
          계좌 정보
        </button>
        <button
          className={`px-4 py-2 font-bold ${
            activeTab === "지갑 정보"
              ? "text-red-500 border-b-2 border-red-500"
              : "text-gray-400"
          }`}
          onClick={() => setActiveTab("지갑 정보")}
        >
          지갑 정보
        </button>
      </div>

      {/* 계좌 정보 */}
      {activeTab === "계좌 정보" && (
        <div>
          <div className="border rounded-lg p-6 px-16 mb-6">
            <div className="flex justify-around items-center mb-4">
              <div className="text-center">
                <span className="text-gray-500 text-sm">이번달 입금</span>
                <p className="text-3xl font-bold">12,000원</p>
              </div>
              <span className="text-gray-300">|</span>
              <div className="text-center">
                <span className="text-gray-500 text-sm">잔액</span>
                <p className="text-3xl font-bold">{formatNumber(account.deposit.toString())} 원</p>
              </div>
              <span className="text-gray-300">|</span>
              <div className="text-center">
                <span className="text-gray-500 text-sm">이번달 출금</span>
                <p className="text-3xl font-bold">12,000원</p>
              </div>
            </div>
            <div className="mt-12 w-full flex justify-center gap-16">
              <button
                className="w-52 bg-red-500 text-white font-bold rounded-lg px-8 py-3"
                onClick={() => openModal("입금")}
              >
                입금
              </button>
              <button
                className="w-52 bg-red-100 text-red-500 font-bold rounded-lg px-8 py-3"
                onClick={() => openModal("출금")}
              >
                출금
              </button>
            </div>
            {/* Modal */}
            {isModalOpen && (
              <>
                {/* Modal */}
                <>
                  {modalType === "입금" && (
                    <AssetDepositModal
                      isOpen={isModalOpen}
                      onClose={closeModal}
                      onConfirm={handleDepositConfirm}
                    />
                  )}
                  {modalType === "출금" && (
                    <AssetWithdrawModal
                      isOpen={isModalOpen}
                      onClose={closeModal}
                      onConfirm={handleWithdrawConfirm}
                    />
                  )}
                  <AssetCheckModal
                    isOpen={isCheckOpen}
                    onClose={() => setIsCheckOpen(false)}
                    onConfirmAll={() => {
                      setIsCheckOpen(false); // 체크 모달 닫기
                      setIsModalOpen(false); // 입금/출금 모달도 함께 닫기
                    }}
                    amount={
                      modalType === "입금" ? depositAmount : withdrawAmount
                    }
                    type={modalType}
                  />
                </>
              </>
            )}
          </div>

          {/* 거래 기록 */}
          <h2 className="text-xl font-bold mb-4 mt-12">입출금 내역</h2>
          <div className="border-gray-200 border rounded-lg p-6 overflow-x-auto">
            <table className="w-full text-sm rounded-lg">
              <thead className="border-b border-gray-200">
                <tr className="text-gray-500 text-left">
                  <th className="py-2 font-normal">Date</th>
                  <th className="font-normal">Amount</th>
                  <th className="font-normal">Time</th>
                  <th className="font-normal">Type</th>
                </tr>
              </thead>
              <tbody>
                {accountAllHistoryLoading ? (
                  <tr>
                    <td colSpan={4} className="py-4 text-center">
                      Loading...
                    </td>
                  </tr>
                ) : accountAllHistoryError ? (
                  <tr>
                    <td colSpan={4} className="py-4 text-center">
                      Error loading transaction history
                    </td>
                  </tr>
                ) : (
                  accountAllHistory.data.map((transaction, index) => {
                    const {date,time} = toKSTDateTime(transaction.bankTime);
                    return (
                      <tr key={index} className="w-1/4 border-b border-gray-100">
                      <td className="w-1/4 py-4">{date}</td>
                      <td
                        className={`w-1/4 font-bold ${
                          transaction.moneyType === 0
                            ? "text-red-500"
                            : "text-blue-500"
                        }`}
                      >
                        {formatNumber(transaction.bankPrice.toString())}
                      </td>
                      <td className="w-1/4">{time}</td>
                      <td className={`w-1/4 ${
                          transaction.moneyType === 0
                            ? "text-red-500"
                            : "text-blue-500"
                        }`}>{transaction.moneyType === 0 ? "입금" : "출금"}</td>
                    </tr>
                    )
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 지갑 정보 */}
      {activeTab === "지갑 정보" && (
        <div>
          <div className="border rounded-lg p-6 px-16 mb-6">
            <div className="flex justify-around items-center mb-4">
              <div className="text-center">
                <span className="text-gray-500 text-sm">토큰 비율</span>
                <p className="text-3xl font-bold">12,000원</p>
              </div>
              <span className="text-gray-300">|</span>
              <div className="text-center">
                <span className="text-gray-500 text-sm">토큰 총액</span>
                <p className="text-3xl font-bold">{formatNumber(account.deposit.toString())}원</p>
              </div>
              <span className="text-gray-300">|</span>
              <div className="text-center">
                <span className="text-gray-500 text-sm">이번달 수익</span>
                <p className="text-3xl font-bold">12,000원</p>
              </div>
            </div>
          </div>
          {/* 토큰 내역 */}
          <h2 className="text-xl font-bold mb-4">토큰 내역</h2>
          <div className="border-gray-200 border rounded-lg p-6 overflow-x-auto mb-6">
            <table className="w-full text-sm rounded-lg">
              <thead className="border-b border-gray-200">
                <tr className="text-gray-500 text-left">
                  <th className="py-2 font-normal w-1/5">Project Id</th>
                  <th className="font-normal w-1/5">Amount</th>
                  <th className="font-normal w-1/5">Price</th>
                  <th className="font-normal w-1/5">Token Name</th>
                </tr>
              </thead>
              <tbody>
                {walletTokenLoading ? (
                  <tr>
                    <td colSpan={4} className="py-4 text-center">
                      Loading...
                    </td>
                  </tr>
                ) : walletTokenError ? (
                  <tr>
                    <td colSpan={4} className="py-4 text-center">
                      Error loading wallet tokens
                    </td>
                  </tr>
                ) : !walletToken || walletToken.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-4 text-center text-gray-400">
                      보유한 토큰이 없습니다.
                    </td>
                  </tr>
                ) : (
                  walletToken.map((token, index) => (
                    <tr key={index} className="border-b border-gray-100">
                      <td className="py-4 w-1/5">{token.projectId}</td>
                      <td className="w-1/5">{token.amount}</td>
                      <td className="w-1/5">{token.tokenPriceInKRW}</td>
                      <td className="text-blue-500 w-1/5">{token.tokenName}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* 토큰 거래 기록 */}
          <h2 className="text-xl font-bold mb-4">토큰 거래 기록</h2>
          <div className="border-gray-200 border rounded-lg p-6 overflow-x-auto mb-6">
            <table className="w-full text-sm rounded-lg">
              <thead className="border-b border-gray-200">
                <tr className="text-gray-500 text-left">
                  <th className="py-2 font-normal w-1/5">Project Id</th>
                  <th className="font-normal w-1/5">Amount</th>
                  <th className="font-normal w-1/5">Price</th>
                  <th className="font-normal w-1/5">Date</th>
                  <th className="font-normal w-1/5">Trade Type</th>
                </tr>
              </thead>
              <tbody>
                {/* projectId; tradeType; tradePrice; tokenQuantity; tradedAt; */}
                {walletTokenTradeHistoryLoading ? (
                  <tr>
                    <td colSpan={5} className="py-4 text-center">
                      Loading...
                    </td>
                  </tr>
                ) : walletTokenTradeHistoryError ? (
                  <tr>
                    <td colSpan={5} className="py-4 text-center">
                      Error loading token trade history
                    </td>
                  </tr>
                ) : !walletTokenTradeHistory || walletTokenTradeHistory.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-4 text-center text-gray-400">
                      거래 기록이 없습니다.
                    </td>
                  </tr>
                ) : (
                  walletTokenTradeHistory.map((history, index) => {
                    const { date, time } = toKSTDateTime(history.tradedAt);
                    return (
                      <tr key={index} className="border-b border-gray-100">
                        <td className="py-4 w-1/5">{history.projectId}</td>
                        <td className=" w-1/5">
                          {history.tokenQuantity}
                        </td>
                        <td className={`py-4 font-semibold ${history.tradeType===1 ? "text-red-500" : "text-blue-500"} w-1/5`}>
                          {formatNumber(String(history.tradePrice))}
                        </td>
                        <td className="w-1/5">{date} {time}</td>
                        <td className={`w-1/5 font-semibold text-${history.tradeType===1?"red-500":"blue-500"}  `}>
                          {history.tradeType===0?"매도":"매수"}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

export default MyAsset;
