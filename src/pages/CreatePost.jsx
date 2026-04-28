import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import './Form.css'

export const CreatePost = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post(
        "/posts/",
        { title, content, status: "published" },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access")}`,
          },
        },
      );

      navigate(`/`);
    } catch (err) {
      setError(JSON.stringify(err.response?.data));
    }
  };

  return (
    <div className="form-page">
      <h1>Створити пост</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}
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
        <button type="submit">Опублікувати</button>
      </form>
    </div>
  );
};
