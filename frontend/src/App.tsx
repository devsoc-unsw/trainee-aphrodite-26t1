import { Route, Routes } from 'react-router'
import Home from './pages/Home'
import LandingPage from'./pages/LandingPage.tsx'

export default function App() {
  return (
    <>
      <Routes>
        <Route index element={<Home />} />
        <Route path="/landing" element={<LandingPage />}/>
      </Routes>
    </>
  )
}