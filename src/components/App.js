import React from "react"
import Signup from "./Signup"
import {AuthProvider} from "../contexts/AuthContext"
import {BrowserRouter as Router, Switch, Route, Link} from "react-router-dom"
import Dashboard from "./Dashboard"
import Login from "./Login"
import DeskList from "./DeskList"
import PrivateRoute from "./PrivateRoute"
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/app.css'


function App() {
    return (
        <Router>
            <div className="App">
                <nav className="navbar navbar-expand-lg navbar-light fixed-top">
                    <div className="container">
                        <Link className="navbar-brand" to={"/login"}>NORUTIN</Link>
                        <div className="collapse navbar-collapse" id="navbarTogglerDemo02">
                            <ul className="navbar-nav ml-auto">
                                <li className="nav-item">
                                    <Link className="nav-link" to={"/login"}>Login</Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link" to={"/signup"}>Sign up</Link>
                                </li>
                            </ul>
                        </div>
                    </div>
                </nav>

                <div className="auth-wrapper">
                    <div className="auth-inner">

                        <AuthProvider>
                            <Switch>
                                <PrivateRoute exact path="/" component={Dashboard}/>
                                <Route path="/signup" component={Signup}/>
                                <Route path="/login" component={Login}/>
                                <PrivateRoute exact path="/desks" component={DeskList}/>
                            </Switch>
                        </AuthProvider>
                    </div>
                </div>
            </div>
        </Router>
    )
}

export default App;