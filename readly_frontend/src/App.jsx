import { Route, Routes, useLocation, Navigate } from "react-router-dom";
import { useEffect } from "react";
import useUserStore from "./store/userStore";
import Login from "./pages/Login/Login.jsx";
import OnBoard from "./pages/OnBoard.jsx";
import Home from "./pages/Home.jsx";
import CustomSidebar from "./components/CustomSidebar.jsx";
import CustomHeader from "./components/CustomHeader.jsx";
import "./App.css";
import MyPage from "./pages/Mypage/MyPage.jsx";
import cloudImg from "./assets/background/cloud.png";
import MakeCard from "./pages/Photocard/MakeCard.jsx";
import SharedBoard from "./pages/SharedBoard/SharedBoard.jsx";
import UpdateProfile from "./pages/Mypage/UpdateProfile.jsx";
import Ranking from "./pages/Ranking/Ranking.jsx";
import Community from "./pages/Community/Community.jsx";
import MakeCommunity from "./pages/Community/MakeCommunity.jsx";
import Activity from "./pages/Activity/Activity.jsx";
import ProtectedRoute from "./components/ProtectedRoute";
import Member from "./pages/Member/Member.jsx"

function RootRedirect() {
  const token = useUserStore.getState().token;

  if (token) {
    return <Navigate to="/home" replace />;
  } else {
    return <OnBoard />;
  }
}

function App() {
  const location = useLocation();
  const isFullScreenPage = ["/login", "/"].includes(location.pathname);
  const notSearchPage =
    ["/login", "/", "/mypage", "/update", "/member/:memberId"].includes(location.pathname) ||
    /^\/activity(\/.*)?$/.test(location.pathname) ||
    /^\/member(\/.*)?$/.test(location.pathname);
  const showCloud = !["/login", "/", "/sharedboard"].includes(location.pathname);

  useEffect(() => {
    const scrollablePages = [
      "/",
      "/community",
      "/mypage",
      "/ranking",
      "/activity",
      "/activity/:groupId"
    ];

    const isScrollable = scrollablePages.some((path) => {
      const regex = new RegExp(`^${path.replace(/:\w+/g, "\\w+")}$`);
      return regex.test(location.pathname);
    });

    if (isScrollable) {
      document.body.style.overflow = "";
    } else {
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [location.pathname]);

  const setUser = useUserStore((state) => state.setUser);
  const user = useUserStore((state) => state.user);

  useEffect(() => {
    if (user) {
      setUser(user);
    }
  }, [user, setUser]);

  return (
    <div className="min-h-screen w-full overflow-x-hidden">
      {!notSearchPage && <CustomHeader />}
      <div className="flex relative min-h-screen">
        {!isFullScreenPage && <CustomSidebar />}
        <main className={`flex-1 ${!isFullScreenPage ? "ml-28" : ""}`}>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<RootRedirect />} />
            <Route element={<ProtectedRoute />}>
              <Route path="/home" element={<Home />} />
              <Route path="/sharedboard" element={<SharedBoard />} />
              <Route path="/mypage" element={<MyPage />} />
              <Route path="/makecard" element={<MakeCard />} />
              <Route path="/update" element={<UpdateProfile />} />
              <Route path="/ranking" element={<Ranking />} />
              <Route path="/community" element={<Community />} />
              <Route path="/makecommunity" element={<MakeCommunity />} />
              <Route path="/activity" element={<Activity />} />
              <Route path="/activity/:groupId" element={<Activity />} />
              <Route path="/member/:memberId" element={<Member />} />
              {/* 다른 라우트들... */}
              {/* <Route path="/member/:memberName" element={<Member/>}/> */}
            </Route>
          </Routes>
        </main>
        {showCloud && (
          <div className="fixed right-0 bottom-0 overflow-hidden pointer-events-none z-0">
            <img
              src={cloudImg}
              alt="Background cloud"
              className="w-48 h-48 object-cover translate-x-1/6 translate-y-1/3"
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default App;