import { Button, Col, Form, Row } from "react-bootstrap";
import { Link, useNavigate, useParams } from "react-router-dom";
import { RouteNames } from "../../constants";
import VjezbacService from "../../services/VjezbacService";
import { useEffect, useState } from "react";



export default function VjezbaciPromjena(){

    const navigate = useNavigate();
    const routeParams = useParams();
    const [vjezbac,setVjezbac] = useState({});


    async function dohvatiVjezbac(){
        const odgovor = await VjezbacService.getBySifra(routeParams.sifra);
        if(odgovor.greska){
            alert(odgovor.poruka);
            return;
        }
        setVjezbac(odgovor.poruka);
    }

    useEffect(()=>{
        dohvatiVjezbac();
    },[]);

    async function promjena(e){
        const odgovor = await VjezbacService.promjena(routeParams.sifra,e);
        if(odgovor.greska){
            alert(odgovor.poruka);
            return;
        }
        navigate(RouteNames.VJEZBAC_PREGLED);
    }

    function obradiSubmit(e){ // e predstavlja event
        e.preventDefault();

        const podaci = new FormData(e.target);

        promjena({
            ime: podaci.get('ime'),
            prezime: podaci.get('prezime'),
            email: podaci.get('email')
        });

    }

    return(
        <>
            Promjena Vježbača
            
            <Form onSubmit={obradiSubmit}>
            <Form.Group controlId="ime">
                    <Form.Label>Ime</Form.Label>
                    <Form.Control type="text" name="ime" required defaultValue={vjezbac.ime}/>
                </Form.Group>

                <Form.Group controlId="prezime">
                    <Form.Label>Prezime</Form.Label>
                    <Form.Control type="text" name="prezime" required  defaultValue={vjezbac.prezime}/>
                </Form.Group>

                <Form.Group controlId="email">
                    <Form.Label>Email</Form.Label>
                    <Form.Control type="text" name="email" required  defaultValue={vjezbac.email}/>
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
                        Promjeni vježbača
                    </Button>
                    </Col>
                </Row>
            </Form>
        </>
    )
}