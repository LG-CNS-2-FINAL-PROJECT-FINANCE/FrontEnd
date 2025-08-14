import React, { useEffect, useState, useRef, useContext } from 'react';
import api from '../../api/axiosInstance';
import { AuthContext } from '../../context/AuthContext';

export default function ReportManagement() {
    const { accessToken } = useContext(AuthContext); // 인증 필요 시
    const [reports, setReports] = useState([]);
    const [total, setTotal] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [searchType, setSearchType] = useState('reportNo'); // reportNo | projectNo | reporter | author
    const [query, setQuery] = useState('');
    const debounceRef = useRef(null);
    const abortRef = useRef(null);

    const parseResponseToList = (data) => {
        if (!data) return [];
        if (Array.isArray(data)) return data;
        if (data.reports) return data.reports;
        if (data.data && Array.isArray(data.data)) return data.data;
        return [];
    };

    const fetchReports = async (q = '') => {
        setLoading(true);
        setError('');
        // 토큰이 필요하면 검사
        try {
            const params = {};
            if (q) {
                params.type = searchType;
                params.q = q;
            }

            // 이전 요청 취소
            if (abortRef.current) {
                try { abortRef.current.abort(); } catch (e) {}
            }
            const controller = new AbortController();
            abortRef.current = controller;

            const headers = {};
            if (accessToken) headers.Authorization = `Bearer ${accessToken}`;

            const res = await api.get('/monitoring/report', {
                params,
                headers,
                signal: controller.signal,
            });

            const payload = res.data;
            const list = parseResponseToList(payload);
            setReports(list);
            setTotal(payload.total ?? list.length);
        } catch (e) {
            if (e.name === 'CanceledError' || e?.message === 'canceled') {
                return;
            }
            console.error('fetchReports error', e);
            const status = e?.response?.status;
            if (status === 401 || status === 403) {
                setError('권한이 없거나 인증이 필요합니다. 다시 로그인하세요.');
            } else {
                setError('신고 목록을 불러오는 중 오류가 발생했습니다.');
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReports();
        return () => {
            if (abortRef.current) {
                try { abortRef.current.abort(); } catch (e) {}
            }
        };
    }, [accessToken]);

    useEffect(() => {
        if (debounceRef.current) clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(() => {
            fetchReports(query.trim());
        }, 400);
        return () => {
            if (debounceRef.current) clearTimeout(debounceRef.current);
        };
    }, [query, searchType, accessToken]);

    return (
        <div className="flex flex-col h-full min-h-[calc(100vh-4rem)]">
            <div className="p-4 bg-white shadow-sm">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-xl font-semibold mb-1">신고관리</h1>
                        <div className="text-sm text-gray-500">전체: {total ?? '-' }건</div>
                    </div>

                    <div className="flex items-center gap-3 w-full max-w-lg">
                        <select value={searchType} onChange={(e) => setSearchType(e.target.value)} className="px-3 py-2 border rounded">
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

                        <button onClick={() => fetchReports(query.trim())} className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600">검색</button>
                    </div>
                </div>
            </div>

            <div className="flex-1 p-4 bg-gray-50">
                <div className="bg-white rounded shadow overflow-hidden">
                    <div className="px-4 py-3 border-b flex items-center justify-between">
                        <div className="text-sm text-gray-600">{loading ? '로딩 중...' : error ? error : `검색결과: ${reports.length}건`}</div>
                    </div>

                    <div className="max-h-[65vh] overflow-y-auto">
                        <table className="min-w-full table-fixed border-collapse">
                            <thead className="bg-gray-100 sticky top-0 z-10">
                            <tr>
                                <th className="w-24 px-4 py-2 text-left text-sm font-medium border-b">신고번호</th>
                                <th className="w-28 px-4 py-2 text-left text-sm font-medium border-b">프로젝트번호</th>
                                <th className="w-48 px-4 py-2 text-left text-sm font-medium border-b">신고자ID</th>
                                <th className="w-48 px-4 py-2 text-left text-sm font-medium border-b">작성자ID</th>
                                <th className="w-40 px-4 py-2 text-left text-sm font-medium border-b">신고유형</th>
                                <th className="w-32 px-4 py-2 text-left text-sm font-medium border-b">처리상태</th>
                            </tr>
                            </thead>

                            <tbody>
                            {reports.length === 0 && !loading ? (
                                <tr>
                                    <td colSpan="6" className="p-6 text-center text-gray-500">표시할 신고가 없습니다.</td>
                                </tr>
                            ) : (
                                reports.map((r) => (
                                    <tr key={getReportKey(r)} className="hover:bg-gray-50">
                                        <td className="px-4 py-3 text-sm border-b">{r.reportNo ?? r.id ?? '-'}</td>
                                        <td className="px-4 py-3 text-sm border-b">{r.projectNo ?? r.projectId ?? '-'}</td>
                                        <td className="px-4 py-3 text-sm border-b">{r.reporter ?? r.reporterId ?? '-'}</td>
                                        <td className="px-4 py-3 text-sm border-b">{r.author ?? r.authorId ?? '-'}</td>
                                        <td className="px-4 py-3 text-sm border-b">{r.reportType ?? r.type ?? '-'}</td>
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

// util
function getReportKey(r) {
    return r.reportNo ?? r.id ?? r._id ?? `${r.projectNo}-${r.reporter}` ?? Math.random().toString(36).slice(2,9);
}