const Todo = require('../models/Todo');

// GET /api/todos - Fetch all tasks
exports.getTodos = async (req, res) => {
  try {
    const todos = await Todo.find().sort({ createdAt: -1 });
    res.status(200).json(todos);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// POST /api/todos - Create
// @desc    Create a new todo
// @route   POST /api/todos
exports.createTodo = async (req, res) => {
  try {
    const { title, category } = req.body;
    if (!title) {
      return res.status(400).json({ message: 'Title is required' });
    }
    const newTodo = await Todo.create({
      title,
      category: category || 'General',
    });
    res.status(201).json(newTodo);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// PUT /api/todos/:id - Update complete status or title
exports.updateTodo = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedTodo = await Todo.findByIdAndUpdate(
      id,
      { $set: req.body },
      { new: true, runValidators: true }
    );

    if (!updatedTodo) {
      return res.status(404).json({ message: 'Todo not found' });
    }

    res.status(200).json(updatedTodo);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// DELETE /api/todos/:id - Delete a task
exports.deleteTodo = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedTodo = await Todo.findByIdAndDelete(id);

    if (!deletedTodo) {
      return res.status(404).json({ message: 'Todo not found' });
    }

    res.status(200).json({ message: 'Todo removed successfully', id });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete all completed todos
// @route   DELETE /api/todos/completed/clear
exports.clearCompletedTodos = async (req, res) => {
  try {
    await Todo.deleteMany({ isCompleted: true });
    res.status(200).json({ message: 'Completed todos cleared successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};