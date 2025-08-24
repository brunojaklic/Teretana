import KategorijaService from "../../services/KategorijaService"
import { Button, Row, Col, Form } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { RouteNames } from "../../constants";
import useLoading from "../../hooks/useLoading";
import useError from '../../hooks/useError';


export default function KategorijeDodaj(){

    const navigate = useNavigate()
    const { showLoading, hideLoading } = useLoading();
    const { prikaziError } = useError();

    async function dodaj(kategorija) {
        showLoading();
        const odgovor = await KategorijaService.dodaj(kategorija)
        hideLoading();
        if(odgovor.greska){
            prikaziError(odgovor.poruka)
            return;
        }
        navigate(RouteNames.KATEGORIJA_PREGLED)
    }

    function obradiSubmit(e){
        e.preventDefault();
        let podaci = new FormData(e.target)
        dodaj({
            naziv: podaci.get('naziv'),
            cijena: parseFloat(podaci.get('cijena')),
        })
    }

    return(
        <>
        Dodavanje kategorije
        <Form onSubmit={obradiSubmit}>

            <Form.Group controlId="naziv">
                <Form.Label>Naziv</Form.Label>
                <Form.Control type="text" name="naziv" required />
            </Form.Group>

            <Form.Group controlId="cijena">
                <Form.Label>Cijena</Form.Label>
                <Form.Control type="number" step={0.01} name="cijena"  />
            </Form.Group>

        <Row className="akcije">
            <Col xs={6} sm={12} md={3} lg={6} xl={6} xxl={6}>
            <Link to={RouteNames.KATEGORIJA_PREGLED} 
            className="btn btn-danger siroko">Odustani</Link>
            </Col>
            <Col xs={6} sm={12} md={9} lg={6} xl={6} xxl={6}>
            <Button variant="success"
            type="submit"
            className="siroko">Dodaj kategoriju</Button>
            </Col>
        </Row>
        </Form>
        </>
    )
}