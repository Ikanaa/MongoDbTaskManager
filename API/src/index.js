const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// Initialize the app
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MongoDB Connection
// mongodb://localhost:27017
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/taskmanager';
mongoose.connect(MONGODB_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('MongoDB connection error:', err));

// Define Task Schema
const taskSchema = new mongoose.Schema({
    titre: { type: String, required: true },
    description: { type: String },
    status: { type: String, enum: ["à faire", "en cours", "terminée", "annulée"], default: 'à faire', required: true},
    priorite: { type: String, enum: ["basse", "moyenne", "haute", "critique"], default: 'basse' },
    echeance: { type: Date },
    dateCreation: { type: Date, default: Date.now, required: true},
    etiquettes: { type: [String] },
    auteur: {
        nom: { type: String, default: 'anon' },
        prenom: { type: String, default: 'anon' },
        email: { type: String, default: 'anon' }
    }
});

const Task = mongoose.model('Task', taskSchema);

// Routes
app.get('/', (req, res) => {
    res.send('Task Manager API is running');
});

// Get all tasks
app.get('/tasks', async (req, res) => {
    try {
        const tasks = await Task.find();
        res.json(tasks);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get task by ID
app.get('/tasks/:id', async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);
        if (!task) return res.status(404).json({ message: 'Task not found' });
        res.json(task);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Create task
app.post('/tasks', async (req, res) => {
    try {
        const task = new Task(req.body);
        const savedTask = await task.save();
        res.status(201).json(savedTask);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Update task
app.put('/tasks/:id', async (req, res) => {
    try {
        const task = await Task.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        if (!task) return res.status(404).json({ message: 'Task not found' });
        res.json(task);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Delete task
app.delete('/tasks/:id', async (req, res) => {
    try {
        const task = await Task.findByIdAndDelete(req.params.id);
        if (!task) return res.status(404).json({ message: 'Task not found' });
        res.json({ message: 'Task deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something went wrong!' });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT} http://localhost:${PORT}`);
});