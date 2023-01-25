import './App.css';
import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Registration from "./pages/Registration";
import Navbar from "./components/Navbar";
import { AuthContext } from "./helpers/AuthContext";
import axios from "axios";

import * as Icon from "react-bootstrap-icons";
import { AllCheckerCheckbox, Checkbox, CheckboxGroup } from '@createnl/grouped-checkboxes';

function App() {
  const [authState, setAuthState] = useState({
    username: "",
    id: "",
    authStatus: false
  });

  useEffect(() => {
    async function fetchAuth() {
     await axios.get("https://users-ibkmt.herokuapp.com/auth", {
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
            authStatus: true
          });
        }
      })
    }
  fetchAuth();
  }, [setAuthState]);

  function logout() {
    localStorage.removeItem("accessToken");
    setAuthState({ username: "", id: "", authStatus: false });
  };

  const [users, setUsers] = useState([]);

    useEffect(() => {
        async function fetchData() {
          await axios.get("https://users-ibkmt.herokuapp.com/users").then(response => {
              setUsers(response.data);
          })
        }
        fetchData();
    }, [setUsers]);
    
      const [selectedUser, setSelectedUser] = useState([]);
      
      const onCheckboxChange = (checkboxes) => {
        let arr = [];
          for (let i = 0; i < checkboxes.length; i++) {
              if (checkboxes[i].checked) {
                arr = [...arr, checkboxes[i].id];
              }
            }
          setSelectedUser(arr);
      };

      const deleteSelectedUsers = () => {
        for (let i = 0; i < selectedUser.length; i++) {
          axios.delete(`https://users-ibkmt.herokuapp.com/users/${selectedUser[i]}`).then((response) => {
            if (authState.id === selectedUser[i]) {
              logout();
            }
            setUsers(response.data);
        })
      }
    };

    const blockSelectedUsers = () => {
      for (let i = 0; i < selectedUser.length; i++) {
        axios.put(`https://users-ibkmt.herokuapp.com/users/${selectedUser[i]}`).then((response) => {
          authState.authStatus = false;
          if (authState.id === selectedUser[i] && !authState.authStatus) {
            logout();
          }
          setUsers(response.data);
      })
    }
  };

  const unblockSelectedUsers = () => {
    for (let i = 0; i < selectedUser.length; i++) {
      axios.patch(`https://users-ibkmt.herokuapp.com/users/${selectedUser[i]}`).then((response) => {
        console.log("unblocked");
        setUsers(response.data);
    })
  }
};
  
  return (
    <div className="App">
    <AuthContext.Provider value={{ authState, setAuthState }}>
      <Router>
        {!authState.authStatus && ( <Navbar /> )}
        {authState.authStatus && ( 

        <div className="container">
        <button onClick={logout} className="btn btn-primary m-3">Выйти</button>
        <div>Вы авторизовались как: <b>{authState.username}</b></div>
        <div className="toolbar">
              <button onClick={() => {blockSelectedUsers()}}><Icon.LockFill />
                <span className="tooltip-text" id="top">Заблокировать</span>
              </button>
              <button onClick={() => {unblockSelectedUsers()}}><Icon.Unlock />
                <span className="tooltip-text" id="top">Разблокировать</span>
              </button>
              <button onClick={() => {deleteSelectedUsers()}}><Icon.Trash />
                <span className="tooltip-text" id="top">Удалить</span>
              </button>
            </div>
        
        <CheckboxGroup onChange={onCheckboxChange} className="form-check">
        <table className="table table-hover">
          <caption>Список пользователей</caption>
            <thead>
                <tr className="table-primary">
                <th scope="col">
                  <AllCheckerCheckbox className="form-check-input"/>
                </th>
                <th scope="col">ИД</th>
                <th scope="col">Имя</th>
                <th scope="col">Почта</th>
                <th scope="col">Дата регистрации</th>
                <th scope="col">Дата входа</th>
                <th scope="col" className="status">Статус</th>
                </tr>
            </thead>
            <tbody>
            {users.map((user, key) => {
                return (
                    <tr key={key}>
                    <td>
                    <Checkbox id={user.id} className="form-check-input"/>
                    </td>
                    <td>{user.id}</td>
                    <td>{user.username}</td>
                    <td>{user.email}</td>
                    <td>{user.regDate}</td>
                    <td>{user.authDate}</td>
                    <td className="status">{ user.status ? "Активный" : "Заблокирован" }
                    </td>
                    </tr>
                )}
            )}
        </tbody>
        </table>
        </CheckboxGroup>
      </div>
        )}
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