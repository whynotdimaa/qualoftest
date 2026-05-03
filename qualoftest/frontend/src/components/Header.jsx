import { Link, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { logoutApi } from "../api/axios";
import "./Header.css";

export const Header = () => {
  const location = useLocation();
  const [isAuth, setIsAuth] = useState(() => !!localStorage.getItem("access"));

  useEffect(() => {
    setIsAuth(!!localStorage.getItem("access"));
  }, [location.pathname]);

  const handleLogout = async () => {
    await logoutApi();
    globalThis.location.href = "/login";
  };

  return (
    <nav>
      <div className="nav-left">
        <Link to="/" className="logo">
          NewsAPI
        </Link>
        <Link to="/categories">Категорії</Link>
        {isAuth ? (
          <>
            <Link to="/subscribe">Підписка</Link>
            <Link to="/payments">Платежі</Link>
            <Link to="/my-comments">Мої коментарі</Link>
            <Link to="/my-posts">Мої пости</Link>
            <Link to="/profile">Профіль</Link>
          </>
        ) : null}
      </div>
      <div className="nav-right">
        {isAuth ? (
          <>
            <Link to="/posts/create" className="btn-create">
              + Створити пост
            </Link>
            <button type="button" className="btn-logout" onClick={handleLogout}>
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
