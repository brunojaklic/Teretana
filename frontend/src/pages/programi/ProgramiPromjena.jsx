import { Button, Col, Form, Row } from "react-bootstrap";
import { Link, useNavigate, useParams } from "react-router-dom";
import { RouteNames } from "../../constants";
import ProgramService from "../../services/ProgramService";
import { useEffect, useState } from "react";


export default function ProgramiPromjena() {


    const navigate = useNavigate();
    const params = useParams();
    const[program, setProgram] = useState({});
    const[aktivan, setAktivan] = useState(false);

    async function ucitajProgram(){
        const odgovor = await ProgramService.getBySifra(params.sifra);
        setProgram(odgovor);
        setAktivan(odgovor.aktivan);
    }

    useEffect(()=>{
        ucitajProgram()
    },[])

    async function promjena(sifra, program) {
        const odgovor = await ProgramService.promjeni(sifra, program);
        navigate(RouteNames.PROGRAM_PREGLED);
    }


    function odradiSubmit(e) {
        e.preventDefault();

        let podaci = new FormData(e.target);

        promjena(
            params.sifra,
            {
                naziv: podaci.get('naziv'),
                cijena: parseFloat(podaci.get('cijena')),
                aktivan: podaci.get('aktivan') == 'on'
            }
        )


    }

    return (
        <>
            Promjena programa
            <Form onSubmit={odradiSubmit}>

            <Form.Group controlId="naziv">
                <Form.Label>Naziv</Form.Label>
                <Form.Control type="text" name="naziv" required
                defaultValue={program.naziv} />
            </Form.Group>

            <Form.Group controlId="cijena">
                <Form.Label>Cijena</Form.Label>
                <Form.Control type="number" name="cijena" step={0.01}
                defaultValue={program.cijena} />
            </Form.Group>

            <Form.Group controlId="aktivan">
                <Form.Check label="Aktivan" name="aktivan"
                checked={aktivan}
                onChange={(e)=>{setAktivan(e.target.checked)}} />
            </Form.Group>

                <hr style={{ marginTop: '50px' }} />
                <Row>
                    <Col xs={6} sm={6} md={3} lg={2} xl={6} xxl={6}>
                        <Link to={RouteNames.PROGRAM_PREGLED}
                            className="btn btn-danger"> Odustani</Link>
                    </Col>
                    <Col xs={6} sm={6} md={9} lg={10} xl={6} xxl={6}>
                        <Button variant="success" type="submit">
                            Promjeni program
                        </Button>
                    </Col>
                </Row>
            </Form>

        </>
    )
}