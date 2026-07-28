import { BrowserRouter, Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage'
import SubjectDetailPage from './pages/SubjectDetailPage'
import AppLayout from './layouts/AppLayout'

function App() {
  return (
    <BrowserRouter>
      <AppLayout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/subjects/:subjectId" element={<SubjectDetailPage />} />
        </Routes>
      </AppLayout>
    </BrowserRouter>
  )
}

export default App
