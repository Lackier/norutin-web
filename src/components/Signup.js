import React, {useRef, useState} from "react"
import {Form, Button, Alert, ButtonGroup} from "react-bootstrap"
import PhoneInput from 'react-phone-number-input/input'
import {Link, useHistory} from "react-router-dom"
import $ from 'jquery';
import "../styles/index.css";
import {useAuth} from "../contexts/AuthContext";

export default function Signup() {
    const emailRef = useRef()
    const usernameRef = useRef()
    const passwordRef = useRef()
    const passwordConfirmRef = useRef()
    const {login} = useAuth()
    const [token, setToken] = useState(null)
    const [phoneRef, setPhone] = useState()
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)
    const history = useHistory()
    let model = {name: "", phone: "", email: "", password: ""}

    function setModel() {
        model.username = usernameRef.current.value
        model.phone = phoneRef
        model.email = emailRef.current.value
        model.password = passwordRef.current.value
    }

    async function handleSubmit() {
        if (passwordRef.current.value !== passwordConfirmRef.current.value) {
            return setError("Passwords do not match")
        }

        setModel()
        if (model.username === "" || model.phone === "" || model.email === "" || model.password === "") {
            setLoading(false)
            return
        }

        try {
            const url = "http://127.0.0.1:8080/api/users/signup"
            $.ajax({
                url: url,
                async: true,
                contentType: "application/json",
                headers: {
                    'Access-Control-Allow-Origin': '*'
                },
                type: "Post",
                dataType: "json",
                data: JSON.stringify({
                    "username": model.username,
                    "phone": model.phone,
                    "email": model.email,
                    "password": model.password
                }),
                success: result => {
                    return result
                },
                error: function (error) {
                    console.log('Error ' + error)
                }
            })

            setError("")
            setLoading(true)
            history.push("/")
        } catch {
            setError("Failed to create an account")
        }

        setLoading(false)
    }

    async function toLogin() {
        await login(model.email, model.password)
            .then(async res => {
                const token = await Object.entries(res.user)[5][1].b
                await localStorage.setItem('token', token)
                setToken(window.localStorage.token)
                history.push("/")
            })
    }

    const handlePhoneChange = (value) => {
        if (value.length <= 12) {
            setPhone(value);
        } else {
            setPhone(value.slice(0, 12))
        }
      };

    return (
        <div className="auth-inner">
            <h2 className="text-center mb-4">Sign Up</h2>
            {error && <Alert variant="danger">{error}</Alert>}
            <Form onSubmit={handleSubmit}>
                <Form.Group id="name" className="form-group">
                    <Form.Label>Name</Form.Label>
                    <Form.Control type="text" ref={usernameRef} required/>
                </Form.Group>

                <Form.Group id="phone" className="form-group">
                    <Form.Label>Phone Number</Form.Label>
                    <PhoneInput international
                                placeholder="Enter phone number"
                                className="input-group-text form-group"
                                value={phoneRef}
                                onChange={handlePhoneChange}
                                required/>
                </Form.Group>

                <Form.Group id="email" className="form-group">
                    <Form.Label>Email</Form.Label>
                    <Form.Control type="email" ref={emailRef} required/>
                </Form.Group>

                <Form.Group id="password" className="form-group">
                    <Form.Label>Password</Form.Label>
                    <Form.Control type="password" ref={passwordRef} required/>
                </Form.Group>

                <Form.Group id="password-confirm" className="form-group">
                    <Form.Label>Password Confirmation</Form.Label>
                    <Form.Control type="password" ref={passwordConfirmRef} required/>
                </Form.Group>

                <ButtonGroup className="w-100 text-center mt-3">
                    <Button disabled={loading} className="w-100 btn btn-primary btn-block" type="submit">
                        Sign Up
                    </Button>
                </ButtonGroup>
            </Form>
            <div className="w-100 text-center mt-2">
                Already have an account?
                <Link className="btn btn-secondary btn-block right-corner w-25 ms-4" to="/login">Sign In</Link>
            </div>
        </div>
    )
}