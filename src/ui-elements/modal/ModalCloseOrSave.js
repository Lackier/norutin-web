import '../../styles/index.css'
import './modal.css';
import React from "react";
import {Button, ButtonGroup} from "react-bootstrap";

const ModalCloseOrSave = ({ handleSave, handleClose, show, children }) => {
    return (
        <div className={show ? "modal_active" : "modal"} onClick={() => handleClose}>
            <div className={show ? "modal_content_active" : "modal_content"}>
                {children}
                <ButtonGroup className="w-40 mt-3 justify-content-end">
                    <Button className="btn btn-primary btn-block" onClick={handleSave}>
                        Save
                    </Button>
                    <Button className="btn btn-primary btn-block" onClick={handleClose}>
                        Close
                    </Button>
                </ButtonGroup>
            </div>
        </div>
    );
};

export default ModalCloseOrSave