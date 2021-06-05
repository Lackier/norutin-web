import '../styles/index.css'
import React from "react"
import {Alert, Button, Card, CardGroup, Container, Form} from "react-bootstrap"
import ModalCloseOrSave from '../ui-elements/modal/ModalCloseOrSave.js'
import $ from "jquery"
import TaskItem from "../ui-elements/TaskItem";

export default class Desk extends React.Component {
    constructor(props) {
        super(props)
        this.error = ""
        this.loading = false
        this.deskId = props.location.search.split("?deskId=")[1]
        this.state = {
            modalCreateActive: false,
            statuses: [],
            statusColumns: [],
            tasks: []
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
        this.setState({statuses: statuses})
    }

    setStatusColumns(statusColumns) {
        this.setState({statusColumns: statusColumns})
    }

    setTasks(tasks) {
        this.setState({tasks: tasks})
    }

    loadPage(deskId) {
        const tasks = []

        this.loadTasks(deskId).then(output => {
            output.forEach(task => {
                tasks.push(task)
            })
            this.setTasks(tasks)
        })

        const statuses = []
        const statusColumns = []

        this.loadStatuses(deskId).then(output => {
            output.forEach(status => {
                const statusRow =
                    <Card className="w-150-250">
                        <Card.Body>
                            <span className="text-center">{status.name}</span>
                            <hr/>
                            {tasks.filter(task => task.statusId === status.id)
                                .map((task, index) => (
                                    <div onClick={() => this.openEditModal(task.id)} className="task mt-2">
                                        <TaskItem task={task}/>
                                    </div>
                                ))}
                            <Button variant="outline-primary" className="w-auto mt-2" onClick={this.showModal}>+</Button>
                            <span className="ms-2">Create new</span>
                        </Card.Body>
                    </Card>
                statusColumns.push(statusRow)
                statuses.push(status)
            })
            this.setStatusColumns(statusColumns)
            this.setStatuses(statuses)
        })
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
        this.loading = true
        const url = "http://127.0.0.1:8080/api/tasks"
        return new Promise((resolve) => {
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
                success: result => {
                    this.error = ""
                    if (result != null) {
                        return resolve(result)
                    }
                },
                error: function (error) {
                    console.log('Error ' + error)
                }
            })
        })
    }

    openEditModal(taskId) {
        debugger
    }

    createTask() {
        debugger
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