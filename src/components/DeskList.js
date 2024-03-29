import React, {useRef, useState} from 'react'
import {useHistory, useLocation} from 'react-router-dom'
import '../styles/index.css'
import {Alert, Button, ButtonGroup, Card, Container, Form, FormCheck} from 'react-bootstrap'
import DeskListItem from '../ui-elements/DeskListItem'
import SimpleModal from '../ui-elements/modal/SimpleModal'
import $ from "jquery";
import {BsPlus, BsX, BsPencil} from "react-icons/bs";

export default function DeskList() {
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)
    const [modalEditActive, setModalEditActive] = useState(false);
    const [modalCreateActive, setModalCreateActive] = useState(false);
    const history = useHistory()
    const location = useLocation()
    let desks = location.state

    let deskForCreate = {
        deskName: useRef(),
        userId: useRef(),
        fillDefaultSettings: useRef(),

        clearDeskForCreate() {
            this.deskName.current.value = ''
            this.userId.current.value = ''
            this.fillDefaultSettings.current.checked = false
        }
    }

    let deskForEdit = {
        id: useRef(),
        deskName: useRef(),
        createDate: useRef(),
        userId: useRef(),

        clearDeskForEdit() {
            this.id.current.value = ''
            this.deskName.current.value = ''
            this.createDate.current.value = ''
            this.userId.current.value = ''
        },

        fillFromResult(desk) {
            this.id.current.value = desk.id
            this.deskName.current.value = desk.name
            this.createDate.current.value = desk.createDate
            this.userId.current.value = desk.userId
        }
    }

    async function openDesk(id) {
        setError("")
        history.push("/tasks?deskId=" + id)
    }

    function createDeskModal() {
        deskForEdit.clearDeskForEdit()
        deskForCreate.clearDeskForCreate()
        setModalCreateActive(true)
    }

    async function editDeskModal(event, id) {
        try {
            const url = "http://127.0.0.1:8080/api/desks/get"
            $.ajax({
                url: url,
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Authorization': 'Bearer ' + localStorage.token
                },
                type: "Get",
                data: {
                    "deskId": id
                },
                success: async function (result) {
                    setError("")
                    setLoading(false)
                    setModalEditActive(true)
                    deskForEdit.fillFromResult(result.data)
                },
                error: function (error) {
                    console.log('Error ' + error)
                }
            })

            setError("")
            setLoading(true)
        } catch {
            setError("Failed to get a desk")
        }
    }

    async function createDesk() {
        try {
            const url = "http://127.0.0.1:8080/api/desks/create"
            $.ajax({
                url: url,
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Authorization': 'Bearer ' + localStorage.token
                },
                type: "Post",
                data: {
                    "name": deskForCreate.deskName.current.value,
                    "fillDefaultSettings": deskForCreate.fillDefaultSettings.current.checked
                },
                success: async function (result) {
                    setError("")
                    setLoading(false)
                    setModalCreateActive(false)

                    await reload()
                },
                error: function (error) {
                    console.log('Error ' + error)
                }
            })

            setError("")
            setLoading(true)
        } catch {
            setError("Failed to create a desk")
        }
    }

    async function editDesk() {
        try {
            const url = "http://127.0.0.1:8080/api/desks/edit"
            $.ajax({
                url: url,
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Authorization': 'Bearer ' + localStorage.token
                },
                type: "Post",
                data: {
                    "id": deskForEdit.id.current.value,
                    "name": deskForEdit.deskName.current.value,
                    "userId": deskForEdit.userId.current.value
                },
                success: async function (result) {
                    setError("")
                    setLoading(false)
                    setModalEditActive(false)

                    await reload()
                },
                error: function (error) {
                    console.log('Error ' + error)
                }
            })

            setError("")
            setLoading(true)
        } catch {
            setError("Failed to create a desk")
        }
    }

    async function reload() {
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

    async function removeDesk(id) {
        try {
            const url = "http://127.0.0.1:8080/api/desks"
            $.ajax({
                url: url,
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Authorization': 'Bearer ' + localStorage.token
                },
                type: "Delete",
                data: {
                    "deskId": id
                },
                success: async function (result) {
                    setError("")
                    setLoading(false)

                    await reload()
                },
                error: function (error) {
                    console.log('Error ' + error)
                }
            })

            setError("")
            setLoading(true)
        } catch {
            setError("Failed to delete a desk")
        }
    }

    return (
        <div className="auth-inner">
        <Container fluid>
            <h2 className="text-center mb-4">Доски</h2>
            {error && <Alert variant="danger">{error}</Alert>}
            {desks.map((desk, index) => (
                <Card>
                    <Card.Body>
                        <div onClick={() => openDesk(desk.id)} className="desk">
                            <DeskListItem
                                key={index}
                                index={index}
                                desk={desk}
                                removeDesk={removeDesk}
                                editDesk={editDeskModal}
                            />
                        </div>
                        <Button variant="outline-danger" className="mt-2 w-auto"
                                onClick={() => removeDesk(desk.id)}>
                            <BsX/>
                        </Button>
                        <Button variant="outline-warning" className="mt-2 ms-2 w-auto"
                                onClick={(event) => editDeskModal(event, desk.id)}>
                            <BsPencil/>
                        </Button>
                    </Card.Body>
                </Card>
            ))}

            <Card>
                <Card.Body>
                    <h3>
                        <Button variant="outline-primary" className="w-auto" onClick={() => createDeskModal()}>
                            <BsPlus/>
                        </Button>
                    </h3>
                </Card.Body>
            </Card>

            <SimpleModal active={modalEditActive} setActive={setModalEditActive}>
                <Form>
                    <div ref={deskForEdit.id} hidden="true"/>
                    <div ref={deskForEdit.userId} hidden="true"/>
                    <Form.Group id="name" className="form-group">
                        <Form.Label>Name</Form.Label>
                        <Form.Control type="text" required ref={deskForEdit.deskName}/>
                    </Form.Group>

                    <Form.Group id="createDate" className="form-group">
                        <Form.Label>Create date</Form.Label>
                        <Form.Control type="text" readOnly plaintext ref={deskForEdit.createDate}/>
                    </Form.Group>

                    <ButtonGroup className="w-40 text-center mt-3">
                        <Button disabled={loading} className="btn btn-primary btn-block" onClick={editDesk}>
                            Save
                        </Button>
                    </ButtonGroup>
                </Form>
            </SimpleModal>

            <SimpleModal active={modalCreateActive} setActive={setModalCreateActive}>
                <Form>
                    <div ref={deskForCreate.id} hidden="true"/>
                    <div ref={deskForCreate.userId} hidden="true"/>
                    <Form.Group id="name" className="form-group">
                        <Form.Label>Name</Form.Label>
                        <Form.Control type="text" required ref={deskForCreate.deskName}/>
                    </Form.Group>

                    <Form.Group id="defaultSettings" className="form-group">
                        <Form.Label>Fill default settings</Form.Label>
                        <FormCheck required ref={deskForCreate.fillDefaultSettings}/>
                    </Form.Group>

                    <ButtonGroup className="w-40 text-center mt-3">
                        <Button disabled={loading} className="btn btn-primary btn-block" onClick={createDesk}>
                            Save
                        </Button>
                    </ButtonGroup>
                </Form>
            </SimpleModal>
        </Container>
        </div>
    )
}