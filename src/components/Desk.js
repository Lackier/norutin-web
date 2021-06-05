import '../styles/index.css'
import React from "react";
import {Alert, Button, Card, CardGroup, Container, Form} from "react-bootstrap";
import ModalCloseOrSave from '../ui-elements/modal/ModalCloseOrSave.js';
import $ from "jquery";

export default class Desk extends React.Component {
    constructor(props) {
        super(props)
        this.error = ""
        this.loading = false
        this.deskId = props.location.search.split("?deskId=")[1]
        this.state = {
            modalCreateActive: false,
            statusColumns: [],
            statuses: []
        }
        this.showModal = this.showModal.bind(this)
        this.hideModal = this.hideModal.bind(this)
        this.loadPage(this.deskId)
    }

    showModal = () => {
        this.setState({modalCreateActive: true})
    }

    hideModal = () => {
        this.setState({modalCreateActive: false})
    }

    setStatuses(statuses) {
        this.setState( {statuses: statuses})
    }

    setStatusColumns(statusColumns) {
        this.setState( {statusColumns: statusColumns})
    }

    loadPage(deskId) {
        const statuses = []
        const statusColumns = []

        this.loadStatuses(deskId).then(output => {
            output.forEach(status => {
                const statusRow =
                    <Card className="w-150-250">
                        <Card.Body>
                            <span className="text-center">{status.name}</span>
                            <hr/>
                            <Button variant="outline-primary" className="w-auto" onClick={this.showModal}>+</Button>
                            <span className="ms-2">Create new</span>
                        </Card.Body>
                    </Card>
                statusColumns.push(statusRow)
                statuses.push(status)
            })
            this.setStatusColumns(statusColumns)
            this.setStatuses(statuses)
        })

        /*this.loadTasks(deskId)*/
    }

    loadStatuses(deskId) {
        this.error = ""
        this.loading = true
        const url = "http://127.0.0.1:8080/api/deskTaskStatus"

        return new Promise((resolve) => {
            $.ajax({
                url: url,
                async: true,
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'firebase_token': localStorage.token
                },
                type: "Get",
                data: {
                    "deskId": deskId
                },
                success: result => {
                    this.error = ""
                    return resolve(result)
                },
                error: function (error) {
                    console.log('Error ' + error)
                }
            })
        })
    }

    loadTasks(deskId) {
        this.error = ""

        try {
            this.loading = true
            const url = "http://127.0.0.1:8080/api/tasks"
            $.ajax({
                url: url,
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'firebase_token': localStorage.token
                },
                type: "Get",
                data: {
                    "deskId": deskId
                },
                success: async function (result) {
                    this.error = ""
                    this.tasks = result
                },
                error: function (error) {
                    console.log('Error ' + error)
                }
            })
        } catch {
            this.error = "Failed to get Tasks"
        }
        this.loading = false
    }

    createTask() {
        //TODO
    }

    render() {
        return (
            <div className="tasks">
                <Container fluid>
                    <h2 className="text-center mb-4">Tasks</h2>
                    {this.error && <Alert variant="danger">{this.error}</Alert>}
                    <CardGroup>
                        {this.state.statusColumns}

                        <ModalCloseOrSave show={this.state.modalCreateActive} handleClose={this.hideModal}
                                          handleSave={this.createTask}>
                            <Form className="justify-content-center">

                            </Form>
                        </ModalCloseOrSave>
                    </CardGroup>
                </Container>
            </div>
        )
    }
}