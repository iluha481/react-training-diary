import React, { useState, useEffect } from 'react';
import { Badge, Calendar, Layout, Spin, Typography, Button, message } from 'antd';
import axios from 'axios';
import moment from 'moment';
import { useNavigate } from 'react-router-dom';
import AppHeader from './AppHeader';
import WorkoutForm from './WorkoutForm';

const WorkoutsPage = () => {
    const [eventsByDate, setEventsByDate] = useState({});
    const [loading, setLoading] = useState(false);
    const [selectedDate, setSelectedDate] = useState(moment());
    const [selectedWorkout, setSelectedWorkout] = useState(null);
    const [currentUser, setCurrentUser] = useState(null);
    const navigate = useNavigate();
    const host = import.meta.env.VITE_HOST;

    useEffect(() => {
        setLoading(true);
        const fetchCurrentUser = async () => {
            try {
                const responseCurrentUser = await axios.get(`${host}/getuserdata`, { withCredentials: true });
                setCurrentUser(responseCurrentUser.data);
            } catch (err) {
                console.error('Error fetching user:', err);
            } finally {
                setLoading(false);
            }
            await loadData();
        };
        fetchCurrentUser();
    }, []);

    const loadData = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${host}/workouts`, { withCredentials: true });
            const events = {};
            response.data.forEach((item) => {
                const date = moment(item.Date).format('YYYY-MM-DD');
                if (!events[date]) {
                    events[date] = [];
                }
                events[date].push({ id: item.ID, notes: item.Notes, exercises: item.Exercises });
            });
            setEventsByDate(events);
        } catch (err) {
            console.error('Error loading workouts:', err);
        } finally {
            setLoading(false);
        }
    };

    

    useEffect(() => {
        if (selectedDate) {
            const dateStr = selectedDate.format('YYYY-MM-DD');
            const events = eventsByDate[dateStr];
            setSelectedWorkout(events && events.length > 0 ? events[0] : null);
        } else {
            setSelectedWorkout(null);
        }
    }, [eventsByDate, selectedDate]);

    

    

    const onSelect = (value) => {
        setSelectedDate(value);
    };

    const handleSave = async (type, data) => {
        try {
            if (type === 'add') {
                await axios.post(`${host}/workouts`, data, { withCredentials: true });
                message.success('Тренировка сохранена');
            } else if (type === 'edit') {
                await axios.post(`${host}/updateworkout`, data, { withCredentials: true });
                message.success('Тренировка обновлена');
            }
            loadData();
        } catch (err) {
            message.error('Ошибка при сохранении тренировки');
            console.error(err);
        }
    };

    const dateCellRender = (value) => {
        const dateStr = value.format('YYYY-MM-DD');
        const notes = eventsByDate[dateStr];
        return notes && notes.length > 0 ? <Badge status="success" text={notes[0].notes} /> : null;
    };

    const monthCellRender = (value) => {
        const monthStr = value.format('YYYY-MM');
        const notesInMonth = Object.keys(eventsByDate)
            .filter((date) => date.startsWith(monthStr))
            .flatMap((date) => eventsByDate[date]);

        return notesInMonth.length > 0 ? (
            <div className="notes-month">
                <span>Заметки за месяц:</span>
                <ul>
                    {notesInMonth.map((note, index) => (
                        <li key={index}>{note.notes}</li>
                    ))}
                </ul>
            </div>
        ) : null;
    };

    const cellRender = (current, info) => {
        if (info.type === 'date') return dateCellRender(current);
        if (info.type === 'month') return monthCellRender(current);
        return info.originNode;
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
                <Layout style={{ height: '90vh', display: 'flex', flexDirection: 'row' }}>
                    <Calendar
                        style={{ width: '60vw' }}
                        cellRender={cellRender}
                        onSelect={onSelect}
                    />
                    <div
                        style={{
                            width: '40vw',
                            padding: '20px',
                            height: '100%',
                            overflowY: 'auto',
                        }}
                    >
                        <WorkoutForm
                            selectedDate={selectedDate}
                            selectedWorkout={selectedWorkout}
                            onSave={handleSave}
                            onExerciseDeleted={() => {
                                loadData();
                                if (!selectedWorkout) setSelectedWorkout(null);
                            }}
                        />
                    </div>
                </Layout>
            ) : (
                <Layout style={{ height: '90vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Typography style={{ fontSize: '50px', textAlign: 'center' }}>
                        <span>Вы не авторизованы</span>
                    </Typography>
                    <Button onClick={() => navigate('/login')} type="primary" style={{ marginTop: '10px' }}>
                        Войти
                    </Button>
                    <Button onClick={() => navigate('/signup')} type="primary" style={{ margin: '20px' }}>
                        Зарегистрироваться
                    </Button>
                </Layout>
            )}
        </Layout>
    );
};

export default WorkoutsPage;