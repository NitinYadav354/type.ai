import { useEffect, useState } from 'react';
import { fetchDashboardData } from '../Services/DashboardAPI';

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
        <div className="dashboard-container" style={{ marginTop: '40px', padding: '20px', backgroundColor: '#1E1E2E', borderRadius: '12px' }}>
            <h2 style={{ color: '#818CF8', marginBottom: '20px' }}>Your Statistics</h2>
            
            <div style={{ color: '#A6ACCD', fontSize: '14px', backgroundColor: '#11111B', padding: '15px', borderRadius: '8px' }}>
                <p>✅ Data successfully fetched!</p>
                <p>Total Tests: {data?.summary?.totalTests}</p>
                <p>Personal Best (WPM): {data?.summary?.maxWpm}</p>
            </div>
            
            <div id="dashboard-summary-cards" style={{ marginTop: '20px' }}></div>
            <div id="dashboard-line-chart" style={{ marginTop: '20px' }}></div>
            <div id="dashboard-heatmap" style={{ marginTop: '20px' }}></div>
        </div>
    );
}
