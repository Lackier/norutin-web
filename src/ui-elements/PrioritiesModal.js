import React from "react";
import ModalInnerEditOrClose from "./modal/ModalInnerEditOrClose";
import * as PropTypes from "prop-types";
import $ from "jquery";
import {Button, ListGroup} from "react-bootstrap";
import {BsPlus, BsX} from "react-icons/bs";
import {CgCheck} from "react-icons/cg";

export default class PrioritiesModal extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            deskId: props.deskId,
            prioritiesRows: [],
            show: props.show,
            items: {},
            showCreate: false,
            newText: ""
        }

        this.loadPage()
    }

    setPrioritiesRows = (prioritiesRows) => this.setState({prioritiesRows: prioritiesRows})
    setPriorities = (priorities) => this.setState({priorities: priorities})
    setPrioritiesMap = (prioritiesMap) => this.setState({prioritiesMap: prioritiesMap})
    setShowCreate = (val) => this.setState({showCreate: val})
    setNewText = (event) => this.setState({newText: event.target.value})

    loadPage() {
        this.loadPriorities(this.state.deskId).then(output => {
            const prioritiesRows = []

            output.forEach(priority => {
                prioritiesRows.push(this.createPriorityRow(priority))
            })

            this.setPrioritiesRows(prioritiesRows)
        })
    }

    loadPriorities(deskId) {
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

    createPriorityRow(priority) {
        /*return <div className="w-auto">
            <ListGroup.Item onClick={() => this.openEditPriority(priority)}>{priority.name}</ListGroup.Item>
        </div>*///todo uncomment when there will be a solution to normal editing

        return <div className="w-auto">
            <input onChange={event => this.editPriority(event, priority)} value={priority.name}/>
            <Button variant="outline-danger inline al-r" onClick={event => this.deletePriority(event, priority)}>
                <BsX/>
            </Button>
        </div>
    }

    /*openEditPriority(priority) {

    }*/

    editPriority(event, priority) {
        this.editPriorityPromise(priority.id, event.target.value).then(() => {
            this.loadPage()
        })
    }

    deletePriority(event, priority) {
        this.deletePriorityPromise(priority.id).then(() => {
            this.loadPage()
        })
    }

    deletePriorityPromise(id) {
        const url = "http://127.0.0.1:8080/api/priorityType"

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
                    "id": id
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

    editPriorityPromise(id, name) {
        const url = "http://127.0.0.1:8080/api/priorityType/edit"

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
                    "id": id,
                    "name": name
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

    createPriority() {
        this.createPriorityPromise(this.state.newText, this.state.deskId).then(() => {
            this.loadPage()
            this.setShowCreate(false)
        })
    }

    createPriorityPromise(name, deskId) {
        const url = "http://127.0.0.1:8080/api/priorityType/create"

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
                    "name": name,
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

    render() {
        return <ModalInnerEditOrClose show={this.props.show}
                                      handleClose={this.props.handleClose}>
            <h3>Priorities</h3>
            <ListGroup variant="flush">
                {this.state.prioritiesRows}
                <center>
                    <ListGroup.Item>
                        {this.state.showCreate ?
                            <div>
                                <input type="text"
                                       onChange={(event) => this.setNewText(event)}
                                       ref={this.state.newText}/>
                                <Button variant="outline-success" className="w-auto" onClick={() => this.createPriority()}>
                                    <CgCheck/>
                                </Button>
                            </div>
                            :
                            <Button variant="outline-primary" className="w-auto" onClick={() => this.setShowCreate(true)}>
                                <BsPlus/>
                            </Button>
                        }
                    </ListGroup.Item>
                </center>
            </ListGroup>
        </ModalInnerEditOrClose>;
    }
}

PrioritiesModal.propTypes = {
    show: PropTypes.bool,
    handleClose: PropTypes.func,
    deskId: PropTypes.any
};