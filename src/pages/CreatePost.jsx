import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { getApiErrorMessage, validateMinLength } from "../utils/formValidation";
import "./Form.css";

export const CreatePost = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const validate = () => {
    const newErrors = {};

    const titleError = validateMinLength(title, "Заголовок", 3);
    const contentError = validateMinLength(content, "Текст поста", 10);

    if (titleError) newErrors.title = titleError;
    if (contentError) newErrors.content = contentError;

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});

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
      setErrors({
        general: getApiErrorMessage(
          err.response?.data,
          "Не вдалося створити пост",
        ),
      });
    }
  };

  return (
    <div className="form-page">
      <h1>Створити пост</h1>
      {errors.general && <p className="form-error">{errors.general}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Заголовок"
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
            setErrors((currentErrors) => ({
              ...currentErrors,
              title: "",
              general: "",
            }));
          }}
          aria-invalid={Boolean(errors.title)}
        />
        {errors.title && <p className="form-error">{errors.title}</p>}
        <textarea
          placeholder="Текст поста"
          value={content}
          onChange={(e) => {
            setContent(e.target.value);
            setErrors((currentErrors) => ({
              ...currentErrors,
              content: "",
              general: "",
            }));
          }}
          aria-invalid={Boolean(errors.content)}
        />
        {errors.content && <p className="form-error">{errors.content}</p>}
        <button type="submit">Опублікувати</button>
      </form>
    </div>
  );
};
