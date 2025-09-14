import { useState, useEffect } from "react";
import { fetchStats, createStat, updateStat, deleteStat } from "../utils/apiCalls";
import { useAuth } from "../contexts/AuthContext";
import Chart from "./Chart";
import StatsManager from "./StatsManager";

const Dashboard = () => {
    const { logout } = useAuth();
    const [stats, setStats] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isSideBySide, setIsSideBySide] = useState(false);

    useEffect(() => {
        const getData = async () => {
            try {
                const fetchedData = await fetchStats();
                setStats(fetchedData);
            } catch (err) {
                console.error('Error fetching data:', err);
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

    const toggleLayout = () => {
        setIsSideBySide(!isSideBySide);
    };

    if (loading) return <div className="text-center text-blue-800 text-2xl p-10">Loading Dashboard...</div>;
    if (error) return <div className="text-center text-red-500 text-2xl p-10">{error}</div>;

    const mainWidthClass = isSideBySide ? "w-full" : "max-w-5xl";
    const layoutClasses = isSideBySide ? "flex-col lg:flex-row flex-nowrap" : "flex-col";

    return (
        <div className="bg-gray-900 text-gray-100 p-4 sm:p-8 font-sans flex justify-center min-h-screen">
            <main className={`w-full ${mainWidthClass} mx-auto`}>
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-4xl font-bold text-white">Analytics Dashboard</h1>
                <div className="flex items-center space-x-4">
                    <button
                        onClick={toggleLayout}
                        className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg transition-colors"
                    >
                        {isSideBySide ? 'View Above/Below' : 'View Side-by-Side'}
                    </button>
                    <button
                        onClick={logout}
                        className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                    >
                        Logout
                    </button>
                </div>
            </div>
                <div className={`flex ${layoutClasses} items-stretch gap-8`}>
                    <div className="flex-1">
                        <Chart rawStats={stats} />
                    </div>
                    <div className="flex-1">
                        <StatsManager
                            stats={stats}
                            onAdd={handleAddStat}
                            onEdit={handleEditStat}
                            onDelete={handleDeleteStat}
                        />
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Dashboard;
