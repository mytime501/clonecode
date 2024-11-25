import React from "react";

const FilterBar = ({ filters, setFilters, applyFilters, resetFilters }) => {
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  return (
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

      <button onClick={applyFilters}>필터 적용</button>
      <button onClick={resetFilters}>초기화</button>
    </div>
  );
};

export default FilterBar;
