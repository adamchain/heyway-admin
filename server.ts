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

// Enhanced dashboard statistics API
app.get('/api/dashboard/stats', async (req: Request, res: Response) => {
    try {
        const db = await connectToDatabase();

        // Get all collections
        const [users, calls, subscriptions, automations, contacts, recordings, usage] = await Promise.all([
            db.collection('users').find({}).toArray(),
            db.collection('calls').find({}).toArray(),
            db.collection('subscriptions').find({}).toArray(),
            db.collection('automations').find({}).toArray(),
            db.collection('contacts').find({}).toArray(),
            db.collection('recordings').find({}).toArray(),
            db.collection('usage').find({}).toArray()
        ]);

        // Calculate comprehensive statistics
        const stats = {
            // User Activity Metrics
            totalUsers: users.length,
            activeUsers: users.filter(u => u.subscription?.status === 'active' || u.hasActiveSubscription).length,
            lastActiveUsers: await getLastActiveUsers(db, users),

            // System Performance Metrics
            totalCalls: calls.length,
            successfulCalls: calls.filter(c => c.status === 'completed').length,
            callSuccessRate: calls.length > 0 ? (calls.filter(c => c.status === 'completed').length / calls.length) * 100 : 0,
            inboundCalls: calls.filter(c => c.isInbound === true).length,
            outboundCalls: calls.filter(c => c.isInbound === false).length,

            // Active Automations
            activeAutomations: automations.filter(a => a.isActive === true).length,
            totalAutomations: automations.length,

            // Usage Statistics
            totalMinutesUsed: usage.reduce((sum, u) => sum + (u.minutesUsed || 0), 0),
            freeUsers: users.filter(u => u.freeMinutes && u.freeMinutes > 0).length,
            paidUsers: users.filter(u => u.hasActiveSubscription).length,

            // Content & Engagement
            totalContacts: contacts.length,
            totalRecordings: recordings.length,
            contactListActivity: await getContactListActivity(db),

            // Revenue Metrics
            totalRevenue: subscriptions.reduce((sum, s) => sum + (s.amount || 0), 0),
            monthlyRevenue: await getMonthlyRevenue(subscriptions),

            // User Growth by Day (last 30 days)
            userGrowthByDay: await getUserGrowthByDay(users),

            // Most Active Users (last 30 days)
            mostActiveUsers: await getMostActiveUsers(db, users, calls)
        };

        res.json(stats);
    } catch (error) {
        console.error('Error fetching dashboard stats:', error);
        res.status(500).json({ error: 'Failed to fetch dashboard statistics' });
    }
});

// Helper function to get last active users based on calls.createdAt
async function getLastActiveUsers(db: any, users: any[]) {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const activeUserIds = await db.collection('calls')
        .distinct('userId', {
            createdAt: { $gte: thirtyDaysAgo }
        });

    return users.filter(u => activeUserIds.includes(u._id)).length;
}

// Helper function to get contact list activity
async function getContactListActivity(db: any) {
    const contactLists = await db.collection('contactlists').find({}).toArray();
    return contactLists.filter(cl => cl.metadata?.lastUsed).length;
}

// Helper function to get monthly revenue
async function getMonthlyRevenue(subscriptions: any[]) {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();

    return subscriptions
        .filter(s => {
            const subDate = new Date(s.createdAt);
            return subDate.getMonth() === currentMonth && subDate.getFullYear() === currentYear;
        })
        .reduce((sum, s) => sum + (s.amount || 0), 0);
}

// Helper function to get user growth by day (last 30 days)
async function getUserGrowthByDay(users: any[]) {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const growthData = [];
    for (let i = 29; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dayStart = new Date(date);
        dayStart.setHours(0, 0, 0, 0);
        const dayEnd = new Date(date);
        dayEnd.setHours(23, 59, 59, 999);

        const usersOnDay = users.filter(u => {
            const userDate = new Date(u.createdAt);
            return userDate >= dayStart && userDate <= dayEnd;
        }).length;

        growthData.push({
            date: date.toISOString().split('T')[0],
            users: usersOnDay,
            cumulative: growthData.length > 0 ? growthData[growthData.length - 1].cumulative + usersOnDay : usersOnDay
        });
    }

    return growthData;
}

// Helper function to get most active users
async function getMostActiveUsers(db: any, users: any[], calls: any[]) {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    // Get call counts per user for last 30 days
    const userCallCounts = await db.collection('calls').aggregate([
        {
            $match: {
                createdAt: { $gte: thirtyDaysAgo }
            }
        },
        {
            $group: {
                _id: '$userId',
                callCount: { $sum: 1 },
                lastCallDate: { $max: '$createdAt' }
            }
        },
        {
            $sort: { callCount: -1 }
        },
        {
            $limit: 10
        }
    ]).toArray();

    // Map to user details
    return userCallCounts.map(uc => {
        const user = users.find(u => u._id === uc._id);
        return {
            userId: uc._id,
            name: user?.name || 'Unknown',
            email: user?.email || 'Unknown',
            callCount: uc.callCount,
            lastCallDate: uc.lastCallDate,
            subscription: user?.subscription?.status || 'inactive'
        };
    });
}

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

    // Catch-all handler for SPA routing - serve index.html for all non-API routes
    app.get('/*', (req: Request, res: Response) => {
        // Only serve index.html for non-API routes
        if (!req.path.startsWith('/api')) {
            res.sendFile('index.html', { root: 'dist' });
        } else {
            res.status(404).json({ error: 'API endpoint not found' });
        }
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