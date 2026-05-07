import { useEffect, useState } from "react";
import api from "../api/axios";
import { SubscriptionInfo } from "../components/SubscriptionInfo";
import "./Profile.css";

export const Profile = () => {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    api
      .get("/auth/profile/", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access")}`,
        },
      })
      .then((res) => {
        console.log(res.data);
        setProfile(res.data);
      });
  }, []);

  if (!profile) return <p>Завантаження...</p>;

  return (
    <div className="profile-page">
      <SubscriptionInfo userId={profile.id} />
      
      <div className="profile-card">
        <div className="profile-avatar">
          {profile.username[0].toUpperCase()}
        </div>
        <h1>{profile.username}</h1>
        <p className="email">{profile.email}</p>
        <div className="profile-stats">
          <div className="stat">
            <div className="number">{profile.posts_count}</div>
            <div className="label">Постів</div>
          </div>
          <div className="stat">
            <div className="number">{profile.comments_count}</div>
            <div className="label">Коментарів</div>
          </div>
        </div>
      </div>
    </div>
  );
};
