import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { FaEdit, FaTrash, FaCircle, FaCheckCircle, FaCheck } from 'react-icons/fa';
import st from './TaskItem.module.scss';
import api from '../../api';
import { getTimeFromDate } from '../../utils/styles/date/date';

function TaskItem({ task, onDelete, onEdit, isLastIndex }) {
  const [value, setValue] = useState(task.title);
  const [checked, setChecked] = useState(task.checked);
  const [isEditing, setIsEditing] = useState(false);

  const taskRef = useRef();

  useEffect(() => {
    if (isLastIndex && taskRef.current) {
      taskRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [isLastIndex]);

  const handleSave = async () => {
    const updatedTask = { ...task, title: value, checked: !checked };

    try {
      const response = await api.updateTask(updatedTask);

      if (response.ok) {
        onEdit({ ...updatedTask, id: task.id });
        setIsEditing(false);
      } else {
        console.error('Error updating task:', response.statusText);
      }
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const setCheckBox = () => {
    setChecked((prev) => !prev);
    handleSave();
  };

  return (
    <motion.li
      className={`${st.container} ${checked ? st.completed : ''}`}
      ref={taskRef}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
    >
      {!isEditing && (
        <label onClick={setCheckBox}>
          {checked ? (
            <FaCheckCircle className={st.checkbox} />
          ) : (
            <FaCircle className={st.checkbox} />
          )}
        </label>
      )}
      {!isEditing ? (
        <motion.div
          className={st.textContainer}
          style={{ flexGrow: 2 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className={st.title}>{task.title}</div>
          <div className={st.date}>Time: {getTimeFromDate(task.dateTime)}</div>
        </motion.div>
      ) : (
        <input
          type='text'
          value={value}
          className={st.inputEdit}
          onChange={(e) => setValue(e.target.value)}
        />
      )}
      <div className={st.buttons}>
        {!isEditing ? (
          <button onClick={() => setIsEditing(true)}>
            <FaEdit className={st.edit} />
          </button>
        ) : (
          <button onClick={handleSave}>
            <FaCheck className={st.save} />
          </button>
        )}
        <motion.button onClick={onDelete} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
          <FaTrash className={st.delete} />
        </motion.button>
      </div>
    </motion.li>
  );
}

export default TaskItem;
