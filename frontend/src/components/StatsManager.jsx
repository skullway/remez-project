import React, { useState, useEffect, useMemo } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
const StatsManager = ({ stats, onAdd, onEdit, onDelete }) => {
    const [date, setDate] = useState('');
    const [visits, setVisits] = useState('');
    const [editingStat, setEditingStat] = useState(null); // Holds the stat object being edited
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        // When editingStat changes, populate the form with its data.
        if (editingStat) {
            setDate(editingStat.date);
            setVisits(editingStat.visits);
        } else {
            // Clear the form when not in edit mode.
            setDate('');
            setVisits('');
        }
    }, [editingStat]);

    const handleSelectForEdit = (stat) => {
        setEditingStat(stat);
        setError('');
    };

    const handleCancelEdit = () => {
        setEditingStat(null);
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsSubmitting(true);

        // Basic validation
        if (!date || visits === '' || isNaN(visits) || Number(visits) < 0) {
            setError('Please enter a valid date and a non-negative number for visits.');
            setIsSubmitting(false);
            return;
        }

        const statData = { date, visits: Number(visits) };

        try {
            if (editingStat) {
                // If editing an existing stat
                await onEdit(editingStat.id, statData);
            } else {
                // If adding a new stat, check for duplicates
                if (stats.some(stat => stat.date === date)) {
                    setError('An entry for this date already exists. Please edit the existing entry.');
                    setIsSubmitting(false);
                    return;
                }
                await onAdd(statData);
            }
            // Clear the form and reset state after successful submission
            setEditingStat(null);
        } catch (err) {
            console.error("API Error:", err);
            setError(err.message || 'An unexpected error occurred. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDeleteClick = async (id) => {
        try {
            await onDelete(id);
        } catch (err) {
            console.error("API Error:", err);
            setError(err.message || 'Failed to delete the entry.');
        }
    };

    return (
        <div className="bg-gray-800 rounded-2xl shadow-2xl p-6 mt-8 transition-all duration-300 hover:shadow-cyan-500/20">
            <h2 className="text-2xl font-bold text-white mb-6 text-center">Manage Stats</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Form Section */}
                <div className="bg-gray-900/50 p-6 rounded-lg">
                    <h3 className="text-xl font-semibold text-white mb-4">{editingStat ? 'Edit Entry' : 'Add New Entry'}</h3>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label htmlFor="date" className="block text-sm font-medium text-gray-300 mb-1">Date</label>
                            <input
                                type="date"
                                id="date"
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                                className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition [&::-webkit-calendar-picker-indicator]:invert"
                                required
                                disabled={!!editingStat || isSubmitting}
                            />
                        </div>
                        <div>
                            <label htmlFor="visits" className="block text-sm font-medium text-gray-300 mb-1">Visits</label>
                            <input
                                type="number"
                                id="visits"
                                value={visits}
                                onChange={(e) => setVisits(e.target.value)}
                                placeholder="e.g., 5000"
                                className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition"
                                required
                                min="0"
                                disabled={isSubmitting}
                            />
                        </div>
                        {error && <p className="text-red-400 text-sm">{error}</p>}
                        <div className="flex items-center space-x-4 pt-2">
                             <button type="submit" disabled={isSubmitting} className="flex-1 px-4 py-2 text-sm font-bold text-white bg-cyan-600 rounded-md hover:bg-cyan-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-cyan-500 disabled:bg-gray-500 disabled:cursor-not-allowed">
                                 {isSubmitting ? 'Saving...' : (editingStat ? 'Update Entry' : 'Add Entry')}
                            </button>
                            {editingStat && (
                                <button type="button" onClick={handleCancelEdit} disabled={isSubmitting} className="flex-1 px-4 py-2 text-sm font-medium bg-gray-600 text-gray-200 rounded-md hover:bg-gray-500 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-gray-400 disabled:opacity-50">
                                    Cancel
                                </button>
                            )}
                        </div>
                    </form>
                </div>

                {/* List of Entries */}
                <div className="bg-gray-900/50 p-2 rounded-lg">
                     <h3 className="text-xl font-semibold text-white mb-2 px-4 pt-4">Existing Entries</h3>
                    <div className="max-h-80 overflow-y-auto pr-2">
                        <ul className="space-y-2">
                            {stats.sort((a, b) => new Date(b.date) - new Date(a.date)).map(stat => (
                                <li
                                    key={stat.id}
                                    className={`flex justify-between items-center p-3 rounded-md transition-colors ${editingStat?.id === stat.id ? 'bg-cyan-900/70' : 'bg-gray-800'}`}
                                >
                                    <div>
                                        <p className="font-semibold text-white">{new Date(stat.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</p>
                                        <p className="text-sm text-cyan-400">{stat.visits.toLocaleString()} visits</p>
                                    </div>
                                    <div className="space-x-2">
                                        <button onClick={() => handleSelectForEdit(stat)} className="px-3 py-1 text-xs font-medium text-white bg-blue-600 rounded hover:bg-blue-700 transition">Edit</button>
                                        <button onClick={() => handleDeleteClick(stat.id)} className="px-3 py-1 text-xs font-medium text-white bg-red-600 rounded hover:bg-red-700 transition">Delete</button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StatsManager;