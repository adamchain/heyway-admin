import React, { useState, useMemo, useEffect } from 'react';
import {
    useReactTable,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    flexRender,
} from '@tanstack/react-table';
import type { ColumnDef } from '@tanstack/react-table';
import { getUsers } from '../services/database';
import type { User } from '../data/users';

const UserList: React.FC = () => {
    const [globalFilter, setGlobalFilter] = useState('');
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);

    const columns = useMemo<ColumnDef<User>[]>(
        () => [
            { accessorKey: '_id', header: 'ID', cell: info => info.getValue() },
            { accessorKey: 'name', header: 'Name', cell: info => info.getValue() },
            { accessorKey: 'email', header: 'Email', cell: info => info.getValue() },
            {
                accessorKey: 'subscription.status',
                header: 'Status',
                cell: info => {
                    const val = (info.getValue() as string) ?? 'inactive';
                    const isActive = val === 'active';
                    return (
                        <span
                            style={{
                                padding: '4px 8px',
                                borderRadius: '4px',
                                backgroundColor: isActive ? '#d4edda' : '#f8d7da',
                                color: isActive ? '#155724' : '#721c24',
                            }}
                        >
                            {val}
                        </span>
                    );
                },
            },
            {
                accessorKey: 'createdAt',
                header: 'Join Date',
                cell: info => {
                    const v = info.getValue() as string | Date | undefined;
                    return v ? new Date(v).toLocaleDateString() : '—';
                },
            },
            {
                accessorKey: 'lastActivity',
                header: 'Last Activity',
                cell: info => {
                    const v = info.getValue() as string | Date | undefined;
                    return v ? new Date(v).toLocaleDateString() : 'N/A';
                },
            },
            { accessorKey: 'subscription.plan', header: 'Plan', cell: info => info.getValue() },
        ],
        []
    );

    useEffect(() => {
        let mounted = true;
        (async () => {
            try {
                const usersData = await getUsers();
                if (mounted) setUsers(usersData as unknown as User[]);
            } catch (error) {
                console.error('Error fetching users:', error);
                if (mounted) setUsers([]);
            } finally {
                if (mounted) setLoading(false);
            }
        })();
        return () => {
            mounted = false;
        };
    }, []);

    // Ensure hooks are called every render
    const data: User[] = loading ? [] : users;

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        globalFilterFn: 'includesString',
        state: { globalFilter },
        onGlobalFilterChange: setGlobalFilter,
    });

    return (
        <div style={{ padding: '20px', backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
            <div style={{ marginBottom: '30px' }}>
                <h1 style={{ color: '#2c3e50', marginBottom: '10px' }}>User Management</h1>
                <p style={{ color: '#7f8c8d', fontSize: '16px' }}>Manage user accounts, subscriptions, and activity</p>
            </div>

            <div style={{
                backgroundColor: 'white',
                padding: '20px',
                borderRadius: '12px',
                boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                marginBottom: '20px'
            }}>
                <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                    <div style={{ flex: 1 }}>
                        <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#2c3e50' }}>
                            Search Users:
                        </label>
                        <input
                            type="text"
                            placeholder="Search by name, email, or ID..."
                            value={globalFilter ?? ''}
                            onChange={e => setGlobalFilter(e.target.value)}
                            style={{
                                padding: '12px 16px',
                                width: '100%',
                                maxWidth: '400px',
                                border: '1px solid #ddd',
                                borderRadius: '6px',
                                fontSize: '14px',
                                backgroundColor: 'white'
                            }}
                            disabled={loading}
                        />
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#2c3e50' }}>
                            Total Users:
                        </label>
                        <div style={{
                            fontSize: '24px',
                            fontWeight: 'bold',
                            color: '#3498db',
                            padding: '12px 16px',
                            backgroundColor: '#f8f9fa',
                            borderRadius: '6px'
                        }}>
                            {data.length}
                        </div>
                    </div>
                </div>
            </div>

            {loading ? (
                <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '200px',
                    fontSize: '18px',
                    color: '#7f8c8d'
                }}>
                    Loading users...
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
                            'No users have been registered yet. Users will appear here once they sign up.'
                        }
                    </p>
                    {globalFilter && (
                        <button
                            onClick={() => setGlobalFilter('')}
                            style={{
                                padding: '10px 20px',
                                marginTop: '20px',
                                backgroundColor: '#3498db',
                                color: 'white',
                                border: 'none',
                                borderRadius: '6px',
                                cursor: 'pointer',
                                fontSize: '14px',
                                fontWeight: '500'
                            }}
                        >
                            Clear Search
                        </button>
                    )}
                </div>
            ) : (
                <div style={{
                    backgroundColor: 'white',
                    borderRadius: '12px',
                    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                    overflow: 'hidden'
                }}>
                    <div style={{ padding: '20px', borderBottom: '1px solid #ecf0f1' }}>
                        <h2 style={{ margin: 0, color: '#2c3e50' }}>User Directory</h2>
                    </div>
                    <div style={{ overflowX: 'auto' }}>
                        <table
                            style={{
                                width: '100%',
                                borderCollapse: 'collapse',
                            }}
                        >
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
                                                    fontSize: '14px'
                                                }}
                                            >
                                                {header.isPlaceholder
                                                    ? null
                                                    : flexRender(header.column.columnDef.header, header.getContext())}
                                            </th>
                                        ))}
                                    </tr>
                                ))}
                            </thead>
                            <tbody>
                                {table.getRowModel().rows.map(row => (
                                    <tr key={row.id} style={{
                                        borderBottom: '1px solid #ecf0f1'
                                    }}>
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

                    <div
                        style={{
                            padding: '20px',
                            borderTop: '1px solid #ecf0f1',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            backgroundColor: '#f8f9fa'
                        }}
                    >
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

export default UserList;
