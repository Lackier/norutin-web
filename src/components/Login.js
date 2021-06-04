import React, {useRef, useState} from "react"
import {Alert, Button, ButtonGroup, Form} from "react-bootstrap"
import {useAuth} from "../contexts/AuthContext"
import {Link, useHistory} from "react-router-dom"
import "../styles/index.css";

export default function Login() {
    const emailRef = useRef()
    const passwordRef = useRef()
    const {login} = useAuth()
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)
    const [token, setToken] = useState(null)
    const history = useHistory()

    async function handleSubmit() {
        if (emailRef.current.value === "" || passwordRef.current.value === "") {
            setLoading(false)
            return
        }

        try {
            setError("")
            setLoading(true)
            await login(emailRef.current.value, passwordRef.current.value)
                .then(async res => {
                    const token = await Object.entries(res.user)[5][1].b
                    await localStorage.setItem('token', token)
                    setToken(window.localStorage.token)
                    history.push("/")
                })
        } catch {
            setError("Failed to log in")
        }

        setLoading(false)
    }

    return (
        <Form className="mt-5">
            <h2 className="text-center mb-4">Sign In</h2>
            {error && <Alert variant="danger">{error}</Alert>}
            <Form onSubmit={handleSubmit}>
                <Form.Group id="email" className="form-group">
                    <Form.Label>Email</Form.Label>
                    <Form.Control type="email" ref={emailRef} required/>
                </Form.Group>

                <Form.Group id="password" className="form-group">
                    <Form.Label>Password</Form.Label>
                    <Form.Control type="password" ref={passwordRef} required/>
                </Form.Group>

                <ButtonGroup className="w-100 text-center mt-3">
                    <Button disabled={loading} className="btn btn-primary btn-block" type="submit"
                            onClick={handleSubmit}>
                        Log In
                    </Button>
                </ButtonGroup>
            </Form>

            <div className="w-100 text-center mt-2">
                Need an account?
                <Link to="/signup" className="btn btn-secondary btn-block right-corner w-25 ms-4">
                    Sign Up
                </Link>
            </div>
        </Form>
    )
}