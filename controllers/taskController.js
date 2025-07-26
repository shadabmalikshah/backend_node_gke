import { db } from '../firebase.js';

const tasksCollection = db.collection('tasks');

export const getTasks = async (req, res) => {
  const userId = req.userId;

  try {
    const snapshot = await tasksCollection.where('userId', '==', userId).get();
    const tasks = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json(tasks);

  } catch (err) {
    res.status(500).json({ error: 'Error fetching tasks' });
  }
};

export const createTask = async (req, res) => {
  const userId = req.userId;
  const { title, description } = req.body;

  try {
    const newTaskRef = await tasksCollection.add({
      title,
      description,
      userId,
      createdAt: new Date()
    });

    const newTask = await newTaskRef.get();
    res.status(201).json({ id: newTask.id, ...newTask.data() });

  } catch (err) {
    res.status(500).json({ error: 'Error creating task' });
  }
};

export const updateTask = async (req, res) => {
  const { id } = req.params;
  const userId = req.userId;

  try {
    const taskRef = tasksCollection.doc(id);
    const task = await taskRef.get();

    if (!task.exists || task.data().userId !== userId) {
      return res.status(404).json({ message: 'Task not found' });
    }

    await taskRef.update(req.body);
    const updatedTask = await taskRef.get();
    res.json({ id: updatedTask.id, ...updatedTask.data() });

  } catch (err) {
    res.status(500).json({ error: 'Error updating task' });
  }
};

export const deleteTask = async (req, res) => {
  const { id } = req.params;
  const userId = req.userId;

  try {
    const taskRef = tasksCollection.doc(id);
    const task = await taskRef.get();

    if (!task.exists || task.data().userId !== userId) {
      return res.status(404).json({ message: 'Task not found' });
    }

    await taskRef.delete();
    res.json({ message: 'Task deleted' });

  } catch (err) {
    res.status(500).json({ error: 'Error deleting task' });
  }
};
