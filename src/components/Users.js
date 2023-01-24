import axios from "axios";
import { useState, useEffect } from "react";
import * as Icon from "react-bootstrap-icons";
import { AllCheckerCheckbox, Checkbox, CheckboxGroup } from '@createnl/grouped-checkboxes';

function Users() {
    function logout() {
        localStorage.removeItem("accessToken");
    };

    const [authState, setAuthState] = useState({
        username: "",
        id: 0,
        authStatus: false,
        authDate: ""
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

    const [users, setUsers] = useState([]);

    useEffect(() => {
        axios.get("http://localhost:3001/users").then(response => {
          setUsers(response.data);
        });
    }, [users]);

    const deleteUser = (id) => {
      axios.delete(`http://localhost:3001/users/${id}`).then(() => {
        if (id === authState.id) logout();
      })};

    const blockUser = (id) => {
      axios.put(`http://localhost:3001/users/${id}`).then(() => {
        authState.authStatus = false;
        if (id === authState.id && !authState.authStatus) {
          logout();
        }
        console.log("blocked")
      })};

    const unblockUser = (id) => {
      axios.patch(`http://localhost:3001/users/${id}`).then(() => {
        console.log("unblocked")
      })};

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
          axios.delete(`http://localhost:3001/users/${selectedUser[i]}`).then(() => {
            if (authState.id === selectedUser[i]) logout();
        })
      }
    };

    const blockSelectedUsers = () => {
      for (let i = 0; i < selectedUser.length; i++) {
        axios.put(`http://localhost:3001/users/${selectedUser[i]}`).then(() => {
          authState.authStatus = false;
          if (authState.id === selectedUser[i] && !authState.authStatus) logout();
      })
    }
  };

  const unblockSelectedUsers = () => {
    for (let i = 0; i < selectedUser.length; i++) {
      axios.patch(`http://localhost:3001/users/${selectedUser[i]}`).then(() => {
        console.log("unblocked");
    })
  }
};
        
    return (
        <div className="container">
        <button onClick={logout} className="btn btn-primary m-3">Выйти</button>
        <div>Вы зашли под именем: <b>{authState.username}</b></div>
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
                <th>Действия</th>
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
                    <td className="actions">
                      <button onClick={() => {blockUser(user.id)}}><Icon.LockFill /></button>
                      <button onClick={() => {unblockUser(user.id)}}><Icon.Unlock /></button>
                      <button onClick={() => {deleteUser(user.id)}}><Icon.Trash /></button>
                    </td>
                    </tr>
                )}
            )}
        </tbody>
        </table>
        </CheckboxGroup>
        

      </div>
    )
}

export default Users;