import axios from 'axios';

const DASHBOARD_ENDPOINT = `${import.meta.env.VITE_API_URL}/api/user/dashboard`;

export async function fetchDashboardData() {
    const token = localStorage.getItem('AuthToken');
    
    // Check if user is logged in before even making the request
    if (!token) {
        throw new Error('Log in to view stats');
    }

    try {
        const response = await axios.get(DASHBOARD_ENDPOINT, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error: any) {
        // Pass along backend error messages (e.g., if token is invalid or guest token)
        if (error.response && error.response.data && error.response.data.error) {
            throw new Error(error.response.data.error);
        }
        console.error('Error fetching dashboard data:', error);
        throw new Error('Failed to load dashboard data');
    }
}
