import { Route, Routes } from 'react-router'
import Home from './pages/Home'
import LandingPage from'./pages/LandingPage.tsx'
import { ReviewPage } from './pages/ReviewPage.tsx'
import SongPage from './pages/SongPage.tsx'
import FriendsPage from './pages/Friends.tsx'
import Profile from './pages/Profile.tsx'
import ExplorePage from './pages/ExplorePage.tsx'
import SearchPage from './pages/SearchPage.tsx'

export default function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<LandingPage />}/>
        <Route path="/home" element={<Home />} />
        <Route path="/friends" element={<FriendsPage />} />
        <Route path="/explore" element={<ExplorePage />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/users/:username" element={<Profile />} />
        <Route path="/reviews/:reviewId" element={<ReviewPage />}/>
        <Route path="/songs/:songId" element={<SongPage />} />
      </Routes>
    </>
  )
}