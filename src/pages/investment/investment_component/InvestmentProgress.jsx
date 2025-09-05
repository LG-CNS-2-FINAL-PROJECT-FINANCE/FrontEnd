import React from "react";
import { useTheme } from "../../../context/ThemeContext";
import { useTranslation } from 'react-i18next';

function InvestmentProgress({
  currentAmount,
  minInvestment,
  targetAmount,
  progress,
}) {
    const { t } = useTranslation();
  const { themeColors } = useTheme();
  
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("ko-KR", {
      style: "currency",
      currency: "KRW",
    }).format(amount);
  };

  return (
    <div className="bg-white py-6 rounded-lg mb-6">
      <h2 className="text-2xl font-bold mb-4">{t('investment_progress_title')}</h2>

      <div className="w-full bg-gray-200 rounded-full h-4 mb-3">
        <div
          className={`${themeColors.primaryBg} h-4 rounded-full`}
          style={{ width: `${progress}%` }}
        ></div>
      </div>

      <div className="flex justify-between items-baseline mb-4">
        <span className={`text-xl font-bold ${themeColors.primaryText}`}>{progress}%</span>
          <span className="text-sm text-gray-500">
          {t('investment_progress_target')}
              <span className="font-semibold">{formatCurrency(targetAmount)}</span>
        </span>
      </div>

      <div className="grid grid-cols-2 gap-4 text-sm text-gray-700">
        <div>
            {t('investment_progress_current_amount')}{" "}
          <span className="font-semibold">{formatCurrency(currentAmount)}</span>
        </div>
        <div className="text-right">
            {t('investment_progress_min_investment')}{" "}
          <span className="font-semibold">{formatCurrency(minInvestment)}</span>
        </div>
      </div>
    </div>
  );
}

export default InvestmentProgress;
