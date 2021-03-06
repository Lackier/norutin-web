import React, {useState} from "react"
import {Alert, Button} from "react-bootstrap"
import {useAuth} from "../contexts/AuthContext"
import {Link, useHistory} from "react-router-dom"
import $ from "jquery";

export default function Dashboard() {
    const [error, setError] = useState("")
    const [setLoading] = useState(false)
    const {currentUser, logout} = useAuth()
    const history = useHistory()

    async function handleLogout() {
        setError("")

        try {
            await logout()
            await localStorage.setItem('token', null)
            history.push("/login")
        } catch {
            setError("Failed to log out")
        }
    }

    async function getDesks() {
        setError("")

        try {
            const url = "http://127.0.0.1:8080/api/desks"
            $.ajax({
                url: url,
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'firebase_token': localStorage.token
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
    }

    return (
        <>
            <h2 className="text-center mb-4">Profile</h2>
            {error && <Alert variant="danger">{error}</Alert>}
            <strong>Email:</strong> {currentUser.email}
            <Link to="/update-profile" className="btn btn-primary w-100 mt-3">
                Update Profile
            </Link>
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
        </>
    )
}