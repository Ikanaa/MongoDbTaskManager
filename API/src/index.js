const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');


const app = express();
const PORT = process.env.PORT || 3000;


app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// mongodb://localhost:27017
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/taskmanager';
mongoose.connect(MONGODB_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('MongoDB connection error:', err));


const taskSchema = new mongoose.Schema({
    titre: { type: String, required: true },
    description: { type: String },
    status: { type: String, enum: ["à faire", "en cours", "terminée", "annulée"], default: 'à faire', required: true},
    priorite: { type: String, enum: ["basse", "moyenne", "haute", "critique"], default: 'basse' },
    categorie: { type: String, default: 'autre' },
    echeance: { type: Date },
    dateCreation: { type: Date, default: Date.now, required: true},
    etiquettes: { type: [String] },
    auteur: {
        nom: { type: String, default: 'anon' },
        prenom: { type: String, default: '' },
        email: { type: String, default: '' }
    },
    commentaires: {
        type: [{
            auteur: {
                nom: { type: String, default: 'anon' },
                prenom: { type: String, default: '' },
                email: { type: String, default: '' }
            },
            contenu: { type: String, required: true },
            date: { type: Date, default: Date.now }
        }]
    }
});

const Task = mongoose.model('Task', taskSchema);


app.get('/', (req, res) => {
    res.send('Task Manager API is running');
});


app.get('/tasks', async (req, res) => {
    try {
        const filter = {};
        
        //  status filter
        if (req.query.statut) {
            filter.status = req.query.statut;
        }
        
        //  priority filter
        if (req.query.priorite) {
            filter.priorite = req.query.priorite;
        }
        
        //  category filter
        if (req.query.categorie) {
            filter.categorie = req.query.categorie;
        }
        
        //  tag filter
        if (req.query.etiquette) {
            filter.etiquettes = { $in: [req.query.etiquette] };
        }
        
        //  due date filters
        if (req.query.avant) {
            filter.echeance = { ...filter.echeance, $lte: new Date(req.query.avant) };
        }
        
        if (req.query.apres) {
            filter.echeance = { ...filter.echeance, $gte: new Date(req.query.apres) };
        }
        
        //  text search
        if (req.query.q) {
            filter.$or = [
                { titre: { $regex: req.query.q, $options: 'i' } },
                { description: { $regex: req.query.q, $options: 'i' } }
            ];
        }
        
        //  sorting
        let sortOption = {};
        if (req.query.tri) {
            const allowedSortFields = ['echeance', 'priorite', 'dateCreation'];
            const sortField = allowedSortFields.includes(req.query.tri) ? req.query.tri : 'dateCreation';
            
            // Check descending order
            const sortOrder = req.query.ordre === 'desc' ? -1 : 1;
            
            sortOption[sortField] = sortOrder;
        }

        // default creation date ascending
        if (Object.keys(sortOption).length === 0) {
            sortOption = { dateCreation: 1 };
        }
        
        const tasks = await Task.find(filter).sort(sortOption);
        res.json(tasks);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


app.get('/tasks/:id', async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);
        if (!task) return res.status(404).json({ message: 'Task not found' });
        res.json(task);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});



app.post('/tasks', async (req, res) => {
    try {
        const task = new Task(req.body);
        const savedTask = await task.save();
        res.status(201).json(savedTask);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});


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


app.post('/tasks/:id/comment', async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);
        if (!task) return res.status(404).json({ message: 'Task not found' });
        
        task.commentaires.push(req.body);
        await task.save();
        res.status(201).json(task);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});


app.delete('/tasks/:id', async (req, res) => {
    try {
        const task = await Task.findByIdAndDelete(req.params.id);
        if (!task) return res.status(404).json({ message: 'Task not found' });
        res.json({ message: 'Task deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


app.delete('/tasks/:taskId/comment/:commentId', async (req, res) => {
    try {
        const task = await Task.findById(req.params.taskId);
        if (!task) return res.status(404).json({ message: 'Task not found' });
        
        task.commentaires.pull({ _id: req.params.commentId });

        await task.save();
        res.json({ message: 'Comment deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
});


app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something went wrong!' });
});


app.listen(PORT, () => {
    console.log(`Server running on port ${PORT} http://localhost:${PORT}`);
});