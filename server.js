const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs/promises');

const app = express();
const PORT = 3001;

app.use(bodyParser.json());
app.use(cors());

const TASKS_FILE_PATH = 'tasks.json';

const initializeTasksFile = async () => {
  try {
    await fs.access(TASKS_FILE_PATH);
  } catch (error) {
    await fs.writeFile(TASKS_FILE_PATH, '[]', 'utf8');
  }
};

initializeTasksFile();
app.get('/tasks', async (req, res) => {
  try {
    const tasksData = await fs.readFile(TASKS_FILE_PATH, 'utf8');
    const tasks = JSON.parse(tasksData);

    const { date } = req.query;
    if (date) {
      const filteredTasks = tasks.filter((task) => {
        const taskDate = new Date(task.dateTime);
        const filterDate = new Date(date);
        return (
          taskDate.getFullYear() === filterDate.getFullYear() &&
          taskDate.getMonth() === filterDate.getMonth() &&
          taskDate.getDate() === filterDate.getDate()
        );
      });

      res.json(filteredTasks);
    } else {
      res.json(tasks);
    }
  } catch (error) {
    console.error('Error reading tasks:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/tasks', async (req, res) => {
  try {
    const { title, dateTime } = req.body;
    const tasksData = await fs.readFile('tasks.json', 'utf8');
    const tasks = JSON.parse(tasksData);

    const newTask = {
      id: Date.now(),
      title,
      dateTime,
    };

    tasks.push(newTask);

    await fs.writeFile('tasks.json', JSON.stringify(tasks, null, 2), 'utf8');

    res.status(201).json(newTask);
  } catch (error) {
    console.error('Error adding task:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.put('/tasks/:id', async (req, res) => {
  try {
    const taskId = parseInt(req.params.id);

    const { title, dateTime, checked } = req.body;

    const tasksData = await fs.readFile('tasks.json', 'utf8');
    const tasks = JSON.parse(tasksData);

    const index = tasks.findIndex((task) => task.id === taskId);

    if (index !== -1) {
      tasks[index] = {
        id: taskId,
        title: title || tasks[index].title,
        dateTime: dateTime || tasks[index].dateTime,
        checked: checked,
      };

      await fs.writeFile('tasks.json', JSON.stringify(tasks, null, 2), 'utf8');
      res.json(tasks[index]);
    } else {
      res.status(404).json({ error: 'Task not found' });
    }
  } catch (error) {
    console.error('Error updating task:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.delete('/tasks/:id', async (req, res) => {
  console.log(parseInt(req.params.id), 'id');
  try {
    const taskId = parseInt(req.params.id);

    const tasksData = await fs.readFile('tasks.json', 'utf8');
    let tasks = JSON.parse(tasksData);

    tasks = tasks.filter((task) => task.id !== taskId);

    await fs.writeFile('tasks.json', JSON.stringify(tasks, null, 2), 'utf8');
    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    console.error('Error deleting task:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
