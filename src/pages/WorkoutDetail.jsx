import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Layout, Row, Col, Spin, message, Typography, Button, Form, Input, Modal, Upload } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import axios from 'axios';
import moment from 'moment';
import AppHeader from './AppHeader';

const { Title, Paragraph } = Typography;

const WorkoutDetail = () => {
    const { id } = useParams();
    const [workout, setWorkout] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);
    const [fileList, setFileList] = useState([]); // Состояние для файла изображения
    const [form] = Form.useForm();
    const host = import.meta.env.VITE_HOST;
    useEffect(() => {
        const fetchData = async () => {
            try {
                // Получаем данные текущего пользователя
                const userResponse = await axios.get(`${host}/getuserdata`, { withCredentials: true });
                setCurrentUser(userResponse.data);

                // Получаем данные поста
                const workoutResponse = await axios.get(`${host}/workoutposts/${id}`, { withCredentials: true });
                console.log(workoutResponse.data);
                setWorkout(workoutResponse.data);
                form.setFieldsValue({
                    title: workoutResponse.data.Title,
                    description: workoutResponse.data.Description,
                });
            } catch (error) {
                message.error('Ошибка при загрузке данных');
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id, form]);

    // Обновление поста
    const handleUpdate = async (values) => {
        try {
            let imageUrl = workout.ImageURL; // Сохраняем текущий URL, если новое изображение не загружено

            // Если загружено новое изображение
            if (fileList.length > 0) {
                const file = fileList[0].originFileObj;
                const formData = new FormData();
                formData.append('image', file);

                const uploadResponse = await axios.post(`${host}/upload`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                    withCredentials: true,
                });
                imageUrl = uploadResponse.data.image_url; // Обновляем URL изображения
            }

            const payload = {
                Title: values.title,
                Description: values.description,
                ImageURL: imageUrl,
            };
            await axios.post(`${host}/updateworkoutposts/${id}`, payload, { withCredentials: true });
            setWorkout({ ...workout, Title: values.title, Description: values.description, ImageURL: imageUrl });
            setIsEditing(false);
            setFileList([]); // Сбрасываем список файлов
            message.success('Пост успешно обновлен');
        } catch (error) {
            message.error('Ошибка при обновлении поста');
            console.error(error);
        }
    };

    // Удаление поста
    const handleDelete = async () => {
        try {
            await axios.post(`${host}/deleteworkoutposts/${id}`, {}, { withCredentials: true });
            message.success('Пост успешно удален');
            window.location.href = '/';
        } catch (error) {
            message.error('Ошибка при удалении поста');
            console.error(error);
        }
    };

    // Обработчик загрузки файла
    const handleUploadChange = ({ fileList: newFileList }) => {
        setFileList(newFileList);
    };

    // Проверка, является ли текущий пользователь автором
    const isAuthor = currentUser && workout && currentUser.ID === workout.UserID;

    if (loading) return <Spin size="large" style={{ display: 'block', margin: '50px auto' }} />;
    if (!workout) return <div>Пост не найден</div>;

    const formattedDate = moment(workout.CreatedAt).format('DD.MM.YYYY');

    return (
        <Layout>
            <AppHeader />
            <Layout style={{ height: '10vh' }} />
            <Layout style={{ padding: '100px', height: '90vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <Row gutter={16} style={{ width: '100%' }}>
                    <Col span={16}>
                        {isEditing ? (
                            <Form form={form} onFinish={handleUpdate} initialValues={{ title: workout.Title, description: workout.Description }} layout="vertical">
                                <Form.Item name="title" label="Название" rules={[{ required: true, message: 'Введите название' }]}>
                                    <Input />
                                </Form.Item>
                                <Form.Item name="description" label="Описание" rules={[{ required: true, message: 'Введите описание' }]}>
                                    <Input.TextArea />
                                </Form.Item>
                                <Form.Item
                                    name="image"
                                    label="Изображение"
                                    valuePropName="fileList"
                                    getValueFromEvent={(e) => e.fileList}
                                    rules={[{ required: false, message: 'Загрузите изображение' }]}
                                >
                                    <Upload
                                        name="image"
                                        listType="picture"
                                        fileList={fileList}
                                        onChange={handleUploadChange}
                                        beforeUpload={() => false} // Предотвращаем автоматическую загрузку
                                        maxCount={1}
                                    >
                                        <Button icon={<PlusOutlined />}>Загрузить новое изображение</Button>
                                    </Upload>
                                </Form.Item>
                                <Form.Item>
                                    <Button type="primary" htmlType="submit">
                                        Сохранить
                                    </Button>
                                    <Button style={{ marginLeft: '10px' }} onClick={() => {
                                        setIsEditing(false);
                                        setFileList([]); // Сбрасываем файл при отмене
                                    }}>
                                        Отмена
                                    </Button>
                                </Form.Item>
                            </Form>
                        ) : (
                            <>
                                <Title level={2}>{workout.Title}</Title>
                                <Paragraph>{workout.Description}</Paragraph>
                            </>
                        )}
                    </Col>
                    <Col span={8} style={{ textAlign: 'center' }}>
                        <div style={{ width: '500px', textAlign: 'center' }}>
                            <div
                                style={{
                                    width: '500px',
                                    height: '500px',
                                    borderRadius: '8px',
                                    overflow: 'hidden',
                                }}
                            >
                                <img
                                    alt={workout.Title}
                                    src={`${host}/images/${workout.ImageURL}`}
                                    style={{
                                        width: '100%',
                                        height: '100%',
                                        objectFit: 'cover',
                                        objectPosition: 'center',
                                    }}
                                />
                            </div>
                            {workout.User && (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1px' }}>
                                    <Paragraph style={{ marginTop: '5px', width: '100%', fontSize: '1.5rem', marginBottom: '0px' }}>
                                        Автор: {workout.User.Username}
                                    </Paragraph>
                                    <Paragraph style={{ width: '100%', fontSize: '1rem', marginBottom: '0' }}>
                                        {formattedDate}
                                    </Paragraph>
                                </div>
                            )}
                            {isAuthor && !isEditing && (
                                <div style={{ marginTop: '10px' }}>
                                    <Button type="primary" onClick={() => setIsEditing(true)} style={{ marginRight: '10px' }}>
                                        Изменить
                                    </Button>
                                    <Button type="danger" onClick={handleDelete}>
                                        Удалить
                                    </Button>
                                </div>
                            )}
                        </div>
                    </Col>
                </Row>
            </Layout>
        </Layout>
    );
};

export default WorkoutDetail;