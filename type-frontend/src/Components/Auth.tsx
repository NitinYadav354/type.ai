import { GoogleLogin, googleLogout } from "@react-oauth/google"
import axios from "axios"
import { getOrCreateGuestID } from "../Utility/userGuestID"

export default function Auth() {
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
          <div className="auth-logout-wrapper">
            <button 
              onClick={handleLogout}
              className="auth-logout-button"
            >
              ⏻
            </button>
            <div className="hover-text">Logout</div>
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