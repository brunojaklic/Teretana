import { Button, Col, Form, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import { RouteNames } from "../../constants";


export default function ProgramiDodaj() {
    return (
        <>
            Dodavanje programa
            <Form>
                <Form.Group controlId="naziv">
                    <Form.Label>Naziv</Form.Label>
                    <Form.Control type="text" name="naziv" required />
                </Form.Group>

                <Form.Group controlId="cijena">
                    <Form.Label>Cijena</Form.Label>
                    <Form.Control type="number" name="cijena" step={0.01} />
                </Form.Group>
                
                <Form.Group controlId="aktivan">
                    <Form.Label>Aktivan</Form.Label>
                    <Form.Check Label="aktivan" name="aktivan" />
                </Form.Group>

                <hr style={{marginTop: '50px'}}/>
                <Row>
                    <Col xs={6} sm={6} md={3} lg={2} xl={6} xxl={6}>
                        <Link to={RouteNames.PROGRAM_PREGLED}
                            className="btn btn-danger"> Odustani</Link>
                    </Col>
                    <Col xs={6} sm={6} md={9} lg={10} xl={6} xxl={6}>
                        <Button variant="success" type="submit">
                            Dodaj program
                        </Button>
                    </Col>
                </Row>
            </Form>

        </>
    )
}