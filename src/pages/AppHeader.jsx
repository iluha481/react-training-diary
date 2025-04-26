import React, { useContext, useEffect, useState } from "react";
import { Switch, Layout, Button, Avatar } from 'antd';
import { useNavigate } from "react-router-dom";
import { BulbOutlined, BulbFilled, UserOutlined } from "@ant-design/icons";
import { ThemeContext } from "../ThemeContext";
import axios from 'axios';

const { Header } = Layout;

const AppHeader = () => {
  const host = import.meta.env.VITE_HOST;
  const navigate = useNavigate();
  const { theme, toggleTheme } = useContext(ThemeContext);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [userData, setUserData] = useState(null);

  const checkIsAuthorized = async () => {
    try {
      const response = await axios.get(`${host}/getuserdata`, { withCredentials: true });
      setIsAuthorized(true);
      setUserData(response.data);
    } catch (err) {
      setIsAuthorized(false);
    }
  };

  useEffect(() => {
    checkIsAuthorized();
  }, []);

  const Logout = async () => {
    try {
      await axios.get(`${host}/logout`, { withCredentials: true });
    } catch (err) {
      console.error(err);
    }
    checkIsAuthorized();
  };

  const ProfileBlock = () => {
    if (isAuthorized && userData) {
      return (
        <div style={{ display: "flex", alignItems: "center" }}>
          <Avatar style={{cursor:"pointer"}} size={64} src={`${host}/images/${userData.AvatarURL}`} onClick={() => { navigate(`/user/${userData.Username}`)}} />
          <span style={{ marginLeft: 10, cursor:"pointer" }} onClick={() => { navigate(`/user/${userData.Username}`)}} >{userData.Username}</span>
          <Button onClick={Logout} style={{ marginLeft: 10 }}>Выйти</Button>
        </div>
      );
    } else {
      return (
        <div style={{ display: "flex", alignItems: "center" }}>
          <a onClick={() => navigate("/login")} style={{ margin: "0 10px", textDecoration: "none", color: "inherit" }}>Войти</a>
          <a onClick={() => navigate("/signup")} style={{ margin: "0 10px", textDecoration: "none", color: "inherit" }}>Зарегистрироваться</a>
        </div>
      );
    }
  };

  return (
    <Header style={{
      position: "fixed",
      top: 0,
      left: 0,
      width: "100%",
      zIndex: 1000,
      height: "10vh",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      backgroundColor: "inherit",
      borderBottom: "1px solid",
      borderColor: "black",
    }}>
      <div style={{ display: "flex", alignItems: "center" }}>
        <a onClick={() => navigate("/")} style={{ fontSize: "1.5rem", margin: "0 10px", textDecoration: "none", color: "inherit" }}>Главная</a>
        <a onClick={() => navigate("/workouts")} style={{ fontSize: "1.5rem", margin: "0 10px", textDecoration: "none", color: "inherit" }}>Тренировки</a>
        <a onClick={() => navigate("/articles")} style={{ fontSize: "1.5rem", margin: "0 10px", textDecoration: "none", color: "inherit" }}>Статьи</a>
      </div>
      <div style={{ display: "flex", alignItems: "center" }}>
        <Switch
          checked={theme === 'dark'}
          onChange={toggleTheme}
          checkedChildren={<BulbFilled />}
          unCheckedChildren={<BulbOutlined />}
          style={{ marginRight: 20 }}
        />
        <ProfileBlock />
      </div>
    </Header>
  );
};

export default AppHeader;