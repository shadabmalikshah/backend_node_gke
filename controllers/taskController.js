import Task from '../models/Task.js';

export const getTasks = async (req, res) => {
  const userId = req.userId;
  const tasks = await Task.find({ user: userId });
  res.json(tasks);
};

export const createTask = async (req, res) => {
  const userId = req.userId;
  const { title, description } = req.body;
  const task = new Task({ title, description, user: userId });
  await task.save();
  res.status(201).json(task);
};

export const updateTask = async (req, res) => {
  const { id } = req.params;
  const userId = req.userId;
  const task = await Task.findOneAndUpdate({ _id: id, user: userId }, req.body, { new: true });
  if (!task) return res.status(404).json({ message: 'Task not found' });
  res.json(task);
};

export const deleteTask = async (req, res) => {
  const { id } = req.params;
  const userId = req.userId;
  const task = await Task.findOneAndDelete({ _id: id, user: userId });
  if (!task) return res.status(404).json({ message: 'Task not found' });
  res.json({ message: 'Task deleted' });
};
