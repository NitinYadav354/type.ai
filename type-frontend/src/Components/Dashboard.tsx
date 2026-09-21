import { useEffect, useState } from 'react';
import { fetchDashboardData } from '../Services/DashboardAPI';
import StatCard from './StatCard';

const formatTime = (totalSeconds: number) => {
    if (!totalSeconds) return '0h 0m';
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
};

export default function Dashboard() {
    const [data, setData] = useState<any>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let isMounted = true;

        async function loadData() {
            try {
                setIsLoading(true);
                setError(null);
                const result = await fetchDashboardData();
                if (isMounted) {
                    setData(result);
                }
            } catch (err: any) {
                if (isMounted) {
                    setError(err.message || 'An unexpected error occurred');
                }
            } finally {
                if (isMounted) {
                    setIsLoading(false);
                }
            }
        }

        loadData();

        return () => {
            isMounted = false;
        };
    }, []);

    if (isLoading) {
        return (
            <div className="dashboard-container" style={{ textAlign: 'center', padding: '40px' }}>
                <h3 style={{ color: '#818CF8' }}>Analyzing your typing history...</h3>
            </div>
        );
    }

    if (error) {
        return (
            <div className="dashboard-container" style={{ textAlign: 'center', padding: '40px' }}>
                <h2 style={{ color: '#F87171' }}>Oops!</h2>
                <p>{error}</p>
                {error === 'Log in to view stats' && (
                    <p style={{ color: '#9CA3AF', marginTop: '10px' }}>
                        Please use the Google Login button above to access your personal dashboard.
                    </p>
                )}
            </div>
        );
    }

    return (
        <div className="dashboard-container" style={{ width: '100%', marginTop: '20px', padding: '20px', backgroundColor: '#1E1E2E', borderRadius: '12px' }}>
            <h2 style={{ color: '#818CF8', marginBottom: '24px' }}>Your Statistics</h2>
            
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '16px',
                marginBottom: '40px'
            }}>
                <StatCard title="Total Tests" value={data?.summary?.totalTests || 0} />
                <StatCard title="Total Time" value={formatTime(data?.summary?.totalTimeSeconds)} />
                <StatCard title="Personal Best" value={data?.summary?.maxWpm || 0} subtitle="Words Per Minute" />
                <StatCard title="Avg WPM" value={data?.summary?.avgWpm || 0}/>
                <StatCard title="Avg Accuracy" value={`${data?.summary?.avgAccuracy || 0}%`} />
            </div>
            
            <div id="dashboard-line-chart" style={{ marginTop: '20px' }}></div>
            <div id="dashboard-heatmap" style={{ marginTop: '20px' }}></div>
        </div>
    );
}
