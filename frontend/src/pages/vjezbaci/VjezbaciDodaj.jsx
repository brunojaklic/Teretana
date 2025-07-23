import { Button, Col, Form, Row } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { RouteNames } from "../../constants";
import VjezbacService from "../../services/VjezbacService";



export default function VjezbaciDodaj(){

    const navigate = useNavigate();

    async function dodaj(e){
        const odgovor = await VjezbacService.dodaj(e);
        if(odgovor.greska){
            alert(odgovor.poruka);
            return;
        }
        navigate(RouteNames.VJEZBAC_PREGLED);
    }

    function obradiSubmit(e){ 
        e.preventDefault();

        const podaci = new FormData(e.target);

        dodaj({
            ime: podaci.get('ime'),
            prezime: podaci.get('prezime'),
            email: podaci.get('email'),
            kategorijaSifra: parseInt(kategorijaSifra)
        });

    }

    return(
        <>
            Dodavanje novog vježbača
            
            <Form onSubmit={obradiSubmit}>
                <Form.Group controlId="ime">
                    <Form.Label>Ime</Form.Label>
                    <Form.Control type="text" name="ime" required />
                </Form.Group>

                <Form.Group controlId="prezime">
                    <Form.Label>Prezime</Form.Label>
                    <Form.Control type="text" name="prezime" required />
                </Form.Group>

                <Form.Group controlId="email">
                    <Form.Label>Email</Form.Label>
                    <Form.Control type="text" name="email" required />
                </Form.Group>
                
                <Form.Group className='mb-3' controlId='kategorija'>
                    <Form.Label>Kategorija</Form.Label>
                    <Form.Select
                        onChange={(e) => { setKategorijaSifra(e.target.value) }}
                    >
                        {kategorije && kategorije.map((s, index) => (
                            <option key={index} value={s.sifra}>
                                {s.naziv}
                            </option>
                        ))}
                    </Form.Select>
                </Form.Group>

             


                <hr />
                <Row>
                    <Col xs={6} sm={6} md={3} lg={6} xl={6} xxl={6}>
                    <Link to={RouteNames.VJEZBAC_PREGLED}
                    className="btn btn-danger siroko">
                    Odustani
                    </Link>
                    </Col>
                    <Col xs={6} sm={6} md={9} lg={6} xl={6} xxl={6}>
                    <Button variant="primary" type="submit" className="siroko">
                        Dodaj novog vježbača
                    </Button>
                    </Col>
                </Row>
            </Form>
        </>
    )
}