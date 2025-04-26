import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Login.css"
import { Form, Input, Button, message, Card, Layout } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import AppHeader from './AppHeader';


const Login = () => {
    const host = import.meta.env.VITE_HOST;
    const navigate = useNavigate();
    const handleSubmit = async (values) => {
        try {
            const response = await axios.post(`${host}/login`, values, { withCredentials: true, });
            navigate("/")
        } catch (error) {
            alert("Login failed");
        }
    };
    return (
        <Layout>
            <AppHeader></AppHeader>
            <Layout style={{height:"10vh"}}>
            </Layout>
            <Layout style={{ height: "90vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Card>
                    <Form onFinish={handleSubmit}>
                        <h1>Вход</h1>
                        <Form.Item
                            name="email"
                            rules={[
                                { required: true, message: "Пожалуйста, введите почту!" },
                                {
                                    type: "email",
                                    message: "Некорректный адрес почты!",
                                },
                            ]}>
                            <Input prefix={<UserOutlined />} placeholder="Почта" />
                        </Form.Item>
                        <Form.Item name="password" rules={[{ required: true, message: "Пожалуйста, введите пароль!" }]}>
                            <Input.Password prefix={<LockOutlined />} placeholder="Пароль" />
                        </Form.Item>
                        <Form.Item>
                            <Button type="primary" htmlType="submit" style={{ width: "100%" }} >
                                Войти
                            </Button>
                        </Form.Item>
                        <a onClick={() => {navigate("/signup");}}>Регистрация</a>
                    </Form>
                </Card>
            </Layout>
        </Layout>
    );
};

export default Login;