import '../../styles/index.css'
import './modal.css';
import React from "react";
import {Button} from "react-bootstrap";

const ModalInnerEditOrClose = ({handleClose, show, children}) => {
    return (
        <div className={show ? "modal_active" : "modal"} onClick={() => handleClose}>
            <div className={show ? "modal_content_active" : "modal_content"}>
                {children}
                <div className="mt-3">
                    <Button className="btn btn-secondary w-25 al-r" onClick={handleClose}>
                        Close
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default ModalInnerEditOrClose