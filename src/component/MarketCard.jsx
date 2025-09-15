import { Link } from "react-router-dom";

function MarketCard({ project }) {
  return (
    <Link
      to={`/market/${project.projectId}`}
      className="w-full h-full bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg hover:scale-105 transition-all duration-300"
    >
      {/* 이미지 */}
      <div className="h-40 bg-gray-300 flex items-center justify-center text-gray-500 text-sm">
        {project.image ? (
          <img
            src={project.image[0]}
            alt={project.title}
            className="object-cover w-full h-full"
          />
        ) : (
          "이미지 없음"
        )}
      </div>

      {/* 텍스트 */}
      <div className="p-4">
        <div className="font-bold text-lg mb-1 truncate">{project.title}</div>
        <div className="flex items-center">
          <span>{"최근 거래가 :"}</span>
          <div className="ml-2 text-sm text-gray-700">{project.tradePrice ? project.tradePrice : "-"} 원</div>
        </div>
          
      </div>
    </Link>
  );
}

export default MarketCard;
