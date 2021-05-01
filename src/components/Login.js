import React, {useRef, useState} from "react"
import {useAuth} from "../contexts/AuthContext"
import {Link, useHistory} from "react-router-dom"
import {
    Form, FormGroup, FormControl, ControlLabel, Button, Alert, HelpBlock, Panel,
    Container, Header, Navbar, Content, FlexboxGrid, ButtonToolbar
    } from 'rsuite'
import 'rsuite/dist/styles/rsuite-dark-rtl.css'
import '../styles/auth_styles.css'

export default function Login() {
    const emailRef = useRef()
    const passwordRef = useRef()
    const login = useAuth()
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)
    const [token, setToken] = useState(null)
    const history = useHistory()

    async function handleSubmit(e) {
        e.preventDefault()

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
        <div className="show-fake-browser login-page">
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
                            <Panel header={<h3>Login</h3>} bordered>
                                {error && <Alert variant="danger">{error}</Alert>}
                                <Form onSubmit={handleSubmit} fluid>
                                    <FormGroup id="email">
                                        <ControlLabel>Email</ControlLabel>
                                        <FormControl type="email" ref={emailRef} required/>
                                        <HelpBlock>This field is required</HelpBlock>
                                    </FormGroup>
                                    <FormGroup id="password">
                                        <ControlLabel>Password</ControlLabel>
                                        <FormControl type="password" ref={passwordRef} required/>
                                        <HelpBlock>This field is required</HelpBlock>
                                    </FormGroup>
                                    <FormGroup>
                                        <ButtonToolbar>
                                            <Button disabled={loading} appearance="primary" type="submit"
                                                    className="button_big button_center">
                                                Log In
                                            </Button>
                                        </ButtonToolbar>
                                    </FormGroup>
                                    <FormGroup>
                                        <ButtonToolbar>
                                            <Button appearance="link" className="button_medium button_left">
                                                <Link to="/forgot-password">Forgot Password?</Link>
                                            </Button>
                                            <Button appearance="secondary" className="button_medium button_right">
                                                <Link to="/signup">Sign Up</Link>
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