import React, { useEffect, useState, useRef, useContext, useMemo } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { AuthContext } from '../../../context/AuthContext';
import { getReports } from '../../../api/report_api';

function getReportKey(r) { /* ... */ return ''; }

export default function ReportManagement() {
    const { accessToken } = useContext(AuthContext);
    const queryClient = useQueryClient();

    const [searchType, setSearchType] = useState('reportNo');
    const [query, setQuery] = useState('');

    const [debouncedQuery, setDebouncedQuery] = useState('');
    const debounceTimeoutRef = useRef(null);

    useEffect(() => {
        if (debounceTimeoutRef.current) {
            clearTimeout(debounceTimeoutRef.current);
        }
        debounceTimeoutRef.current = setTimeout(() => {
            setDebouncedQuery(query.trim());
        }, 400);

        return () => {
            if (debounceTimeoutRef.current) {
                clearTimeout(debounceTimeoutRef.current);
            }
        };
    }, [query]);


    const {
        data,
        isLoading,
        isError,
        error: queryError,
    } = useQuery({
        queryKey: ['reports', { searchType, query: debouncedQuery }],
        queryFn: async ({ queryKey, signal }) => {
            const [, filters] = queryKey;
            if (!accessToken) return { reports: [], total: 0 };

            const options = { signal };
            if (filters.query) {
                options.type = filters.searchType;
                options.q = filters.query;
            }

            return getReports(options);
        },
        enabled: !!accessToken,
        staleTime: 5 * 60 * 1000,
        cacheTime: 10 * 60 * 1000,
        retry: 1,
    });

    const reports = data?.reports || [];
    const total = data?.total ?? 0;
    const error = isError ? (queryError?.message || '알 수 없는 오류가 발생했습니다.') : '';


    const handleSearchClick = () => {
        setDebouncedQuery(query.trim());
    };

    const handleReset = () => {
        setSearchType('reportNo');
        setQuery('');
        setDebouncedQuery('');
    };


    return (
        <div className="flex flex-col h-full min-h-[calc(100vh-4rem)]">
            <div className="p-4 bg-white shadow-sm">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-xl font-semibold mb-1">신고관리</h1>
                        <div className="text-sm text-gray-500">전체: {total ?? '-' }건</div>
                    </div>

                    <div className="flex items-center gap-3 w-full max-w-lg">
                        <select
                            value={searchType}
                            onChange={(e) => setSearchType(e.target.value)}
                            className="px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-300"
                        >
                            <option value="reportNo">신고번호</option>
                            <option value="projectNo">프로젝트번호</option>
                            <option value="reporter">신고자ID</option>
                            <option value="author">작성자ID</option>
                        </select>

                        <input
                            type="search"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="검색어를 입력하세요"
                            className="flex-1 px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-300"
                        />

                        <button
                            onClick={handleSearchClick}
                            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                        >
                            검색
                        </button>
                    </div>
                </div>
            </div>

            <div className="flex-1 p-4 bg-gray-50">
                <div className="bg-white rounded shadow overflow-hidden">
                    <div className="px-4 py-3 border-b flex items-center justify-between">
                        <div className="text-sm text-gray-600">
                            {isLoading ? '로딩 중...' : error ? error : `검색결과: ${reports.length}건`}
                        </div>
                    </div>

                    <div className="max-h-[65vh] overflow-y-auto">
                        <table className="min-w-full table-fixed border-collapse">
                            <thead className="bg-red-500 sticky top-0 z-10">
                            <tr>
                                <th className="w-24 px-4 py-2 text-left text-sm font-medium border-b text-white">신고번호</th>
                                <th className="w-28 px-4 py-2 text-left text-sm font-medium border-b text-white">프로젝트번호</th>
                                <th className="w-48 px-4 py-2 text-left text-sm font-medium border-b text-white">신고자ID</th>
                                <th className="w-48 px-4 py-2 text-left text-sm font-medium border-b text-white">작성자ID</th>
                                <th className="w-40 px-4 py-2 text-left text-sm font-medium border-b text-white">신고유형</th>
                                <th className="w-32 px-4 py-2 text-left text-sm font-medium border-b text-white">처리상태</th>
                            </tr>
                            </thead>

                            <tbody>
                            {isLoading ? (
                                <tr>
                                    <td colSpan="6" className="p-6 text-center text-gray-500">로딩 중입니다...</td>
                                </tr>
                            ) : reports.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="p-6 text-center text-gray-500">표시할 신고가 없습니다.</td>
                                </tr>
                            ) : (
                                reports.map((r) => (
                                    <tr key={getReportKey(r)} className="hover:bg-gray-50">
                                        <td className="px-4 py-3 text-sm border-b">{r.reportNo ?? '-'}</td>
                                        <td className="px-4 py-3 text-sm border-b">{r.projectId ?? '-'}</td>
                                        <td className="px-4 py-3 text-sm border-b">{r.reportId ?? '-'}</td>
                                        <td className="px-4 py-3 text-sm border-b">{r.writerId ?? '-'}</td>
                                        <td className="px-4 py-3 text-sm border-b">{r.reportType ?? '-'}</td>
                                        <td className="px-4 py-3 text-sm border-b">{r.status ?? '-'}</td>
                                    </tr>
                                ))
                            )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}