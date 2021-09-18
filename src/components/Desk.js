import '../styles/index.css'
import React from "react"
import {Alert, Button, Card, CardGroup, Container, Form} from "react-bootstrap"
import ModalCloseOrSave from '../ui-elements/modal/ModalCloseOrSave.js'
import $ from "jquery"
import TaskItem from "../ui-elements/TaskItem"
import CreateTaskModal from "../ui-elements/CreateTaskModal"
import EditTaskModal from "../ui-elements/EditTaskModal"
import PrioritiesModal from "../ui-elements/PrioritiesModal"
import TaskTypesModal from "../ui-elements/TaskTypesModal";
import {BsPlus, BsX, BsPencil} from "react-icons/bs";

export default class Desk extends React.Component {
    constructor(props) {
        super(props)
        this.deskId = props.location.search.split("?deskId=")[1]
        this.deskName = ""
        this.state = {
            statuses: [],
            priorityTypes: [],
            taskTypes: [],
            statusColumns: [],
            tasks: [],

            modalPrioritiesActive: false,
            modalTaskTypesActive: false,

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
            modalCreateTaskDeadlineDate: Date(),

            modalEditTaskId: null,
            modalEditTaskActive: false,
            modalEditTaskName: {current: {value: ""}},
            modalEditTaskStatus: {value: null},
            modalEditTaskPriorityType: {value: null},
            modalEditTaskType: {value: null},
            modalEditTaskDescription: {current: {value: ""}},
            modalEditTaskDeadlineDate: null
        }

        this.createTask = this.createTask.bind(this)
        this.editTask = this.editTask.bind(this)
        this.deleteTask = this.deleteTask.bind(this)
        this.createStatus = this.createStatus.bind(this)
        this.editStatus = this.editStatus.bind(this)
        this.loadPage()
    }

    setDeskName = (text) => this.deskName = text

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

    showModalEditTask = (task) => {
        this.setState({modalEditTaskActive: true})
        this.state.modalEditTaskId = task.id
        this.state.modalEditTaskName.current.value = task.name
        this.state.modalEditTaskStatus.value = task.statusId
        this.state.modalEditTaskPriorityType.value = task.priorityId
        this.state.modalEditTaskType.value = task.typeId
        this.state.modalEditTaskDescription.current.value = task.description
        this.setModalEditTaskDeadlineDate(task.doneDate)
    }
    clearEditTaskModal = () => {
        this.state.modalEditTaskId = null
        this.state.modalEditTaskName.current.value = ""
        this.state.modalEditTaskStatus.value = null
        this.state.modalEditTaskDescription.current.value = ""
        this.state.modalEditTaskPriorityType.value = null
        this.state.modalEditTaskType.value = null
    }
    hideModalEditTask = () => {
        this.setState({modalEditTaskActive: false})
        this.clearEditTaskModal()
    }
    setModalEditTaskName = (text) => this.setState({modalEditTaskName: text})
    setModalEditTaskDescription = (text) => this.setState({modalEditTaskDescription: text})
    setModalEditTaskDeadlineDate = (date) => this.setState({modalEditTaskDeadlineDate: date})

    showModalPriorities = () => this.setState({modalPrioritiesActive: true})
    hideModalPriorities = () => {
        this.setState({modalPrioritiesActive: false})
        this.loadPage()
    }

    showModalTypes = () => this.setState({modalTaskTypesActive: true})
    hideModalTaskTypes = () => {
        this.setState({modalTaskTypesActive: false})
        this.loadPage()
    }

    showModalCreateStatus = () => this.setState({modalCreateStatusActive: true})
    setModalCreateStatusName = (text) => this.setState({modalCreateStatusName: text})
    hideModalCreateStatus = () => this.setState({modalCreateStatusActive: false})

    showModalEditStatus = () => this.setState({modalEditStatusActive: true})
    setEditStatusId = (text) => this.setState({editStatusId: text})
    setModalEditStatusName = (text) => this.setState({modalEditStatusName: text})
    hideModalEditStatus = () => this.setState({modalEditStatusActive: false})

