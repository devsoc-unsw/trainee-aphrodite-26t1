import { Route, Routes } from 'react-router'
import Home from './pages/Home'
import LandingPage from'./pages/LandingPage.tsx'
import { ReviewPage } from './pages/ReviewPage.tsx'
import SongPage from './pages/SongPage.tsx'
import FriendsPage from './pages/Friends.tsx'
import Profile from './pages/Profile.tsx'
import ExplorePage from './pages/ExplorePage.tsx'
import SearchPage from './pages/SearchPage.tsx'
import GoogleCallback from './pages/GoogleCallback.tsx'
import ProtectedRoute from "./components/protected/ProtectedRoute.tsx";

export default function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<LandingPage />}/>
        <Route path="/callback" element={<GoogleCallback />} />
        <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
        <Route path="/friends" element={<ProtectedRoute><FriendsPage /></ProtectedRoute>} />
        <Route path="/explore" element={<ProtectedRoute><ExplorePage /></ProtectedRoute>} />
        <Route path="/search" element={<ProtectedRoute><SearchPage /></ProtectedRoute>} />
        <Route path="/users/:username" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/reviews/:reviewId" element={<ProtectedRoute><ReviewPage /></ProtectedRoute>}/>
        <Route path="/songs/:songId" element={<ProtectedRoute><SongPage /></ProtectedRoute>} />
      </Routes>
    </>
  )
}