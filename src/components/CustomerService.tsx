import React, { useState, useEffect } from 'react';
import { getFeedbacks, getUsers, getCalls } from '../services/database';

interface SupportTicket {
    id: string;
    userId: string;
    userEmail: string;
    userName: string;
    category: string;
    subject: string;
    description: string;
    status: 'open' | 'in_progress' | 'resolved' | 'closed';
    priority: 'low' | 'medium' | 'high' | 'urgent';
    createdAt: Date;
    updatedAt: Date;
    assignedTo?: string;
    resolution?: string;
}

interface CustomerMetrics {
    totalTickets: number;
    openTickets: number;
    resolvedTickets: number;
    averageResponseTime: number;
    customerSatisfaction: number;
    escalatedTickets: number;
}

const CustomerService: React.FC = () => {
    const [tickets, setTickets] = useState<SupportTicket[]>([]);
    const [metrics, setMetrics] = useState<CustomerMetrics>({
        totalTickets: 0,
        openTickets: 0,
        resolvedTickets: 0,
        averageResponseTime: 0,
        customerSatisfaction: 0,
        escalatedTickets: 0,
    });
    const [loading, setLoading] = useState(true);
    const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
    const [filterStatus, setFilterStatus] = useState<string>('all');
    const [filterPriority, setFilterPriority] = useState<string>('all');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [feedbacks] = await Promise.all([
                    getFeedbacks(),
                    getUsers(),
                    getCalls()
                ]);

                // Generate mock support tickets from feedback data
                const mockTickets: SupportTicket[] = [
                    {
                        id: '1',
                        userId: 'user1',
                        userEmail: 'john.doe@example.com',
                        userName: 'John Doe',
                        category: 'Technical Issue',
                        subject: 'Call quality problems',
                        description: 'Experiencing poor call quality during important business calls. Audio cuts out frequently.',
                        status: 'open',
                        priority: 'high',
                        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
                        updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
                    },
                    {
                        id: '2',
                        userId: 'user2',
                        userEmail: 'jane.smith@example.com',
                        userName: 'Jane Smith',
                        category: 'Billing',
                        subject: 'Subscription renewal issue',
                        description: 'My subscription was not renewed automatically despite having a valid payment method.',
                        status: 'in_progress',
                        priority: 'medium',
                        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
                        updatedAt: new Date(Date.now() - 3 * 60 * 60 * 1000),
                        assignedTo: 'Support Agent 1',
                    },
                    {
                        id: '3',
                        userId: 'user3',
                        userEmail: 'mike.wilson@example.com',
                        userName: 'Mike Wilson',
                        category: 'Feature Request',
                        subject: 'Integration with CRM systems',
                        description: 'Would like to see integration with Salesforce and HubSpot for better contact management.',
                        status: 'resolved',
                        priority: 'low',
                        createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
                        updatedAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000),
                        assignedTo: 'Product Team',
                        resolution: 'Feature added to roadmap for Q2 2024',
                    },
                    {
                        id: '4',
                        userId: 'user4',
                        userEmail: 'sarah.johnson@example.com',
                        userName: 'Sarah Johnson',
                        category: 'Account',
                        subject: 'Cannot access my account',
                        description: 'I cannot log into my account. Getting an error message about invalid credentials.',
                        status: 'open',
                        priority: 'urgent',
                        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
                        updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
                    },
                    {
                        id: '5',
                        userId: 'user5',
                        userEmail: 'david.brown@example.com',
                        userName: 'David Brown',
                        category: 'Technical Issue',
                        subject: 'Automation not working',
                        description: 'My scheduled calls are not being made automatically as configured.',
                        status: 'in_progress',
                        priority: 'high',
                        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
                        updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
                        assignedTo: 'Technical Support',
                    }
                ];

                setTickets(mockTickets);

                // Calculate metrics
                const totalTickets = mockTickets.length;
                const openTickets = mockTickets.filter(t => t.status === 'open').length;
                const resolvedTickets = mockTickets.filter(t => t.status === 'resolved').length;
                const escalatedTickets = mockTickets.filter(t => t.priority === 'urgent').length;

                setMetrics({
                    totalTickets,
                    openTickets,
                    resolvedTickets,
                    averageResponseTime: 2.3, // Mock data
                    customerSatisfaction: 87.5, // Mock data
                    escalatedTickets,
                });

            } catch (error) {
                console.error('Error fetching customer service data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const filteredTickets = tickets.filter(ticket => {
        const statusMatch = filterStatus === 'all' || ticket.status === filterStatus;
        const priorityMatch = filterPriority === 'all' || ticket.priority === filterPriority;
        return statusMatch && priorityMatch;
    });

    const updateTicketStatus = (ticketId: string, newStatus: SupportTicket['status']) => {
        setTickets(prev => prev.map(ticket => 
            ticket.id === ticketId 
                ? { ...ticket, status: newStatus, updatedAt: new Date() }
                : ticket
        ));
    };

    const getStatusColor = (status: SupportTicket['status']) => {
        switch (status) {
            case 'open': return '#e74c3c';
            case 'in_progress': return '#f39c12';
            case 'resolved': return '#27ae60';
            case 'closed': return '#95a5a6';
            default: return '#7f8c8d';
        }
    };

    const getPriorityColor = (priority: SupportTicket['priority']) => {
        switch (priority) {
            case 'urgent': return '#e74c3c';
            case 'high': return '#f39c12';
            case 'medium': return '#3498db';
            case 'low': return '#27ae60';
            default: return '#7f8c8d';
        }
    };

    if (loading) {
        return (
            <div style={{ 
                padding: '20px', 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center', 
                height: '50vh',
                fontSize: '18px'
            }}>
                Loading customer service data...
            </div>
        );
    }

    return (
        <div style={{ padding: '20px', backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
            <div style={{ marginBottom: '30px' }}>
                <h1 style={{ color: '#2c3e50', marginBottom: '10px' }}>Customer Service Management</h1>
                <p style={{ color: '#7f8c8d', fontSize: '16px' }}>Manage support tickets and customer inquiries</p>
            </div>

            {/* Metrics Cards */}
            <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
                gap: '20px', 
                marginBottom: '30px' 
            }}>
                <div style={{ 
                    padding: '20px', 
                    backgroundColor: 'white',
                    borderRadius: '12px', 
                    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                    borderLeft: '4px solid #3498db'
                }}>
                    <h3 style={{ margin: '0 0 10px 0', color: '#7f8c8d', fontSize: '14px' }}>Total Tickets</h3>
                    <p style={{ fontSize: '2em', fontWeight: 'bold', margin: 0, color: '#2c3e50' }}>
                        {metrics.totalTickets}
                    </p>
                </div>

                <div style={{ 
                    padding: '20px', 
                    backgroundColor: 'white',
                    borderRadius: '12px', 
                    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                    borderLeft: '4px solid #e74c3c'
                }}>
                    <h3 style={{ margin: '0 0 10px 0', color: '#7f8c8d', fontSize: '14px' }}>Open Tickets</h3>
                    <p style={{ fontSize: '2em', fontWeight: 'bold', margin: 0, color: '#e74c3c' }}>
                        {metrics.openTickets}
                    </p>
                </div>

                <div style={{ 
                    padding: '20px', 
                    backgroundColor: 'white',
                    borderRadius: '12px', 
                    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                    borderLeft: '4px solid #27ae60'
                }}>
                    <h3 style={{ margin: '0 0 10px 0', color: '#7f8c8d', fontSize: '14px' }}>Resolved</h3>
                    <p style={{ fontSize: '2em', fontWeight: 'bold', margin: 0, color: '#27ae60' }}>
                        {metrics.resolvedTickets}
                    </p>
                </div>

                <div style={{ 
                    padding: '20px', 
                    backgroundColor: 'white',
                    borderRadius: '12px', 
                    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                    borderLeft: '4px solid #f39c12'
                }}>
                    <h3 style={{ margin: '0 0 10px 0', color: '#7f8c8d', fontSize: '14px' }}>Avg Response Time</h3>
                    <p style={{ fontSize: '2em', fontWeight: 'bold', margin: 0, color: '#f39c12' }}>
                        {metrics.averageResponseTime}h
                    </p>
                </div>

                <div style={{ 
                    padding: '20px', 
                    backgroundColor: 'white',
                    borderRadius: '12px', 
                    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                    borderLeft: '4px solid #9b59b6'
                }}>
                    <h3 style={{ margin: '0 0 10px 0', color: '#7f8c8d', fontSize: '14px' }}>Satisfaction</h3>
                    <p style={{ fontSize: '2em', fontWeight: 'bold', margin: 0, color: '#9b59b6' }}>
                        {metrics.customerSatisfaction}%
                    </p>
                </div>

                <div style={{ 
                    padding: '20px', 
                    backgroundColor: 'white',
                    borderRadius: '12px', 
                    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                    borderLeft: '4px solid #e67e22'
                }}>
                    <h3 style={{ margin: '0 0 10px 0', color: '#7f8c8d', fontSize: '14px' }}>Escalated</h3>
                    <p style={{ fontSize: '2em', fontWeight: 'bold', margin: 0, color: '#e67e22' }}>
                        {metrics.escalatedTickets}
                    </p>
                </div>
            </div>

            {/* Filters */}
            <div style={{ 
                backgroundColor: 'white', 
                padding: '20px', 
                borderRadius: '12px', 
                boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                marginBottom: '20px',
                display: 'flex',
                gap: '20px',
                alignItems: 'center'
            }}>
                <div>
                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#2c3e50' }}>
                        Filter by Status:
                    </label>
                    <select 
                        value={filterStatus} 
                        onChange={(e) => setFilterStatus(e.target.value)}
                        style={{
                            padding: '8px 12px',
                            border: '1px solid #ddd',
                            borderRadius: '6px',
                            backgroundColor: 'white'
                        }}
                    >
                        <option value="all">All Statuses</option>
                        <option value="open">Open</option>
                        <option value="in_progress">In Progress</option>
                        <option value="resolved">Resolved</option>
                        <option value="closed">Closed</option>
                    </select>
                </div>

                <div>
                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#2c3e50' }}>
                        Filter by Priority:
                    </label>
                    <select 
                        value={filterPriority} 
                        onChange={(e) => setFilterPriority(e.target.value)}
                        style={{
                            padding: '8px 12px',
                            border: '1px solid #ddd',
                            borderRadius: '6px',
                            backgroundColor: 'white'
                        }}
                    >
                        <option value="all">All Priorities</option>
                        <option value="urgent">Urgent</option>
                        <option value="high">High</option>
                        <option value="medium">Medium</option>
                        <option value="low">Low</option>
                    </select>
                </div>
            </div>

            {/* Tickets Table */}
            <div style={{ 
                backgroundColor: 'white', 
                borderRadius: '12px', 
                boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                overflow: 'hidden'
            }}>
                <div style={{ padding: '20px', borderBottom: '1px solid #ecf0f1' }}>
                    <h2 style={{ margin: 0, color: '#2c3e50' }}>Support Tickets</h2>
                </div>

                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead style={{ backgroundColor: '#f8f9fa' }}>
                            <tr>
                                <th style={{ padding: '15px', textAlign: 'left', borderBottom: '1px solid #ecf0f1', color: '#2c3e50' }}>ID</th>
                                <th style={{ padding: '15px', textAlign: 'left', borderBottom: '1px solid #ecf0f1', color: '#2c3e50' }}>Customer</th>
                                <th style={{ padding: '15px', textAlign: 'left', borderBottom: '1px solid #ecf0f1', color: '#2c3e50' }}>Subject</th>
                                <th style={{ padding: '15px', textAlign: 'left', borderBottom: '1px solid #ecf0f1', color: '#2c3e50' }}>Category</th>
                                <th style={{ padding: '15px', textAlign: 'left', borderBottom: '1px solid #ecf0f1', color: '#2c3e50' }}>Priority</th>
                                <th style={{ padding: '15px', textAlign: 'left', borderBottom: '1px solid #ecf0f1', color: '#2c3e50' }}>Status</th>
                                <th style={{ padding: '15px', textAlign: 'left', borderBottom: '1px solid #ecf0f1', color: '#2c3e50' }}>Created</th>
                                <th style={{ padding: '15px', textAlign: 'left', borderBottom: '1px solid #ecf0f1', color: '#2c3e50' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredTickets.map((ticket) => (
                                <tr key={ticket.id} style={{ borderBottom: '1px solid #ecf0f1' }}>
                                    <td style={{ padding: '15px', color: '#7f8c8d' }}>#{ticket.id}</td>
                                    <td style={{ padding: '15px' }}>
                                        <div>
                                            <div style={{ fontWeight: 'bold', color: '#2c3e50' }}>{ticket.userName}</div>
                                            <div style={{ fontSize: '12px', color: '#7f8c8d' }}>{ticket.userEmail}</div>
                                        </div>
                                    </td>
                                    <td style={{ padding: '15px', color: '#2c3e50' }}>{ticket.subject}</td>
                                    <td style={{ padding: '15px', color: '#2c3e50' }}>{ticket.category}</td>
                                    <td style={{ padding: '15px' }}>
                                        <span style={{
                                            padding: '4px 8px',
                                            borderRadius: '4px',
                                            backgroundColor: getPriorityColor(ticket.priority),
                                            color: 'white',
                                            fontSize: '12px',
                                            fontWeight: 'bold'
                                        }}>
                                            {ticket.priority.toUpperCase()}
                                        </span>
                                    </td>
                                    <td style={{ padding: '15px' }}>
                                        <span style={{
                                            padding: '4px 8px',
                                            borderRadius: '4px',
                                            backgroundColor: getStatusColor(ticket.status),
                                            color: 'white',
                                            fontSize: '12px',
                                            fontWeight: 'bold'
                                        }}>
                                            {ticket.status.replace('_', ' ').toUpperCase()}
                                        </span>
                                    </td>
                                    <td style={{ padding: '15px', color: '#7f8c8d' }}>
                                        {ticket.createdAt.toLocaleDateString()}
                                    </td>
                                    <td style={{ padding: '15px' }}>
                                        <button
                                            onClick={() => setSelectedTicket(ticket)}
                                            style={{
                                                padding: '6px 12px',
                                                backgroundColor: '#3498db',
                                                color: 'white',
                                                border: 'none',
                                                borderRadius: '4px',
                                                cursor: 'pointer',
                                                fontSize: '12px',
                                                marginRight: '5px'
                                            }}
                                        >
                                            View
                                        </button>
                                        {ticket.status === 'open' && (
                                            <button
                                                onClick={() => updateTicketStatus(ticket.id, 'in_progress')}
                                                style={{
                                                    padding: '6px 12px',
                                                    backgroundColor: '#f39c12',
                                                    color: 'white',
                                                    border: 'none',
                                                    borderRadius: '4px',
                                                    cursor: 'pointer',
                                                    fontSize: '12px'
                                                }}
                                            >
                                                Assign
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Ticket Detail Modal */}
            {selectedTicket && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(0,0,0,0.5)',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    zIndex: 1000
                }}>
                    <div style={{
                        backgroundColor: 'white',
                        borderRadius: '12px',
                        padding: '30px',
                        maxWidth: '600px',
                        width: '90%',
                        maxHeight: '80vh',
                        overflowY: 'auto'
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                            <h2 style={{ margin: 0, color: '#2c3e50' }}>Ticket #{selectedTicket.id}</h2>
                            <button
                                onClick={() => setSelectedTicket(null)}
                                style={{
                                    background: 'none',
                                    border: 'none',
                                    fontSize: '24px',
                                    cursor: 'pointer',
                                    color: '#7f8c8d'
                                }}
                            >
                                ×
                            </button>
                        </div>

                        <div style={{ marginBottom: '20px' }}>
                            <h3 style={{ color: '#2c3e50', marginBottom: '10px' }}>Customer Information</h3>
                            <p><strong>Name:</strong> {selectedTicket.userName}</p>
                            <p><strong>Email:</strong> {selectedTicket.userEmail}</p>
                            <p><strong>User ID:</strong> {selectedTicket.userId}</p>
                        </div>

                        <div style={{ marginBottom: '20px' }}>
                            <h3 style={{ color: '#2c3e50', marginBottom: '10px' }}>Ticket Details</h3>
                            <p><strong>Subject:</strong> {selectedTicket.subject}</p>
                            <p><strong>Category:</strong> {selectedTicket.category}</p>
                            <p><strong>Priority:</strong> 
                                <span style={{
                                    padding: '2px 6px',
                                    borderRadius: '3px',
                                    backgroundColor: getPriorityColor(selectedTicket.priority),
                                    color: 'white',
                                    fontSize: '12px',
                                    fontWeight: 'bold',
                                    marginLeft: '8px'
                                }}>
                                    {selectedTicket.priority.toUpperCase()}
                                </span>
                            </p>
                            <p><strong>Status:</strong> 
                                <span style={{
                                    padding: '2px 6px',
                                    borderRadius: '3px',
                                    backgroundColor: getStatusColor(selectedTicket.status),
                                    color: 'white',
                                    fontSize: '12px',
                                    fontWeight: 'bold',
                                    marginLeft: '8px'
                                }}>
                                    {selectedTicket.status.replace('_', ' ').toUpperCase()}
                                </span>
                            </p>
                            <p><strong>Created:</strong> {selectedTicket.createdAt.toLocaleString()}</p>
                            <p><strong>Last Updated:</strong> {selectedTicket.updatedAt.toLocaleString()}</p>
                            {selectedTicket.assignedTo && (
                                <p><strong>Assigned To:</strong> {selectedTicket.assignedTo}</p>
                            )}
                        </div>

                        <div style={{ marginBottom: '20px' }}>
                            <h3 style={{ color: '#2c3e50', marginBottom: '10px' }}>Description</h3>
                            <p style={{ 
                                backgroundColor: '#f8f9fa', 
                                padding: '15px', 
                                borderRadius: '6px',
                                border: '1px solid #ecf0f1'
                            }}>
                                {selectedTicket.description}
                            </p>
                        </div>

                        {selectedTicket.resolution && (
                            <div style={{ marginBottom: '20px' }}>
                                <h3 style={{ color: '#2c3e50', marginBottom: '10px' }}>Resolution</h3>
                                <p style={{ 
                                    backgroundColor: '#e8f5e8', 
                                    padding: '15px', 
                                    borderRadius: '6px',
                                    border: '1px solid #27ae60',
                                    color: '#155724'
                                }}>
                                    {selectedTicket.resolution}
                                </p>
                            </div>
                        )}

                        <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                            <button
                                onClick={() => setSelectedTicket(null)}
                                style={{
                                    padding: '10px 20px',
                                    backgroundColor: '#95a5a6',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '6px',
                                    cursor: 'pointer'
                                }}
                            >
                                Close
                            </button>
                            {selectedTicket.status !== 'resolved' && (
                                <button
                                    onClick={() => {
                                        updateTicketStatus(selectedTicket.id, 'resolved');
                                        setSelectedTicket({...selectedTicket, status: 'resolved', resolution: 'Issue resolved by support team'});
                                    }}
                                    style={{
                                        padding: '10px 20px',
                                        backgroundColor: '#27ae60',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '6px',
                                        cursor: 'pointer'
                                    }}
                                >
                                    Mark as Resolved
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CustomerService;
