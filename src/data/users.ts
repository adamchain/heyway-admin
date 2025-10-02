export interface User {
    _id: string;
    email: string;
    name: string;
    createdAt: string;
    subscription?: {
        status: 'active' | 'inactive' | 'trial' | 'cancelled';
        plan: string;
        currentPeriodStart?: string;
        currentPeriodEnd?: string;
    };
    lastActivity?: string;
    // Add other fields as needed
}