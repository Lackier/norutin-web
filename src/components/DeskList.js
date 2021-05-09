import React, {useRef, useState} from 'react'
import {useHistory, useLocation} from 'react-router-dom'
import '../styles/index.css'
import {Alert, Button, ButtonGroup, Card, Container, Form} from 'react-bootstrap'
import DeskListItem from '../ui-elements/DeskListItem'
import SimpleModal from '../ui-elements/modal/SimpleModal'
import $ from "jquery";

export default function DeskList() {
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)
    const [modalActive, setModalActive] = useState(false);
    const history = useHistory()
    const location = useLocation()
    let desks = location.state

    let deskForEdit = {
        id: useRef(),
        deskName: useRef(),
        createDate: useRef(),
        userId: useRef(),

        clearDeskForEdit() {
            deskForEdit.id = ''
            deskForEdit.deskName.current.value = ''
            deskForEdit.createDate.current.value = ''
            deskForEdit.userId = ''
        },

        fillFromResult(desk) {
            deskForEdit.id = desk.id
            deskForEdit.deskName.current.value = desk.name
            deskForEdit.createDate.current.value = desk.createDate
            deskForEdit.userId = desk.userId
        }
    }

    async function openDesk(id) {
        //todo
    }

    function createDesk() {
        deskForEdit.clearDeskForEdit()
        setModalActive(true)
    }

    async function editDesk(event, id) {
        try {
            const url = "http://127.0.0.1:8080/api/desks/get"
            $.ajax({
                url: url,
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'firebase_token': localStorage.token
                },
                type: "Get",
                data: {
                    "deskId": id
                },
                success: function (result) {
                    setError("")
                    setLoading(false)
                    setModalActive(true)
                    deskForEdit.fillFromResult(result.desk)
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

    async function saveDesk() {
        debugger
        setModalActive(false)
    }

    async function removeDesk(id) {
        //todo
    }

    return (
        <Container fluid className="mt-5">
            <h2 className="text-center mb-4">Desks</h2>
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
                                editDesk={editDesk}
                            />
                        </div>
                        <Button variant="outline-danger" className="mt-2 w-12"
                                onClick={() => removeDesk(desk.id)}>✕</Button>
                        <Button variant="outline-warning" className="mt-2 ms-2 w-12"
                                onClick={(event) => editDesk(event, desk.id)}>I</Button>
                    </Card.Body>
                </Card>
            ))}

            <Card>
                <Card.Body>
                    <Button variant="outline-primary" className="w-12" onClick={() => createDesk()}>+</Button>
                    <span className="ms-2">Create new</span>
                </Card.Body>
            </Card>

            <SimpleModal active={modalActive} setActive={setModalActive}>
                <Form>
                    <Form.Group id="Name" className="form-group">
                        <Form.Label>Name</Form.Label>
                        <Form.Control type="text" required ref={deskForEdit.deskName}
                                      defaultValue={deskForEdit.deskName}/>
                    </Form.Group>

                    <Form.Group id="createDate" className="form-group">
                        <Form.Label>Create date</Form.Label>
                        <Form.Control type="text" readOnly plaintext ref={deskForEdit.createDate}
                                      defaultValue={deskForEdit.createDate}/>
                    </Form.Group>

                    <ButtonGroup className="w-40 text-center mt-3">
                        <Button disabled={loading} className="btn btn-primary btn-block" onClick={saveDesk}>
                            Save
                        </Button>
                    </ButtonGroup>
                </Form>
            </SimpleModal>
        </Container>
    )
}