import "./App.css";

import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

function App() {
  
  function PrivateRoute({ children }) {
    const token = localStorage.getItem("token");
    return token ? children : <Navigate to="/signup" />;
  }

  return (
    <>
      <Router>
        

        <Routes>

        </Routes>
      </Router>
    </>
  );
}

export default App;
