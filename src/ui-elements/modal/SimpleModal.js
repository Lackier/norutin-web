import React from 'react'
import "./modal.css"

const SimpleModal = ({active, setActive, children}) => {
    return (
        <div className={active ? "modal_active" : "modal"} onClick={() => setActive(false)}>
            <div className={active ? "modal_content_active" : "modal_content"}
                 onClick={e => e.stopPropagation()}>
                {children}
            </div>
        </div>
    )
}

export default SimpleModal