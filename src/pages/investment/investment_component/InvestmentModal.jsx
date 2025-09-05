import React, { useState } from "react";
import useScrollLock from "../../../component/useScrollLock";
import { useTheme } from "../../../context/ThemeContext";
import { buyInvestment as api } from "../../../api/investment_api";
import useUser from "../../../lib/useUser";
import { useTranslation } from 'react-i18next';
import { IoInformationCircleOutline } from "react-icons/io5";

function InvestmentModal({
  isOpen,
  onClose,
  projectId,
  minInvestment,
  imageUrl,
  title,
  summary,
  author,
  tokenPrice,
  nickname,
}) {

  const { t } = useTranslation();
  const [hasConfirmed, setHasConfirmed] = useState(false);  
  const [investmentAmount, setInvestmentAmount] = useState(minInvestment || 0);
  const [isLoading, setIsLoading] = useState(false);
  const { themeColors } = useTheme();
  const { user } = useUser();

  //스크롤 방지
  useScrollLock(isOpen);

  if (!isOpen) return null;

  // 모달 외부 클릭 시 닫히도록 설정
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleConfirmChange = (e) => {
    setHasConfirmed(e.target.checked);
  };

  const handleAmountChange = (e) => {
    const value = e.target.value;
    if (value === "") {
      setInvestmentAmount("");
    } else {
      const numValue = parseFloat(value);
      if (!isNaN(numValue)) {
        setInvestmentAmount(numValue);
      }
    }
  };

  // 실제 투자 신청 버튼 클릭
  const handleApplyInvestment = async () => {
    if (!hasConfirmed) {
      alert(t('investment_modal_alert_confirm_info'));
      return;
    }
    
    const minInvestmentValue = minInvestment || 0;
    if (investmentAmount < minInvestmentValue) {
      alert(t('investment_modal_alert_min_investment', { amount: minInvestmentValue.toLocaleString(), unit: t('unit_won') }));
      return;
    }

    // Use email as user identifier since userSeq is not available
    const userIdentifier = user?.email;
    if (!userIdentifier) {
      alert(t('investment_modal_alert_user_info_not_found'));
      return;
    }

    setIsLoading(true);
    
    try {
      const tokenPriceValue = tokenPrice || 1;
      const tokenQuantity = Math.floor(investmentAmount / tokenPriceValue);
      
      const investmentData = {
        userSeq: userIdentifier, // Using email since userSeq is not available
        projectId: projectId,
        investedPrice: investmentAmount,
        tokenQuantity: tokenQuantity
      };

      console.log('Sending investment data:', investmentData);

      const response = await api(investmentData);
      console.log('Investment response:', response);
      
      // Check if investment was successful based on response
      if (response && response.invStatus) {
        const status = response.invStatus;
        if (status === 'FUNDING') {
          alert(t('investment_modal_alert_success_funding', {
            title: title,
            amount: investmentAmount.toLocaleString(),
            tokenQuantity: tokenQuantity,
            unit_won: t('unit_won'),
            unit_ea: t('unit_ea')
          }));
        } else if (status === 'CANCELLED') {
          alert(t('investment_modal_alert_cancelled'));
        } else {
          alert(t('investment_modal_alert_submitted', { status: status }));
        }
      } else {
        alert(t('investment_modal_alert_success_generic', {
          title: title,
          amount: investmentAmount.toLocaleString(),
          tokenQuantity: tokenQuantity,
          unit_won: t('unit_won'),
          unit_ea: t('unit_ea')
        }));
      }

      onClose();

    } catch (error) {
      console.error('Investment error:', error);
      alert(t('investment_modal_alert_error'));
    } finally {
      setIsLoading(false);
    }
  };

  const tokenPriceValue = tokenPrice || 0;
  const expectedTokens = tokenPriceValue > 0 ? investmentAmount / tokenPriceValue : 0; // 예상 토큰 수량 계산

  return (
    <div
      className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50"
      onClick={handleOverlayClick}
    >
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-lg relative animate-fade-in">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-3xl font-bold"
        >
          &times;
        </button>

        <h2 className="text-2xl font-bold mb-4 text-center">{t('investment_modal_title')}</h2>
        <hr className="mb-6" />

        <div className="flex items-start gap-4 mb-6">
          {imageUrl && (
            <div className="flex-shrink-0 w-28 h-28">
              <img
                src={imageUrl}
                alt={t('investment_modal_project_image_alt')}
                className="w-full h-full object-cover rounded-md"
              />
            </div>
          )}
          <div className="flex flex-col flex-grow">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold mb-1">{title}</h3>
              <div className="flex items-center text-sm gap-1">
                <div className="text-[10px]">{t('investment_modal_before_check')}</div>
                <IoInformationCircleOutline className="text-red-500 w-5 h-5" title="주의사항" />
              </div>
            </div>
            <p className="text-gray-600 text-sm mb-2">{t('investment_modal_author_label')}: {nickname}</p>
            <p className="text-gray-700 text-sm overflow-hidden text-ellipsis line-clamp-3">
              {summary}
            </p>
          </div>
        </div>
        <hr className="mb-6" />

        <div className="mb-6">
          <div className="flex justify-between items-center text-lg font-bold mb-2">
            <span className="text-gray-800">{t('investment_modal_token_price_label')}:</span>
            <span className="text-red-600">
              {(tokenPrice || 0).toLocaleString()}{t('unit_won')}
            </span>
          </div>
          <div className="flex justify-between items-center text-base mb-4">
            <span className="text-gray-700">{t('investment_modal_min_investment_label')}:</span>
            <span className="text-blue-600 font-semibold">
              {(minInvestment || 0).toLocaleString()}{t('unit_won')}
            </span>
          </div>

          <div className="flex items-center mt-4 p-3 bg-gray-100 rounded-md">
            <input
              type="checkbox"
              id="hasConfirmed"
              checked={hasConfirmed}
              onChange={handleConfirmChange}
              className="mr-2 h-5 w-5 text-red-600 rounded focus:ring-red-500"
            />
            <label
              htmlFor="hasConfirmed"
              className="text-gray-800 font-semibold cursor-pointer"
            >
              {t('investment_modal_confirm_checkbox_label')}
            </label>
          </div>
        </div>

        <div className="mb-6">
          <label
            htmlFor="investmentAmount"
            className="block text-gray-700 text-base font-bold mb-2"
          >
            {t('investment_modal_investment_amount_label')}:
          </label>
          <input
            type="number"
            id="investmentAmount"
            name="investmentAmount"
            value={investmentAmount}
            onChange={handleAmountChange}
            placeholder={t('investment_modal_investment_amount_placeholder', { unit_won: t('unit_won') })}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            min={minInvestment || 0}
          />
          <p className="text-right text-sm text-gray-500 mt-2">
            {t('investment_modal_expected_tokens_label')}:{" "}
            <span className="font-semibold">{expectedTokens.toFixed(2)}개</span>
          </p>
        </div>

        <div className="flex justify-center space-x-4 mt-6">
          <button
            onClick={handleApplyInvestment}
            disabled={!hasConfirmed || investmentAmount < (minInvestment || 0) || isLoading}
            className={`
                            py-2 px-6 rounded-md font-semibold transition-colors flex-1 max-w-[120px]
                            ${hasConfirmed && investmentAmount >= (minInvestment || 0) && !isLoading
                ? `${themeColors.primaryBg} text-white hover:${themeColors.primaryHover}`
                : `${themeColors.primaryBg} opacity-50 text-gray-100 cursor-not-allowed`
              }
                        `}
          >
            {isLoading ? t('investment_modal_processing_button') : t('investment_modal_apply_button')}
          </button>
          <button
            onClick={onClose}
            disabled={isLoading}
            className="bg-gray-300 text-gray-800 py-2 px-6 rounded-md hover:bg-gray-400 transition-colors font-semibold flex-1 max-w-[120px] disabled:opacity-50"
          >
            {t('investment_modal_cancel_button')}
          </button>
        </div>
      </div>
    </div>
  );
}

export default InvestmentModal;
