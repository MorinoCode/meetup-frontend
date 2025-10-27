import "./App.css";

import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Navbar from "./component/navbar/Navbar";

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

          
        </Routes>
      </Router>
    </>
  );
}

export default App;
