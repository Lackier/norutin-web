import React, {useRef, useState} from "react"
import {
    Form, FormGroup, FormControl, ControlLabel, Button, Alert, Panel,
    Container, Header, Navbar, Content, FlexboxGrid, ButtonToolbar
} from 'rsuite'
import {Link, useHistory} from "react-router-dom"
import $ from 'jquery';
import PhoneInput from 'react-phone-number-input/input'
import 'rsuite/dist/styles/rsuite-dark-rtl.css'
import '../styles/auth_styles.css'

export default function Signup() {
    const emailRef = useRef()
    const nameRef = useRef()
    const passwordRef = useRef()
    const passwordConfirmRef = useRef()
    const {login} = useAuth()
    const [token, setToken] = useState(null)
    const [phoneNumberRef, setPhoneNumber] = useState()
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)
    const history = useHistory()
    let model = {name: "", phoneNumber: "", email: "", password: ""}

    function setModel() {
        model.name = nameRef.current.value
        model.phoneNumber = phoneNumberRef
        model.email = emailRef.current.value
        model.password = passwordRef.current.value
    }

    async function handleSubmit() {
        if (passwordRef.current.value !== passwordConfirmRef.current.value) {
            return setError("Passwords do not match")
        }

        setModel()
        if (model.name === "" || model.phoneNumber === "" || model.email === "" || model.password === "") {
            setLoading(false)
            return
        }

        try {
            const url = "http://127.0.0.1:8080/api/users/signup"
            $.ajax({
                url: url,
                headers: {
                    'Access-Control-Allow-Origin': '*'
                },
                type: "Post",
                data: {
                    "name": model.name,
                    "phoneNumber": model.phoneNumber,
                    "email": model.email,
                    "password": model.password
                },
                success: async function () {
                    await toLogin()
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

    return (
        <div>
            <Container>
                <Header>
                    <Navbar appearance="inverse">
                        <Navbar.Header>
                            <a className="navbar-brand logo">NORUTIN</a>
                        </Navbar.Header>
                    </Navbar>
                </Header>
                <Content>
                    <FlexboxGrid justify="center">
                        <FlexboxGrid.Item colspan={5}>
                            <Panel header={<h3>Sign Up</h3>} bordered>
                                {error && <Alert variant="danger">{error}</Alert>}
                                <Form onSubmit={handleSubmit} fluid>
                                    <FormGroup id="name">
                                        <ControlLabel>Name</ControlLabel>
                                        <FormControl type="text" ref={nameRef} required/>
                                    </FormGroup>

                                    <FormGroup id="phoneNumber">
                                        <ControlLabel>Phone Number</ControlLabel>
                                        <PhoneInput international defaultCountry="RU" required
                                                    placeholder="Enter phone number" value={phoneNumberRef}
                                                    onChange={setPhoneNumber} className="dark_field"/>
                                    </FormGroup>

                                    <FormGroup id="email">
                                        <ControlLabel>Email</ControlLabel>
                                        <FormControl type="email" ref={emailRef} required/>
                                    </FormGroup>

                                    <FormGroup id="password">
                                        <ControlLabel>Password</ControlLabel>
                                        <FormControl type="password" ref={passwordRef} required/>
                                    </FormGroup>

                                    <FormGroup id="password-confirm">
                                        <ControlLabel>Password Confirmation</ControlLabel>
                                        <FormControl type="password" ref={passwordConfirmRef} required/>
                                    </FormGroup>

                                    <FormGroup>
                                        <ButtonToolbar>
                                            <Button disabled={loading} className="button_big button_center"
                                                    type="submit" appearance="primary">
                                                Sign Up
                                            </Button>
                                        </ButtonToolbar>
                                    </FormGroup>
                                    <FormGroup>
                                        <ButtonToolbar>
                                            Already have an account?
                                            <Button className="button_center" appearance="secondary">
                                                <Link to="/login">Log In</Link>
                                            </Button>
                                        </ButtonToolbar>
                                    </FormGroup>
                                </Form>
                            </Panel>
                        </FlexboxGrid.Item>
                    </FlexboxGrid>
                </Content>
            </Container>
        </div>
    )
}