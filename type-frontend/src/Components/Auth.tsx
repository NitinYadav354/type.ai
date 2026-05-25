import { GoogleLogin } from "@react-oauth/google"
import axios from "axios"
import { getOrCreateGuestID } from "../Utility/userGuestID"

export default function Auth() {
    const handleLoginSuccess = async (credentialResponse: any) => {
        try {
            const { credential } = credentialResponse

            const guestID = getOrCreateGuestID()
            const response = await axios.post('http://localhost:3000/api/auth/google', {
                token: credential,
                guestID: guestID
            })
            console.log('Login successful:', response.data)

            localStorage.setItem('authToken', response.data.token)
            localStorage.setItem('userId', response.data.userId)
            window.location.reload()
        } catch (error) {
            console.error('Login failed:', error)
        }   
    }


    return (
    <div style={{ padding: '20px', display: 'flex', justifyContent: 'flex-end' }}>
    
      {localStorage.getItem('authToken') ? (
        <span>Welcome back!</span>
      ) : (
        <GoogleLogin
          onSuccess={handleLoginSuccess}
          onError={() => {
            console.log('Login Failed');
          }}
        useOneTap
        />
      )}
    </div>
  );
}