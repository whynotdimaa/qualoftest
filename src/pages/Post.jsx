import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import api from "../api/axios";
import "./Post.css";

export const Post = () => {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [text, setText] = useState("");
  const isAuth = !!localStorage.getItem("access");
  const navigate = useNavigate();
  const token = localStorage.getItem("access");

  useEffect(() => {
    api.get(`/posts/${slug}/`).then((res) => {
      setPost(res.data);

      api
        .get(`/comments/?post=${res.data.id}`)

        .then((r) => setComments(r.data.results || r.data));
    });
  }, [slug]);

  const handleDelete = async () => {
    if (!window.confirm("Видалити пост?")) return;
    await api.delete(`/posts/${slug}/`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    navigate("/");
  };

  const handleComment = async (e) => {
    e.preventDefault();
    try {
      await api.post(
        "/comments/",
        {
          post: post.id,
          content: text,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access")}`,
          },
        },
      );
      setText("");
      const res = await api.get(`/comments/?post=${post.id}`);
      setComments(res.data.results || res.data);
    } catch (err) {
      console.error(err.response?.data);
    }
  };

  if (!post) return <p>Завантаження...</p>;

  return (
    <div className="post-page">
      <h1>{post.title}</h1>
      <div className="post-meta">
        Автор: {post.author_info?.username} · Переглядів: {post.views_count}
      </div>
      <p className="post-content">{post.content}</p>

      {token && (
        <div className="post-actions">
          <Link to={`/posts/${slug}/edit`}>Редагувати</Link>
          <button onClick={handleDelete}>Видалити</button>
        </div>
      )}

      <div className="comments-section">
        <h2>Коментарі</h2>
        {comments.map((c) => (
          <div key={c.id} className="comment">
            <strong>{c.author_info?.username}</strong>
            <p>{c.content}</p>
          </div>
        ))}

        {isAuth && (
          <div className="comment-form">
            <form onSubmit={handleComment}>
              <textarea
                placeholder="Ваш коментар..."
                value={text}
                onChange={(e) => setText(e.target.value)}
              />
              <button type="submit">Надіслати</button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
