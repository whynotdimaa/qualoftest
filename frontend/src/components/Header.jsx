import { Link } from "react-router-dom";
import api from "../api/axios";
import "./Header.css";

export const Header = () => {
  const isAuth = !!localStorage.getItem("access");

  const handleLogout = async () => {
    try {
      await api.post("/auth/logout/", {
        refresh_token: localStorage.getItem("refresh"),
      });
    } catch {
      // ignore logout failures, still clear tokens
    }
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    globalThis.location.href = "/login";
  };

  return (
    <nav>
      <div className="nav-left">
        <Link to="/" className="logo">
          NewsAPI
        </Link>
        <Link to="/categories">Категорії</Link>
        <Link to="/subscription-plans">Підписка</Link>
        {isAuth && <Link to="/my-posts">Мої пости</Link>}
        {isAuth && <Link to="/profile">Профіль</Link>}
      </div>
      <div className="nav-right">
        {isAuth ? (
          <>
            <Link to="/posts/create" className="btn-create">
              + Створити пост
            </Link>
            <button className="btn-logout" onClick={handleLogout}>
              Вийти
            </button>
          </>
        ) : (
          <>
            <Link to="/login">Логін</Link>
            <Link to="/register">Реєстрація</Link>
          </>
        )}
      </div>
    </nav>
  );
};
