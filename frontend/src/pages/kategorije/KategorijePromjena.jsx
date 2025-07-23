import KategorijaService from "../../services/KategorijaService"
import { Button, Row, Col, Form } from "react-bootstrap";
import moment from "moment";
import { Link, useNavigate, useParams } from "react-router-dom";
import { RouteNames } from "../../constants";
import { useEffect, useState } from "react";


export default function KategorijePromjena(){

    const [kategorija,setKategorija] = useState({})
    const [aktivan,setaktivan] = useState(false)
    const navigate = useNavigate()
    const routeParams = useParams()

    async function dohvatiKategoriju(){
        const odgovor = await KategorijaService.getBySifra(routeParams.sifra);
        if(odgovor.greska){
            alert(odgovor.poruka)
            return
        }
        //debugger; // ovo radi u Chrome inspect (ali i ostali preglednici)
        let s = odgovor.poruka
        setKategorija(s)
    } 

    useEffect(()=>{
        dohvatiKategoriju();
     },[])

     async function promjena(kategorija) {
        const odgovor = await KategorijaService.promjena(routeParams.sifra,kategorija)
        if(odgovor.greska){
            alert(odgovor.poruka)
            return;
        }
        navigate(RouteNames.KATEGORIJA_PREGLED)
    }

    function obradiSubmit(e){ // e je event
        e.preventDefault(); // nemoj odraditi zahtjev na server
        let podaci = new FormData(e.target)
        //console.log(podaci.get('naziv'))
        promjena({
            naziv: podaci.get('naziv'),
            cijena: parseFloat(podaci.get('cijena')),
            aktivan: podaci.get('aktivan')=='on' ? true : false 
        })
    }

    return(
        <>
        Promjena kategorije
        <Form onSubmit={obradiSubmit}>

            <Form.Group controlId="naziv">
                <Form.Label>Naziv</Form.Label>
                <Form.Control type="text" name="naziv" required
                defaultValue={kategorija.naziv} />
            </Form.Group>

            <Form.Group controlId="cijena">
                <Form.Label>Cijena</Form.Label>
                <Form.Control type="number" step={0.01} name="cijena" defaultValue={kategorija.cijena}/>
            </Form.Group>

        <Row className="akcije">
            <Col xs={6} sm={12} md={3} lg={6} xl={6} xxl={6}>
            <Link to={RouteNames.KATEGORIJA_PREGLED} 
            className="btn btn-danger siroko">Odustani</Link>
            </Col>
            <Col xs={6} sm={12} md={9} lg={6} xl={6} xxl={6}>
            <Button variant="success"
            type="submit"
            className="siroko">Promjeni kategoriju</Button>
            </Col>
        </Row>
        </Form>
        </>
    )
}