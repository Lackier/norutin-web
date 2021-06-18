import '../styles/index.css'
import React from "react"
import {Alert, Button, Card, CardGroup, Container, Form} from "react-bootstrap"
import ModalCloseOrSave from '../ui-elements/modal/ModalCloseOrSave.js'
import $ from "jquery"
import TaskItem from "../ui-elements/TaskItem";
import CreateTaskModal from "../ui-elements/CreateTaskModal";

export default class Desk extends React.Component {
    constructor(props) {
        super(props)
        this.deskId = props.location.search.split("?deskId=")[1]
        this.state = {
            statuses: [],
            priorityTypes: [],
            taskTypes: [],
            statusColumns: [],
            tasks: [],

            modalCreateStatusActive: false,
            modalCreateStatusName: "",

            modalEditStatusActive: false,
            modalEditStatusName: {current: {value: ""}},
            editStatusId: null,

            modalCreateTaskActive: false,
            modalCreateTaskStatusId: null,
            modalCreateTaskName: {current: {value: ""}},
            modalCreateTaskStatus: {current: {value: ""}},
            modalCreateTaskPriorityType: {value: null},
            modalCreateTaskType: {value: null},
            modalCreateTaskDescription: {current: {value: ""}},
            modalCreateTaskDeadlineDate: Date()
        }

        this.createTask = this.createTask.bind(this)
        this.createStatus = this.createStatus.bind(this)
        this.editStatus = this.editStatus.bind(this)
        this.loadPage()
    }

    setStatuses = (statuses) => this.setState({statuses: statuses})
    setPriorityTypes = (priorityTypes) => this.setState({priorityTypes: priorityTypes})
    setTaskTypes = (taskTypes) => this.setState({taskTypes: taskTypes})
    setStatusColumns = (statusColumns) => this.setState({statusColumns: statusColumns})
    setTasks = (tasks) => this.setState({tasks: tasks})

    showModalCreateTask = (status) => {
        this.setState({modalCreateTaskStatusId: status.id})
        this.state.modalCreateTaskStatus.current.value = status.name
        this.setState({modalCreateTaskActive: true})
        this.state.modalCreateTaskPriorityType.value = null
        this.state.modalCreateTaskType.value = null
        this.setModalCreateTaskDeadlineDate(Date())
    }
    clearCreateTaskModal = () => {
        this.setState({modalCreateTaskStatusId: null})
        this.state.modalCreateTaskName.current.value = ""
        this.state.modalCreateTaskStatus.current.value = ""
        this.state.modalCreateTaskDescription.current.value = ""
        this.state.modalCreateTaskPriorityType.value = null
        this.state.modalCreateTaskType.value = null
    }
    hideModalCreateTask = () => {
        this.setState({modalCreateTaskActive: false})
        this.clearCreateTaskModal()
    }
    setModalCreateTaskName = (text) => this.setState({modalCreateTaskName: text})
    setModalCreateTaskDescription = (text) => this.setState({modalCreateTaskDescription: text})
    setModalCreateTaskDeadlineDate = (date) => this.setState({modalCreateTaskDeadlineDate: date})

    showModalCreateStatus = () => this.setState({modalCreateStatusActive: true})
    setModalCreateStatusName = (text) => this.setState({modalCreateStatusName: text})
    hideModalCreateStatus = () => this.setState({modalCreateStatusActive: false})

    showModalEditStatus = () => this.setState({modalEditStatusActive: true})
    setEditStatusId = (text) => this.setState({editStatusId: text})
    setModalEditStatusName = (text) => this.setState({modalEditStatusName: text})
    hideModalEditStatus = () => this.setState({modalEditStatusActive: false})

    loadPage() {
        this.loadTasks(this.deskId).then(output => {
            const tasks = []
            output.forEach(task => {
                tasks.push(task)
            })
            this.setTasks(tasks)
        }).then(() => {
            this.loadStatuses(this.deskId).then(output => {
                const statuses = []
                const statusColumns = []

                output.forEach(status => {
                    statusColumns.push(this.createStatusRow(status))
                    statuses.push(status)
                })

                if (statuses.length < 7) {
                    statusColumns.push(this.createNewStatusRow())
                }

                this.setStatusColumns(statusColumns)
                this.setStatuses(statuses)
            })
        }).then(() => {
            this.loadPriorityTypes(this.deskId).then(output => {
                const priorityTypes = []
                output.forEach(priorityType => {
                    priorityTypes.push(priorityType)
                })
                this.setPriorityTypes(priorityTypes)
            })
        }).then(() => {
            this.loadTaskTypes(this.deskId).then(output => {
                const taskTypes = []
                output.forEach(taskType => {
                    taskTypes.push(taskType)
                })
                this.setTaskTypes(taskTypes)
            })
        })
    }

