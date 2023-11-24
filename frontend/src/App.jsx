// Library imports
import { Navigate, Route, Routes } from "react-router-dom";
import { Container } from "@chakra-ui/react";
import { useRecoilValue } from "recoil";

// Component imports
import Navbar from "./components/Navbar";

// Page imports
import Home from "./pages/Home";
import Auth from "./pages/Auth";
import BlogPage from "./pages/BlogPage";
import CreateBlog from "./pages/CreateBlog";
import UpdateBlog from "./pages/UpdateBlog";
import UserProfile from "./pages/UserProfile";
import UpdateUserProfile from "./pages/UpdateUserProfile";
import NotFound from "./pages/NotFound";

//State imports
import { userAtom } from "../atoms/userAtom";

function App() {
  const user = useRecoilValue(userAtom);

  return (
    <>
    <Container maxW={"1200px"}>
      <Navbar />
      <Routes>
        <Route path="/" element={user ? <Home /> : <Navigate to="/auth" />} />
        <Route path="/auth" element={!user ? <Auth /> : <Navigate to="/" />} />
        <Route path="/createblog" element={user ? <CreateBlog /> : <Navigate to="/auth" />} />
        <Route path="/updateblog/:id" element={user ? <UpdateBlog /> : <Navigate to="/auth" />} />
        <Route path="/blogpage/:username/:id" element={user ? <BlogPage /> : <Navigate to="/auth" />} />
        <Route path="/profile/:query" element={user ? <UserProfile /> : <Navigate to="/auth" />} />
        <Route path="/profileUpdate/:id" element={user ? <UpdateUserProfile /> : <Navigate to="/auth" />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Container>
    </>
  );
}

export default App;
