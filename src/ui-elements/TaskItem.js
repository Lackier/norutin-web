import React from "react"
import {format} from "date-fns";

export default function TaskItem({task}) {
    function setTaskItem(task) {
        task.name = task.name.slice(0, 15)
        return task;
    }

    function formatDate(stringDate) {
        let date = new Date(stringDate);
        return format(date, "dd.MM.yyyy HH:mm");
    }

    task = setTaskItem(task)

    return (
        <div>
            <div className="row">
                <div className="col-sm text-primary fw-bold">{task.name}</div>
                <div className="col-sm">{task.type}</div>
            </div>
            <div className="row">
                <div className="col-sm">Priority:</div>
                <div className="col-sm text-success fw-bold">{task.priority}</div>
            </div>
            {task.doneDate != null &&
            <div className="row">
                <span className="col-sm">Deadline:</span>
                <span className="col-sm">{formatDate(task.doneDate)}</span>
            </div>
            }
            {task.commitDate != null &&
            <div>
                <p>{formatDate(task.commitDate)}</p>
                <p>{task.doneOnTime}</p>
            </div>
            }
        </div>
    );
}