import './App.css'
import { Routes, Route } from "react-router-dom";
import NavbarComponent from './components/NavbarComponent';
import Home from './components/Home';
import Login from './components/Login';
import Profile from './components/Profile';
function App() {


  return (
    <>
      <NavbarComponent />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>


    </>
  )
}

export default App
