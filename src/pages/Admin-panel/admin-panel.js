import style from "./admin-panel.module.css";
import { useState } from "react";
import { useSelector } from "react-redux";
import { selectUserRole } from "../../selectors";
import { checkAccess } from "../../utils";
import { ROLE } from "../../constants/role";
import { PrivateContent, UserRow } from "../components";
import { PrivateEditForm } from "../Product-Page/private-edit-form.js";
import { setUser } from "../../actions";
import { useLayoutEffect,useEffect, useCallback } from "react";
import { useDispatch } from "react-redux";
import { Header, Orders, Reports } from "../components";
import {getUsersFetch, getRolesFetch, getOrdersFetch, removeUserFetch, updateBusketOrdersFetch, deleteBusketOrderFetch, getReportsFetch, deleteReportFetch} from "../../fetchs";
import { CLOSE_MODAL, openModal } from "../../actions";

export const AdminPanel = () => {
  const dispatch = useDispatch();
  const [users, setUsers] = useState([]);
  const [role, setRole] = useState([]);
  const [errorMessage, setErrorMessage] = useState(null);
  const [shouldUpdateUserList, setShouldUpdateUserList] = useState(false);
  const userRole = useSelector(selectUserRole);
  const newProduct = {
    id: "",
    productName: "",
    image_url: "",
    description: "",
    category: "",
    weight: "",
    calories: "",
    ingredients: "",
    price: "",
    comments: [],
  };
  const [orders, setOrders] = useState([]);
  const [paidStatus, setPaidStatus] = useState(false);
  const [deliveryStatus, setDeliveryStatus] = useState(false);
  const [reports, setReports] = useState([]);

  
  const onBusketOrderUpdate = (objParams) => {
    updateBusketOrdersFetch(objParams);
  };


  const onBusketOrderDelete = (id) => {  
    dispatch(
      openModal({
        text: "Удалить заказ? ",
        onConform: () => {
          dispatch(CLOSE_MODAL);
          deleteBusketOrderFetch(id);
        },
        onCancel: () => {
          dispatch(CLOSE_MODAL);
        },
      })
    );

  };
  const deleteReport = (id) => {
    console.log("deleteReport", id);
    dispatch(
      openModal({
        text: "Удалить жалобу? ",
        onConform: () => {
          dispatch(CLOSE_MODAL);
          deleteReportFetch(id);
        },
        onCancel: () => {
          dispatch(CLOSE_MODAL);
        },
      })
    );
  };

  const onUserRemove = useCallback((userId) => {
    if (!checkAccess([ROLE.ADMIN], userRole)) {
      setErrorMessage("Доступ запрещен");
      return;
    }
    const user = users.find((user) => user.id === userId);

    if (user.roleId === 0){
      setErrorMessage("Нельзя удалить администратора");
      return;
    }
      setErrorMessage(null);
      removeUserFetch(userId).then(() => {
        setShouldUpdateUserList(!shouldUpdateUserList);
      });
    }, [users, shouldUpdateUserList, userRole]);

  useLayoutEffect(() => {
    const currentUserDataJSON = sessionStorage.getItem("userData");
    if (!currentUserDataJSON) {
      return;
    }

    const currentUserData = JSON.parse(currentUserDataJSON);
    dispatch(
      setUser({ ...currentUserData, roleId: Number(currentUserData.roleId) })
    );


  }, [ dispatch ]);

  useEffect(() => {
    if (!checkAccess([ROLE.ADMIN, ROLE.MODERATOR], userRole)) {
      setErrorMessage("Доступ запрещен ");
      return;
    }
    Promise.all([
    getUsersFetch(),
    getRolesFetch(),
    getOrdersFetch(),
    getReportsFetch()
  ]).then(([usersRes, rolesRes, ordersRes, reportsRes]) => {
      setUsers(usersRes);
      setRole(rolesRes);
      setOrders(ordersRes);
      setReports(reportsRes);
    });
  }, [dispatch, userRole, shouldUpdateUserList, paidStatus, deliveryStatus,onBusketOrderUpdate, onBusketOrderDelete]);



  return (
    <>
      <Header />
      <div className={style.AdminPanelWrapper}>
        {userRole === ROLE.ADMIN || userRole === ROLE.MODERATOR ? (
          <details className={style.AdminPanelDetails}>
            <summary className={style.AdminPanelSummary}>
              Добавить новый продукт
            </summary>
              <PrivateEditForm product={newProduct} />
          </details>
        ) : null}
        {userRole === ROLE.ADMIN || userRole === ROLE.MODERATOR ? (
          <details className={style.AdminPanelDetails}>
            <summary className={style.AdminPanelSummary}>Пользователи</summary>
            {errorMessage ? <div >{errorMessage}</div> : null}
            <PrivateContent access={[ROLE.ADMIN]} serverError={errorMessage}>
              <div>
                {users?.map(
                  ({ id, login, address ,homeNumber,flatNumber, phone, registed_at, roleId }) => (
                    <UserRow
                      key={id}
                      id={id}
                      login={login}
                      address={address}
                      homeNumber={homeNumber}
                      flatNumber={flatNumber}
                      phone={phone}
                      registed_at={registed_at}
                      roleId={roleId}
                      roles={role.filter(
                        ({ id: role_id }) => role_id !== ROLE.GUEST
                      )}
                      onUserRemove={() => onUserRemove(id)}
                    />
                  )
                )}
              </div>
            </PrivateContent>
          </details>
        ) : null}

        {userRole === ROLE.ADMIN || userRole === ROLE.MODERATOR ? (
          <details>
            <summary className={style.AdminPanelSummary}>Заказы</summary>
            <div className={style.OrdersWrapper}>
              <Orders users={users} orders={orders} setPaidStatus={setPaidStatus} setDeliveryStatus={setDeliveryStatus} onBusketOrderUpdate={onBusketOrderUpdate} paidStatus={paidStatus} deliveryStatus={deliveryStatus} onBusketOrderDelete={onBusketOrderDelete}/>
            </div>
          </details>
        ) : null}

        {userRole === ROLE.ADMIN || userRole === ROLE.MODERATOR ? (
            <details>
            <summary className={style.AdminPanelSummary}>Жалобы</summary>
            <div>
               <Reports users={users} reports={reports} deleteReport={deleteReport}/>
            </div>
            </details>
        ) : null}
      </div>
    </>
  );
};
