import React from "react";

export default function DeskListItem({desk}) {
    function setDeskListItem(desk) {
        desk.name = desk.name.slice(0, 15)
        desk.createDate = desk.createDate.slice(0, 15)
        return desk;
    }

    desk = setDeskListItem(desk)

    return (
        <div>
            <p>Name: {desk.name}</p>
            <p>Created: {desk.createDate}</p>
        </div>
    );
}