import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { getApiErrorMessage } from "../utils/formValidation";
import "./SubscriptionInfo.css";

export const SubscriptionInfo = ({ userId }) => {
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("access");
    if (!token) {
      setLoading(false);
      return;
    }

    api
      .get("/subscribe/my-subscription/", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setSubscription(res.data);
      })
      .catch((err) => {
        if (err.response?.status !== 404) {
          setError(getApiErrorMessage(err.response?.data, "Помилка завантаження підписки"));
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const handleCancel = async () => {
    const token = localStorage.getItem("access");
    if (!token) return;

    if (window.confirm("Ви впевнені, що хочете скасувати підписку?")) {
      try {
        await api.post(
          "/subscribe/cancel/",
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setSubscription(null);
        alert("Підписка скасована");
      } catch (err) {
        setError(getApiErrorMessage(err.response?.data, "Помилка при скасуванні"));
      }
    }
  };

  if (loading) {
    return null;
  }

  return (
    <div className="subscription-info">
      {subscription ? (
        <div className="subscription-active">
          <h3>Ваша підписка</h3>
          <div className="subscription-details">
            <div className="detail-item">
              <span className="label">План:</span>
              <span className="value">{subscription.plan?.name}</span>
            </div>
            <div className="detail-item">
              <span className="label">Статус:</span>
              <span className={`value status-${subscription.status}`}>
                {subscription.status === "active" ? "✓ Активна" : "Неактивна"}
              </span>
            </div>
            <div className="detail-item">
              <span className="label">До:</span>
              <span className="value">
                {new Date(subscription.end_date).toLocaleDateString("uk-UA")}
              </span>
            </div>
          </div>
          <div className="subscription-actions">
            <button className="btn-upgrade" onClick={() => navigate("/subscription-plans")}>
              Змінити план
            </button>
            <button className="btn-cancel" onClick={handleCancel}>
              Скасувати підписку
            </button>
          </div>
        </div>
      ) : (
        <div className="subscription-inactive">
          <h3>Підписка не активна</h3>
          <p>Активуйте підписку, щоб отримати преміум функції</p>
          <button
            className="btn-subscribe"
            onClick={() => navigate("/subscription-plans")}
          >
            Обрати план
          </button>
        </div>
      )}
      {error && <p className="error-message">{error}</p>}
    </div>
  );
};
