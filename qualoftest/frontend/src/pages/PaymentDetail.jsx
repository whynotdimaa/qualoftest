import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../api/axios";
import { getApiErrorMessage } from "../utils/formValidation";
import "./Payments.css";

export const PaymentDetail = () => {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [syncMsg, setSyncMsg] = useState("");

  useEffect(() => {
    api
      .get(`/payment/payments/${id}/`)
      .then((r) => setData(r.data))
      .catch((e) =>
        setError(getApiErrorMessage(e.response?.data, "Не вдалося завантажити платіж")),
      );
  }, [id]);

  const syncStatus = () => {
    setSyncMsg("");
    api
      .get(`/payment/payments/${id}/status/`)
      .then((r) => setSyncMsg(r.data.message ?? JSON.stringify(r.data)))
      .catch(() => setSyncMsg("Не вдалося синхронізувати."));
  };

  if (error) return <div className="payments-page">{error}</div>;
  if (!data) return <p className="payments-page">Завантаження…</p>;

  return (
    <div className="payments-page">
      <p>
        <Link to="/payments">← Назад</Link>
      </p>
      <h1>Платіж #{data.id}</h1>
      <p>
        Сума: {data.amount} {data.currency} · Статус: <strong>{data.status}</strong>
      </p>
      {data.description ? <p>{data.description}</p> : null}
      {data.subscription_info ? (
        <p>Підписка: {data.subscription_info.plan_name}</p>
      ) : null}
      <button type="button" onClick={syncStatus}>
        Оновити статус із Stripe
      </button>
      {syncMsg ? <p>{syncMsg}</p> : null}
    </div>
  );
};
