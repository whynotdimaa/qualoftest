import { useEffect, useState } from "react";
import api from "../api/axios";
import { mediaUrl } from "../utils/backendMeta";
import { getApiErrorMessage, validateMinLength } from "../utils/formValidation";
import "./Profile.css";

export const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [bio, setBio] = useState("");
  const [avatarFile, setAvatarFile] = useState(null);
  const [passwordForm, setPasswordForm] = useState({
    old: "",
    next: "",
    confirm: "",
  });
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");
  const [avatarPreviewUrl, setAvatarPreviewUrl] = useState("");

  const loadProfile = async () => {
    const res = await api.get("/auth/profile/");
    const p = res.data;
    setProfile(p);
    setFirstName(p.first_name ?? "");
    setLastName(p.last_name ?? "");
    setBio(p.bio ?? "");
  };

  useEffect(() => {
    loadProfile().catch(() => setProfile(null));
  }, []);

  useEffect(() => {
    if (!avatarFile) {
      setAvatarPreviewUrl("");
      return;
    }
    const url = URL.createObjectURL(avatarFile);
    setAvatarPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [avatarFile]);

  const saveProfile = async (e) => {
    e.preventDefault();
    setErr("");
    setMsg("");
    try {
      const fd = new FormData();
      fd.append("first_name", firstName);
      fd.append("last_name", lastName);
      fd.append("bio", bio);
      if (avatarFile) fd.append("avatar", avatarFile);
      await api.patch("/auth/profile/", fd);
      setMsg("Профіль оновлено.");
      setAvatarFile(null);
      await loadProfile();
    } catch (apiErr) {
      setErr(getApiErrorMessage(apiErr.response?.data, "Не вдалося зберегти"));
    }
  };

  const changePassword = async (e) => {
    e.preventDefault();
    setErr("");
    setMsg("");
    const pwe = validateMinLength(passwordForm.next, "Новий пароль", 8);
    const confirmMismatch =
      passwordForm.next !== passwordForm.confirm ? "Паролі не збігаються" : "";
    if (!passwordForm.old) {
      setErr("Введіть старий пароль.");
      return;
    }
    if (pwe || confirmMismatch) {
      setErr(pwe || confirmMismatch);
      return;
    }
    try {
      await api.post("/auth/change-password/", {
        old_password: passwordForm.old,
        new_password: passwordForm.next,
        new_password_confirm: passwordForm.confirm,
      });
      setPasswordForm({ old: "", next: "", confirm: "" });
      setMsg("Пароль змінено. Наступні запити використовуватимуть новий пароль.");
    } catch (apiErr) {
      setErr(getApiErrorMessage(apiErr.response?.data, "Не вдалося змінити пароль"));
    }
  };

  if (!profile) return <p>Завантаження...</p>;

  const avatarSrc = avatarPreviewUrl || (profile.avatar ? mediaUrl(profile.avatar) : "");

  return (
    <div className="profile-page">
      {msg ? <p className="profile-flash ok">{msg}</p> : null}
      {err ? <p className="profile-flash err">{err}</p> : null}

      <div className="profile-card profile-card-static">
        {avatarSrc ? (
          <img className="profile-avatar-img" src={avatarSrc} alt="" />
        ) : (
          <div className="profile-avatar">
            {profile.username?.[0]?.toUpperCase() ?? "?"}
          </div>
        )}
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

      <form className="profile-form" onSubmit={saveProfile}>
        <h2>Редагування профілю</h2>
        <input
          placeholder="Імʼя"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
        />
        <input
          placeholder="Прізвище"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
        />
        <textarea
          placeholder="Біографія"
          rows={4}
          value={bio}
          onChange={(e) => setBio(e.target.value)}
        />
        <label className="form-label">Новий аватар</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setAvatarFile(e.target.files?.[0] ?? null)}
        />
        <button type="submit">Зберегти профіль</button>
      </form>

      <form className="profile-form" onSubmit={changePassword}>
        <h2>Зміна пароля</h2>
        <input
          type="password"
          placeholder="Старий пароль"
          value={passwordForm.old}
          autoComplete="current-password"
          onChange={(e) =>
            setPasswordForm((p) => ({ ...p, old: e.target.value }))
          }
        />
        <input
          type="password"
          placeholder="Новий пароль"
          value={passwordForm.next}
          autoComplete="new-password"
          onChange={(e) =>
            setPasswordForm((p) => ({ ...p, next: e.target.value }))
          }
        />
        <input
          type="password"
          placeholder="Підтвердження нового пароля"
          value={passwordForm.confirm}
          autoComplete="new-password"
          onChange={(e) =>
            setPasswordForm((p) => ({ ...p, confirm: e.target.value }))
          }
        />
        <button type="submit">Змінити пароль</button>
      </form>
    </div>
  );
};
