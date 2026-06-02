import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import Banner from './components/Banner'
import Navbar from './components/Navbar'
import Chatbot from './components/Chatbot'
import About from './pages/About'
import Projects from './pages/Projects'
import Blog from './pages/Blog'
import BlogRead from './pages/BlogRead'
import Contact from './pages/Contact'
import Dashboard from './pages/Dashboard'

function RequireOwner({ children }) {
  const { user } = useAuth();
  if (!user || user.role !== "owner") return <Navigate to="/" replace />
  return children;
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Banner />
        <Navbar />
        <Routes>
          <Route path="/" element={<About />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:slug" element={<BlogRead />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/dashboard" element={<RequireOwner><Dashboard /></RequireOwner>} />
        </Routes>
        <Chatbot />
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
