import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Layout, Spin, Typography, Button, Form, Input, Modal, Upload, Card, message } from 'antd';
import { PlusOutlined, EditOutlined } from '@ant-design/icons';
import AppHeader from './AppHeader';
import moment from 'moment';

const { Title, Paragraph, Text } = Typography;

const UserPage = () => {
    const { username } = useParams();
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [fileList, setFileList] = useState([]); // Состояние для файла изображения
    const [form] = Form.useForm();
    const [currentUser, setCurrentUser] = useState(null);
    const host = import.meta.env.VITE_HOST;
    useEffect(() => {
        const fetchUserData = async () => {
            setLoading(true);
            try {
                const responseCurrentUser = await axios.get(`${host}/getuserdata`, { withCredentials: true });
                setCurrentUser(responseCurrentUser.data);
                const response = await axios.get(`${host}/getuser?username=${username}`, {
                    withCredentials: true,
                });
                setUserData(response.data.user);
                form.setFieldsValue({
                    username: response.data.user.Username,
                });
            } catch (error) {
                console.error('Ошибка при загрузке данных пользователя:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchUserData();
    }, [username, form]);

    const isCurrentUser = currentUser && userData && currentUser.ID === userData.ID;

    // Обновление данных пользователя
    const handleUpdate = async (values) => {
        try {
            let avatarUrl = userData.AvatarURL;

            if (fileList.length > 0) {
                const file = fileList[0].originFileObj;
                const formData = new FormData();
                formData.append('image', file);

                const uploadResponse = await axios.post(`${host}/upload`, formData, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                    withCredentials: true,
                });
                avatarUrl = uploadResponse.data.image_url;
            }

            const payload = { Username: values.username, AvatarURL: avatarUrl };
            await axios.post(`${host}/updateuserdata`, payload, { withCredentials: true });
            setUserData({ ...userData, Username: values.username, AvatarURL: avatarUrl });
            setIsModalVisible(false);
            setFileList([]);
            message.success('Профиль успешно обновлен', 2);
        } catch (error) {
            message.error('Ошибка при обновлении профиля');
            console.error(error);
        }
    };

    // Обработчик загрузки файла
    const handleUploadChange = ({ fileList: newFileList }) => {
        setFileList(newFileList);
    };

    // Показать модальное окно
    const showModal = () => {
        setIsModalVisible(true);
    };

    // Закрыть модальное окно
    const handleCancel = () => {
        setIsModalVisible(false);
        setFileList([]);
        form.resetFields();
    };

    if (loading) {
        return (
            <Layout style={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                <Spin size="large" />
            </Layout>
        );
    }

    if (!userData) {
        return (
            <Layout>
                <AppHeader />
                <Layout style={{height:'10vh'}}></Layout>
                <Layout style={{ padding: '20px', minHeight: '90vh'}}>
                    <Typography>
                        <Title level={2} style={{ textAlign: 'center'}}>
                            Пользователь {username} не найден
                        </Title>
                    </Typography>
                </Layout>
            </Layout>
        );
    }

    return (
        <Layout style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #e0eafc, #cfdef3)' }}>
            <AppHeader />
            <Layout style={{ height: '10vh' }}></Layout>
            <Layout style={{ padding: '40px 20px', minHeight: '90vh' }}>
                <Card
                    style={{
                        maxWidth: '800px',
                        margin: '0 auto',
                        borderRadius: '15px',
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                        
                        overflow: 'hidden',
                        transition: 'all 0.3s ease',
                    }}
                    cover={
                        <div
                            style={{
                                width: '100%',
                                height: '400px',
                                overflow: 'hidden',
                                position: 'relative',
                            }}
                        >
                            <img
                                alt=''
                                src={`${host}/images/${userData.AvatarURL}`}
                                style={{
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'cover',
                                    filter: 'brightness(0.9)',
                                }}
                            />
                            <div
                                style={{
                                    position: 'absolute',
                                    top: '50%',
                                    left: '50%',
                                    transform: 'translate(-50%, -50%)',
                                    
                                    textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)',
                                }}
                            >   
                            {!userData.AvatarURL&& (<Title level={1} style={{ margin: 0 }}>
                                    {userData.Username}
                                </Title>)}
                                
                            </div>
                        </div>
                    }
                >
                    <div style={{ padding: '20px' }}>
                        <Typography>
                            <Paragraph style={{ fontSize: '18px', marginBottom: '15px' }}>
                                <Text strong>Имя:</Text> {userData.Username || 'Не указано'}
                            </Paragraph>
                            <Paragraph style={{ fontSize: '18px', marginBottom: '15px' }}>
                                <Text strong>Дата регистрации:</Text>{' '}
                                {moment(userData.CreatedAt).format('DD.MM.YYYY') || 'Не указано'}
                            </Paragraph>
                        </Typography>
                        {isCurrentUser && (
                            <Button
                                type="primary"
                                icon={<EditOutlined />}
                                onClick={showModal}
                                style={{
                                    marginTop: '20px',
                                    width: '200px',
                                    background: 'linear-gradient(45deg, #1890ff, #40a9ff)',
                                    border: 'none',
                                    color: '#fff',
                                    transition: 'all 0.3s ease',
                                }}
                                onMouseEnter={(e) => (e.target.style.background = 'linear-gradient(45deg, #40a9ff, #1890ff)')}
                                onMouseLeave={(e) => (e.target.style.background = 'linear-gradient(45deg, #1890ff, #40a9ff)')}
                            >
                                Редактировать профиль
                            </Button>
                        )}
                    </div>
                </Card>

                <Modal
                    title={
                        <Title level={3} style={{ color: '#1890ff', textAlign: 'center' }}>
                            Редактировать профиль
                        </Title>
                    }
                    visible={isModalVisible}
                    onCancel={handleCancel}
                    footer={null}
                    style={{ top: '20px' }}
                    bodyStyle={{ padding: '30px' }}
                >
                    <Form form={form} onFinish={handleUpdate} initialValues={{ username: userData.Username }} layout="vertical">
                        <Form.Item
                            name="username"
                            label={<Text strong style={{ color: '#333' }}>Имя пользователя</Text>}
                            rules={[{ required: true, message: 'Введите имя пользователя' }]}
                        >
                            <Input placeholder="Введите новое имя" style={{ padding: '8px', borderRadius: '8px' }} />
                        </Form.Item>
                        <Form.Item
                            name="avatar"
                            label={<Text strong style={{ color: '#333' }}>Аватар</Text>}
                            valuePropName="fileList"
                            getValueFromEvent={(e) => e.fileList}
                            rules={[{ required: false, message: 'Загрузите аватар' }]}
                        >
                            <Upload
                                name="avatar"
                                listType="picture-card"
                                fileList={fileList}
                                onChange={handleUploadChange}
                                beforeUpload={() => false}
                                maxCount={1}
                            >
                                {fileList.length === 0 && <div><PlusOutlined /><div style={{ marginTop: 8 }}>Загрузить</div></div>}
                            </Upload>
                        </Form.Item>
                        <Form.Item>
                            <Button
                                type="primary"
                                htmlType="submit"
                                style={{
                                    width: '100%',
                                    background: 'linear-gradient(45deg, #1890ff, #40a9ff)',
                                    border: 'none',
                                    color: '#fff',
                                    padding: '8px',
                                    borderRadius: '8px',
                                    transition: 'all 0.3s ease',
                                }}
                                onMouseEnter={(e) => (e.target.style.background = 'linear-gradient(45deg, #40a9ff, #1890ff)')}
                                onMouseLeave={(e) => (e.target.style.background = 'linear-gradient(45deg, #1890ff, #40a9ff)')}
                            >
                                Сохранить
                            </Button>
                            <Button
                                style={{ width: '100%', marginTop: '10px', borderRadius: '8px' }}
                                onClick={handleCancel}
                            >
                                Отмена
                            </Button>
                        </Form.Item>
                    </Form>
                </Modal>
            </Layout>
        </Layout>
    );
};

export default UserPage;