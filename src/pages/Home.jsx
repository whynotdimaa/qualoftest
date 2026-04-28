import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";
import "./Home.css";

export const Home = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    api.get("/posts/").then((res) => {
      setPosts(res.data.results);
    });
  }, []);

  return (
    <div className="home">
      <h1>Новини</h1>
      {posts.map((post) => (
        <div key={post.id} className="post-card">
          <Link to={`/posts/${post.slug}`} className="card-link">
            <h2>{post.title}</h2>
            <p>{post.content}</p>
            <div className="post-meta">
              Автор: {post.author} ·{" "}
              {new Date(post.created_at).toLocaleDateString("uk-UA")}
            </div>
          </Link>
        </div>
      ))}
    </div>
  );
};
