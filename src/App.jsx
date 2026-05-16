
import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import NavbarComponent from './components/NavbarComponent';
import Home from './components/Home';
function App() {


  return (
    <>
      <BrowserRouter>
        <NavbarComponent />
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
      </BrowserRouter>


    </>
  )
}

export default App
