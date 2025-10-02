export interface Call {
    _id: string;
    userId: string;
    status: 'completed' | 'failed' | 'in-progress';
    startedAt: string;
    endedAt?: string;
    // Add other fields as needed
}