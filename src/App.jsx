import "./App.css";

import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

// import pages and components
import Navbar from "./component/navbar/Navbar";
import Signup from "./pages/signup/Signup";
import Footer from "./component/footer/Footer";
import Login from "./pages/login/Login";

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
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
        </Routes>

        <Footer />
      </Router>
    </>
  );
}

export default App;
