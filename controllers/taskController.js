import { db } from '../firebase.js';

const tasksCollection = db.collection('tasks');

// ✅ GET all tasks for the user with Firestore doc ID as _id
export const getTasks = async (req, res) => {
  const userId = req.userId;

  try {
    const snapshot = await tasksCollection.where('userId', '==', userId).get();
    const tasks = snapshot.docs.map(doc => ({
      _id: doc.id, // 🔥 KEY FIX: Use _id for frontend compatibility
      ...doc.data(),
    }));
    res.json(tasks);

  } catch (err) {
    res.status(500).json({ error: 'Error fetching tasks' });
  }
};

// ✅ CREATE a new task
export const createTask = async (req, res) => {
  const userId = req.userId;
  const { title, description } = req.body;

  try {
    const newTaskRef = await tasksCollection.add({
      title,
      description,
      completed: false,
      userId,
      createdAt: new Date()
    });

    const newTask = await newTaskRef.get();
    res.status(201).json({ _id: newTask.id, ...newTask.data() });

  } catch (err) {
    res.status(500).json({ error: 'Error creating task' });
  }
};

// ✅ UPDATE a task
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
    res.json({ _id: updatedTask.id, ...updatedTask.data() });

  } catch (err) {
    res.status(500).json({ error: 'Error updating task' });
  }
};

// ✅ DELETE a task
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
