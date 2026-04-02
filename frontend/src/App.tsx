import { Route, Routes } from 'react-router'
import Home from './pages/Home'
import LandingPage from'./pages/LandingPage.tsx'
import { ReviewPage } from './pages/ReviewPage.tsx'
import SongPage from './pages/SongPage.tsx'

export default function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<LandingPage />}/>
        <Route path="/home" element={<Home />} />
        <Route path="/review" element={<ReviewPage />}/>
        <Route path="/songs/:songId" element={<SongPage />} />
      </Routes>
    </>
  )
}