import axios from "axios";
import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../helpers/AuthContext';

function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const { setAuthState } = useContext(AuthContext);
    const navigate = useNavigate();
    
    const login = () => {
        const data = { username: username, password: password };
        axios.post("https://users-ibkmt.herokuapp.com/auth/login", data).then((response) => {
            if (response.data.error) {
              alert(response.data.error);
            } else {
              console.log(response.data);
              localStorage.setItem("accessToken", response.data.token);
              setAuthState({
                username: response.data.username,
                id: response.data.id,
                authStatus: true,
                authDate: response.data.authDate,
              });
              navigate("/");
            }
        });
    };

  return (
    <div className="form m-auto">
      <h1 className="h3 mb-3 fw-normal">Вход</h1>
      <div className="p-2">
        <input 
        type="text" 
        onChange={(event) => {
          setUsername(event.target.value);
        }}
        className="form-control"
        placeholder="Имя пользователя"
        />
      </div>

      <div className="p-2">
      <input
        type="password" 
        onChange={(event) => {
          setPassword(event.target.value);
        }}
        className="form-control"
        placeholder="Пароль"
      />
      </div>

      <button onClick={login} className="w-50 m-3 btn btn-lg btn-primary">Войти</button>
    </div>
  );
}

export default Login;