    createStatusRow(status) {
        return <Card className="w-150-250">
            <Card.Body>
                <span>{status.name}</span>
                <Button variant="outline-danger" className="w-auto al-r"
                        onClick={() => this.deleteStatus(status.id)}>✕</Button>
                <Button variant="outline-warning" className="al-r me-1 w-18"
                        onClick={() => this.editStatusModal(status)}>I</Button>
                <hr/>
                {this.state.tasks.filter(task => task.statusId === status.id)
                    .map((task, index) => (
                        <div onClick={() => this.openEditModal(task.id)} className="task mt-2 bg-light">
                            <TaskItem task={task}/>
                        </div>
                    ))}
                <Button variant="outline-primary" className="w-auto mt-2"
                        onClick={() => this.showModalCreateTask(status)}>+</Button>
                <span className="ms-2">new</span>
            </Card.Body>
        </Card>
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
                    return resolve(result)
                },
                error: function (error) {
                    console.log('Error ' + error)
                }
            })
        })
    }

    loadPriorityTypes(deskId) {
        const url = "http://127.0.0.1:8080/api/deskPriorityType"

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
                    return resolve(result)
                },
                error: function (error) {
                    console.log('Error ' + error)
                }
            })
        })
    }

    loadTaskTypes(deskId) {
        const url = "http://127.0.0.1:8080/api/deskTaskType"

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
                    return resolve(result)
                },
                error: function (error) {
                    console.log('Error ' + error)
                }
            })
        })
    }

    loadTasks(deskId) {
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

    createTask() {
        this.createTaskPromise().then(() => {
            this.hideModalCreateTask()
            this.clearCreateTaskModal()
            this.loadPage()
        })
    }

    createTaskPromise() {
        const url = "http://127.0.0.1:8080/api/tasks/create"

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
                    "name": this.state.modalCreateTaskName.current.value,
                    "statusId": this.state.modalCreateTaskStatusId,
                    "priorityId": this.state.modalCreateTaskPriorityType.value,
                    "typeId": this.state.modalCreateTaskType.value,
                    "description": this.state.modalCreateTaskDescription.current.value,
                    "doneDate": this.state.modalCreateTaskDeadlineDate
                },
                success: result => {
                    return resolve(result)
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

    createStatus() {
        this.createStatusPromise().then(() => {
            this.hideModalCreateStatus()
            this.state.modalCreateStatusName.current.value = ""
            this.loadPage()
        })
    }

    createStatusPromise() {
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
                    "name": this.state.modalCreateStatusName.current.value
                },
                success: result => {
                    return resolve(result)
                },
                error: function (error) {
                    console.log('Error ' + error)
                }
            })
        })
    }

    editStatusModal(status) {
        this.setEditStatusId(status.id)
        this.state.modalEditStatusName.current.value = status.name
        this.showModalEditStatus()
    }

    editStatus() {
        this.editStatusPromise().then(() => {
            this.hideModalEditStatus()
            this.state.modalEditStatusName.current.value = ""
            this.setEditStatusId(null)
            this.loadPage()
        })
    }

    editStatusPromise() {
        const url = "http://127.0.0.1:8080/api/deskTaskStatus/edit"

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
                    "id": this.state.editStatusId,
                    "name": this.state.modalEditStatusName.current.value
                },
                success: result => {
                    return resolve(result)
                },
                error: function (error) {
                    console.log('Error ' + error)
                }
            })
        })
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
                    return resolve(result)
                },
                error: function (error) {
                    console.log('Error ' + error)
                }
            })
        })
    }

    render() {
        const {
            modalCreateTaskDeadlineDate
        } = this.state;

        return (
            <div className="tasks">
                <Container fluid>
                    <h2 className="text-center mb-4">Tasks</h2>
                    {this.error && <Alert variant="danger">{this.error}</Alert>}
                    <CardGroup>
                        {this.state.statusColumns}

                        <CreateTaskModal show={this.state.modalCreateTaskActive}
                                         handleSave={this.createTask}
                                         handleClose={this.hideModalCreateTask}

                                         nameRef={this.state.modalCreateTaskName}
                                         onChangeName={text => this.setModalCreateTaskName(text)}

                                         statusRef={this.state.modalCreateTaskStatus}

                                         taskPriorityRef={(input) => this.state.modalCreateTaskPriorityType = input}
                                         priorityTypes={this.state.priorityTypes}
                                         taskPriorityCallback={(priorityType) => (
                                             <option value={priorityType.id}>{priorityType.name}</option>
                                         )}

                                         taskTypeRef={(input) => this.state.modalCreateTaskType = input}
                                         taskTypes={this.state.taskTypes}
                                         taskTypeCallback={(taskType) => (
                                             <option value={taskType.id}>{taskType.name}</option>
                                         )}

                                         descriptionRef={this.state.modalCreateTaskDescription}
                                         onChangeDescription={text => this.setModalCreateTaskDescription(text)}

                                         deadlineDateVal={modalCreateTaskDeadlineDate}
                                         onChangeDeadlineDate={date => this.setModalCreateTaskDeadlineDate(date)}/>

                        <ModalCloseOrSave show={this.state.modalCreateStatusActive}
                                          handleClose={this.hideModalCreateStatus}
                                          handleSave={this.createStatus}>
                            <Form className="justify-content-center">
                                <Form.Group id="name" className="form-group">
                                    <Form.Label>Name</Form.Label>
                                    <Form.Control type="text" required ref={this.state.modalCreateStatusName}
                                                  onChange={name => this.setModalCreateStatusName(name)}/>
                                </Form.Group>
                            </Form>
                        </ModalCloseOrSave>

                        <ModalCloseOrSave show={this.state.modalEditStatusActive}
                                          handleClose={this.hideModalEditStatus}
                                          handleSave={this.editStatus}>
                            <Form className="justify-content-center">
                                <Form.Group id="name" className="form-group">
                                    <Form.Label>Name</Form.Label>
                                    <Form.Control type="text" required ref={this.state.modalEditStatusName}
                                                  onChange={name => this.setModalEditStatusName(name)}/>
                                </Form.Group>
                            </Form>
                        </ModalCloseOrSave>
                    </CardGroup>
                </Container>
            </div>
        )
    }
}