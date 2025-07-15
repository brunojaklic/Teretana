import { Button, Col, Form, Row } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { RouteNames } from "../../constants";
import ProgramService from "../../services/ProgramService";


export default function ProgramiDodaj() {


    const navigate = useNavigate();

    async function dodaj(program) {
        const odgovor = await ProgramService.dodaj(program);
        navigate(RouteNames.PROGRAM_PREGLED);
    }


    function odradiSubmit(e) { // e je event
        e.preventDefault();

        let podaci = new FormData(e.target); // dohvacamo sve podatke iz forme

        dodaj(
            {
                naziv: podaci.get('naziv'),
                cijena: parseFloat(podaci.get('cijena')),
                aktivan: podaci.get('aktivan') == 'on'
            }
        )


    }

    return (
        <>
            Dodavanje programa
            <Form onSubmit={odradiSubmit}>
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
                    <Form.Check label="Aktivan" name="aktivan" />
                </Form.Group>

                <hr style={{ marginTop: '50px' }} />
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