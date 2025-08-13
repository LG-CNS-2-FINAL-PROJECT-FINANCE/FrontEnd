import React from "react";
import { FaFilePdf, FaFileExcel, FaDownload } from "react-icons/fa"; // 파일 타입에 따른 아이콘

function InvestmentFiles({ files }) {
  const getFileIcon = (fileName) => {
    if (fileName.endsWith(".pdf"))
      return <FaFilePdf className="text-red-500" />;
    if (fileName.endsWith(".xlsx") || fileName.endsWith(".xls"))
      return <FaFileExcel className="text-green-500" />;
    return <FaDownload className="text-gray-500" />; // 기본 아이콘
  };

  return (
    <div className="bg-white rounded-lg mt-10">
      <h2 className="text-2xl font-bold mb-4">첨부 파일</h2>
      {files && files.length > 0 ? (
        <ul>
          {files.map((file, index) => (
            <li
              key={index}
              className="flex items-center justify-between py-2 border-b last:border-b-0"
            >
              <div className="flex items-center">
                <span className="mr-3 text-lg">{getFileIcon(file.name)}</span>
                <span className="text-blue-600 hover:underline">
                  {file.name}
                </span>
              </div>
              <a
                href={file.url}
                download={file.name}
                className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm hover:bg-blue-600 flex items-center"
              >
                <FaDownload className="inline-block mr-1" /> 다운로드
              </a>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-600">첨부 파일이 없습니다.</p>
      )}
    </div>
  );
}

export default InvestmentFiles;
