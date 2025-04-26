import React from 'react';
import { Layout, Typography, Row, Col, Card } from 'antd';
import './HomePage.css'; // Подключим стили
import AppHeader from './AppHeader';

const { Content } = Layout;
const { Title, Paragraph } = Typography;

const images = [
    'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=500', 
    'https://sun1-29.userapi.com/s/v1/ig2/BGzcgSM7vqk6g9InwexFz03T4RlbEsdCiuBasMTaJOgRCkCmoDYVNABqy1s5gQUhEAHMELEda6QUQO2AL64-6BWb.jpg?quality=96&as=32x32,48x48,72x72,108x108,160x160,240x240,360x360,480x480,540x540,640x640,720x720,1080x1080&from=bu&u=Ox-cAgTaZ-lRdp-qioS1L73tLQ6HZIjt1OEKXRCyh-4&cs=807x807',
];

const HomePage = () => {
    return (
        <Layout>
            <AppHeader />
            <Layout style={{ height: '10vh' }} />
            <Content style={{ padding: '50px', height: '90vh' }}>
                
                <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                    <Title level={1}>Журнал тренировок</Title>
                    <Paragraph style={{ fontSize: '16px', maxWidth: '800px', margin: '0 auto' }}>
                        Записывай свои тренировки, отслеживай прогресс и достигай новых высот.
                        Здесь начинается твой путь к лучшей версии себя!
                    </Paragraph>
                </div>

                
                <Row gutter={[16, 16]} justify="center">
                    {images.map((img, index) => (
                        <Col xs={24} sm={12} md={8} key={index}>
                            <Card
                                hoverable
                                cover={<img src={img} />}
                                style={{ borderRadius: '10px', overflow: 'hidden' }}
                                bodyStyle={{ display: 'none' }} 
                            />
                        </Col>
                    ))}
                </Row>
            </Content>
        </Layout>
    );
};

export default HomePage;