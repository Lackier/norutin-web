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
            modalCreateTaskActive: false,
            modalCreateStatusActive: false,
            modalStatusName: "",
            statuses: [],
            statusColumns: [],
            tasks: []
        }
        /*this.showModalCreateTask = this.showModalCreateTask.bind(this)
        this.hideModalCreateTask = this.hideModalCreateTask.bind(this)
        this.showModalCreateStatus = this.showModalCreateStatus.bind(this)
        this.hideModalCreateStatus = this.hideModalCreateStatus.bind(this)*/
        this.createStatus = this.createStatus.bind(this)
        this.loadPage()
    }

    setError(error) {
        this.setState({error: error})
    }

    setLoading(loading) {
        this.setState({loading: loading})
    }

    showModalCreateTask = () => {
        this.setState({modalCreateTaskActive: true})
    }

    hideModalCreateTask = () => {
        this.setState({modalCreateTaskActive: false})
    }

    showModalCreateStatus = () => {
        this.setState({modalCreateStatusActive: true})
    }

    hideModalCreateStatus = () => {
        this.setState({modalCreateStatusActive: false})
    }

    setStatuses(statuses) {
        this.setState({statuses: statuses})
    }

    setModalStatusName(modalStatusName) {
        this.setState({modalStatusName: modalStatusName})
    }

    clearStatusModalValues() {
        this.state.modalStatusName.current.value = ""
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
                                        onClick={() => this.showModalCreateTask}>+</Button>
                                <span className="ms-2">new</span>
                            </Card.Body>
                        </Card>
                    statusColumns.push(statusRow)
                    statuses.push(status)
                })

                if (statuses.length < 7) {
                    statusColumns.push(this.createNewStatusRow())
                }

                this.setStatusColumns(statusColumns)
                this.setStatuses(statuses)
            })
        })
    }

    createNewStatusRow() {
        return <Card className="w-150-250">
            <Card.Body>
                <Button variant="outline-primary" className="w-auto"
                        onClick={this.showModalCreateStatus}>+</Button>
                <span className="ms-2">new</span>
                <hr/>
            </Card.Body>
        </Card>
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

    createStatus() {
        this.createStatusPromise().then(() => {
            this.hideModalCreateStatus()
            this.clearStatusModalValues()
            this.loadPage()
        })
    }

    createStatusPromise() {
        this.error = ""
        this.loading = true
        const url = "http://127.0.0.1:8080/api/deskTaskStatus/create"

        return new Promise((resolve) => {
            $.ajax({
                url: url,
                async: true,
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'firebase_token': localStorage.token
                },
                type: "Post",
                data: {
                    "deskId": this.deskId,
                    "name": this.state.modalStatusName.current.value
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

                        <ModalCloseOrSave show={this.state.modalCreateTaskActive} handleClose={this.hideModalCreateTask}
                                          handleSave={this.createTask}>
                            <Form className="justify-content-center">

                            </Form>
                        </ModalCloseOrSave>

                        <ModalCloseOrSave show={this.state.modalCreateStatusActive}
                                          handleClose={this.hideModalCreateStatus}
                                          handleSave={this.createStatus}>
                            <Form className="justify-content-center">
                                <Form.Group id="name" className="form-group">
                                    <Form.Label>Name</Form.Label>
                                    <Form.Control type="text" required ref={this.state.modalStatusName}
                                                  onChange={name => this.setModalStatusName(name)}/>
                                </Form.Group>
                            </Form>
                        </ModalCloseOrSave>
                    </CardGroup>
                </Container>
            </div>
        )
    }
}