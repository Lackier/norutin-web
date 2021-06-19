import '../../styles/index.css'
import './modal.css';
import React from "react";
import {Button} from "react-bootstrap";

const ModalDeleteCloseSave = ({handleSave, handleClose, handleDelete, show, children}) => {
    return (
        <div className={show ? "modal_active" : "modal"} onClick={() => handleClose}>
            <div className={show ? "modal_content_active" : "modal_content"}>
                {children}
                <div className="mt-3">
                    <Button className="btn btn-warning" onClick={handleDelete}>
                        Delete
                    </Button>
                    <Button className="btn btn-secondary w-25 al-r" onClick={handleClose}>
                        Close
                    </Button>
                    <Button className="btn btn-primary w-25 al-r" onClick={handleSave}>
                        Save
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default ModalDeleteCloseSave