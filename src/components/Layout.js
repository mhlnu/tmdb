import React, { useState } from "react";
import { Nav, Container, Row, Col, Modal, Button, Form } from "react-bootstrap";
import { getData } from "./../api/data";

const Layout = ({ api, children, changeApi }) => {
    const [show, setShow] = useState(false);
    const [valid, setValid] = useState(null);
    const [apiKey, setApiKey] = useState("");
    const [error, setError] = useState("");
    const handleClose = () => {
        setShow(false);
        setValid(false);
        setApiKey("");
        setError("");
    };
    const handleShow = () => setShow(true);
    const handleSave = () => {
        changeApi(apiKey);
        handleClose();
    };

    const handleChange = val => {
        setError(false);
        setApiKey(val);
    };

    const isApiValid = api => {
        getData("movie", "details", { id: 10428 }, 1, null, api)
            .then(res => {
                if (res?.title?.length > 1) {
                    setValid(true);
                    setError(false);
                } else {
                    setValid(false);
                    setError(true);
                }
            })
            .catch(err => console.log(err));
    };

    return (
        <React.Fragment>
            <header className="topmenu">
                <Container>
                    <Row>
                        <Col md={4} sm={4} xs={4} className="logoCol">
                            <a href="/" className="logo">
                                <img src="logo.svg" srcSet="logo.svg" alt="tmdb" width="50" height="auto" />
                            </a>
                        </Col>
                        <Col md={8} sm={4} xs={4}>
                            <Nav className="main">
                                <Nav as="ul">
                                    <Nav.Link as="li" className="d-lg-block d-md-none d-sm-none d-none" onClick={() => handleShow()}>
                                        Your API
                                    </Nav.Link>
                                    <Nav.Link as="li" className="d-lg-block d-md-none d-sm-none d-none">
                                        <a href="https://github.com/mhlnu/tmdb">Code</a>
                                    </Nav.Link>
                                </Nav>
                            </Nav>
                        </Col>
                    </Row>
                </Container>
            </header>
            {children}
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Change the API</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Row className="align-items-center">
                        <Col sm={2}>API key</Col>
                        <Col sm={7}>
                            <Form.Control
                                type="text"
                                placeholder="Your API"
                                value={apiKey}
                                aria-label="Your API"
                                onChange={e => handleChange(e.target.value)}
                                style={valid ? { border: "2px solid green" } : error ? { border: "2px solid red" } : null}
                            />
                        </Col>
                        <Col sm={3}>
                            <Button variant="primary" onClick={() => isApiValid(apiKey)}>
                                Check
                            </Button>
                        </Col>
                        <Col sm={12}>
                            <p>{error && "Your API is invalid"}</p>
                        </Col>
                    </Row>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="negative" onClick={handleClose}>
                        Cancel
                    </Button>
                    <Button variant="primary" onClick={handleSave} disabled={!valid}>
                        Save
                    </Button>
                </Modal.Footer>
            </Modal>
        </React.Fragment>
    );
};

export default Layout;
