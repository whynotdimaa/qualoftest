import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../api/axios";
import "./Home.css";

export const CategoryPosts = () => {
  const { slug } = useParams();
  const [category, setCategory] = useState(null);
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get(`/posts/categories/${slug}/posts/`)
      .then((res) => {
        setCategory(res.data.category);
        setPosts(res.data.posts);
      })
      .catch(() => setError("Не вдалося завантажити пости категорії"));
  }, [slug]);

  return (
    <div className="home">
      <h1>{category?.name || "Категорія"}</h1>
      {category?.description && <p>{category.description}</p>}
      {error && <p className="form-error">{error}</p>}
      {posts.length === 0 ? (
        <p>У цій категорії поки немає постів.</p>
      ) : (
        posts.map((post) => (
          <div key={post.id} className="post-card">
            <Link to={`/posts/${post.slug}`} className="card-link">
              <h2>{post.title}</h2>
              <p>{post.content}</p>
              <div className="post-meta">
                Автор: {post.author} · {new Date(post.created_at).toLocaleDateString("uk-UA")}
              </div>
            </Link>
          </div>
        ))
      )}
    </div>
  );
};
