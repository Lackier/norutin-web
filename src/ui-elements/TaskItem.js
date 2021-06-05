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
            <p>Name: {task.name}</p>
            <p>Created: {task.createDate}</p>
            <p>{task.type}</p>
            <p>{task.priority}</p>
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