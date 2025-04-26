import React, { useState, useEffect } from 'react';
import { Form, Input, Button, InputNumber, Select, Row, Col, message } from 'antd';
import axios from 'axios';

const WorkoutForm = ({ selectedDate, selectedWorkout, onSave, onExerciseDeleted }) => {

    const host = import.meta.env.VITE_HOST;

    const [form] = Form.useForm();
    const [exercisesList, setExercisesList] = useState([]);

    useEffect(() => {
        const fetchExercises = async () => {
            try {
                const response = await axios.get(`${host}/exercisesnames`, { withCredentials: true });
                setExercisesList(response.data.exercises);
            } catch (err) {
                console.error('Ошибка при загрузке списка упражнений:', err);
            }
        };
        fetchExercises();
    }, []);

    // Устанавливаем начальные значения формы
    useEffect(() => {
        if (selectedWorkout) {
            form.setFieldsValue({
                notes: selectedWorkout.notes,
                exercises: selectedWorkout.exercises || [],
            });
        } else {
            form.setFieldsValue({
                notes: '',
                exercises: [],
            });
        }
    }, [selectedWorkout, form]);

    // Обработчик сохранения формы
    const handleSave = () => {
        form.validateFields().then(values => {
            if (selectedWorkout) {
                const updatedWorkout = {
                    WorkoutID: selectedWorkout.id,
                    Notes: values.notes,
                    Exercises: values.exercises.map((exercise) => ({
                        ID: exercise.ID || 0,
                        Name: exercise.Name,
                        Sets: exercise.Sets,
                        Reps: exercise.Reps,
                        Weight: exercise.Weight,
                        Notes: exercise.Notes,
                    })),
                };
                onSave('edit', updatedWorkout);

            } else {
                const newWorkout = {
                    Date: selectedDate.format('YYYY-MM-DD'),
                    Notes: values.notes,
                    Exercises: values.exercises || [],
                };
                onSave('add', newWorkout);
            }
        });
    };

    // Обработчик удаления упражнения
    const handleDeleteExercise = async (exerciseIndex, remove) => {
        const exercises = form.getFieldValue('exercises') || [];
        const exercise = exercises[exerciseIndex];

        if (exercise && exercise.ID) {
            try {
                await axios.post(
                    `${host}/deletexercise`,
                    { ID: exercise.ID },
                    { withCredentials: true }
                );
                onExerciseDeleted();
                message.success('Упражнение удалено');
            } catch (err) {
                message.error('Ошибка при удалении упражнения');
                console.error('Ошибка при удалении упражнения:', err);
                return;
            }
        }

        remove(exerciseIndex);
    };

    // Обработчик удаления тренировки
    const handleDeleteWorkout = async () => {
        if (!selectedWorkout) return;

        try {
            await axios.post(
                `${host}/deleteworkout`,
                { ID: selectedWorkout.id },
                { withCredentials: true }
            );
            console.log(`Тренировка с ID ${selectedWorkout.id} успешно удалена`);
            onExerciseDeleted(); // Используем тот же callback для обновления данных
            message.success('Тренировка удалена');
        } catch (err) {
            message.error('Ошибка при удалении тренировки');

            console.error('Ошибка при удалении тренировки:', err);
        }
    };

    if (!selectedDate) {
        return <div>Выберите дату</div>;
    }

    return (
        <Form form={form} layout="vertical">
            <Form.Item
                name="notes"
                label="Заметки"
                rules={[{ required: true, message: 'Введите заметки' }]}
            >
                <Input.TextArea rows={4} />
            </Form.Item>
            <Form.List name="exercises">
                {(fields, { add, remove }) => (
                    <>
                        {fields.map(({ key, name, ...restField }) => (
                            <div
                                key={key}
                                style={{
                                    marginBottom: 16,
                                    paddingBottom: 16,
                                    borderBottom: '1px solid rgb(58, 57, 57)',
                                }}
                            >
                                <Form.Item {...restField} name={[name, 'ID']} hidden>
                                    <Input type="hidden" />
                                </Form.Item>
                                <Form.Item
                                    {...restField}
                                    name={[name, 'Name']}
                                    label="Название упражнения"
                                    rules={[
                                        { required: true, message: 'Введите название упражнения' },
                                    ]}
                                >
                                    <Select
                                        showSearch
                                        allowClear
                                        placeholder="Выберите или введите название"
                                        options={exercisesList.map(exercise => ({ label: exercise, value: exercise }))}
                                        filterOption={(input, option) =>
                                            option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                        }
                                        onSearch={(value) => {
                                            // Ничего не делаем при поиске, просто разрешаем ввод
                                        }}
                                        onSelect={(value) => {
                                            // Если выбрано значение из списка, оно автоматически сохраняется в форме
                                        }}
                                        onBlur={(e) => {
                                            const value = e.target.value;
                                            if (value && !exercisesList.includes(value)) {
                                                form.setFieldsValue({
                                                    exercises: form.getFieldValue('exercises').map((ex, idx) =>
                                                        idx === name ? { ...ex, Name: value } : ex
                                                    ),
                                                });
                                            }
                                        }}
                                        notFoundContent={null}
                                        dropdownRender={(menu) => (
                                            <div>
                                                {menu}
                                            </div>
                                        )}
                                    />

                                </Form.Item>
                                <Row justify="space-around" align="middle">
                                    <Col>
                                        <Form.Item
                                            {...restField}
                                            name={[name, 'Sets']}
                                            label="Подходы"
                                            rules={[
                                                { required: true, message: 'Введите количество подходов' },
                                            ]}
                                        >
                                            <InputNumber min={1} />
                                        </Form.Item>
                                    </Col>
                                    <Col>
                                        <Form.Item
                                            {...restField}
                                            name={[name, 'Reps']}
                                            label="Повторения"
                                            rules={[
                                                { required: true, message: 'Введите количество повторений' },
                                            ]}
                                        >
                                            <InputNumber min={1} />
                                        </Form.Item>
                                    </Col>
                                    <Col>
                                        <Form.Item
                                            {...restField}
                                            name={[name, 'Weight']}
                                            label="Вес (кг)"
                                            rules={[{ required: true, message: 'Введите вес' }]}
                                        >
                                            <InputNumber min={0} step={0.1} />
                                        </Form.Item>
                                    </Col>
                                </Row>
                                <Form.Item
                                    {...restField}
                                    name={[name, 'Notes']}
                                    label="Заметки к упражнению"
                                >
                                    <Input.TextArea rows={2} />
                                </Form.Item>
                                <Button
                                    type="dashed"
                                    onClick={() => handleDeleteExercise(name, remove)}
                                    style={{ marginTop: 8 }}
                                >
                                    Удалить упражнение
                                </Button>
                            </div>
                        ))}
                        <Button
                            type="dashed"
                            onClick={() => add()}
                            block
                            style={{ marginTop: 16 }}
                        >
                            Добавить упражнение
                        </Button>
                    </>
                )}
            </Form.List>
            <Button
                type="primary"
                onClick={handleSave}
                style={{ marginTop: 16 }}
            >
                Сохранить
            </Button>
            {selectedWorkout && (
                <Button
                    type="danger"
                    onClick={handleDeleteWorkout}
                    style={{ marginTop: 16, marginLeft: 8 }}
                >
                    Удалить тренировку
                </Button>
            )}
        </Form>
    );
};

export default WorkoutForm;