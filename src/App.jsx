import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import { Routes, Route } from "react-router-dom";
import NavbarComponent from './components/NavbarComponent';
import Home from './components/Home';
import Login from './components/Login';
import Profile from './components/Profile';
import Register from './components/Register';
import PrivateLayout from './components/PrivateLayout';
import MatchComponent from './components/MatchComponent';
import SearchComponent from './components/SearchComponent';

function App() {
  return (
    <>
      <NavbarComponent />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route element={<PrivateLayout />}>
          {/* <Route path="/search" element={<Search />} />
          <Route path="/chat" element={<Chat />} /> */}
          <Route path="/profile" element={<Profile />} />
          <Route path="/match" element={<MatchComponent />} />
          <Route path="/search" element={<SearchComponent />} />
        </Route>
      </Routes>

    </>
  )
}

export default App