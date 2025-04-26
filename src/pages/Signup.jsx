import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Login.css"
import { Form, Input, Button, message, Card, Layout } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import AppHeader from './AppHeader';
import Password from "antd/es/input/Password";


const Signup = () => {
    const navigate = useNavigate();
    const host = import.meta.env.VITE_HOST;
    const handleSubmit = async (values) => {
        try {
            const response = await axios.post(`${host}/signup`, values, { withCredentials: true, });
            navigate("/login")
        } catch (error) {
            alert("Login failed");
        }
    };
    return (
        <Layout>
            <AppHeader></AppHeader>
            <Layout style={{ height: "10vh" }}>
            </Layout>
            <Layout style={{ height: "90vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Card>
                    <Form onFinish={handleSubmit}>
                        <h1>Регистрация</h1>
                        <Form.Item
                            name="username"
                            rules={[
                                { required: true, message: "Пожалуйста, введите имя!" },
                                {
                                    type: "username",
                                    message: "Некорректное имя!",
                                },
                            ]}>
                            <Input prefix={<UserOutlined />} placeholder="Имя" />
                        </Form.Item>
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
                        <Form.Item
                            name="confirmPassword"
                            dependencies={["password"]}
                            hasFeedback
                            rules={[
                                {
                                    required: true,
                                    message: "Пожалуйста, подтвердите пароль!",
                                },
                                ({ getFieldValue }) => ({
                                    validator(_, value) {
                                        if (!value || getFieldValue("password") === value) {
                                            return Promise.resolve();
                                        }
                                        return Promise.reject(new Error("Пароли не совпадают!"));
                                    },
                                }),
                            ]}>
                            <Input.Password prefix={<LockOutlined />} placeholder="Подтвердите пароль" />
                        </Form.Item>
                        <Form.Item>
                            <Button type="primary" htmlType="submit" style={{ width: "100%" }} >
                                Зарегистрироваться
                            </Button>
                        </Form.Item>
                        <a onClick={() => {navigate("/login");}}>Войти</a>
                    </Form>
                </Card>
            </Layout>
        </Layout>
    );
};

export default Signup;
