import "./App.css";

import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

// import pages
import Navbar from "./component/navbar/Navbar";
import Signup from "./pages/signup/Signup";

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

          
        </Routes>
      </Router>
    </>
  );
}

export default App;
