import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";
import "../pages/Form.css";

export const EditPost = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    api.get(`/posts/${slug}/`).then((res) => {
      setTitle(res.data.title);
      setContent(res.data.content);
    });
  }, [slug]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.patch(
        `/posts/${slug}/`,
        { title, content },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access")}`,
          },
        },
      );
      navigate(`/posts/${slug}`);
    } catch (err) {
      setError(JSON.stringify(err.response?.data));
    }
  };

  return (
    <div className="form-page">
      <h1>Редагувати пост</h1>
      {error && <p className="form-error">{error}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Заголовок"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          placeholder="Текст поста"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <button type="submit">Зберегти</button>
      </form>
    </div>
  );
};
