import { useState } from "react";
import { FaRegCopy } from "react-icons/fa";
import AssetDepositModal from "./modals/AssetDepositModal";
import AssetWithdrawModal from "./modals/AssetWithdrawModal";
import { toast } from "react-toastify";
import AssetCheckModal from "./modals/AssetCheckModal";

function MyAsset({ account, wallet }) {

  console.log("MyAsset account:", account);
  console.log("MyAsset wallet:", wallet);
  const transactions = [
    {
      date: "07/15/2024",
      amount: "+500.00",
      time: "10:30 AM",
      balance: "$12,500.00",
      type: "입금",
    },
    {
      date: "07/10/2024",
      amount: "+1,000.00",
      time: "02:45 PM",
      balance: "$14,500.00",
      type: "입금",
    },
    {
      date: "07/05/2024",
      amount: "+2,000.00",
      time: "09:15 AM",
      balance: "$13,500.00",
      type: "입금",
    },
    {
      date: "06/28/2024",
      amount: "+800.00",
      time: "04:00 PM",
      balance: "$11,500.00",
      type: "입금",
    },
    {
      date: "06/20/2024",
      amount: "-1,500.00",
      time: "11:00 AM",
      balance: "$12,300.00",
      type: "출금",
    },
    {
      date: "07/15/2024",
      amount: "+500.00",
      time: "10:30 AM",
      balance: "$12,500.00",
      type: "입금",
    },
    {
      date: "07/15/2024",
      amount: "+500.00",
      time: "10:30 AM",
      balance: "$12,500.00",
      type: "입금",
    },
    {
      date: "07/15/2024",
      amount: "+500.00",
      time: "10:30 AM",
      balance: "$12,500.00",
      type: "입금",
    },
    {
      date: "07/15/2024",
      amount: "+500.00",
      time: "10:30 AM",
      balance: "$12,500.00",
      type: "입금",
    },
    {
      date: "07/15/2024",
      amount: "+500.00",
      time: "10:30 AM",
      balance: "$12,500.00",
      type: "입금",
    },
    {
      date: "07/15/2024",
      amount: "+500.00",
      time: "10:30 AM",
      balance: "$12,500.00",
      type: "입금",
    },
    {
      date: "07/15/2024",
      amount: "+500.00",
      time: "10:30 AM",
      balance: "$12,500.00",
      type: "입금",
    },
    {
      date: "07/15/2024",
      amount: "+500.00",
      time: "10:30 AM",
      balance: "$12,500.00",
      type: "입금",
    },
    {
      date: "07/15/2024",
      amount: "+500.00",
      time: "10:30 AM",
      balance: "$12,500.00",
      type: "입금",
    },
    {
      date: "07/15/2024",
      amount: "+500.00",
      time: "10:30 AM",
      balance: "$12,500.00",
      type: "입금",
    },
    {
      date: "07/15/2024",
      amount: "+500.00",
      time: "10:30 AM",
      balance: "$12,500.00",
      type: "입금",
    },
  ];
  const tokenDetails = [
    {
      projectName: "감만유",
      amount: "30",
      time: "02:45 PM",
      date: "07/10/2024",
      tokenNumber: "rnalsdhkswjsqkhajcdjdl",
    },
    {
      projectName: "감만유",
      amount: "30",
      time: "02:45 PM",
      date: "07/10/2024",
      tokenNumber: "rnalsdhkswjsqkhajcdjdl",
    },
    {
      projectName: "감만유",
      amount: "30",
      time: "02:45 PM",
      date: "07/10/2024",
      tokenNumber: "rnalsdhkswjsqkhajcdjdl",
    },
    {
      projectName: "감만유",
      amount: "30",
      time: "02:45 PM",
      date: "07/10/2024",
      tokenNumber: "rnalsdhkswjsqkhajcdjdl",
    },
    {
      projectName: "감만유",
      amount: "30",
      time: "02:45 PM",
      date: "07/10/2024",
      tokenNumber: "rnalsdhkswjsqkhajcdjdl",
    },
    {
      projectName: "감만유",
      amount: "30",
      time: "02:45 PM",
      date: "07/10/2024",
      tokenNumber: "rnalsdhkswjsqkhajcdjdl",
    },

    {
      projectName: "케로로 중사",
      amount: "2,000",
      time: "09:15 AM",
      date: "07/05/2024",
      tokenNumber: "gywnsdlakfantlgkwlak!",
    },
    {
      projectName: "영구와 땡칠이",
      amount: "80",
      time: "04:00 PM",
      date: "06/28/2024",
      tokenNumber: "alsdlmsgodhqrgkekgpgpg",
    },
    {
      projectName: "뽀로로와 친구들",
      amount: "30",
      time: "11:00 AM",
      date: "06/20/2024",
      tokenNumber: "wnsghsmsdhkswjsQkfro",
    },
  ];
  const tokenMarkets = [
    {
      projectName: "감만유",
      amount: "+30",
      time: "02:45 PM",
      date: "07/10/2024",
      tokenNumber: "rnalsdhkswjsqkhajcdjdl",
    },
    {
      projectName: "감만유",
      amount: "+30",
      time: "02:45 PM",
      date: "07/10/2024",
      tokenNumber: "rnalsdhkswjsqkhajcdjdl",
    },
    {
      projectName: "감만유",
      amount: "-30",
      time: "02:45 PM",
      date: "07/10/2024",
      tokenNumber: "rnalsdhkswjsqkhajcdjdl",
    },
    {
      projectName: "감만유",
      amount: "-30",
      time: "02:45 PM",
      date: "07/10/2024",
      tokenNumber: "rnalsdhkswjsqkhajcdjdl",
    },
    {
      projectName: "감만유",
      amount: "-30",
      time: "02:45 PM",
      date: "07/10/2024",
      tokenNumber: "rnalsdhkswjsqkhajcdjdl",
    },
    {
      projectName: "감만유",
      amount: "+30",
      time: "02:45 PM",
      date: "07/10/2024",
      tokenNumber: "rnalsdhkswjsqkhajcdjdl",
    },

    {
      projectName: "케로로 중사",
      amount: "-2,000",
      time: "09:15 AM",
      date: "07/05/2024",
      tokenNumber: "gywnsdlakfantlgkwlak!",
    },
    {
      projectName: "영구와 땡칠이",
      amount: "+80",
      time: "04:00 PM",
      date: "06/28/2024",
      tokenNumber: "alsdlmsgodhqrgkekgpgpg",
    },
    {
      projectName: "뽀로로와 친구들",
      amount: "+30",
      time: "11:00 AM",
      date: "06/20/2024",
      tokenNumber: "wnsghsmsdhkswjsQkfro",
    },
  ];
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
          <h2 className="text-xl font-bold mb-4 mt-12">거래 기록</h2>
          <div className="border-gray-200 border rounded-lg p-6 overflow-x-auto">
            <table className="w-full text-sm rounded-lg">
              <thead className="border-b border-gray-200">
                <tr className="text-gray-500 text-left">
                  <th className="py-2 font-normal w-1/5">Date</th>
                  <th className="font-normal w-1/5">Amount</th>
                  <th className="font-normal w-1/5">Time</th>
                  <th className="font-normal w-1/5">Resulting Balance</th>
                  <th className="font-normal w-1/5">Type</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((transaction, index) => (
                  <tr key={index} className="border-b border-gray-100">
                    <td className="py-4 w-1/5">{transaction.date}</td>
                    <td
                      className={`font-bold w-1/5 ${
                        transaction.amount.startsWith("+")
                          ? "text-red-500"
                          : "text-blue-500"
                      }`}
                    >
                      {transaction.amount}
                    </td>
                    <td className="w-1/5">{transaction.time}</td>
                    <td className="w-1/5">{transaction.balance}</td>
                    <td className="text-red-500 w-1/5">{transaction.type}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 지갑 정보 */}
      {activeTab === "지갑 정보" && (
        <div>
          {/* 토큰 내역 */}
          <h2 className="text-xl font-bold mb-4">토큰 내역</h2>
          <div className="border-gray-200 border rounded-lg p-6 overflow-x-auto mb-6">
            <table className="w-full text-sm rounded-lg">
              <thead className="border-b border-gray-200">
                <tr className="text-gray-500 text-left">
                  <th className="py-2 font-normal w-1/5">Project Name</th>
                  <th className="font-normal w-1/5">Amount</th>
                  <th className="font-normal w-1/5">Time</th>
                  <th className="font-normal w-1/5">Date</th>
                  <th className="font-normal w-1/5">Token Number</th>
                </tr>
              </thead>
              <tbody>
                {tokenDetails.map((token, index) => (
                  <tr key={index} className="border-b border-gray-100">
                    <td className="py-4 w-1/5">{token.projectName}</td>
                    <td className="w-1/5">{token.amount}</td>
                    <td className="w-1/5">{token.time}</td>
                    <td className="w-1/5">{token.date}</td>
                    <td className="text-blue-500 w-1/5">{token.tokenNumber}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* 토큰 거래 기록 */}
          <h2 className="text-xl font-bold mb-4">토큰 거래 기록</h2>
          <div className="border-gray-200 border rounded-lg p-6 overflow-x-auto mb-6">
            <table className="w-full text-sm rounded-lg">
              <thead className="border-b border-gray-200">
                <tr className="text-gray-500 text-left">
                  <th className="py-2 font-normal w-1/5">Project Name</th>
                  <th className="font-normal w-1/5">Amount</th>
                  <th className="font-normal w-1/5">Time</th>
                  <th className="font-normal w-1/5">Date</th>
                  <th className="font-normal w-1/5">Token Number</th>
                </tr>
              </thead>
              <tbody>
                {tokenMarkets.map((token, index) => (
                  <tr key={index} className="border-b border-gray-100">
                    <td className="py-4 w-1/5">{token.projectName}</td>
                    <td
                      className={`font-bold w-1/5 ${
                        token.amount.startsWith("+")
                          ? "text-red-500"
                          : "text-blue-500"
                      }`}
                    >
                      {token.amount}
                    </td>
                    <td className="w-1/5">{token.time}</td>
                    <td className="w-1/5">{token.date}</td>
                    <td className="text-blue-500 w-1/5">{token.tokenNumber}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

export default MyAsset;
