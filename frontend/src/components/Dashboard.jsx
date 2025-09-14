import { useState, useEffect } from "react";
import { fetchStats, createStat, updateStat, deleteStat } from "../utils/apiCalls";
import Chart from "./Chart";
import StatsManager from "./StatsManager";

const Dashboard = () => {
    const [stats, setStats] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const getData = async () => {
            try {
                const fetchedData = await fetchStats();
                setStats(fetchedData);
            } catch (err) {
                setError("Failed to fetch initial data. Please try refreshing the page.");
            } finally {
                setLoading(false);
            }
        };
        getData();
    }, []);
    
    // Handler Functions to be passed to StatsManager
    
    const handleAddStat = async (newStat) => {
        const createdStat = await createStat(newStat);
        setStats(prevStats => [...prevStats, createdStat]);
    };
    
    const handleEditStat = async (id, updatedStat) => {
        const returnedStat = await updateStat(id, updatedStat);
        setStats(prevStats => 
            prevStats.map(stat => stat.id === id ? returnedStat : stat)
        );
    };
    
    const handleDeleteStat = async (id) => {
        await deleteStat(id);
        setStats(prevStats => prevStats.filter(stat => stat.id !== id));
    };

    if (loading) return <div className="text-center text-white p-10">Loading Dashboard...</div>;
    if (error) return <div className="text-center text-red-500 p-10">{error}</div>;

    return (
        <div className="bg-gray-900 text-gray-100 p-4 sm:p-8 font-sans flex justify-center min-h-screen">
            <main className="w-full max-w-5xl">
                <h1 className="text-4xl font-bold text-white mb-8 text-center">Analytics Dashboard</h1>
                <Chart rawStats={stats} />
                <StatsManager
                    stats={stats}
                    onAdd={handleAddStat}
                    onEdit={handleEditStat}
                    onDelete={handleDeleteStat}
                />
            </main>
        </div>
    );
};

export default Dashboard;
