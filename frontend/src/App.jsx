import { BrowserRouter, Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage'
import SubjectDetailPage from './pages/SubjectDetailPage'
import AppLayout from './layouts/AppLayout'
import { ToastProvider } from './context/ToastContext'
import Toast from './components/Toast'

function App() {
  return (
    <ToastProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<AppLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/subjects/:subjectId" element={<SubjectDetailPage />} />
          </Route>
        </Routes>
        <Toast />
      </BrowserRouter>
    </ToastProvider>
  )
}

export default App
