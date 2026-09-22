import { useEffect, useState, useMemo } from 'react';
import { fetchDashboardData } from '../Services/DashboardAPI';
import StatCard from './StatCard';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

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
    const [chartFilter, setChartFilter] = useState<'all' | 'short' | 'medium' | 'long'>('all');

    const formattedChartData = useMemo(() => {
        if (!data || !data.chartData) return [];
        
        const filteredRawData = data.chartData.filter((test: any) => {
            const timeLimit = test.testConfig.timeLimit;
            if (chartFilter === 'short') return timeLimit < 30;
            if (chartFilter === 'medium') return timeLimit >= 30 && timeLimit <= 60;
            if (chartFilter === 'long') return timeLimit > 60;
            return true;
        });

        return filteredRawData.map((test: any) => {
            const wpm = test.macroscopicMetrics.wpm;
            const accuracy = test.macroscopicMetrics.accuracy;
            return {
                rawDate: new Date(test.timestamp),
                displayDate: new Date(test.timestamp).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
                timeTaken: test.testConfig.timeLimit,
                wpm: wpm,
                accuracy: accuracy,
                netWpm: Math.round(wpm * (accuracy / 100))
            };
        });
    }, [data, chartFilter]);

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

    const CustomTooltip = ({ active, payload }: any) => {
        if (active && payload && payload.length) {
            const pointData = payload[0].payload;
            return (
                <div style={{ backgroundColor: '#11111B', padding: '12px', border: '1px solid #818CF8', borderRadius: '8px' }}>
                    <p style={{ margin: '0 0 8px 0', color: '#A6ACCD', fontWeight: 'bold' }}>{pointData.rawDate.toLocaleString()}</p>
                    <p style={{ margin: '4px 0', color: '#6B7280' }}>Time Taken: {pointData.timeTaken}s</p>
                    <p style={{ margin: '4px 0', color: '#818CF8' }}>WPM: {pointData.wpm}</p>
                    <p style={{ margin: '4px 0', color: '#10B981' }}>Net WPM: {pointData.netWpm}</p>
                    <p style={{ margin: '4px 0', color: '#F59E0B' }}>Accuracy: {pointData.accuracy}%</p>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="dashboard-container" style={{ width: '100%', marginTop: '20px', padding: '20px', backgroundColor: '#1E1E2E', borderRadius: '12px' }}>
            <h2 style={{ color: '#818CF8', marginBottom: '24px' }}>Your Statistics</h2>
            
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '16px',
                marginBottom: '40px'
            }}>
                <StatCard title="Total Tests" value={data?.summary?.totalTests || 0} icon="📝" />
                <StatCard title="Total Time" value={formatTime(data?.summary?.totalTimeSeconds)} icon="⏱️" />
                <StatCard title="Personal Best" value={data?.summary?.maxWpm || 0} subtitle="Words Per Minute" icon="🏆" />
                <StatCard title="Avg WPM" value={data?.summary?.avgWpm || 0} icon="⚡" />
                <StatCard title="Avg Accuracy" value={`${data?.summary?.avgAccuracy || 0}%`} icon="🎯" />
            </div>
            
            {/* Line Chart Section */}
            <div style={{ backgroundColor: '#11111B', padding: '20px', borderRadius: '12px', marginBottom: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '10px' }}>
                    <h3 style={{ color: '#A6ACCD', margin: 0 }}>Performance History</h3>
                    <div style={{ display: 'flex', gap: '8px' }}>
                        {['all', 'short', 'medium', 'long'].map(filter => (
                            <button
                                key={filter}
                                onClick={() => setChartFilter(filter as any)}
                                style={{
                                    backgroundColor: chartFilter === filter ? '#818CF8' : '#1E1E2E',
                                    color: chartFilter === filter ? '#11111B' : '#A6ACCD',
                                    border: 'none',
                                    padding: '6px 12px',
                                    borderRadius: '20px',
                                    cursor: 'pointer',
                                    fontSize: '0.85rem',
                                    textTransform: 'capitalize',
                                    fontWeight: chartFilter === filter ? 'bold' : 'normal',
                                    transition: 'all 0.2s ease-in-out'
                                }}
                            >
                                {filter}
                            </button>
                        ))}
                    </div>
                </div>
                <div style={{ width: '100%', height: 350 }}>
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={formattedChartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                            <XAxis dataKey="displayDate" stroke="#9CA3AF" tick={{ fill: '#9CA3AF' }} />
                            <YAxis yAxisId="left" stroke="#818CF8" tick={{ fill: '#818CF8' }} />
                            <YAxis yAxisId="right" orientation="right" stroke="#F59E0B" tick={{ fill: '#F59E0B' }} domain={[0, 100]} />
                            <Tooltip content={<CustomTooltip />} />
                            <Legend wrapperStyle={{ paddingTop: '20px' }} />
                            <Line yAxisId="left" type="monotone" dataKey="wpm" name="WPM" stroke="#818CF8" strokeWidth={3} activeDot={{ r: 8 }} />
                            <Line yAxisId="left" type="monotone" dataKey="netWpm" name="Net WPM" stroke="#10B981" strokeWidth={3} />
                            <Line yAxisId="right" type="monotone" dataKey="accuracy" name="Accuracy" stroke="#F59E0B" strokeWidth={2} dot={false} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>

            <div id="dashboard-heatmap" style={{ marginTop: '20px' }}></div>
        </div>
    );
}
