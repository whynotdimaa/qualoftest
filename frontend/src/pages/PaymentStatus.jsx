import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import api from "../api/axios";
import "./PaymentStatus.css";

export const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const sessionId = searchParams.get("session_id");
  const [status, setStatus] = useState("checking");

  useEffect(() => {
    if (!sessionId) {
      navigate("/");
      return;
    }

    const checkPaymentStatus = async () => {
      try {
        const response = await api.get("/payment/payments/history/", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access")}`,
          },
        });

        if (response.data && response.data.length > 0) {
          const payment = response.data[0];
          if (payment.status === "completed") {
            setStatus("success");
          } else if (payment.status === "pending") {
            setStatus("pending");
          } else {
            setStatus("failed");
          }
        }
      } catch (err) {
        setStatus("error");
      }
    };

    const timer = setTimeout(checkPaymentStatus, 2000);
    return () => clearTimeout(timer);
  }, [sessionId, navigate]);

  return (
    <div className="payment-status-page">
      <div className="status-container">
        {status === "checking" && (
          <div className="status-checking">
            <div className="spinner"></div>
            <h1>Перевіримо статус платежу...</h1>
            <p>Зачекайте, ми перевіряємо вашу оплату</p>
          </div>
        )}

        {status === "success" && (
          <div className="status-success">
            <div className="success-icon">✓</div>
            <h1>Платіж успішно оброблено!</h1>
            <p>Ваша підписка активована</p>
            <button className="btn-primary" onClick={() => navigate("/")}>
              Повернутися на головну
            </button>
          </div>
        )}

        {status === "pending" && (
          <div className="status-pending">
            <div className="pending-icon">⏳</div>
            <h1>Платіж в обробці</h1>
            <p>Ваш платіж перевіряється. Це може тривати кілька хвилин.</p>
            <button className="btn-primary" onClick={() => navigate("/")}>
              Повернутися на головну
            </button>
          </div>
        )}

        {(status === "failed" || status === "error") && (
          <div className="status-error">
            <div className="error-icon">✗</div>
            <h1>Виникла проблема з платежем</h1>
            <p>Спробуйте ще раз або зв'яжіться з підтримкою</p>
            <div className="button-group">
              <button className="btn-primary" onClick={() => navigate("/subscription-plans")}>
                Спробувати ще раз
              </button>
              <button className="btn-secondary" onClick={() => navigate("/")}>
                Повернутися на головну
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export const PaymentCancel = () => {
  const navigate = useNavigate();

  return (
    <div className="payment-status-page">
      <div className="status-container">
        <div className="status-cancelled">
          <div className="cancelled-icon">⊗</div>
          <h1>Платіж скасовано</h1>
          <p>Ви скасували процес оплати. Можете спробувати ще раз.</p>
          <div className="button-group">
            <button className="btn-primary" onClick={() => navigate("/subscription-plans")}>
              Повернутися до планів
            </button>
            <button className="btn-secondary" onClick={() => navigate("/")}>
              На головну
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
