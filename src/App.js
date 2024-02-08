import { Route, Routes, Navigate } from "react-router-dom"
import { Provider } from "react-redux"
import { configureStore } from "@reduxjs/toolkit"
import rootReducer from "./reducers"
import Main2048 from "./components/2048/main"
import Main from "./components/main"
import Signup from "./components/signup"
import Login from "./components/login"
import Leaderboard2048 from "./components/2048/leaderboard"
import LeaderboardMS from "./components/minesweeper/leaderboard"
import UserScores2048 from "./components/2048/userscores"
import Profile from "./components/profile"
import Logout from "./components/logout"
import Contact from "./components/contact"
import MainMS from "./components/minesweeper/main"
import Schedule from "./components/schedule/main"
import MainC4 from "./components/connect-4/main"
import Apps from "./components/apps"

const store = configureStore({reducer: rootReducer})

function App() {
  const user = localStorage.getItem("token")
  const guest = (user === null)
  /*
    Routing
    /
    |- /2048
    | |- /leaderboard
    | |- /userscores
    |
    |- /minesweeper
    | |- /leaderboard
    |
    |- /connect-4
    |
    |- /schedule
    |- /myprofile (guests -> /login)
    |- /logout (guests -> /)
    |- /signup (users -> /)
    |- /login (users -> /)
    |- /contact
    |- /apps
  */
  return (
    <Provider store={store}>
      <Routes>
        <Route path="/" exact element={<Main />} />
        <Route path="/contact" exact element={<Contact />} />
        <Route path="/apps" exact element={<Apps />} />
        <Route path="/2048" exact element={<Main2048 />} />
        <Route path="/2048/leaderboard" exact element={<Leaderboard2048 />} />
        <Route path="/2048/userscores" exact element={<UserScores2048 />} />
        <Route path="/minesweeper" exact element={<MainMS />} />
        <Route path="/minesweeper/leaderboard" exact element={<LeaderboardMS />} />
        <Route path="/connect-4" exact element={<MainC4 />} />
        {user && <Route path="/myprofile" exact element={<Profile />} />}
        {user && <Route path="/logout" exact element={<Logout />} />}
        {guest && <Route path="/signup" exact element={<Signup />} />}
        {guest && <Route path="/login" exact element={<Login />} />}
        <Route path="/schedule" exact element={<Schedule />} />
        <Route path="/myprofile" element={<Navigate replace to="/login" />} />
        <Route path="/logout" element={<Navigate replace to="/" />} />
        <Route path="/signup" element={<Navigate replace to="/" />} />
        <Route path="/login" element={<Navigate replace to="/" />} />
      </Routes>
    </Provider>
  )
}

export default App;
