import { jwtDecode } from "jwt-decode";
import { Navigate } from "react-router";

export default function ProtectedRoute({children}: { children: React.ReactNode }) {
    const token = localStorage.getItem("token")

    if (!token) return <Navigate to="/" replace />

    try {
        const decodedToken: any = jwtDecode(token)
        if (decodedToken.exp * 1000 < Date.now()) {
            console.log("TOKEN EXPIRED")
            localStorage.removeItem("token")
            return <Navigate to="/" replace />
        }
        
    } catch {
        return <Navigate to="/" replace />
    }

    return children
}