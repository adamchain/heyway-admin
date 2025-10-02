export interface Subscription {
    _id: string;
    userId: string;
    status: 'active' | 'inactive' | 'cancelled';
    plan: string;
    amount: number;
    createdAt: string;
    // Add other fields
}