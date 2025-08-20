import React, { useEffect, useState, useRef, useContext } from "react";
import { getPosts } from "../../../api/project_api";
import dayjs from "dayjs";
import { AuthContext } from "../../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";

import PostDetailModal from "../postManagement/PostDetailModal"; // 모달 컴포넌트 임포트

export default function PostManagement() {
  const { accessToken, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // const [posts, setPosts] = useState([]);
  // const [total, setTotal] = useState(null);
  // const [loading, setLoading] = useState(false);
  // const [error, setError] = useState('');

  const [searchType, setSearchType] = useState("postNo");
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

  // <<<< useQuery 훅으로 데이터 페칭 로직 통합
  const {
    data,
    isLoading: isInitialLoading, // 쿼리가 데이터가 없고 처음 로드될 때 (true)
    isFetching, // 쿼리가 어떤 이유로든 데이터를 가져오는 중일 때 (true)
    isError: hasError, // 쿼리 에러 발생 여부 (true)
    error: queryError, // 쿼리 에러 객체
    refetch, // 쿼리를 수동으로 다시 실행하는 함수
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

  // <<<< useQuery에서 받은 데이터와 상태를 컴포넌트에서 사용하기 편리하게 재정의
  const posts = data?.posts || [];
  const total = data?.total || 0;
  const isLoading = isInitialLoading || isFetching; // <<<< 수정: `isInitialLoading`과 `isFetching`을 조합하여 로딩 상태 정의
  const error = hasError
    ? queryError?.message || "알 수 없는 오류가 발생했습니다."
    : "";

  // <<<< 기존 useEffect에서 불필요한 setPosts/setTotal/setLoading 호출 제거
  useEffect(() => {
    // accessToken이 null이 되면 useQuery의 enabled 옵션에 의해 API 호출이 중단되고
    // posts와 total은 data 객체에서 자동으로 []와 0으로 처리됩니다.
    if (!accessToken) {
      // 여기에 setPosts/setTotal/setLoading을 직접 호출할 필요가 없습니다.
      // UI는 isLoading과 posts, total 값에 따라 자동으로 업데이트됩니다.
    }
    // 이 useEffect는 accessToken이 변경될 때 useQuery가 다시 실행되도록 트리거하는 역할을 합니다.
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
    console.log("게시물 클릭됨:", post.postNo);
    setSelectedPost(post);
    setIsDetailModalOpen(true);
  };

  const handleModalClose = () => {
    setIsDetailModalOpen(false);
    setSelectedPost(null);
  };

  const handleStatusChange = (postNo, newStatus) => {
    queryClient.invalidateQueries(["posts"]); // 'posts' 쿼리 전체를 무효화하여 데이터를 다시 가져옴
    handleModalClose(); // 모달 닫기
  };

  // 검색/리셋/페이징 핸들러: 상태만 업데이트하고 useQuery가 변경을 감지하여 API 호출
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
              <option value="postNo">게시물번호</option>
              <option value="userNo">사용자번호</option>
            </select>

            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={`${
                searchType === "postNo" ? "게시물번호" : "사용자번호"
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

      {/* 테이블 영역 */}
      <div className="flex-1 p-4 bg-gray-50">
        <div className="bg-white rounded shadow overflow-hidden">
          <div className="px-4 py-3 border-b flex items-center justify-between">
            {/* 로딩 상태를 isLoading으로 직접 사용 */}
            <div className="text-sm text-gray-600">
              {isLoading
                ? "로딩 중..."
                : error
                ? `에러: ${error}`
                : `검색결과: ${posts.length}건`}
            </div>
            {/* 페이징 컨트롤러 */}
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
                        {p.postNo ?? p.id ?? "-"}
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
    p.postNo ||
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
