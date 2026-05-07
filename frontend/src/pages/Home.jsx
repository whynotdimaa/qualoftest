import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import api from "../api/axios";
import "./Home.css";

export const Home = () => {
  const [posts, setPosts] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const pageSize = 20;
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchInput, setSearchInput] = useState(
    searchParams.get("search") || "",
  );

  const parsedPage = Number(searchParams.get("page") || 1);
  const currentPage =
    Number.isFinite(parsedPage) && parsedPage > 0 ? parsedPage : 1;
  const searchQuery = searchParams.get("search") || "";

  useEffect(() => {
    const params = { page: currentPage };
    if (searchQuery.trim()) params.search = searchQuery.trim();

    api.get("/posts/", { params }).then((res) => {
      const responseData = res.data;
      setPosts(responseData.results || responseData || []);
      setTotalCount(responseData.count || 0);
    });
  }, [currentPage, searchQuery]);

  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));

  const handleSearch = (e) => {
    e.preventDefault();
    const nextParams = new URLSearchParams(searchParams);

    if (searchInput.trim()) {
      nextParams.set("search", searchInput.trim());
    } else {
      nextParams.delete("search");
    }

    nextParams.set("page", "1");
    setSearchParams(nextParams);
  };

  const goToPage = (page) => {
    const nextParams = new URLSearchParams(searchParams);
    nextParams.set("page", String(page));
    if (searchQuery.trim()) nextParams.set("search", searchQuery.trim());
    setSearchParams(nextParams);
  };

  return (
    <div className="home">
      <h1>Новини</h1>
      <form className="home-search" onSubmit={handleSearch}>
        <input
          type="search"
          placeholder="Пошук постів"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
        />
        <button type="submit">Шукати</button>
      </form>

      {searchQuery && (
        <div className="home-search-meta">
          Результати для: <strong>{searchQuery}</strong>
        </div>
      )}

      {posts.length === 0 ? (
        <p className="home-empty">Пости не знайдено.</p>
      ) : null}

      {posts.map((post) => (
        <div key={post.id} className="post-card">
          <Link to={`/posts/${post.slug}`} className="card-link">
            <h2>{post.title}</h2>
            <p>{post.content}</p>
            <div className="post-meta">
              Автор: {post.author} · {new Date(post.created_at).toLocaleDateString("uk-UA")}
            </div>
          </Link>
        </div>
      ))}

      {totalPages > 1 && (
        <div className="home-pagination">
          <button type="button" onClick={() => goToPage(currentPage - 1)} disabled={currentPage <= 1}>
            Попередня
          </button>
          <span>
            Сторінка {currentPage} з {totalPages}
          </span>
          <button type="button" onClick={() => goToPage(currentPage + 1)} disabled={currentPage >= totalPages}>
            Наступна
          </button>
        </div>
      )}
    </div>
  );
};
