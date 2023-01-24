import './App.css';
import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Registration from "./pages/Registration";
import Navbar from "./components/Navbar";
import Users from "./components/Users";
import { AuthContext } from "./helpers/AuthContext";
import axios from "axios";

function App() {
  const [authState, setAuthState] = useState({
    username: "",
    id: 0,
    authStatus: false,
    authDate: "",
  });

  useEffect(() => {
    axios.get("http://localhost:3001/auth", {
      headers: {
        accessToken: localStorage.getItem("accessToken"),
      },
    })
    .then((response) => {
      if (response.data.error) {
        setAuthState({ ...authState, authStatus: false });
      } else {
        setAuthState({
          username: response.data.username,
          id: response.data.id,
          authStatus: true,
          authDate: response.data.authDate,
        });
      }
    });
  });
  
  return (
    <div className="App">
    <AuthContext.Provider value={{ authState, setAuthState }}>
      <Router>
        {!authState.authStatus && ( <Navbar /> )}
        {authState.authStatus && ( <Users /> )}
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/registration" element={<Registration />} />
          <Route path="*" element={<></>} />
        </Routes>
      </Router>
    </AuthContext.Provider>
    </div>
  );
}

export default App;