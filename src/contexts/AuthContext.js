import React, {useContext, useEffect, useState} from "react"
import $ from "jquery";
import {useHistory} from "react-router-dom"

const AuthContext = React.createContext()

export function useAuth() {
    return useContext(AuthContext)
}

export function AuthProvider({children}) {
    const [currentUser, setCurrentUser] = useState()
    const [loading, setLoading] = useState(true)
    const [token, setToken] = useState(null)
    const history = useHistory()

    function signup(username, email, password, phone) {
        const url = "http://127.0.0.1:8080/api/users/signup"

        return new Promise((resolve) => {
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
                    "username": username,
                    "email": email,
                    "phone": phone,
                    "password": password
                }),
                success: result => {
                    return result
                },
                error: function (error) {
                    console.log('Error ' + error)
                }
            })
        })
    }

    function login(email, password) {
        const url = "http://127.0.0.1:8080/api/users/login"

        return new Promise((resolve) => {
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
                    "username": email,
                    "password": password
                }),
                success: result => {
                    const token = result.token
                    localStorage.setItem('token', token)
                    setToken(window.localStorage.token)
                    setCurrentUser(result.user)
                    history.push("/")
                },
                error: function (error) {
                    console.log('Error ' + error)
                }
            })
        })
    }

    function logout() {
        const url = "http://127.0.0.1:8080/api/users/logout"

        if (localStorage.token == "null") {
            history.push("/login")
            return
        }
                return new Promise((resolve) => {
                    $.ajax({
                        url: url,
                        async: true,
                        contentType: "application/json",
                        headers: {
                            'Access-Control-Allow-Origin': '*',
                            'Authorization': 'Bearer ' + localStorage.token
                        },
                        type: "Post",
                        dataType: "json",
                        success: result => {
                            localStorage.setItem('token', null)
                            setToken(null)
                            setCurrentUser(null)
                            history.push("/login")
                        },
                        error: function (error) {
                            console.log('Error ' + error)
                            localStorage.setItem('token', null)
                            setToken(null)
                            setCurrentUser(null)
                            history.push("/login")
                        }
                    })
                })
    }

    function resetPassword(email) {
        //return auth.sendPasswordResetEmail(email)
    }

    function updateEmail(email) {
        //return currentUser.updateEmail(email)
    }

    function updatePassword(password) {
        //return currentUser.updatePassword(password)
    }

    useEffect(() => {
        //setCurrentUser(user)
        setLoading(false)
    }, [])

    const value = {
        currentUser,
        login,
        signup,
        logout
    }

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    )
}