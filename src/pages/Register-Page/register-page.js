import style from "./register-page.module.css";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { server } from "../../Bff/";
import { useState } from "react";
import { Navigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { selectUserRole } from "../../selectors";
import { setUser } from "../../actions";
import { ROLE } from "../../constants/role";
import { useResetForm } from "../../hooks";
import { Header, VideoBackground } from "../components";
import Slider from "../components/slider/Slider";
import { InputMask } from "@react-input/mask";
import { useNavigate } from "react-router-dom";

// const phoneRegExp = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;

const regFormSchema = yup.object().shape({
  login: yup
    .string()
    .required("Заполните логин")
    .matches(/\w+$/, "Логин не подходит. Допускаются только буквы и цифры")
    .min(3, "Неверный логин. Логин слишком мал")
    .max(15, "Неверный логин. Логин слишком большой"),
  password: yup
    .string()
    .required("Пустой пароль")
    .matches(
      /^[\w#%]+$/,
      "Неподходящий пароль. Допускаются только буквы, цифры и символы"
    )
    .min(8, "Неверный пароль. Слишком мал. Не меньше 8 символов")
    .max(30, "Неверный пароль. Пароль слишком большой. Не больше 30 символов"),
  passcheck: yup
    .string()
    .required("Пустой пароль")
    .oneOf([yup.ref("password"), null], "Пароли должны совпадать!"),
  address: yup.string().required("Заполните адрес"),
  homeNumber: yup.string().required("Заполните домашний номер"),
  flatNumber: yup.string().required("Заполните квартиру"),
  phone: yup
    .string()
    // .matches(phoneRegExp, "Телефонный номер не подходит")
    .required("Заполните телефон"),
});

export const RegisterPage = () => {
  const {
    register,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      login: "",
      password: "",
      passcheck: "",
      address: "",
      homeNumber: "",
      flatNumber: "",
      phone: "",
    },
    resolver: yupResolver(regFormSchema),
  });

  const [serverError, setServerError] = useState();
  const roleId = useSelector(selectUserRole);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useResetForm(reset);

  const onSubmit = ({
    login,
    password,
    address,
    homeNumber,
    flatNumber,
    phone,
  }) => {
    server
      .register(login, password, address, homeNumber, flatNumber, phone)
      .then(({ error, res }) => {
        if (error) {
          setServerError(`Ошибка запроса ${error}`);
          return;
        }
        dispatch(setUser(res));
        sessionStorage.setItem("userData", JSON.stringify(res));
        navigate("/");
      });
  };

  const formError =
    errors?.login?.message ||
    errors?.password?.message ||
    errors?.passcheck?.message ||
    errors?.address?.message ||
    errors?.homeNumber?.message ||
    errors?.flatNumber?.message ||
    errors?.phone?.message;
  const errorMessage = formError || serverError;

  if (roleId !== ROLE.GUEST) {
    return <Navigate to="/" />;
  }

  return (
    <>
      <Header />
      <div className={style.registerPageWrapper}>
        <form onSubmit={handleSubmit(onSubmit)} className={style.registerForm}>
          <h2 className={style.registerFormTitle}>Регистрация</h2>
          <input
            type="text"
            placeholder="Логин"
            className={style.registerInput}
            {...register("login", {
              onChange: () => setServerError(null),
            })}
          ></input>
          <input
            type="password"
            placeholder="Пароль"
            className={style.registerInput}
            autoComplete="on"
            {...register("password", {
              onChange: () => setServerError(null),
            })}
          ></input>
          <input
            type="password"
            placeholder="Повтор пароля"
            className={style.registerInput}
            autoComplete="on"
            {...register("passcheck", {
              onChange: () => setServerError(null),
            })}
          ></input>
          <input
            type="text"
            placeholder="Адрес"
            className={style.registerInput}
            autoComplete="on"
            {...register("address", {
              onChange: () => setServerError(null),
            })}
          ></input>
          <input
            type="text"
            placeholder="Номер дома"
            className={style.registerInput}
            autoComplete="on"
            {...register("homeNumber", {
              onChange: () => setServerError(null),
            })}
          ></input>
          <input
            type="text"
            placeholder="Номер квартиры"
            className={style.registerInput}
            autoComplete="on"
            {...register("flatNumber", {
              onChange: () => setServerError(null),
            })}
          ></input>
          <InputMask
            mask="+7 (___) ___-__-__"
            replacement={{ _: /\d/ }}
            placeholder="Телефон"
            className={style.registerInput}
            autoComplete="on"
            {...register("phone", {
              onChange: () => setServerError(null),
            })}
          />
          {/* <input
            type="tel"
            // pattern="[0-9]{1}([0-9]{3})-[0-9]{3}-[0-9]{2}-[0-9]{2}"
            placeholder="Телефон"
            className={style.registerInput}
            autoComplete="on"
            {...register("phone", {
              onChange: () => setServerError(null),
            })}
          ></input> */}
          <button
            type="submit"
            disabled={!!formError}
            children={"Зарегистрироваться"}
            className={style.registerButton}
          ></button>
          {errorMessage && (
            <div className={style.errorMessage}>{errorMessage}</div>
          )}
        </form>
        <div className={style.sliderWrapper}>
          <Slider />
        </div>
      </div>
      <VideoBackground />
    </>
  );
};
