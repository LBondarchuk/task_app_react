const BASE_URL = 'http://localhost:3001';

const api = {
  fetchTasks: async () => {
    try {
      const response = await fetch(`${BASE_URL}/tasks`);
      console.log(response);

      if (response.ok) {
        return await response.json();
      }
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }

    return [];
  },

  addTask: async (newTask) => {
    try {
      const response = await fetch(`${BASE_URL}/tasks`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newTask),
      });

      if (response.ok) {
        return await response.json();
      }
    } catch (error) {
      console.error('Error adding task:', error);
    }

    return null;
  },

  deleteTask: async (taskId) => {
    try {
      const response = await fetch(`${BASE_URL}/tasks/${taskId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        return true;
      }
    } catch (error) {
      console.error('Error deleting task:', error);
    }

    return false;
  },

  updateTask: async (updatedTask) => {
    try {
      const response = await fetch(`${BASE_URL}/tasks/${updatedTask.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedTask),
      });
      return response;
    } catch (error) {
      console.error('Error updating task:', error);
      return null;
    }
  },
};

export default api;
