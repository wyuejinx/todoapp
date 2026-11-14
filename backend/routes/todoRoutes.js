const express = require('express');
const router = express.Router();
const {
  getTodos,
  createTodo,
  updateTodo,
  deleteTodo,
  clearCompletedTodos, // <-- Add this here!
} = require('../controllers/todoController');

router.route('/')
  .get(getTodos)
  .post(createTodo);

// Important: this MUST come before /:id
router.delete('/completed/clear', clearCompletedTodos);

router.route('/:id')
  .put(updateTodo)
  .delete(deleteTodo);

module.exports = router;