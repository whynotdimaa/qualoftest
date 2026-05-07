import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";
import { getApiErrorMessage, validateMinLength } from "../utils/formValidation";
import "../pages/Form.css";

export const EditPost = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    setLoading(true);
    api
      .get(`/posts/${slug}/`)
      .then((res) => {
        setTitle(res.data.title);
        setContent(res.data.content);
        setLoading(false);
      })
      .catch((err) => {
        if (err.response?.status === 404) {
          setNotFound(true);
        } else {
          setErrors({
            general: getApiErrorMessage(
              err.response?.data,
              "Не вдалося завантажити пост",
            ),
          });
        }
        setLoading(false);
      });
  }, [slug]);

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

    setErrors((currentErrors) => ({ ...currentErrors, general: "" }));

    try {
      const response = await api.patch(
        `/posts/${slug}/`,
        { title, content },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access")}`,
          },
        },
      );
      const newSlug = response.data.slug || slug;
      navigate(`/posts/${newSlug}`);
    } catch (err) {
      setErrors({
        general: getApiErrorMessage(
          err.response?.data,
          "Не вдалося зберегти зміни",
        ),
      });
    }
  };

  if (loading) {
    return <p>Завантаження...</p>;
  }

  if (notFound) {
    return <p>Пост не знайдено.</p>;
  }

  return (
    <div className="form-page">
      <h1>Редагувати пост</h1>
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
        <button type="submit">Зберегти</button>
      </form>
    </div>
  );
};
