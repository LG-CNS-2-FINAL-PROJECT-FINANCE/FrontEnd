import React from "react";
import { FaFilePdf, FaFileExcel, FaDownload } from "react-icons/fa"; // 파일 타입에 따른 아이콘

function InvestmentFiles({ files }) {
    const getFileIcon = (fileName) => {
        if (!fileName || typeof fileName !== 'string') {
          return <FaDownload className="text-gray-500" />;
        }

        const lowerCaseFileName = fileName.toLowerCase();

        if (lowerCaseFileName.endsWith(".pdf")) {
          return <FaFilePdf className="text-red-500" />;
        }
        if (lowerCaseFileName.endsWith(".xlsx") || lowerCaseFileName.endsWith(".xls")) {
          return <FaFileExcel className="text-green-500" />;
        }
        return <FaDownload className="text-gray-500" />;
    };

  if (!files || !Array.isArray(files) || files.length === 0) {
    return (
        <div className="bg-white rounded-lg mt-10">
          <h2 className="text-2xl font-bold mb-4">첨부 파일</h2>
          <p className="text-gray-600">첨부 파일이 없습니다.</p>
        </div>
    );
  }

  return (
      <div className="bg-white rounded-lg mt-10">
        <h2 className="text-2xl font-bold mb-4">첨부 파일</h2>
        <ul>
          {files.map((file, index) => {
            if (!file || !file.name || typeof file.name !== 'string' || !file.url || typeof file.url !== 'string') {
              console.warn(`[InvestmentFiles] 유효하지 않은 파일 항목 감지 (index: ${index}):`, file);
              return null;
            }

            return (
                <li
                    key={index}
                    className="flex items-center justify-between py-2 border-b last:border-b-0"
                >
                  <div className="flex items-center">
                    <span className="mr-3 text-lg">{getFileIcon(file.name)}</span>
                    <a href={file.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                      {file.name}
                    </a>
                  </div>
                  <a
                      href={file.url}
                      download={file.name}
                      className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm hover:bg-blue-600 flex items-center"
                  >
                    <FaDownload className="inline-block mr-1" /> 상세보기
                  </a>
                </li>
            );
          })}
        </ul>
      </div>
  );
}

export default InvestmentFiles;