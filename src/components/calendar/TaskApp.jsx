import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import TaskForm from '../task-form/TaskForm';
import TaskList from '../task-list/TaskList';
import { isSameDay } from 'date-fns';
import 'react-calendar/dist/Calendar.css';
import { motion} from 'framer-motion';
import api from '../../api';
import st from './TaskApp.module.scss';

function CalendarComponent() {
  const [date, setDate] = useState(new Date());
  const [tasks, setTasks] = useState([]);

  const handleDateChange = (newDate) => {
    setDate(newDate);
  };

  useEffect(() => {
    const fetchTasksData = async () => {
      const tasksData = await api.fetchTasks();
      setTasks(tasksData);
    };

    fetchTasksData();
  }, [date]);

  const handleAddTask = async (newTask) => {
    const addedTask = await api.addTask(newTask);

    if (addedTask) {
      setTasks([...tasks, addedTask]);
    }
  };

  const handleDeleteTask = async (taskId) => {
    const isDeleted = await api.deleteTask(taskId);

    if (isDeleted) {
      setTasks(tasks.filter((task) => task.id !== taskId));
    }
  };

  const handleEdit = (newItem) => {
    setTasks(
      tasks.map((item) => {
        return item.id === newItem.id ? newItem : item;
      }),
    );
  };

  return (
    <div className={st.container}>
      <motion.div
        className={st.calendar}
        animate={{ scale: 1 }}
        initial={{ scale: 0 }}
        transition={{ duration: 1 }}
      >
        <Calendar
          onChange={handleDateChange}
          value={date}
          tileClassName={({ date }) => {
            const tasksForDate = tasks.filter((task) => isSameDay(new Date(task.dateTime), date));
            return tasksForDate.length > 0 ? 'has-tasks' : '';
          }}
        />
      </motion.div>

      <div className={st.data}>
        <TaskList
          tasks={tasks.filter((item) => isSameDay(new Date(item.dateTime), date))}
          onDelete={handleDeleteTask}
          date={date}
          onEdit={handleEdit}
        />
        <TaskForm onSubmit={handleAddTask} ActualData={date} />
      </div>
    </div>
  );
}

export default CalendarComponent;
