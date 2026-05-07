import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { getApiErrorMessage } from "../utils/formValidation";
import "./SubscriptionPlans.css";

export const SubscriptionPlans = () => {
  const [plans, setPlans] = useState([]);
  const [currentSubscription, setCurrentSubscription] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const response = await api.get("/subscribe/plans/");
        setPlans(response.data);
      } catch (err) {
        setError(getApiErrorMessage(err.response?.data, "Помилка завантаження планів"));
      }
    };

    const fetchCurrentSubscription = async () => {
      try {
        const token = localStorage.getItem("access");
        if (token) {
          const response = await api.get("/subscribe/my-subscription/", {
            headers: { Authorization: `Bearer ${token}` },
          });
          setCurrentSubscription(response.data);
        }
      } catch (err) {
        // No active subscription
      }
    };

    Promise.all([fetchPlans(), fetchCurrentSubscription()]).finally(() =>
      setLoading(false)
    );
  }, []);

  const handleSubscribe = (planId) => {
    const token = localStorage.getItem("access");
    if (!token) {
      navigate("/login");
      return;
    }
    navigate(`/checkout?plan=${planId}`);
  };

  if (loading) {
    return <p className="loading">Завантаження...</p>;
  }

  return (
    <div className="subscription-plans-page">
      <h1>Плани підписки</h1>
      {error && <p className="error-message">{error}</p>}

      <div className="plans-grid">
        {plans.map((plan) => (
          <div key={plan.id} className="plan-card">
            <h2>{plan.name}</h2>
            <div className="price">
              ₴{plan.price}
              <span className="period">/{plan.billing_period}</span>
            </div>
            <p className="description">{plan.description}</p>
            <ul className="features">
              {plan.features && plan.features.length > 0 ? (
                plan.features.map((feature, idx) => (
                  <li key={idx}>✓ {feature}</li>
                ))
              ) : (
                <li>Базові можливості</li>
              )}
            </ul>

            {currentSubscription?.plan?.id === plan.id ? (
              <button className="btn btn-active" disabled>
                Активна підписка
              </button>
            ) : (
              <button
                className="btn btn-subscribe"
                onClick={() => handleSubscribe(plan.id)}
              >
                Оформити
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
