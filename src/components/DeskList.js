import React, {useState} from 'react'
import {useLocation} from 'react-router-dom'
import '../styles/index.css'
import {Alert, Button, Card, Container} from 'react-bootstrap'
import DeskListItem from '../elements/DeskListItem'

// eslint-disable-next-line no-unused-vars
class DeskModel {
    id
    name
    createDate
    userId
}

export default function DeskList() {
    const [error, setError] = useState("")
    const location = useLocation();
    let desks = location.state

    const removeDesk = id => {
        debugger;
    };

    function createDesk() {
        debugger;
    }

    const openDesk = id => {
        debugger;
    }

    const editDesk = id => {
        debugger;
    }

    return (
        <Container fluid className="mt-5">
            <h3>Desks</h3>
            {error && <Alert variant="danger">{error}</Alert>}
            {desks.map((desk, index) => (
                <Card>
                    <Card.Body>
                        <div onClick={() => openDesk(desk.id)} className="desk">
                            <DeskListItem
                                key={index}
                                index={index}
                                desk={desk}
                                removeDesk={removeDesk}
                                editDesk={editDesk}
                            />
                        </div>
                        <Button variant="outline-danger" className="mt-2 w-12"
                                onClick={() => removeDesk(desk.id)}>✕</Button>
                        <Button variant="outline-warning" className="mt-2 ms-2 w-12"
                                onClick={() => editDesk(desk.id)}>I</Button>
                    </Card.Body>
                </Card>
            ))}

            <Card>
                <Card.Body>
                    <Button variant="outline-primary" className="w-12" onClick={() => createDesk()}>+</Button>
                    <span className="ms-2">Create new</span>
                </Card.Body>
            </Card>
        </Container>
    )
}