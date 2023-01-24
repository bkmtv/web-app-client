import axios from "axios";
import { useNavigate } from 'react-router-dom';
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";

function Registration() {
    const navigate = useNavigate();
    const initialValue = {
        username: "",
        email: "",
        password: "",
      };
    
    const validationSchema = Yup.object().shape({
        username: Yup.string().min(1).max(20).required(),
        email: Yup.string().min(1).required(),
        password: Yup.string().min(1).max(20).required(),
      });

    const onSubmit = (data) => {
        axios.post("http://localhost:3001/auth/register", data).then(() => {
          alert("Регистрация прошла успешно");
          navigate("/login");
        });
    };

  return (
    <div className="form m-auto">
    <h1 className="h3 mb-3 fw-normal">Регистрация</h1>
      <Formik 
        initialValues={initialValue}
        onSubmit={onSubmit}
        validationSchema={validationSchema}
      >
        <Form>
        <div className="p-2">
          <Field
            name="username"
            placeholder="Имя пользователя"
            className="form-control"
          />
          </div>

          <div className="p-2">
          <Field
            name="email"
            placeholder="Почта"
            className="form-control"
          />
          </div>

          <div className="p-2">
          <Field
            type="password"
            name="password"
            placeholder="Пароль"
            className="form-control"
          />
          </div>

      <button type="submit" className="w-50 m-3 btn btn-lg btn-primary">Отправить</button>
      </Form>
      </Formik>
    </div>
  );
}

export default Registration;