import React, { useRef, useState } from "react"
import { Form, Button, Card, Alert } from "react-bootstrap"
import PhoneInput from 'react-phone-number-input/input'
import { Link, useHistory } from "react-router-dom"
import $ from 'jquery';

export default function Signup() {
    const [emailRef, nameRef, passwordRef, passwordConfirmRef] = useRef()
    const [phoneNumberRef, setPhoneNumber] = useState()
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)
    const history = useHistory()
    let name, phoneNumber, email, password

    async function handleSubmit(e) {
        e.preventDefault()

        if (passwordRef.current.value !== passwordConfirmRef.current.value) {
            return setError("Passwords do not match")
        }

        name = nameRef.current.value
        phoneNumber = phoneNumberRef
        email = emailRef.current.value
        password = passwordRef.current.value

        try {
            const url = "http://127.0.0.1:8080/api/users/signup"
            $.ajax({
                url: url,
                headers: {
                    'Access-Control-Allow-Origin': '*'
                },
                type: "Post",
                data: {
                    "name": name,
                    "phoneNumber": phoneNumber,
                    "email": email,
                    "password": password
                },
                success: function (result) {

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

    return (
        <>
            <Card>
                <Card.Body>
                    <h2 className="text-center mb-4">Sign Up</h2>
                    {error && <Alert variant="danger">{error}</Alert>}
                    <Form onSubmit={handleSubmit}>
                        <Form.Group id="name">
                            <Form.Label>Name</Form.Label>
                            <Form.Control type="text" ref={nameRef} required />
                        </Form.Group>

                        <Form.Group id="phoneNumber">
                            <Form.Label>Phone Number</Form.Label>
                            <PhoneInput international
                                        defaultCountry="RU"
                                        placeholder="Enter phone number"
                                        value={phoneNumberRef}
                                        required
                                        onChange={setPhoneNumber}/>
                        </Form.Group>

                        <Form.Group id="email">
                            <Form.Label>Email</Form.Label>
                            <Form.Control type="email" ref={emailRef} required />
                        </Form.Group>

                        <Form.Group id="password">
                            <Form.Label>Password</Form.Label>
                            <Form.Control type="password" ref={passwordRef} required />
                        </Form.Group>

                        <Form.Group id="password-confirm">
                            <Form.Label>Password Confirmation</Form.Label>
                            <Form.Control type="password" ref={passwordConfirmRef} required />
                        </Form.Group>

                        <Button disabled={loading} className="w-100" type="submit">
                            Sign Up
            </Button>
                    </Form>
                </Card.Body>
            </Card>
            <div className="w-100 text-center mt-2">
                Already have an account? <Link to="/login">Log In</Link>
            </div>
        </>
    )
}