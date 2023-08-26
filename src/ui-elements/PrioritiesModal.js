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
            rows: [],
            show: props.show,
            items: {},
            showCreate: false,
            newText: ""
        }

        this.loadPage()
    }

    setRows = (rows) => this.setState({rows: rows})
    setShowCreate = (val) => this.setState({showCreate: val})
    setNewText = (event) => this.setState({newText: event.target.value})

    loadPage() {
        this.load(this.state.deskId).then(output => {
            const rows = []

            output.forEach(priority => {
                rows.push(this.createRow(priority))
            })

            this.setRows(rows)
        })
    }

    load(deskId) {
        const url = "http://127.0.0.1:8080/api/priorityType"

        return new Promise((resolve) => {
            $.ajax({
                url: url,
                async: true,
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Authorization': 'Bearer ' + localStorage.token
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

    createRow(priority) {
        /*return <div className="w-auto">
            <ListGroup.Item onClick={() => this.openedit(priority)}>{priority.name}</ListGroup.Item>
        </div>*///todo uncomment when there will be a solution to normal editing

        return <div className="w-auto">
            <input onChange={event => this.edit(event, priority)} value={priority.name}/>
            <Button variant="outline-danger inline al-r" onClick={event => this.delete(event, priority)}>
                <BsX/>
            </Button>
        </div>
    }

    /*openedit(priority) {

    }*/

    edit(event, priority) {
        this.editPromise(priority.id, event.target.value).then(() => {
            this.loadPage()
        })
    }

    delete(event, priority) {
        this.deletePromise(priority.id).then(() => {
            this.loadPage()
        })
    }

    deletePromise(id) {
        const url = "http://127.0.0.1:8080/api/priorityType"

        return new Promise((resolve) => {
            $.ajax({
                url: url,
                async: true,
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Authorization': 'Bearer ' + localStorage.token
                },
                type: "Delete",
                data: {
                    "id": id
                },
                success: result => {
                    return resolve(result)
                },
                error: function (error) {
                    alert("Cannot delete priority with existing tasks! First delete tasks or change their priority.")
                    console.log('Error ' + error)
                }
            })
        })
    }

    editPromise(id, name) {
        const url = "http://127.0.0.1:8080/api/priorityType/edit"

        return new Promise((resolve) => {
            $.ajax({
                url: url,
                async: true,
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Authorization': 'Bearer ' + localStorage.token
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

    create() {
        this.createPromise(this.state.newText, this.state.deskId).then(() => {
            this.loadPage()
            this.setShowCreate(false)
        })
    }

    createPromise(name, deskId) {
        const url = "http://127.0.0.1:8080/api/priorityType/create"

        return new Promise((resolve) => {
            $.ajax({
                url: url,
                async: true,
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Authorization': 'Bearer ' + localStorage.token
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
                {this.state.rows}
                <center>
                    <ListGroup.Item>
                        {this.state.showCreate ?
                            <div>
                                <input type="text"
                                       onChange={(event) => this.setNewText(event)}
                                       ref={this.state.newText}/>
                                <Button variant="outline-success" className="w-auto" onClick={() => this.create()}>
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