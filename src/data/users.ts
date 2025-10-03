export interface User {
    _id: string;
    email: string;
    name: string;
    createdAt: string;
    updatedAt?: string;
    subscription?: {
        status: 'active' | 'inactive' | 'trial' | 'cancelled';
        plan: string;
        currentPeriodStart?: string;
        currentPeriodEnd?: string;
    };
    lastActivity?: string;
    hasActiveSubscription?: boolean;
    freeMinutes?: number;
    // Add other fields as needed
}