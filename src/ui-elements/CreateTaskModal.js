import React from "react";
import ModalCloseOrSave from "./modal/ModalCloseOrSave";
import {Form} from "react-bootstrap";
import {DateTimePicker, MuiPickersUtilsProvider} from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import * as PropTypes from "prop-types";

export default class CreateTaskModal extends React.Component {
    render() {
        return <ModalCloseOrSave show={this.props.show}
                                 handleSave={this.props.handleSave}
                                 handleClose={this.props.handleClose}>
            <Form className="justify-content-center">
                <Form.Group id="name" className="form-group">
                    <Form.Label>Name</Form.Label>
                    <Form.Control type="text" required ref={this.props.nameRef}
                                  onChange={this.props.onChangeName}/>
                </Form.Group>

                <Form.Group id="status" className="form-group">
                    <Form.Label>Status</Form.Label>
                    <Form.Control type="text" readOnly plaintext
                                  ref={this.props.statusRef}/>
                </Form.Group>

                <div className="form-group">
                    <label htmlFor="taskPriority">Priority</label>
                    <select className="form-control" id="taskPriority" required
                            ref={this.props.taskPriorityRef}>
                        {this.props.priorityTypes.map(this.props.taskPriorityCallback)}
                    </select>
                </div>

                <div className="form-group">
                    <label htmlFor="taskType">Type</label>
                    <select className="form-control" id="taskType" required
                            ref={this.props.taskTypeRef}>
                        {this.props.taskTypes.map(this.props.taskTypeCallback)}
                    </select>
                </div>

                <div className="form-group">
                    <label htmlFor="description">Description</label>
                    <textarea className="form-control" rows="5" id="description"
                              required ref={this.props.descriptionRef}
                              onChange={this.props.onChangeDescription}/>
                </div>

                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                    <p><label>Deadline date</label></p>
                    <DateTimePicker ampm={false} disablePast format="dd.MM.yyyy HH:mm"
                                    value={this.props.deadlineDateVal}
                                    onChange={this.props.onChangeDeadlineDate}
                    />
                </MuiPickersUtilsProvider>
                <div>
                        <label>
                          <input
                            type="checkbox"
                            checked={this.props.noDeadline}
                            onChange={this.props.handleToggleNoDeadline}
                          />
                          No deadline
                        </label>
                      </div>
            </Form>
        </ModalCloseOrSave>;
    }
}

CreateTaskModal.propTypes = {
    show: PropTypes.bool,
    handleSave: PropTypes.func,
    handleClose: PropTypes.func,

    nameRef: PropTypes.shape({current: PropTypes.shape({value: PropTypes.string})}),
    onChangeName: PropTypes.func,

    statusRef: PropTypes.shape({current: PropTypes.shape({value: PropTypes.string})}),

    taskPriorityRef: PropTypes.func,
    priorityTypes: PropTypes.any,
    taskPriorityCallback: PropTypes.func,

    taskTypeRef: PropTypes.func,
    taskTypes: PropTypes.any,
    taskTypeCallback: PropTypes.func,

    descriptionRef: PropTypes.shape({current: PropTypes.shape({value: PropTypes.string})}),
    onChangeDescription: PropTypes.func,

    deadlineDateVal: PropTypes.any,
    onChangeDeadlineDate: PropTypes.func,

    noDeadline: PropTypes.any,
    handleToggleNoDeadline: PropTypes.func
};