    loadPage() {
        this.loadDesk(this.deskId).then(output => {
            this.setDeskName(output.data.name)
        }).then(() => {
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
                }).then(() => {
                    this.loadPriorityTypes(this.deskId).then(output => {
                        const priorityTypes = []
                        output.forEach(priorityType => {
                            priorityTypes.push(priorityType)
                        })
                        this.setPriorityTypes(priorityTypes)
                    }).then(() => {
                        this.loadTaskTypes(this.deskId).then(output => {
                            const taskTypes = []
                            output.forEach(taskType => {
                                taskTypes.push(taskType)
                            })
                            this.setTaskTypes(taskTypes)
                        })
                    })
                })
            })
        })
    }

    createStatusRow(status) {
        return <Card className="w-150-250">
            <Card.Body>
                <span>{status.name}</span>
                <Button variant="outline-danger" className="w-auto al-r"
                        onClick={() => this.deleteStatus(status.id)}>
                    <BsX/>
                </Button>
                <Button variant="outline-warning" className="w-auto al-r"
                        onClick={() => this.editStatusModal(status)}>
                    <BsPencil/>
                </Button>
                <hr/>
                {this.state.tasks.filter(task => task.statusId === status.id)
                    .map((task, index) => (
                        <div onClick={() => this.openEditModal(task.id)} className="task mt-2 bg-light">
                            <TaskItem task={task}/>
                        </div>
                    ))}
                <center>
                    <Button variant="outline-primary" className="w-auto mt-2"
                            onClick={() => this.showModalCreateTask(status)}>
                        <BsPlus/>
                    </Button>
                </center>
            </Card.Body>
        </Card>
    }

    createNewStatusRow() {
        return <Card className="w-150-250">
            <Card.Body>
                <center>
                    <Button variant="outline-primary" className="w-auto"
                            onClick={this.showModalCreateStatus}>
                        <BsPlus/>
                    </Button>
                </center>
            </Card.Body>
        </Card>
    }

    loadStatuses(deskId) {
        const url = "http://127.0.0.1:8080/api/taskStatus"

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
        const url = "http://127.0.0.1:8080/api/priorityType"

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
        const url = "http://127.0.0.1:8080/api/taskType"

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

    loadDesk(deskId) {
        const url = "http://127.0.0.1:8080/api/desks/get"
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
        this.showModalEditTask(this.state.tasks.filter(task => task.id === taskId)[0])
    }

    editTask() {
        this.editTaskPromise().then(() => {
            this.hideModalEditTask()
            this.loadPage()
        })
    }

    editTaskPromise() {
        const url = "http://127.0.0.1:8080/api/tasks/edit"

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
                    "id": this.state.modalEditTaskId,
                    "name": this.state.modalEditTaskName.current.value,
                    "statusId": this.state.modalEditTaskStatus.value,
                    "priorityId": this.state.modalEditTaskPriorityType.value,
                    "typeId": this.state.modalEditTaskType.value,
                    "description": this.state.modalEditTaskDescription.current.value,
                    "doneDate": new Date(this.state.modalEditTaskDeadlineDate)
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

    deleteTask() {
        this.deleteTaskPromise().then(() => {
            this.hideModalEditTask()
            this.loadPage()
        })
    }

    deleteTaskPromise() {
        const url = "http://127.0.0.1:8080/api/tasks"

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
                    "id": this.state.modalEditTaskId
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

    createStatus() {
        this.createStatusPromise().then(() => {
            this.hideModalCreateStatus()
            this.state.modalCreateStatusName.current.value = ""
            this.loadPage()
        })
    }

    createStatusPromise() {
        const url = "http://127.0.0.1:8080/api/taskStatus/create"

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
        const url = "http://127.0.0.1:8080/api/taskStatus/edit"

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
        this.deleteStatusPromise(statusId).then(() => {
            this.loadPage()
        })
    }

    deleteStatusPromise(statusId) {
        const url = "http://127.0.0.1:8080/api/taskStatus"

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
                    alert("Cannot delete status with existing tasks! First delete tasks or move them to another status.")
                    console.log('Error ' + error)
                }
            })
        })
    }

    render() {
        const {
            modalCreateTaskDeadlineDate,
            modalEditTaskDeadlineDate
        } = this.state;

        return (
            <div className="tasks">
                <Container fluid>
                    <div className="row">
                        <div className="col-sm-10">
                            <h2 className="text-center">{this.deskName}</h2>
                        </div>

                        <div className="col-sm">
                            <Button className="btn btn-secondary al-r ms-2" onClick={this.showModalTypes}>
                                Types
                            </Button>
                            <Button className="btn btn-secondary al-r" onClick={this.showModalPriorities}>
                                Priorities
                            </Button>
                        </div>
                    </div>
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
                                         priorityTypes={this.state.priorityTypes}//todo make this dynamic
                                         taskPriorityCallback={(priorityType) => (
                                             <option value={priorityType.id}>{priorityType.name}</option>
                                         )}

                                         taskTypeRef={(input) => this.state.modalCreateTaskType = input}
                                         taskTypes={this.state.taskTypes}//todo make this dynamic
                                         taskTypeCallback={(taskType) => (
                                             <option value={taskType.id}>{taskType.name}</option>
                                         )}

                                         descriptionRef={this.state.modalCreateTaskDescription}
                                         onChangeDescription={text => this.setModalCreateTaskDescription(text)}

                                         deadlineDateVal={modalCreateTaskDeadlineDate}
                                         onChangeDeadlineDate={date => this.setModalCreateTaskDeadlineDate(date)}/>

                        <EditTaskModal show={this.state.modalEditTaskActive}
                                       handleSave={this.editTask}
                                       handleClose={this.hideModalEditTask}
                                       handleDelete={this.deleteTask}

                                       nameRef={this.state.modalEditTaskName}
                                       onChangeName={text => this.setModalEditTaskName(text)}

                                       statusRef={(input) => this.state.modalEditTaskStatus = input}
                                       taskStatuses={this.state.statuses}
                                       taskStatusCallback={(taskStatus) => (
                                           <option value={taskStatus.id}>{taskStatus.name}</option>
                                       )}

                                       taskPriorityRef={(input) => this.state.modalEditTaskPriorityType = input}
                                       priorityTypes={this.state.priorityTypes}//todo make this dynamic
                                       taskPriorityCallback={(priorityType) => (
                                           <option value={priorityType.id}>{priorityType.name}</option>
                                       )}

                                       taskTypeRef={(input) => this.state.modalEditTaskType = input}
                                       taskTypes={this.state.taskTypes}//todo make this dynamic
                                       taskTypeCallback={(taskType) => (
                                           <option value={taskType.id}>{taskType.name}</option>
                                       )}

                                       descriptionRef={this.state.modalEditTaskDescription}
                                       onChangeDescription={text => this.setModalEditTaskDescription(text)}

                                       deadlineDateVal={modalEditTaskDeadlineDate}
                                       onChangeDeadlineDate={date => this.setModalEditTaskDeadlineDate(date)}/>

                        <PrioritiesModal show={this.state.modalPrioritiesActive}
                                         handleClose={this.hideModalPriorities}
                                         deskId={this.deskId}
                        />

                        <TaskTypesModal show={this.state.modalTaskTypesActive}
                                        handleClose={this.hideModalTaskTypes}
                                        deskId={this.deskId}
                        />

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