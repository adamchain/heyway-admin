import express, { Request, Response } from 'express';
import cors from 'cors';
import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
const MONGO_URI = process.env.MONGO_URI;
if (!MONGO_URI) {
    console.error('MONGO_URI environment variable is not set');
    process.exit(1);
}

let client: MongoClient;

async function connectToDatabase() {
    if (!client) {
        client = new MongoClient(MONGO_URI!);
        await client.connect();
        console.log('Connected to MongoDB');
    }
    return client.db();
}

// API Routes
app.get('/api/users', async (req: Request, res: Response) => {
    try {
        const db = await connectToDatabase();
        const users = await db.collection('users').find({}).toArray();
        res.json(users);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ error: 'Failed to fetch users' });
    }
});

app.get('/api/calls', async (req: Request, res: Response) => {
    try {
        const db = await connectToDatabase();
        const calls = await db.collection('calls').find({}).toArray();
        res.json(calls);
    } catch (error) {
        console.error('Error fetching calls:', error);
        res.status(500).json({ error: 'Failed to fetch calls' });
    }
});

app.get('/api/subscriptions', async (req: Request, res: Response) => {
    try {
        const db = await connectToDatabase();
        const subscriptions = await db.collection('subscriptions').find({}).toArray();
        res.json(subscriptions);
    } catch (error) {
        console.error('Error fetching subscriptions:', error);
        res.status(500).json({ error: 'Failed to fetch subscriptions' });
    }
});

app.get('/api/automations', async (req: Request, res: Response) => {
    try {
        const db = await connectToDatabase();
        const automations = await db.collection('automations').find({}).toArray();
        res.json(automations);
    } catch (error) {
        console.error('Error fetching automations:', error);
        res.status(500).json({ error: 'Failed to fetch automations' });
    }
});

app.get('/api/feedbacks', async (req: Request, res: Response) => {
    try {
        const db = await connectToDatabase();
        const feedbacks = await db.collection('feedbacks').find({}).toArray();
        res.json(feedbacks);
    } catch (error) {
        console.error('Error fetching feedbacks:', error);
        res.status(500).json({ error: 'Failed to fetch feedbacks' });
    }
});

// Health check endpoint
app.get('/health', (req: Request, res: Response) => {
    res.status(200).json({ 
        status: 'healthy', 
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
    });
});

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
    app.use(express.static('dist'));
    
    app.get('/*', (req: Request, res: Response) => {
        res.sendFile('index.html', { root: 'dist' });
    });
}

// Error handling middleware
app.use((err: any, req: Request, res: Response, next: any) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('SIGTERM received, shutting down gracefully');
    if (client) {
        client.close();
    }
    process.exit(0);
});

process.on('SIGINT', () => {
    console.log('SIGINT received, shutting down gracefully');
    if (client) {
        client.close();
    }
    process.exit(0);
});

app.listen(PORT, () => {
    console.log(`GetHeyway Admin Dashboard running on port ${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});