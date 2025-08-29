import React, { Suspense, lazy} from "react";
import { Route, Routes, HashRouter, Navigate, useNavigate, useLocation } from "react-router-dom";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Loading from "./views/UI/Loading";
import { setUser } from "./utils/auth";
import { useAuthStore } from "./store/auth";
import { setLogoutHandler } from "./utils/axios";

const Index = lazy(() => import("./views/core/Index"));
const Detail = lazy(() => import("./views/core/Detail"));
const Search = lazy(() => import("./views/core/Search"));
const Category = lazy(() => import("./views/core/Category"));
const About = lazy(() => import("./views/pages/About"));
const Contact = lazy(() => import("./views/pages/Contact"));
const UnsubscribeSuccess = lazy(() => import("./views/pages/UnsubscribeSuccess"));
const Register = lazy(() => import("./views/auth/Register"));
const Login = lazy(() => import("./views/auth/Login"));
const Signup = lazy(() => import("./views/auth/Signup"));
const ForgotPassword = lazy(() => import("./views/auth/ForgotPassword"));
const CreatePassword = lazy(() => import("./views/auth/CreatePassword"));
const Dashboard = lazy(() => import("./views/dashboard/Dashboard"));
const Posts = lazy(() => import("./views/dashboard/Posts"));
const AddPost = lazy(() => import("./views/dashboard/AddPost"));
const EditPost = lazy(() => import("./views/dashboard/EditPost"));
const Comments = lazy(() => import("./views/dashboard/Comments"));
const Notifications = lazy(() => import("./views/dashboard/Notifications"));
const Profile = lazy(() => import("./views/dashboard/Profile"));
const MainWrapper = lazy(() => import("../src/layouts/MainWrapper"));
const Header = lazy(() => import("./views/partials/Header"));
const Footer = lazy(() => import("./views/partials/Footer"));
const Page404 = lazy(() => import("./views/pages/Page404"));
const ProfileList = lazy(() => import("./views/core/ProfileList"));
const ProfileDetail = lazy(() => import("./views/core/ProfileDetails"));
const AllPosts = lazy(() => import("./views/pages/AllPosts"));
const News = lazy(() => import("./views/pages/News"));
const Services = lazy(() => import("./views/pages/Services"))

function PrivateRoute({ element }) {
  const isLoggedIn = useAuthStore.getState().isLoggedIn();
  if (!isLoggedIn) {
    return <Navigate to="/" replace />;
  }
  return element;
}

function AppWrapper() {
  const navigate = useNavigate();
  const location = useLocation();

  React.useEffect(() => {
    setUser();

    setLogoutHandler(() => {
      useAuthStore.setState({ allUserData: null });
      navigate("/", { replace: true, state: { logoutMessage: "از سایت بیرون افتادید، لطفا دوباره وارد شوید" } });
    });
  }, [navigate]);

  React.useEffect(() => {
    if (location.state?.logoutMessage) {
      import("./plugin/Toast").then(({ default: Toast }) => {
        Toast("warning", location.state.logoutMessage);
      });
    }
  }, [location.state?.logoutMessage]);

  return (
    <>
      <Header />
      <Suspense
        fallback={
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "calc(100vh - 120px)",
            }}
          >
            <Loading />
          </div>
        }
      >
        <MainWrapper>
          <Routes>
            <Route path="/" element={<Index logoutMessage={location.state?.logoutMessage} />} />
            <Route path="/category/:slug/" element={<Category />} />
            <Route path="/post/:slug/" element={<Detail />} />
            <Route path="/posts/:slug/" element={<Detail />} />
            <Route path="/category/" element={<Category />} />
            <Route path="/search/:searchTerm" element={<Search />} />
            {/* Authentication */}
            <Route path="/register/" element={<Register />} />
            <Route path="/login/" element={<Login />} />
            <Route path="/signup/" element={<Signup />} />
            <Route path="/forgot-password/" element={<ForgotPassword />} />
            <Route path="/create-new-password/" element={<CreatePassword />} />
            <Route path="/create-password/" element={<CreatePassword />} />
            {/* Dashboard */}
            <Route path="/dashboard/*" element={<PrivateRoute element={<Dashboard />} />} />
            <Route path="/posts/" element={<PrivateRoute element={<Posts />} />} />
            <Route path="/add-post/" element={<PrivateRoute element={<AddPost />} />} />
            <Route path="/edit-post/:id/" element={<PrivateRoute element={<EditPost />} />} />
            <Route path="/comments/" element={<PrivateRoute element={<Comments />} />} />
            <Route path="/notifications/" element={<PrivateRoute element={<Notifications />} />} />
            <Route path="/profile/" element={<PrivateRoute element={<Profile />} />} />
            <Route path="/unsubscribe-success/" element={<PrivateRoute element={<UnsubscribeSuccess />} />} />
            {/* Pages */}
            <Route path="/about/" element={<About />} />
            <Route path="/contact/" element={<Contact />} />
            <Route path="/authors/" element={<ProfileList />} />
            <Route path="/author-profile/:id/" element={<ProfileDetail />} />
            <Route path="/all-posts/" element={<AllPosts />} />
            <Route path="/news/" element={<News />} />
            <Route path="/services/" element={<Services/>}/>
            {/* Catch-all route for 404 */}
            <Route path="*" element={<Page404 />} />
          </Routes>
        </MainWrapper>
      </Suspense>
      <Footer />
    </>
  );
}

function App() {
  return (
    <HashRouter>
      <AppWrapper />
    </HashRouter>
  );
}

export default App;
