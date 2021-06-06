import React from "react"

export default function TaskItem({task}) {
    function setTaskItem(task) {
        task.name = task.name.slice(0, 15)
        task.createDate = task.createDate.slice(0, 15)
        return task;
    }

    task = setTaskItem(task)

    return (
        <div>
            <div className="row">
                <div className="col-sm text-primary fw-bold">{task.name}</div>
                <div className="col-sm fw-bold">{task.type}</div>
            </div>
            <div className="row">
                <div className="col-sm">Priority:</div>
                <div className="col-sm text-success fw-bold">{task.priority}</div>
            </div>
            <p>Create date: {task.createDate}</p>
            {task.doneDate != null &&
            <div>
                <p>{task.doneDate}</p>
                <p>{task.doneOnTime}</p>
            </div>
            }
            {task.commitDate != null &&
            <div>
                <p>{task.commitDate}</p>
            </div>
            }
        </div>
    );
}