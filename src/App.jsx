import "./App.css";

import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

// import pages and components
import Navbar from "./component/navbar/Navbar";
import HomePage from "./pages/home/HomePage";
import Signup from "./pages/signup/Signup";
import Login from "./pages/login/Login";
import Footer from "./component/footer/Footer";

function App() {
  function PrivateRoute({ children }) {
    const token = localStorage.getItem("token");
    return token ? children : <Navigate to="/signup" />;
  }

  return (
    <>
      <Router>
        <Navbar />

        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/allmeetup" element={<PrivateRoute><MeetupsPage /></PrivateRoute> }/>
        </Routes>

        <Footer />
      </Router>
    </>
  );
}

export default App;
