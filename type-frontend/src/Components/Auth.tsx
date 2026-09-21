import { GoogleLogin, googleLogout } from "@react-oauth/google"
import axios from "axios"
import { getOrCreateGuestID } from "../Utility/userGuestID"

interface AuthProps {
  onToggleDashboard?: () => void;
  showDashboard?: boolean;
}

export default function Auth({ onToggleDashboard, showDashboard }: AuthProps) {
  const API_URL = import.meta.env.VITE_API_URL
  const token = localStorage.getItem('AuthToken')
  const userDataString = localStorage.getItem('userData')
  const user = userDataString ? JSON.parse(userDataString) : null
    const handleLoginSuccess = async (credentialResponse: any) => {
        try {
            const { credential } = credentialResponse

            const guestID = getOrCreateGuestID()
            const response = await axios.post(`${API_URL}/api/auth/google`, {
                token: credential,
                guestID: guestID
            })


            localStorage.setItem('AuthToken', response.data.token)
      localStorage.setItem('userData', JSON.stringify(response.data.user))
      globalThis.location.reload()
        } catch (error) {
            console.error('Login failed')
        }   
    }

    const handleLogout = () => {
        googleLogout()
        localStorage.removeItem('AuthToken')
      localStorage.removeItem('userData')
      globalThis.location.reload()
    }


    return (
    <div className="auth-shell">
      {token && user ? (
        <>
          <span className="auth-user-name">
            Welcome, {user.name}
          </span>
          <div className="auth-logout-wrapper" style={{ display: 'flex', gap: '15px' }}>
            <button 
              onClick={onToggleDashboard}
              className="auth-logout-button"
              title={showDashboard ? "Back to Typing Test" : "View Dashboard"}
            >
              {showDashboard ? '⌨️' : '📊'}
            </button>
            <button 
              onClick={handleLogout}
              className="auth-logout-button"
              title="Logout"
            >
              ⏻
            </button>
          </div>
        </>
      ) : (
        <GoogleLogin
          onSuccess={handleLoginSuccess}
          onError={() => console.log('Login Failed')}
        />
      )}
    </div>
  );
}