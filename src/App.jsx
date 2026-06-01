import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import Banner from './components/Banner'
import Navbar from './components/Navbar'
import Chatbot from './components/Chatbot'
import About from './pages/About'
import Projects from './pages/Projects'
import Blog from './pages/Blog'
import BlogRead from './pages/BlogRead'
import Contact from './pages/Contact'
import "./App.css"

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
        </Routes>
        <Chatbot />
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
