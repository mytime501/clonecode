import React, { useState, useEffect } from "react";

const FilterBar = ({ filters, setFilters, onSearch, resetFilters }) => {
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const [searchQuery, setSearchQuery] = useState("");
  const [recentSearches, setRecentSearches] = useState([]);
  const [searchInputClicked, setSearchInputClicked] = useState(false); // 클릭 여부 상태 추가

  // 로컬 스토리지에서 최근 검색어 불러오기
  useEffect(() => {
    const storedSearches = JSON.parse(localStorage.getItem("recentSearches")) || [];
    setRecentSearches(storedSearches);
  }, []);

  // 검색어 저장 함수
  const saveSearchQuery = (query) => {
    let storedSearches = JSON.parse(localStorage.getItem("recentSearches")) || [];
    
    // 중복된 검색어는 저장하지 않음
    if (!storedSearches.includes(query)) {
      storedSearches = [query, ...storedSearches].slice(0, 5); // 최대 5개까지만 저장
      localStorage.setItem("recentSearches", JSON.stringify(storedSearches));
      setRecentSearches(storedSearches);
    }
  };

  // 검색어 삭제 함수
  const handleDeleteSearch = (query) => {
    let storedSearches = JSON.parse(localStorage.getItem("recentSearches")) || [];
    storedSearches = storedSearches.filter((item) => item !== query);
    localStorage.setItem("recentSearches", JSON.stringify(storedSearches));
    setRecentSearches(storedSearches);
  };

  // 검색어 클릭 시 검색창에 입력하고 검색 실행
  const handleRecentSearchClick = (query) => {
    setSearchQuery(query);
    onSearch(query); // 부모 컴포넌트로 검색어 전달하여 검색 실행
    setSearchInputClicked(false); // 검색어 클릭 후 검색창 숨기기
  };

  // 검색어 검색 시 로컬 스토리지에 저장하고 검색 실행
  const handleSearch = () => {
    if (searchQuery.trim()) {
      saveSearchQuery(searchQuery);
      onSearch(searchQuery); // 부모 컴포넌트로 검색어 전달하여 검색 실행
    }
  };

  return (
    <div>
      <div className="filter-bar">
        <select name="genre" value={filters.genre} onChange={handleInputChange}>
          <option value="">장르 선택</option>
          <option value="28">액션</option>
          <option value="35">코미디</option>
          <option value="18">드라마</option>
        </select>

        <select name="rating" value={filters.rating} onChange={handleInputChange}>
          <option value="">평점 선택</option>
          <option value="7">7점 이상</option>
          <option value="8">8점 이상</option>
          <option value="9">9점 이상</option>
        </select>

        <select name="sort" value={filters.sort} onChange={handleInputChange}>
          <option value="popularity.desc">인기순</option>
          <option value="vote_average.desc">평점순</option>
          <option value="release_date.desc">최신순</option>
        </select>

        <input
          type="number"
          name="year"
          value={filters.year}
          placeholder="개봉년도"
          onChange={handleInputChange}
        />

        <button onClick={resetFilters}>초기화</button>

        <button onClick={handleSearch} className="search-button">
          Search
        </button>
        <div className="search">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setSearchInputClicked(true)} // 검색창 클릭 시 최근 검색어 표시
            onBlur={(e) => {
              // 최근 검색어 항목 클릭 시 닫히지 않도록 조건 추가
              if (!e.currentTarget.contains(e.relatedTarget)) {
                setSearchInputClicked(false);
              }
            }}
            placeholder="Search movies..."
            className="search-input"
          />
          {searchInputClicked && recentSearches.length > 0 && (
            <div
              className="recent-searches"
              onMouseDown={(e) => e.preventDefault()} // 클릭 시 blur 방지
            >
              {recentSearches.map((query, index) => (
                <div key={index} className="recent-search-item">
                  <span onClick={() => handleRecentSearchClick(query)}>{query}</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation(); // 이벤트 버블링 방지
                      handleDeleteSearch(query); // 삭제 처리
                    }}
                    className="delete-button"
                  >
                    X
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FilterBar;
