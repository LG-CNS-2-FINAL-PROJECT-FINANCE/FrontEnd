import React from "react";
import { useTheme } from "../../../context/ThemeContext";
import { useTranslation } from 'react-i18next';
import { FaChartLine, FaBullseye, FaCoins, FaWallet } from "react-icons/fa";
import useUser from '../../../lib/useUser'

function InvestmentProgress({
  currentAmount,
  minInvestment,
  targetAmount,
  progress,
  deadline,
}) {
    const { t } = useTranslation();
  const { themeColors } = useTheme();
  
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("ko-KR", {
      style: "currency",
      currency: "KRW",
    }).format(amount);
  };

  const { user } = useUser();

  // Calculate progress animation delay
  const progressBarWidth = Math.min(progress, 100);
  const isNearCompletion = progress >= 80;
  const progressColor =
      user?.role === "USER"
          ? "from-red-500 to-red-600"    // USER → 빨강
          : user?.role === "CREATOR"
              ? "from-blue-500 to-blue-600"  // CREATOR → 파랑
              : "from-gray-400 to-gray-500";

  // Determine status based on deadline value
  let investmentStatus;
  let statusColor;
  
  if (deadline >= 1) {
    investmentStatus = '투자 진행중';
    statusColor = 'bg-blue-100 text-blue-700';
  } else if (deadline === 0) {
    investmentStatus = '투자 마감일';
    statusColor = 'bg-orange-100 text-orange-700';
  } else if (deadline < 0) {
    investmentStatus = '투자 모집 종료';
    statusColor = 'bg-red-100 text-red-700';
  } else {
    // Fallback for undefined/null deadline
    investmentStatus = '투자 진행중';
    statusColor = 'bg-blue-100 text-blue-700';
  }

  return (
    <div className="bg-white border-2 border-gray-100 rounded-xl overflow-hidden mb-8">
      {/* Header Section - Different design from Description */}
      <div className="bg-gray-50 border-b border-gray-200 px-8 py-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white rounded-lg border border-gray-200">
              <FaChartLine className="text-blue-600 text-xl" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800">{t('investment_progress_title')}</h2>
              <p className="text-sm text-gray-600">실시간 투자 현황</p>
            </div>
          </div>
          <div className={`px-4 py-2 rounded-lg text-sm font-medium ${statusColor}`}>
            {investmentStatus}
          </div>
        </div>
      </div>

      <div className="p-8">
        {/* Progress Bar Section */}
        <div className="mb-8">
          <div className="relative">
            {/* Background Track */}
            <div className="w-full bg-gray-200 rounded-full h-6 shadow-inner">
              {/* Animated Progress Bar */}
              <div
                className={`bg-gradient-to-r ${progressColor} h-6 rounded-full transition-all duration-1000 ease-out shadow-lg relative overflow-hidden`}
                style={{ width: `${progressBarWidth}%` }}
              >
                {/* Shimmer Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse"></div>
                
                {/* Progress Indicator */}
                {progress > 10 && (
                  <div className="absolute right-2 top-1/2 -translate-y-1/2">
                    <span className="text-white text-xs font-bold drop-shadow-lg">
                      {progress.toFixed(1)}%
                    </span>
                  </div>
                )}
              </div>
            </div>
            
            {/* External Progress Percentage (when bar is too small) */}
            {progress <= 10 && (
              <div className="absolute -top-8 left-0">
                <span className={`text-lg font-bold bg-gradient-to-r ${progressColor} bg-clip-text text-transparent`}>
                  {progress.toFixed(1)}%
                </span>
              </div>
            )}
          </div>

          {/* Progress Status Text */}
          <div className="flex justify-between items-center mt-4">
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${progressColor}`}></div>
              <span className="text-sm font-medium text-gray-600">
                {investmentStatus}
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <FaBullseye className="text-purple-500" />
              <span>{t('investment_progress_target')}</span>
              <span className="font-bold text-gray-700">{formatCurrency(targetAmount)}</span>
            </div>
          </div>
        </div>

        {/* Investment Details Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Current Amount Card */}
          <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-6 hover:border-blue-300 transition-all duration-300 group">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 rounded-lg group-hover:scale-105 transition-transform duration-300">
                <FaCoins className="text-blue-600 text-2xl" />
              </div>
              <div>
                <p className="text-sm font-medium text-blue-600 mb-1">
                  {t('investment_progress_current_amount')}
                </p>
                <p className="text-2xl font-bold text-blue-800">
                  {formatCurrency(currentAmount)}
                </p>
              </div>
            </div>
          </div>

          {/* Minimum Investment Card */}
          <div className="bg-purple-50 border-2 border-purple-200 rounded-lg p-6 hover:border-purple-300 transition-all duration-300 group">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-purple-100 rounded-lg group-hover:scale-105 transition-transform duration-300">
                <FaWallet className="text-purple-600 text-2xl" />
              </div>
              <div>
                <p className="text-sm font-medium text-purple-600 mb-1">
                  {t('investment_progress_min_investment')}
                </p>
                <p className="text-2xl font-bold text-purple-800">
                  {formatCurrency(minInvestment)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Achievement Badge (when near completion) */}
        {isNearCompletion && (
          <div className="mt-6 bg-green-50 border-2 border-green-200 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-full">
                <FaBullseye className="text-green-700 text-lg" />
              </div>
              <div>
                <p className="font-bold text-green-800">목표 달성이 가까워졌습니다!</p>
                <p className="text-sm text-green-600">
                  남은 금액: {formatCurrency(targetAmount - currentAmount)}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Investment Statistics */}
        <div className="mt-6 bg-gray-50 border border-gray-200 rounded-lg p-6">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="p-4 bg-white rounded-lg border border-gray-200">
              <p className="text-2xl font-bold text-gray-800">{progress.toFixed(1)}%</p>
              <p className="text-sm text-gray-600">진행률</p>
            </div>
            <div className="p-4 bg-white rounded-lg border border-gray-200">
              <p className="text-2xl font-bold text-gray-800">
                {((currentAmount / targetAmount) * 100).toFixed(0)}%
              </p>
              <p className="text-sm text-gray-600">달성률</p>
            </div>
            <div className="p-4 bg-white rounded-lg border border-gray-200">
              <p className="text-2xl font-bold text-gray-800">
                {Math.max(0, Math.ceil((targetAmount - currentAmount) / minInvestment))}
              </p>
              <p className="text-sm text-gray-600">남은 투자자</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default InvestmentProgress;
