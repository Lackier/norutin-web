import '../styles/index.css'
import React from "react"
import {Alert, Button, Card, CardGroup, Container, Form} from "react-bootstrap"
import ModalCloseOrSave from '../ui-elements/modal/ModalCloseOrSave.js'
import $ from "jquery"
import TaskItem from "../ui-elements/TaskItem";

export default class Desk extends React.Component {
    constructor(props) {
        super(props)
        this.deskId = props.location.search.split("?deskId=")[1]
        this.state = {
            error: "",
            loading: false,
            modalCreateActive: false,
            statuses: [],
            statusColumns: [],
            tasks: []
        }
        this.showModal = this.showModal.bind(this)
        this.hideModal = this.hideModal.bind(this)
        this.loadPage()
    }

    setError(error) {
        this.setState({error: error})
    }

    setLoading(loading) {
        this.setState({loading: loading})
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

    loadPage() {
        const tasks = []
        const statuses = []
        const statusColumns = []

        this.loadTasks(this.deskId).then(output => {
            output.forEach(task => {
                tasks.push(task)
            })
            this.setTasks(tasks)

        }).then(() => {
            this.loadStatuses(this.deskId).then(output => {
                output.forEach(status => {
                    const statusRow =
                        <Card className="w-150-250">
                            <Card.Body>
                                <span>{status.name}</span>
                                <Button variant="outline-danger" className="ms-6 w-auto"
                                        onClick={() => this.deleteStatus(status.id)}>✕</Button>
                                <Button variant="outline-warning" className="ms-1 w-18"
                                        onClick={() => this.editStatusModal(status.id)}>I</Button>
                                <hr/>
                                {this.state.tasks.filter(task => task.statusId === status.id)
                                    .map((task, index) => (
                                        <div onClick={() => this.openEditModal(task.id)} className="task mt-2 bg-light">
                                            <TaskItem task={task}/>
                                        </div>
                                    ))}
                                <Button variant="outline-primary" className="w-auto mt-2"
                                        onClick={() => this.showModal}>+</Button>
                                <span className="ms-2">new</span>
                            </Card.Body>
                        </Card>
                    statusColumns.push(statusRow)
                    statuses.push(status)
                })
                const newStatusRow =
                    <Card className="w-150-250">
                        <Card.Body>
                            <Button variant="outline-primary" className="w-auto"
                                    onClick={this.createStatusModal}>+</Button>
                            <span className="ms-2">new</span>
                            <hr/>
                        </Card.Body>
                    </Card>
                statusColumns.push(newStatusRow)

                this.setStatusColumns(statusColumns)
                this.setStatuses(statuses)
            })
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
        const url = "http://127.0.0.1:8080/api/tasks/ofDeskWithNames"
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
        this.loadPage()
    }

    createStatusModal() {

    }

    createStatus(statusId) {
        this.loadPage()
    }

    editStatusModal(statusId) {

    }

    editStatus(statusId) {
        this.loadPage()
    }

    deleteStatus(statusId) {
        if (this.state.tasks.filter(task => task.statusId === statusId).length !== 0) {
            alert("Cannot delete status with existing tasks! First delete tasks or move them to another status.")
            return
        }

        this.deleteStatusPromise(statusId).then(() => {
            this.loadPage()
        })
    }

    deleteStatusPromise(statusId) {
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
                type: "Delete",
                data: {
                    "id": statusId
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