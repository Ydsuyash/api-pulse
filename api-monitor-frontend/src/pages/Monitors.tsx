import React, { useState, useEffect } from 'react';
import { Plus, Search, X, BarChart2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { useSocket } from '../context/SocketContext';
import MonitorCard from '../components/MonitorCard';
import ResponseTimeChart from '../components/ResponseTimeChart';
import { getMonitors, createMonitor, updateMonitor, deleteMonitor, getMonitorMetrics } from '../services/api';

const Monitors = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDetailsOpen, setIsDetailsOpen] = useState(false);
    const [selectedMonitor, setSelectedMonitor] = useState<any>(null);
    const [monitorMetrics, setMonitorMetrics] = useState<any>(null);
    const [monitors, setMonitors] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const { socket } = useSocket();

    // Form State
    const [editingMonitor, setEditingMonitor] = useState<any>(null);
    const [formData, setFormData] = useState({ name: '', url: '', interval: '1m', isActive: true });
    const [isSubmitting, setIsSubmitting] = useState(false);

    // ... (fetchMonitors and socket logic same as before) ...
    const fetchMonitors = async () => {
        try {
            const { data } = await getMonitors();
            setMonitors(data);
        } catch (error) {
            console.error('Failed to fetch monitors', error);
            toast.error('Failed to load monitors');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMonitors();

        if (socket) {
            socket.on('monitor:update', (updatedMonitor: any) => {
                setMonitors((prevMonitors: any) =>
                    prevMonitors.map((m: any) =>
                        m.id === updatedMonitor.id ? { ...m, ...updatedMonitor } : m
                    )
                );
            });

            return () => {
                socket.off('monitor:update');
            };
        }
    }, [socket]);

    const openCreateModal = () => {
        setEditingMonitor(null);
        setFormData({ name: '', url: '', interval: '1m', isActive: true });
        setIsModalOpen(true);
    };

    const openEditModal = (monitor: any) => {
        setEditingMonitor(monitor);
        setFormData({
            name: monitor.name,
            url: monitor.url,
            interval: monitor.interval || '1m',
            isActive: monitor.isActive !== undefined ? monitor.isActive : true
        });
        setIsModalOpen(true);
    };

    const openDetailsModal = async (monitor: any) => {
        setSelectedMonitor(monitor);
        setIsDetailsOpen(true);
        setMonitorMetrics(null);
        try {
            const { data } = await getMonitorMetrics(monitor.id);
            setMonitorMetrics(data);
        } catch (error) {
            console.error('Failed to load metrics', error);
            toast.error('Failed to load metrics');
        }
    };

    const handleSaveMonitor = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            if (editingMonitor) {
                await updateMonitor(editingMonitor.id, {
                    ...formData,
                    status: editingMonitor.status // Keep existing status
                });
                toast.success('Monitor updated successfully');
            } else {
                await createMonitor({
                    ...formData,
                    type: 'HTTP', // Default type
                    isActive: true
                });
                toast.success('Monitor created successfully');
            }
            setIsModalOpen(false);
            fetchMonitors();
        } catch (error) {
            console.error('Failed to save monitor', error);
            toast.error(editingMonitor ? 'Failed to update monitor' : 'Failed to create monitor');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDeleteMonitor = async (id: string) => {
        try {
            await deleteMonitor(id);
            toast.success('Monitor deleted');
            setMonitors(monitors.filter((m: any) => m.id !== id));
        } catch (error) {
            console.error('Failed to delete monitor', error);
            toast.error('Failed to delete monitor');
        }
    };

    const filteredMonitors = monitors.filter((m: any) =>
        m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.url.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="space-y-6 relative">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-100">Monitors</h1>
                    <p className="text-gray-400">Manage and view the status of your endpoints.</p>
                </div>
                <button
                    onClick={openCreateModal}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
                >
                    <Plus className="w-5 h-5" />
                    <span>Add Monitor</span>
                </button>
            </div>

            {/* Search/Filter Bar */}
            <div className="bg-gray-900 p-4 rounded-xl border border-gray-800 flex items-center space-x-4">
                <Search className="w-5 h-5 text-gray-500" />
                <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search monitors..."
                    className="bg-transparent border-none text-gray-100 placeholder-gray-500 focus:outline-none w-full"
                />
            </div>

            {/* Monitors Grid */}
            {loading ? (
                <div className="text-center text-gray-400 py-10">Loading monitors...</div>
            ) : filteredMonitors.length === 0 ? (
                <div className="text-center text-gray-500 py-10">
                    {searchQuery ? 'No monitors match your search.' : 'No monitors found. Add one to get started!'}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredMonitors.map((monitor: any) => (
                        <div key={monitor.id} className="relative group">
                            <MonitorCard
                                monitor={monitor}
                                onEdit={openEditModal}
                                onDelete={handleDeleteMonitor}
                            />
                            <button
                                onClick={() => openDetailsModal(monitor)}
                                className="absolute top-4 right-14 p-1.5 text-gray-400 hover:text-indigo-400 bg-gray-800/50 rounded-md opacity-0 group-hover:opacity-100 transition-opacity"
                                title="View Analytics"
                            >
                                <BarChart2 className="w-4 h-4" />
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {/* Analytics Modal */}
            {isDetailsOpen && selectedMonitor && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-gray-900 rounded-xl border border-gray-800 w-full max-w-2xl shadow-2xl overflow-hidden">
                        <div className="flex justify-between items-center p-6 border-b border-gray-800 bg-gray-800/30">
                            <div>
                                <h3 className="text-xl font-bold text-gray-100 flex items-center gap-2">
                                    <BarChart2 className="w-5 h-5 text-indigo-400" />
                                    {selectedMonitor.name}
                                </h3>
                                <p className="text-sm text-gray-400">{selectedMonitor.url}</p>
                            </div>
                            <button
                                onClick={() => setIsDetailsOpen(false)}
                                className="text-gray-400 hover:text-gray-200 transition-colors"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <div className="p-6 space-y-6">
                            {/* Summary Stats */}
                            <div className="grid grid-cols-3 gap-4">
                                <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
                                    <p className="text-gray-400 text-xs uppercase font-medium">Current Status</p>
                                    <p className={`text-lg font-bold ${selectedMonitor.status === 'UP' ? 'text-green-400' : 'text-red-400'}`}>
                                        {selectedMonitor.status}
                                    </p>
                                </div>
                                <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
                                    <p className="text-gray-400 text-xs uppercase font-medium">Uptime (24h)</p>
                                    <p className="text-lg font-bold text-gray-200">
                                        {monitorMetrics ? `${monitorMetrics.uptimePercentage}%` : '-'}
                                    </p>
                                </div>
                                <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
                                    <p className="text-gray-400 text-xs uppercase font-medium">Last Check</p>
                                    <p className="text-lg font-bold text-gray-200">
                                        {selectedMonitor.lastChecked ? new Date(selectedMonitor.lastChecked).toLocaleTimeString() : '-'}
                                    </p>
                                </div>
                            </div>

                            {/* Chart */}
                            <div>
                                {monitorMetrics ? (
                                    <ResponseTimeChart data={monitorMetrics.latencyData} />
                                ) : (
                                    <div className="h-64 flex items-center justify-center text-gray-500 bg-gray-900/50 border border-gray-800 rounded-xl">
                                        Loading metrics...
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Add/Edit Monitor Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-gray-900 rounded-xl border border-gray-800 w-full max-w-md shadow-2xl transform transition-all">
                        <div className="flex justify-between items-center p-6 border-b border-gray-800">
                            <h3 className="text-xl font-bold text-gray-100">
                                {editingMonitor ? 'Edit Monitor' : 'Add New Monitor'}
                            </h3>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="text-gray-400 hover:text-gray-200 transition-colors"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <form onSubmit={handleSaveMonitor} className="p-6 space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-300">Name</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full bg-gray-800 border border-gray-700 rounded-lg p-2.5 text-gray-100 focus:ring-2 focus:ring-indigo-500/50 outline-none"
                                    placeholder="Production API"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-300">URL / Endpoint</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.url}
                                    onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                                    className="w-full bg-gray-800 border border-gray-700 rounded-lg p-2.5 text-gray-100 focus:ring-2 focus:ring-indigo-500/50 outline-none"
                                    placeholder="https://api.example.com/health"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-300">Check Interval</label>
                                <select
                                    value={formData.interval}
                                    onChange={(e) => setFormData({ ...formData, interval: e.target.value })}
                                    className="w-full bg-gray-800 border border-gray-700 rounded-lg p-2.5 text-gray-100 focus:ring-2 focus:ring-indigo-500/50 outline-none"
                                >
                                    <option value="30s">30 Seconds</option>
                                    <option value="1m">1 Minute</option>
                                    <option value="5m">5 Minutes</option>
                                    <option value="15m">15 Minutes</option>
                                </select>
                            </div>

                            <div className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    id="isActive"
                                    checked={formData.isActive}
                                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                                    className="w-4 h-4 text-indigo-600 bg-gray-800 border-gray-700 rounded focus:ring-indigo-500 focus:ring-2"
                                />
                                <label htmlFor="isActive" className="text-sm font-medium text-gray-300">Active (Run checks)</label>
                            </div>

                            <div className="pt-4 flex justify-end space-x-3">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-4 py-2 text-gray-400 hover:text-gray-200"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg font-medium transition-colors disabled:opacity-70"
                                >
                                    {isSubmitting ? 'Saving...' : (editingMonitor ? 'Update Monitor' : 'Create Monitor')}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Monitors;
