import React, { useEffect, useState, useRef } from 'react';
import api from '../../api/axiosInstance'; // 프로젝트 구조에 맞춰 경로 조정

function ReportActionModal({ open, onClose, report, onCompleted }) {
    const [loading, setLoading] = useState(false);
    const [err, setErr] = useState('');

    if (!open || !report) return null;

    const reportId = report.reportNo ?? report.id ?? report.reportId;

    const updateStatus = async (newStatus) => {
        setErr('');
        setLoading(true);
        try {
            // 서버 API 경로/페이로드는 백엔드 규격에 맞게 조정하세요.
            // 예시: POST /reports/{id}/status  { status: 'RESOLVED' }
            const res = await api.post(`/reports/${reportId}/status`, { status: newStatus });
            onCompleted && onCompleted(newStatus, res.data);
            onClose();
        } catch (e) {
            console.error('status update error', e);
            setErr(e?.response?.data?.message || '처리 중 오류가 발생했습니다.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div role="dialog" aria-modal="true" className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
            <div className="bg-white w-full max-w-lg rounded shadow-lg overflow-hidden">
                <div className="p-4 border-b">
                    <h3 className="text-lg font-medium">신고 처리 — 신고번호: {reportId}</h3>
                    <p className="text-sm text-gray-500 mt-1">{report.reportType ?? report.type ?? '신고유형 없음'}</p>
                </div>

                <div className="p-4 space-y-3">
                    {err && <div className="text-sm text-red-600">{err}</div>}

                    <div className="text-sm text-gray-700">
                        <div><strong>신고자:</strong> {report.reporter ?? '-'}</div>
                        <div><strong>작성자(피신고자):</strong> {report.author ?? '-'}</div>
                        <div className="mt-2"><strong>내용 요약:</strong></div>
                        <div className="p-2 bg-gray-50 rounded text-sm text-gray-600">{report.summary ?? report.content ?? '요약 없음'}</div>
                    </div>

                    <div className="flex gap-2 mt-3">
                        <button onClick={() => updateStatus('PENDING')} disabled={loading} className="flex-1 py-2 px-3 bg-yellow-500 hover:bg-yellow-600 text-white rounded">대기</button>
                        <button onClick={() => updateStatus('IN_PROGRESS')} disabled={loading} className="flex-1 py-2 px-3 bg-blue-500 hover:bg-blue-600 text-white rounded">처리중</button>
                        <button onClick={() => updateStatus('RESOLVED')} disabled={loading} className="flex-1 py-2 px-3 bg-green-500 hover:bg-green-600 text-white rounded">해결</button>
                        <button onClick={() => updateStatus('REJECTED')} disabled={loading} className="flex-1 py-2 px-3 bg-red-500 hover:bg-red-600 text-white rounded">기각</button>
                    </div>

                    <div className="flex justify-end gap-2 mt-2">
                        <button onClick={onClose} className="py-2 px-3 text-sm text-gray-600 hover:underline">닫기</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function ReportManagement() {
    const [reports, setReports] = useState([]);
    const [total, setTotal] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [searchType, setSearchType] = useState('reportNo'); // 예시: reportNo, projectNo, reporter
    const [query, setQuery] = useState('');
    const debounceRef = useRef(null);

    const [selectedReport, setSelectedReport] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);

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
        try {
            const params = {};
            if (q) {
                params.type = searchType;
                params.q = q;
            }
            // 백엔드 API 경로를 실제 규격에 맞게 변경하세요.
            const res = await api.get('/reports', { params });
            const payload = res.data;
            const list = parseResponseToList(payload);
            setReports(list);
            setTotal(payload.total ?? list.length);
        } catch (e) {
            console.error('fetchReports error', e);
            setError('신고 목록을 불러오는 중 오류가 발생했습니다.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReports();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (debounceRef.current) clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(() => {
            fetchReports(query.trim());
        }, 400);
        return () => {
            if (debounceRef.current) clearTimeout(debounceRef.current);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [query, searchType]);

    const handleRowClick = (r) => {
        setSelectedReport(r);
        setModalOpen(true);
    };

    const handleModalClose = () => {
        setModalOpen(false);
        setSelectedReport(null);
    };

    const handleActionCompleted = (newStatus, data) => {
        // 간단히 전체 재조회하거나, 개별 항목만 상태 변경해도 됩니다.
        fetchReports(query.trim());
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
                        <select value={searchType} onChange={(e) => setSearchType(e.target.value)} className="px-3 py-2 border rounded">
                            <option value="reportNo">신고번호</option>
                            <option value="projectNo">프로젝트번호</option>
                            <option value="reporter">신고자</option>
                            <option value="author">작성자</option>
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
                                <th className="w-48 px-4 py-2 text-left text-sm font-medium border-b">신고자</th>
                                <th className="w-48 px-4 py-2 text-left text-sm font-medium border-b">작성자</th>
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
                                    <tr key={getReportKey(r)} className="hover:bg-gray-50 cursor-pointer" onClick={() => handleRowClick(r)}>
                                        <td className="px-4 py-3 text-sm border-b">{r.reportNo ?? r.id ?? '-'}</td>
                                        <td className="px-4 py-3 text-sm border-b">{r.projectNo ?? r.projectId ?? '-'}</td>
                                        <td className="px-4 py-3 text-sm border-b">{r.reporter ?? r.reporterEmail ?? '-'}</td>
                                        <td className="px-4 py-3 text-sm border-b">{r.author ?? r.owner ?? '-'}</td>
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

            <ReportActionModal open={modalOpen} onClose={handleModalClose} report={selectedReport} onCompleted={handleActionCompleted} />
        </div>
    );
}

// 유틸
function getReportKey(r) {
    return r.reportNo ?? r.id ?? r._id ?? `${r.projectNo}-${r.reporter}` ?? Math.random().toString(36).slice(2,9);
}
