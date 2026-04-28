import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Home } from "./pages/Home";
import { Login } from "./pages/Login";
import { Register } from "./pages/Register";
import { Header } from "./components/Header";
import { Post } from "./pages/Post";
import { Profile } from "./pages/Profile";
import { CreatePost } from "./pages/CreatePost";
import { MyPosts } from "./pages/MyPosts";
import { EditPost } from "./pages/EditPost";

export const App = () => {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="/posts/:slug" element={<Post />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/posts/create" element={<CreatePost />} />
        <Route path="/my-posts" element={<MyPosts />} />
        <Route path="/posts/:slug/edit" element={<EditPost />} />
      </Routes>
    </BrowserRouter>
  );
};
