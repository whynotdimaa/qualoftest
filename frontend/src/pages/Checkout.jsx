import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import api from "../api/axios";
import { getApiErrorMessage } from "../utils/formValidation";
import "./Checkout.css";

export const Checkout = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const planId = searchParams.get("plan");
  
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    if (!planId) {
      navigate("/subscription-plans");
      return;
    }

    api
      .get(`/subscribe/plans/${planId}/`)
      .then((res) => {
        setPlan(res.data);
      })
      .catch((err) => {
        setError(getApiErrorMessage(err.response?.data, "План не знайдено"));
      })
      .finally(() => setLoading(false));
  }, [planId, navigate]);

  const handleCheckout = async () => {
    const token = localStorage.getItem("access");
    if (!token) {
      navigate("/login");
      return;
    }

    setProcessing(true);
    try {
      const response = await api.post(
        "/payment/create-checkout-session/",
        {
          subscription_plan_id: planId,
          success_url: `${window.location.origin}/payment/success`,
          cancel_url: `${window.location.origin}/subscription-plans`,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data.checkout_url) {
        window.location.href = response.data.checkout_url;
      }
    } catch (err) {
      setError(getApiErrorMessage(err.response?.data, "Помилка при созданні платежу"));
      setProcessing(false);
    }
  };

  if (loading) {
    return <p className="loading">Завантаження...</p>;
  }

  if (!plan) {
    return <p className="error-message">План не знайдено</p>;
  }

  return (
    <div className="checkout-page">
      <div className="checkout-container">
        <h1>Оформлення підписки</h1>

        <div className="checkout-content">
          <div className="plan-summary">
            <h2>{plan.name}</h2>
            <p className="description">{plan.description}</p>

            <div className="price-info">
              <div className="price">₴{plan.price}</div>
              <div className="period">за {plan.billing_period}</div>
            </div>

            {plan.features && plan.features.length > 0 && (
              <div className="features-checkout">
                <h3>Що включено:</h3>
                <ul>
                  {plan.features.map((feature, idx) => (
                    <li key={idx}>✓ {feature}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div className="checkout-form">
            {error && <p className="error-message">{error}</p>}

            <div className="payment-method">
              <h3>Спосіб оплати</h3>
              <div className="payment-option">
                <input
                  type="radio"
                  id="stripe"
                  name="payment"
                  defaultChecked
                />
                <label htmlFor="stripe">
                  <span className="stripe-logo">💳</span>
                  Stripe (Карта/Apple Pay/Google Pay)
                </label>
              </div>
            </div>

            <div className="order-summary">
              <h3>Сумарно</h3>
              <div className="summary-row">
                <span>Підписка {plan.name}</span>
                <span>₴{plan.price}</span>
              </div>
              <div className="summary-total">
                <span>Разом:</span>
                <span>₴{plan.price}</span>
              </div>
            </div>

            <button
              className="btn-pay"
              onClick={handleCheckout}
              disabled={processing}
            >
              {processing ? "Обробка..." : "Перейти до оплати"}
            </button>

            <p className="security-note">
              🔒 Ваші дані безпечно обробляються через Stripe
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
