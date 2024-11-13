const express = require('express');
const app = express();
const port = 3000;

// Middleware to parse JSON
app.use(express.json());

// Sample data
let todos = [
  { id: 1, task: "Learn Node.js", completed: false, priority: "medium" },
  { id: 2, task: "Build a REST API", completed: false, priority: "medium" }
];

// GET /todos - Retrieve all to-do items (Read)
app.get('/todos', (req, res) => {
  const { completed } = req.query; // Get the 'completed' query parameter

  if (completed !== undefined) {
    // If 'completed' query parameter is provided, filter by it
    const isCompleted = completed === 'true'; // Convert string 'true'/'false' to boolean
    const filteredTodos = todos.filter(todo => todo.completed === isCompleted);
    return res.json(filteredTodos); // Return the filtered list
  }

  // If no 'completed' query parameter, return all to-do items
  res.json(todos);
});

// POST /todos - Add a new to-do item
app.post('/todos', (req, res) => {
  const newTodo = {
    id: todos.length + 1,
    task: req.body.task,
    completed: false,
    priority: req.body.priority || "medium" // Default to "medium"
  };
  todos.push(newTodo);
  res.status(201).json(newTodo);
});

// PUT /todos/complete-all - Mark all to-dos as completed
// PUT /todos/:id - Update an existing to-do item
app.put('/todos/:id', (req, res, next) => {
  if (req.url.includes("complete-all"))
    next()
  else {
    const id = parseInt(req.params.id);
    const todo = todos.find(t => t.id === id);
    if (!todo) {
      return res.status(404).send("To-Do item not found");
    }
    todo.task = req.body.task || todo.task;
    todo.completed = req.body.completed !== undefined ? req.body.completed : todo.completed;
    res.json(todo);
  }
});

app.put('/todos/complete-all', (req, res) => {
  if (!todos) {
    return res.status(404).send("To-Do item not found");
  }
  todos.forEach(item => {
    item.completed = true
  })
  // You must return a 200 or 204 status code to the client indicating success of this operation
  res.status(200).send();
});

// DELETE /todos/:id - Delete a to-do item
app.delete('/todos/:id', (req, res) => {
  const id = parseInt(req.params.id); // Get ID from URL
  const index = todos.findIndex(t => t.id === id); // Find index of the to-do item

  if (index === -1) {
    return res.status(404).send("To-Do item not found"); // If not found, send 404
  }

  todos.splice(index, 1); // Remove the to-do item from the array
  res.status(204).send(); // Send 204 No Content status to indicate successful deletion
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
