import React from "react";

export default function DeskListItem({desk}) {
    function setDeskListItem(desk) {
        return desk;
    }

    desk = setDeskListItem(desk)

    return (
        <div>
            <p>{desk.name}</p>
        </div>
    );
}