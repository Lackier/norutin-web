import React, {useState} from "react"
import {Alert, Button} from "react-bootstrap"
import {useAuth} from "../contexts/AuthContext"
import {useHistory} from "react-router-dom"
import $ from "jquery";

export default function Dashboard() {
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)
    const {currentUser, logout, setToken, setCurrentUser} = useAuth()
    const history = useHistory()

    async function handleLogout() {
        setError("")

        try {
            await logout()
        } catch {
            setError("Failed to log out")
        }
    }

    async function getDesks() {
        setError("")

        try {
            setLoading(true)
            const url = "http://127.0.0.1:8080/api/desks"
            $.ajax({
                url: url,
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Authorization': 'Bearer ' + localStorage.token
                },
                type: "Get",
                success: function (result) {
                    setError("")
                    history.push("/desks", result)
                },
                error: function (error) {
                    console.log('Error ' + error)
                }
            })
        } catch {
            setError("Failed to get Desks")
        }
        setLoading(false)
    }

    return (
        <div className="auth-inner">
            <h2 className="text-center mb-4">Profile</h2>
            {error && <Alert variant="danger">{error}</Alert>}
            <strong>Email:</strong> {currentUser.email}
            <div className="w-100 text-center mt-2">
                <Button variant="link" onClick={handleLogout}>
                    Log Out
                </Button>
            </div>
            <div className="w-100 text-center mt-2">
                <Button variant="link" onClick={getDesks}>
                    Desks
                </Button>
            </div>
        </div>
    )
}