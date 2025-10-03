import React, { useState, useMemo, useEffect } from 'react';
import {
    useReactTable,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    flexRender,
} from '@tanstack/react-table';
import type { ColumnDef } from '@tanstack/react-table';
import { getUsers, getCalls, getDashboardStats } from '../services/database';
import SmallUserGrowthChart from './SmallUserGrowthChart';

interface User {
    _id: string;
    name: string;
    email: string;
    createdAt: string;
    updatedAt?: string;
    subscription?: {
        status: 'active' | 'inactive' | 'trial' | 'cancelled';
        plan: string;
    };
    hasActiveSubscription?: boolean;
    freeMinutes?: number;
}

interface UserWithActivity extends User {
    lastActivity?: string;
    callCount?: number;
    totalMinutes?: number;
    subscriptionStatus: string;
    isActive: boolean;
}

const EnhancedUserList: React.FC = () => {
    const [globalFilter, setGlobalFilter] = useState('');
    const [users, setUsers] = useState<UserWithActivity[]>([]);
    const [calls, setCalls] = useState<any[]>([]);
    const [userGrowthData, setUserGrowthData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [sorting, setSorting] = useState<any[]>([{ id: 'lastActivity', desc: true }]);

    // Calculate user activity metrics
    const calculateUserActivity = (users: User[], calls: any[]) => {
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        return users.map(user => {
            // Find last activity from calls
            const userCalls = calls.filter(call => call.userId === user._id);
            const lastCall = userCalls
                .sort((a, b) => new Date(b.createdAt || b.startedAt).getTime() - new Date(a.createdAt || a.startedAt).getTime())[0];

            // Count calls in last 30 days
            const recentCalls = userCalls.filter(call => {
                const callDate = new Date(call.createdAt || call.startedAt);
                return callDate >= thirtyDaysAgo;
            });

            // Calculate total minutes (if available)
            const totalMinutes = userCalls.reduce((sum, call) => sum + (call.duration || 0), 0);

            return {
                ...user,
                lastActivity: lastCall ? (lastCall.createdAt || lastCall.startedAt) : (user.updatedAt || user.createdAt),
                callCount: recentCalls.length,
                totalMinutes: Math.round(totalMinutes),
                subscriptionStatus: user.subscription?.status || (user.hasActiveSubscription ? 'active' : 'inactive'),
                isActive: recentCalls.length > 0
            };
        });
    };

    const columns = useMemo<ColumnDef<UserWithActivity>[]>(
        () => [
            {
                accessorKey: 'name',
                header: 'User',
                cell: info => {
                    const user = info.row.original;
                    return (
                        <div>
                            <div style={{ fontWeight: 'bold', color: '#2c3e50' }}>
                                {user.name || 'Unknown'}
                            </div>
                            <div style={{ fontSize: '12px', color: '#7f8c8d' }}>
                                {user.email}
                            </div>
                        </div>
                    );
                },
            },
            {
                accessorKey: 'subscriptionStatus',
                header: 'Status',
                cell: info => {
                    const status = info.getValue() as string;
                    const isActive = status === 'active';
                    const isTrial = status === 'trial';

                    let bgColor = '#f8d7da';
                    let textColor = '#721c24';

                    if (isActive) {
                        bgColor = '#d4edda';
                        textColor = '#155724';
                    } else if (isTrial) {
                        bgColor = '#fff3cd';
                        textColor = '#856404';
                    }

                    return (
                        <span
                            style={{
                                padding: '4px 8px',
                                borderRadius: '4px',
                                backgroundColor: bgColor,
                                color: textColor,
                                fontSize: '12px',
                                fontWeight: 'bold'
                            }}
                        >
                            {status.toUpperCase()}
                        </span>
                    );
                },
            },
            {
                accessorKey: 'callCount',
                header: 'Activity (30d)',
                cell: info => {
                    const count = info.getValue() as number;
                    const isActive = count > 0;
                    return (
                        <div style={{ textAlign: 'center' }}>
                            <div style={{
                                fontSize: '16px',
                                fontWeight: 'bold',
                                color: isActive ? '#27ae60' : '#7f8c8d'
                            }}>
                                {count}
                            </div>
                            <div style={{ fontSize: '10px', color: '#7f8c8d' }}>
                                calls
                            </div>
                        </div>
                    );
                },
            },
            {
                accessorKey: 'totalMinutes',
                header: 'Usage',
                cell: info => {
                    const minutes = info.getValue() as number;
                    const hours = Math.round(minutes / 60 * 10) / 10;
                    return (
                        <div style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#3498db' }}>
                                {hours}h
                            </div>
                            <div style={{ fontSize: '10px', color: '#7f8c8d' }}>
                                total
                            </div>
                        </div>
                    );
                },
            },
            {
                accessorKey: 'lastActivity',
                header: 'Last Active',
                cell: info => {
                    const date = info.getValue() as string;
                    if (!date) return <span style={{ color: '#7f8c8d' }}>Never</span>;

                    const activityDate = new Date(date);
                    const now = new Date();
                    const diffDays = Math.floor((now.getTime() - activityDate.getTime()) / (1000 * 60 * 60 * 24));

                    let color = '#27ae60';
                    if (diffDays > 7) color = '#f39c12';
                    if (diffDays > 30) color = '#e74c3c';

                    return (
                        <div>
                            <div style={{ fontSize: '12px', color, fontWeight: 'bold' }}>
                                {diffDays === 0 ? 'Today' :
                                    diffDays === 1 ? 'Yesterday' :
                                        `${diffDays}d ago`}
                            </div>
                            <div style={{ fontSize: '10px', color: '#7f8c8d' }}>
                                {activityDate.toLocaleDateString()}
                            </div>
                        </div>
                    );
                },
            },
            {
                accessorKey: 'createdAt',
                header: 'Joined',
                cell: info => {
                    const date = info.getValue() as string;
                    return new Date(date).toLocaleDateString();
                },
            },
        ],
        []
    );

    useEffect(() => {
        let mounted = true;
        (async () => {
            try {
                const [usersData, callsData, dashboardStats] = await Promise.all([
                    getUsers(),
                    getCalls(),
                    getDashboardStats()
                ]);

                if (mounted) {
                    const usersWithActivity = calculateUserActivity(
                        usersData as unknown as User[],
                        callsData as unknown as any[]
                    );
                    setUsers(usersWithActivity);
                    setCalls(callsData as unknown as any[]);
                    setUserGrowthData(dashboardStats.userGrowthByDay || []);
                }
            } catch (error) {
                console.error('Error fetching data:', error);
                if (mounted) {
                    setUsers([]);
                    setCalls([]);
                    setUserGrowthData([]);
                }
            } finally {
                if (mounted) setLoading(false);
            }
        })();
        return () => {
            mounted = false;
        };
    }, []);

    const data: UserWithActivity[] = loading ? [] : users;

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        globalFilterFn: 'includesString',
        state: {
            globalFilter,
            sorting
        },
        onGlobalFilterChange: setGlobalFilter,
        onSortingChange: setSorting,
    });

    // Calculate summary statistics
    const activeUsers = users.filter(u => u.isActive).length;
    const paidUsers = users.filter(u => u.subscriptionStatus === 'active').length;
    const trialUsers = users.filter(u => u.subscriptionStatus === 'trial').length;
    const totalCalls = users.reduce((sum, u) => sum + (u.callCount || 0), 0);

    return (
        <div style={{ padding: '20px', backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
            <div style={{ marginBottom: '30px' }}>
                <h1 style={{ color: '#2c3e50', marginBottom: '10px' }}>User Activity Dashboard</h1>
                <p style={{ color: '#7f8c8d', fontSize: '16px' }}>
                    Comprehensive user activity and engagement metrics
                </p>
            </div>

            {/* Compact Summary Cards with Small Chart */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                gap: '15px',
                marginBottom: '20px'
            }}>
                <div style={{
                    padding: '12px 16px',
                    backgroundColor: 'white',
                    borderRadius: '8px',
                    boxShadow: '0 1px 4px rgba(0,0,0,0.1)',
                    borderLeft: '3px solid #3498db'
                }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                            <div style={{ fontSize: '12px', color: '#7f8c8d', marginBottom: '2px' }}>Total Users</div>
                            <div style={{ fontSize: '1.5em', fontWeight: 'bold', color: '#2c3e50' }}>
                                {users.length}
                            </div>
                        </div>
                        <div style={{ fontSize: '1.2em', color: '#3498db' }}>👥</div>
                    </div>
                </div>

                <div style={{
                    padding: '12px 16px',
                    backgroundColor: 'white',
                    borderRadius: '8px',
                    boxShadow: '0 1px 4px rgba(0,0,0,0.1)',
                    borderLeft: '3px solid #27ae60'
                }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                            <div style={{ fontSize: '12px', color: '#7f8c8d', marginBottom: '2px' }}>Active Users</div>
                            <div style={{ fontSize: '1.5em', fontWeight: 'bold', color: '#2c3e50' }}>
                                {activeUsers}
                            </div>
                            <div style={{ fontSize: '10px', color: '#27ae60' }}>
                                {users.length > 0 ? Math.round((activeUsers / users.length) * 100) : 0}%
                            </div>
                        </div>
                        <div style={{ fontSize: '1.2em', color: '#27ae60' }}>✅</div>
                    </div>
                </div>

                <div style={{
                    padding: '12px 16px',
                    backgroundColor: 'white',
                    borderRadius: '8px',
                    boxShadow: '0 1px 4px rgba(0,0,0,0.1)',
                    borderLeft: '3px solid #f39c12'
                }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                            <div style={{ fontSize: '12px', color: '#7f8c8d', marginBottom: '2px' }}>Paid Users</div>
                            <div style={{ fontSize: '1.5em', fontWeight: 'bold', color: '#2c3e50' }}>
                                {paidUsers}
                            </div>
                            <div style={{ fontSize: '10px', color: '#f39c12' }}>
                                {trialUsers} trial
                            </div>
                        </div>
                        <div style={{ fontSize: '1.2em', color: '#f39c12' }}>💰</div>
                    </div>
                </div>

                <div style={{
                    padding: '12px 16px',
                    backgroundColor: 'white',
                    borderRadius: '8px',
                    boxShadow: '0 1px 4px rgba(0,0,0,0.1)',
                    borderLeft: '3px solid #e74c3c'
                }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                            <div style={{ fontSize: '12px', color: '#7f8c8d', marginBottom: '2px' }}>Total Calls</div>
                            <div style={{ fontSize: '1.5em', fontWeight: 'bold', color: '#2c3e50' }}>
                                {totalCalls}
                            </div>
                            <div style={{ fontSize: '10px', color: '#e74c3c' }}>
                                30 days
                            </div>
                        </div>
                        <div style={{ fontSize: '1.2em', color: '#e74c3c' }}>📞</div>
                    </div>
                </div>

                {/* Small User Growth Chart */}
                <div style={{ gridColumn: 'span 2' }}>
                    <SmallUserGrowthChart
                        data={userGrowthData}
                        loading={loading}
                    />
                </div>
            </div>

            {/* Search and Filters */}
            <div style={{
                backgroundColor: 'white',
                padding: '20px',
                borderRadius: '12px',
                boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                marginBottom: '20px'
            }}>
                <div style={{ display: 'flex', gap: '20px', alignItems: 'center', flexWrap: 'wrap' }}>
                    <div style={{ flex: 1, minWidth: '300px' }}>
                        <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#2c3e50' }}>
                            Search Users:
                        </label>
                        <input
                            type="text"
                            placeholder="Search by name, email, or status..."
                            value={globalFilter ?? ''}
                            onChange={e => setGlobalFilter(e.target.value)}
                            style={{
                                padding: '12px 16px',
                                width: '100%',
                                border: '1px solid #ddd',
                                borderRadius: '6px',
                                fontSize: '14px',
                                backgroundColor: 'white'
                            }}
                            disabled={loading}
                        />
                    </div>
                </div>
            </div>

            {/* User Table */}
            {loading ? (
                <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '200px',
                    fontSize: '18px',
                    color: '#7f8c8d'
                }}>
                    Loading user data...
                </div>
            ) : data.length === 0 ? (
                <div style={{
                    backgroundColor: 'white',
                    borderRadius: '12px',
                    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                    padding: '60px 20px',
                    textAlign: 'center'
                }}>
                    <div style={{ fontSize: '48px', color: '#bdc3c7', marginBottom: '20px' }}>👥</div>
                    <h3 style={{ color: '#2c3e50', marginBottom: '10px' }}>No Users Found</h3>
                    <p style={{ color: '#7f8c8d', fontSize: '16px' }}>
                        {globalFilter ?
                            `No users match your search "${globalFilter}". Try adjusting your search terms.` :
                            'No users have been registered yet.'
                        }
                    </p>
                </div>
            ) : (
                <div style={{
                    backgroundColor: 'white',
                    borderRadius: '12px',
                    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                    overflow: 'hidden'
                }}>
                    <div style={{ padding: '20px', borderBottom: '1px solid #ecf0f1' }}>
                        <h2 style={{ margin: 0, color: '#2c3e50' }}>User Activity Report</h2>
                    </div>
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                {table.getHeaderGroups().map(headerGroup => (
                                    <tr key={headerGroup.id} style={{ backgroundColor: '#f8f9fa' }}>
                                        {headerGroup.headers.map(header => (
                                            <th
                                                key={header.id}
                                                style={{
                                                    padding: '15px',
                                                    textAlign: 'left',
                                                    borderBottom: '1px solid #ecf0f1',
                                                    fontWeight: 'bold',
                                                    color: '#2c3e50',
                                                    fontSize: '14px',
                                                    cursor: header.column.getCanSort() ? 'pointer' : 'default'
                                                }}
                                                onClick={header.column.getToggleSortingHandler()}
                                            >
                                                {header.isPlaceholder
                                                    ? null
                                                    : flexRender(header.column.columnDef.header, header.getContext())}
                                                {header.column.getIsSorted() === 'asc' ? ' ↑' :
                                                    header.column.getIsSorted() === 'desc' ? ' ↓' : ''}
                                            </th>
                                        ))}
                                    </tr>
                                ))}
                            </thead>
                            <tbody>
                                {table.getRowModel().rows.map(row => (
                                    <tr key={row.id} style={{ borderBottom: '1px solid #ecf0f1' }}>
                                        {row.getVisibleCells().map(cell => (
                                            <td
                                                key={cell.id}
                                                style={{
                                                    padding: '15px',
                                                    borderBottom: '1px solid #ecf0f1',
                                                    color: '#2c3e50',
                                                    fontSize: '14px'
                                                }}
                                            >
                                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div style={{
                        padding: '20px',
                        borderTop: '1px solid #ecf0f1',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        backgroundColor: '#f8f9fa'
                    }}>
                        <div>
                            <button
                                onClick={() => table.previousPage()}
                                disabled={!table.getCanPreviousPage()}
                                style={{
                                    padding: '10px 20px',
                                    marginRight: '10px',
                                    backgroundColor: table.getCanPreviousPage() ? '#3498db' : '#bdc3c7',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '6px',
                                    cursor: table.getCanPreviousPage() ? 'pointer' : 'not-allowed',
                                    fontSize: '14px',
                                    fontWeight: '500'
                                }}
                            >
                                ← Previous
                            </button>
                            <button
                                onClick={() => table.nextPage()}
                                disabled={!table.getCanNextPage()}
                                style={{
                                    padding: '10px 20px',
                                    backgroundColor: table.getCanNextPage() ? '#3498db' : '#bdc3c7',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '6px',
                                    cursor: table.getCanNextPage() ? 'pointer' : 'not-allowed',
                                    fontSize: '14px',
                                    fontWeight: '500'
                                }}
                            >
                                Next →
                            </button>
                        </div>
                        <span style={{ color: '#7f8c8d', fontSize: '14px' }}>
                            Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
                        </span>
                    </div>
                </div>
            )}
        </div>
    );
};

export default EnhancedUserList;
