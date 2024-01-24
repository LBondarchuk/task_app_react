import React, { useState } from 'react';
import TaskItem from '../task-item/TaskItem';
import st from './TaskList.module.scss';

function TaskList({ tasks, onEdit, onDelete, date }) {
  const [loaded, setLoaded] = useState(false);
  useState(() => {
    setTimeout(() => {
      setLoaded(true);
    }, 500);
  }, []);
  return (
    <ul className={st.container}>
      <h1 className={st.title}>Tasks for {date.toString().split(' ').slice(1, 3).join(' ')}</h1>

      {tasks.length === 0 && loaded ? (
        <p className={st.notification}>No tasks available</p>
      ) : (
        tasks.map((task) => (
          <TaskItem
            key={task.id}
            task={task}
            onEdit={onEdit}
            onDelete={() => onDelete(task.id)}
            isLastIndex={tasks[tasks.length - 1].id === task.id}
            lastIndex={tasks[tasks.length - 1].id}
          />
        ))
      )}
    </ul>
  );
}

export default TaskList;
