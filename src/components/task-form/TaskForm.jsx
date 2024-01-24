import React, { useState, useEffect } from 'react';
import st from './TaskForm.module.scss';
import { getCurrentTime } from '../../utils/styles/date/date';
const getDay = (data) => {
  const currentDate = new Date(data);
  const year = currentDate.getFullYear();
  const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
  const day = currentDate.getDate().toString().padStart(2, '0');

  return `${year}-${month}-${day}`;
};

function TaskForm({ onSubmit, ActualData }) {
  const [date, setDate] = useState(getDay(ActualData));
  useEffect(() => {
    setDate(getDay(ActualData));
  }, [ActualData]);

  const [title, setTitle] = useState('');

  const [time, setTime] = useState(getCurrentTime());
  const [showErrorMessage, setShowErrorMessage] = useState(false);

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
    setShowErrorMessage(false);
  };

  const handleDateChange = (e) => {
    setShowErrorMessage(false);
  };

  const handleTimeChange = (e) => {
    setTime(e.target.value);
    setShowErrorMessage(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!title || !date || !time) {
      setShowErrorMessage(true);
      return;
    }

    const dateTime = new Date(`${date}T${time}`);
    onSubmit({ title, dateTime });

    setTitle('');
    setTime(getCurrentTime());
    setShowErrorMessage(false);
  };

  return (
    <div>
      <form className={st.form} onSubmit={handleSubmit}>
        <div>
          <label className={st.title}>Add New Task:</label>
          <input type='text' value={title} onChange={handleTitleChange} className={st.text} />
        </div>
        <div className={st.timeDate}>
          <input
            type='date'
            value={getDay(ActualData)}
            onChange={handleDateChange}
            className={st.date}
          />
          <input type='time' value={time} onChange={handleTimeChange} className={st.time} />
        </div>

        <button type='submit' className={st.button}>
          Add Task
        </button>
      </form>

      {showErrorMessage && <div className={st.errorMessage}>Please fill in all fields.</div>}
    </div>
  );
}

export default TaskForm;
