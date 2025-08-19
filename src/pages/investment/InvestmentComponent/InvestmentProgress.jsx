import React from "react";
import { useTheme } from "../../../context/ThemeContext";

function InvestmentProgress({
  currentAmount,
  minInvestment,
  targetAmount,
  progress,
}) {
  const { themeColors } = useTheme();
  
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("ko-KR", {
      style: "currency",
      currency: "KRW",
    }).format(amount);
  };

  return (
    <div className="bg-white py-6 rounded-lg mb-6">
      <h2 className="text-2xl font-bold mb-4">투자 목표 및 진행</h2>

      <div className="w-full bg-gray-200 rounded-full h-4 mb-3">
        <div
          className={`${themeColors.primaryBg} h-4 rounded-full`}
          style={{ width: `${progress}%` }}
        ></div>
      </div>

      <div className="flex justify-between items-baseline mb-4">
        <span className={`text-xl font-bold ${themeColors.primaryText}`}>{progress}%</span>
        <span className="text-sm text-gray-500">
          목표: {formatCurrency(targetAmount)}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-4 text-sm text-gray-700">
        <div>
          현재 유치 금액:{" "}
          <span className="font-semibold">{formatCurrency(currentAmount)}</span>
        </div>
        <div className="text-right">
          최소 투자 금액:{" "}
          <span className="font-semibold">{formatCurrency(minInvestment)}</span>
        </div>
      </div>
    </div>
  );
}

export default InvestmentProgress;
