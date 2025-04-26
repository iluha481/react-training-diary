import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Input, Button, Modal, Form, Upload, message, Layout, Typography, Spin } from 'antd';
import { PlusOutlined, SearchOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import AppHeader from './AppHeader';

const WorkoutLog = () => {
    const [workouts, setWorkouts] = useState([]);
    const [filteredWorkouts, setFilteredWorkouts] = useState([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [form] = Form.useForm();
    const navigate = useNavigate();
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(false);
    const host = import.meta.env.VITE_HOST;
    useEffect(() => {
        setLoading(true);
        const fetchCurrentUser = async () => {
            try {
                const responseCurrentUser = await axios.get(`${host}/getuserdata`, { withCredentials: true });
                setCurrentUser(responseCurrentUser.data);
            } catch (err) {
                console.error(err);
            }
        }
        setLoading(false);
        fetchCurrentUser();
    }, [])

    // Загрузка списка постов при монтировании компонента
    useEffect(() => {
        fetchWorkouts();
    }, []);

    const fetchWorkouts = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${host}/workoutposts`, { withCredentials: true });
            setWorkouts(response.data);
            setFilteredWorkouts(response.data);
            console.log(response.data);
        } catch (error) {
            console.error('Ошибка при загрузке постов');
        }
        setLoading(false);
    };

    // Поиск постов по названию
    const handleSearch = (value) => {
        const filtered = workouts.filter((workout) =>
            workout.Title.toLowerCase().includes(value.toLowerCase())
        );
        setFilteredWorkouts(filtered);
    };

    // Показать модальное окно для создания поста
    const showModal = () => {
        setIsModalVisible(true);
    };

    // Закрыть модальное окно
    const handleCancel = () => {
        setIsModalVisible(false);
        form.resetFields();
    };

    // Создание нового поста с загрузкой изображения
    const handleCreateWorkout = async (values) => {
        try {
            // Загружаем изображение
            const file = values.image[0].originFileObj;
            const formData = new FormData();
            formData.append('image', file);

            const uploadResponse = await axios.post(`${host}/upload`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                withCredentials: true,
            });
            const imageUrl = uploadResponse.data.image_url; // Предполагаем, что бэкенд возвращает image_url
            console.log("image url: ", imageUrl);
            // Создаем пост
            const payload = {
                title: values.title,
                description: values.description,
                ImageURL: imageUrl,
            };
            const response = await axios.post(`${host}/workoutposts`, payload, { withCredentials: true });

            setWorkouts([...workouts, response.data]);
            setFilteredWorkouts([...workouts, response.data]);
            message.success('Пост успешно создан');
            handleCancel();
        } catch (error) {
            message.error('Ошибка при создании поста');
        }
    };

    // Переход на страницу с подробной информацией о посте
    const handleCardClick = (id) => {
        navigate(`/articles/${id}`);
    };
    if (loading) {
        return (
            <Layout style={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <Spin size="large" />
            </Layout>
        );
    }

    return (
        <Layout>
            <AppHeader />
            <Layout style={{ height: '10vh' }} />

            {currentUser ? (
                <Layout style={{ padding: '20px', minHeight: '90vh' }}>
                    <Row >
                        <Input.Search
                            placeholder="Поиск по названию поста"
                            enterButton={<SearchOutlined />}
                            size="large"
                            onSearch={handleSearch}
                            style={{ marginBottom: '20px', width: "85%" }}
                        />
                        <Button
                            type="primary"
                            icon={<PlusOutlined />}
                            onClick={showModal}
                            style={{ marginTop: "3px", marginLeft: '3%', width: "10%" }}
                        >
                            Добавить пост
                        </Button>
                    </Row>
                    <Row gutter={[16, 16]}>
                        {filteredWorkouts.map((workout) => (
                            <Col xs={24} sm={12} md={8} lg={6} key={workout.ID}>
                                <Card
                                    hoverable
                                    cover={
                                        <div
                                            style={{
                                                width: '100%',           // Ширина контейнера равна ширине карточки
                                                height: '250px',         // Фиксированная высота для всех изображений
                                                overflow: 'hidden',      // Обрезаем изображение, если оно выходит за пределы
                                                borderRadius: '8px 8px 0 0', // Скругленные углы сверху
                                            }}
                                        >
                                            <img
                                                alt={workout.Title}
                                                src={`${host}/images/${workout.ImageURL}`}
                                                style={{
                                                    width: '100%',
                                                    height: '100%',
                                                    objectFit: 'cover',  // Изображение заполняет контейнер с обрезкой
                                                    objectPosition: 'center', // Центрируем изображение для обрезки
                                                }}
                                            />
                                        </div>
                                    }
                                    onClick={() => handleCardClick(workout.ID)}
                                    style={{ height: '100%' }} // Устанавливаем одинаковую высоту для карточек
                                >
                                    <Card.Meta title={workout.Title} />
                                </Card>
                            </Col>
                        ))}
                    </Row>
                    <Modal
                        title="Добавить новый пост"
                        visible={isModalVisible}
                        onCancel={handleCancel}
                        footer={null}
                    >
                        <Form form={form} onFinish={handleCreateWorkout} layout="vertical">
                            <Form.Item
                                name="title"
                                label="Название поста"
                                rules={[{ required: true, message: 'Введите название поста' }]}
                            >
                                <Input />
                            </Form.Item>
                            <Form.Item
                                name="description"
                                label="Описание"
                                rules={[{ required: true, message: 'Введите описание' }]}
                            >
                                <Input.TextArea />
                            </Form.Item>
                            <Form.Item
                                name="image"
                                label="Изображение"
                                valuePropName="fileList"
                                getValueFromEvent={(e) => e.fileList}
                                rules={[{ required: true, message: 'Загрузите изображение' }]}
                            >
                                <Upload
                                    name="image"
                                    listType="picture"
                                    maxCount={1}
                                    beforeUpload={() => false} // Предотвращаем автоматическую загрузку
                                >
                                    <Button icon={<PlusOutlined />}>Загрузить</Button>
                                </Upload>
                            </Form.Item>
                            <Form.Item>
                                <Button type="primary" htmlType="submit" block>
                                    Добавить
                                </Button>
                            </Form.Item>
                        </Form>
                    </Modal>
                </Layout>
            ) : (<Layout style={{ height: '90vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Typography style={{ fontSize: '50px', textAlign: 'center' }}>
                    <span>Вы не авторизованы</span>
                </Typography>
                <Button onClick={() => { navigate("/login") }} type="primary" style={{ marginTop: "10px" }}>Войти</Button>
                <Button onClick={() => { navigate("/signup") }} type="primary" style={{ margin: "20px" }}>Зарегистрироваться</Button>
            </Layout>)}
        </Layout>

    );
};

export default WorkoutLog;