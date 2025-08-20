import React, { useEffect, useState, useRef, useContext } from "react";
import { getPosts } from "../../../api/project_api";
import dayjs from "dayjs";
import { AuthContext } from "../../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";

import PostDetailModal from "../postManagement/PostDetailModal";

export default function PostManagement() {
  const { accessToken, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [searchType, setSearchType] = useState("requestId");
  const [query, setQuery] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [status, setStatus] = useState("ALL");
  const [title, setTitle] = useState("");

  const [page, setPage] = useState(1);
  const [size, setSize] = useState(20);

  const debounceTimeoutRef = useRef(null);

  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);

  const {
    data,
    isLoading: isInitialLoading,
    isFetching,
    isError: hasError,
    error: queryError,
    refetch,
  } = useQuery({
    queryKey: [
      "posts",
      { page, size, searchType, query, startDate, endDate, status, title },
    ],
    queryFn: async ({ queryKey, signal }) => {
      const [_key, filters] = queryKey;
      if (!accessToken) {
        return { posts: [], total: 0 };
      }
      console.log(
        "[PostManagement - useQuery] getPosts 호출 파라미터:",
        filters
      );
      return getPosts({ ...filters, signal });
    },
    enabled: !!accessToken,
    keepPreviousData: true,
  });

  const posts = data?.posts || [];
  const total = data?.total || 0;
  const isLoading = isInitialLoading || isFetching;
  const error = hasError
    ? queryError?.message || "알 수 없는 오류가 발생했습니다."
    : "";

  useEffect(() => {
    if (!accessToken) {
    }
  }, [accessToken]);

  useEffect(() => {
    if (!accessToken) return;

    const allSearchFieldsEmpty =
      !query.trim() &&
      !title.trim() &&
      !startDate &&
      !endDate &&
      status === "ALL";

    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    debounceTimeoutRef.current = setTimeout(() => {
      const currentQueryKeyFilters = {
        page: 1,
        size,
        searchType,
        query: query.trim(),
        startDate,
        endDate,
        status,
        title: title.trim(),
      };
      if (allSearchFieldsEmpty) {
        queryClient.invalidateQueries([
          "posts",
          {
            page: 1,
            size,
            searchType,
            query: "",
            startDate: "",
            endDate: "",
            status: "ALL",
            title: "",
          },
        ]);
      } else {
        queryClient.invalidateQueries(["posts", currentQueryKeyFilters]);
      }
    }, 400);

    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, [
    query,
    searchType,
    startDate,
    endDate,
    status,
    title,
    accessToken,
    page,
    size,
  ]);

  // <<<< 모달 제어를 위한 핸들러
  const handleRowClick = (post) => {
    console.log("게시물 클릭됨:", post.requestId);
    setSelectedPost(post);
    setIsDetailModalOpen(true);
  };

  const handleModalClose = () => {
    setIsDetailModalOpen(false);
    setSelectedPost(null);
  };

  const handleStatusChange = (requestId, newStatus) => {
    queryClient.invalidateQueries(["posts"]);
    handleModalClose();
  };

  const handleSearchClick = () => {
    setPage(1);
  };
  const handleReset = () => {
    setQuery("");
    setStartDate("");
    setEndDate("");
    setStatus("ALL");
    setTitle("");
    setPage(1);
  };
  const handlePrev = () => {
    if (page <= 1) return;
    setPage(page - 1);
  };
  const handleNext = () => {
    const maxPage = Math.max(1, Math.ceil((total ?? 0) / size));
    if (page >= maxPage) return;
    setPage(page + 1);
  };

  return (
    <div className="flex flex-col h-full min-h-[calc(100vh-4rem)]">
      {/* 상단 검색영역 */}
      <div className="p-4 bg-white shadow-sm">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
          <div>
            <h1 className="text-xl font-semibold mb-1">게시물관리</h1>
            <div className="text-sm text-gray-500">전체: {total ?? "-"}건</div>
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full max-w-4xl">
            <select
              value={searchType}
              onChange={(e) => setSearchType(e.target.value)}
              className="w-36 px-3 py-2 border rounded"
            >
              <option value="requestId">게시물번호</option>
              <option value="userNo">사용자번호</option>
            </select>

            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={`${
                searchType === "requestId" ? "게시물번호" : "사용자번호"
              } 검색`}
              className="flex-1 min-w-0 px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-300"
            />

            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="제목 검색"
              className="flex-1 min-w-0 px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-300"
            />

            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="px-3 py-2 border rounded"
              aria-label="시작일자"
            />
            <div className="px-1">~</div>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="px-3 py-2 border rounded"
              aria-label="종료일자"
            />

            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-36 px-3 py-2 border rounded"
            >
              <option value="ALL">전체상태</option>
              <option value="PUBLISHED">게시됨</option>
              <option value="DRAFT">임시저장</option>
              <option value="DELETED">삭제</option>
            </select>

            <button
              onClick={handleSearchClick}
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            >
              검색
            </button>
            <button
              onClick={handleReset}
              className="px-3 py-2 border rounded text-sm"
            >
              초기화
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 p-4 bg-gray-50">
        <div className="bg-white rounded shadow overflow-hidden">
          <div className="px-4 py-3 border-b flex items-center justify-between">
            <div className="text-sm text-gray-600">
              {isLoading
                ? "로딩 중..."
                : error
                ? `에러: ${error}`
                : `검색결과: ${posts.length}건`}
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handlePrev}
                disabled={page <= 1 || isLoading}
                className="px-2 py-1 border rounded"
              >
                이전
              </button>
              <span className="text-sm"> {page} </span>
              <button
                onClick={handleNext}
                disabled={
                  isLoading ||
                  (total !== null && page >= Math.ceil(total / size))
                }
                className="px-2 py-1 border rounded"
              >
                다음
              </button>
              <select
                value={size}
                onChange={(e) => {
                  setSize(Number(e.target.value));
                  setPage(1);
                  // 상태만 업데이트하면 useQuery가 감지하여 자동으로 다시 가져옵니다.
                }}
                className="ml-2 px-2 py-1 border rounded"
              >
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
              </select>
            </div>
          </div>

          <div className="max-h-[65vh] overflow-y-auto">
            <table className="min-w-full table-fixed border-collapse">
              <thead className="bg-red-500 sticky top-0 z-10">
                <tr>
                  <th className="w-28 px-4 py-2 text-left text-sm font-medium border-b text-white">
                    게시물번호
                  </th>
                  <th className="w-28 px-4 py-2 text-left text-sm font-medium border-b text-white">
                    사용자번호
                  </th>
                  <th className="w-28 px-4 py-2 text-left text-sm font-medium border-b text-white">
                    제목
                  </th>
                  <th className="w-40 px-4 py-2 text-left text-sm font-medium border-b text-white">
                    시작일자
                  </th>
                  <th className="w-40 px-4 py-2 text-left text-sm font-medium border-b text-white">
                    종료일자
                  </th>
                  <th className="w-32 px-4 py-2 text-left text-sm font-medium border-b text-white">
                    게시물상태
                  </th>
                  <th className="w-32 px-4 py-2 text-left text-sm font-medium border-b text-white">
                    상태
                  </th>
                </tr>
              </thead>

              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan="6" className="p-6 text-center text-gray-500">
                      로딩 중입니다...
                    </td>
                  </tr>
                ) : posts.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="p-6 text-center text-gray-500">
                      표시할 게시물이 없습니다.
                    </td>
                  </tr>
                ) : (
                  posts.map((p) => (
                    <tr
                      key={getPostKey(p)}
                      onClick={() => handleRowClick(p)}
                      className={`${
                        p.status === "APPROVED" || p.status === "REJECTED"
                          ? "cursor-default bg-gray-100 text-gray-500"
                          : "hover:bg-gray-50 cursor-pointer"
                      }`}
                    >
                      <td className="px-4 py-3 text-sm border-b">
                        {p.requestId ?? p.id ?? "-"}
                      </td>
                      <td className="px-4 py-3 text-sm border-b">
                        {p.userNo ?? p.userId ?? "-"}
                      </td>
                      <td className="px-4 py-3 text-sm border-b">
                        {p.title ?? "-"}
                      </td>
                      <td className="px-4 py-3 text-sm border-b">
                        {formatDate(p.startDate) ?? "-"}
                      </td>
                      <td className="px-4 py-3 text-sm border-b">
                        {formatDate(p.endDate) ?? "-"}
                      </td>
                      <td className="px-4 py-3 text-sm border-b">
                        {p.status ?? "-"}
                      </td>
                      <td className="px-4 py-3 text-sm border-b">
                        {p.type ?? "-"}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {isDetailModalOpen && (
        <PostDetailModal
          open={isDetailModalOpen}
          onClose={handleModalClose}
          post={selectedPost}
          onStatusChange={handleStatusChange}
        />
      )}
    </div>
  );
}

function getPostKey(p) {
  // Math.random() 대신 유일한 ID 사용을 권장합니다.
  return (
    p.requestId ||
    p.id ||
    p._id ||
    `temp-${Math.random().toString(36).slice(2, 9)}`
  );
}

function formatDate(d) {
  if (!d) return null;
  try {
    const date = typeof d === "number" ? new Date(d) : new Date(d);
    if (isNaN(date.getTime())) return d;
    return dayjs(date).format("YYYY-MM-DD");
  } catch (e) {
    return d;
  }
}
