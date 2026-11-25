import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home/Home'

import Header from './components/Header/Header'
import NotFound from './pages/NotFound/NotFound'

function AppRoutes() {
  return (
    <BrowserRouter>
      <Header />

      <Routes>
        <Route path="/" element={<Home />} />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  )
}

export default AppRoutes