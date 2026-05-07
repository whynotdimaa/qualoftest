import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";
import "./Home.css";

export const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get("/posts/categories/")
      .then((res) => {
        const data = res.data;
        setCategories(data.results || data || []);
      })
      .catch(() => setError("Не вдалося завантажити категорії"));
  }, []);

  return (
    <div className="home">
      <h1>Категорії</h1>
      {error && <p className="form-error">{error}</p>}
      {categories.length === 0 ? (
        <p>Категорії відсутні.</p>
      ) : (
        <div className="section-list">
          {categories.map((category) => (
            <Link key={category.id} to={`/categories/${category.slug}`} className="section-card">
              <h3>{category.name}</h3>
              <p>{category.description}</p>
              <small>Пости: {category.posts_count}</small>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};
