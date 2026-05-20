import './App.css'
import { Routes, Route } from "react-router-dom";
import NavbarComponent from './components/NavbarComponent';
import Home from './components/Home';
import Login from './components/Login';
import Profile from './components/Profile';
import Register from './components/Register';

function App() {
  return (
    <>
      <NavbarComponent />
      <main className="app-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </main>
    </>
  )
}

export default App