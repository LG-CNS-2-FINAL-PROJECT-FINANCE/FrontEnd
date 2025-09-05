import React from 'react';
import { FaPlus } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import InvestmentCard from '../../component/InvestmentCard';
import formatAmount from '../../lib/formatAmount';
import calculateDday from '../../lib/calculateDday';
import { useTranslation } from 'react-i18next';

function TopProjectsSection({ projectsByView, projectsByViewLoading, projectsByViewError }) {

    const { t } = useTranslation();

  // 데이터 형태 방어 (react-query 응답 또는 바로 배열)
  const list = Array.isArray(projectsByView?.data)
    ? projectsByView.data
    : Array.isArray(projectsByView)
    ? projectsByView
    : [];

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mt-4 mb-8">
        <span className="text-xl font-bold">{t('top_projects_section_title')}</span>
        <Link to="/investment">
          <FaPlus className="text-gray-500 hover:text-gray-700 cursor-pointer mr-2" />
        </Link>
      </div>

      {/* 로딩 스켈레톤 */}
      {projectsByViewLoading && (
        <div className="grid grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="rounded-xl border border-gray-200 p-3 animate-pulse"
            >
              <div className="w-full h-32 bg-gray-200 rounded mb-3" />
              <div className="h-6 bg-gray-200 rounded mb-2" />
              <div className="h-6 bg-gray-200 rounded w-2/3" />
            </div>
          ))}
        </div>
      )}

      {/* 에러 */}
      {projectsByViewError && !projectsByViewLoading && (
        <div className="border rounded-xl p-8 text-center text-sm text-red-500">
            {t('top_projects_section_view_data_error')}
        </div>
      )}

      {/* 빈 상태 */}
      {!projectsByViewLoading && !projectsByViewError && list.length === 0 && (
        <div className="border rounded-xl p-8 text-center text-sm text-gray-400">
            {t('top_projects_section_no_data')}
        </div>
      )}

      {/* 정상 데이터 */}
      {!projectsByViewLoading && !projectsByViewError && list.length > 0 && (
        <div className="grid grid-cols-3 gap-6">
          {list.map(investment => (
            <InvestmentCard
                key={investment.projectId}
                imageUrl={investment.image}
                project={{
                    projectId: investment.projectId,
                    name: investment.title,
                    amount: formatAmount(investment.amount),
                    dday: calculateDday(investment.deadline, t),
                    progress: investment.percent,
                    // imageUrl: investment.imageUrl,
                    views: investment.viewCount,
                    status: investment.state,
                    startDate : investment.startDate,
                }}
            />
))}
        </div>
      )}
    </div>
  );
}

export default TopProjectsSection;