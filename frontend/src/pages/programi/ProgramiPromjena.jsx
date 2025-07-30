import ProgramService from "../../services/ProgramService"
import { Button, Row, Col, Form } from "react-bootstrap";
import moment from "moment";
import { Link, useNavigate, useParams } from "react-router-dom";
import { RouteNames } from "../../constants";
import { useEffect, useState } from "react";


export default function ProgramiPromjena(){

    const [program,setProgram] = useState({})
    const [aktivan,setaktivan] = useState(false)
    const navigate = useNavigate()
    const routeParams = useParams()

    async function dohvatiProgram(){
        const odgovor = await ProgramService.getBySifra(routeParams.sifra);
        if(odgovor.greska){
            alert(odgovor.poruka)
            return
        }
        let s = odgovor.poruka
        setProgram(s)
        setaktivan(s.aktivan)
    } 

    useEffect(()=>{
        dohvatiProgram();
     },[])

     async function promjena(program) {
        const odgovor = await ProgramService.promjena(routeParams.sifra,program)
        if(odgovor.greska){
            alert(odgovor.poruka)
            return;
        }
        navigate(RouteNames.PROGRAM_PREGLED)
    }

    function obradiSubmit(e){
        e.preventDefault();
        let podaci = new FormData(e.target)
        promjena({
            naziv: podaci.get('naziv'),
            cijena: parseFloat(podaci.get('cijena')),
            aktivan: podaci.get('aktivan')=='on' ? true : false 
        })
    }

    return(
        <>
        Promjena programa
        <Form onSubmit={obradiSubmit}>

            <Form.Group controlId="naziv">
                <Form.Label>Naziv</Form.Label>
                <Form.Control type="text" name="naziv" required
                defaultValue={program.naziv} />
            </Form.Group>

            <Form.Group controlId="cijena">
                <Form.Label>Cijena</Form.Label>
                <Form.Control type="number" step={0.01} name="cijena" defaultValue={program.cijena}/>
            </Form.Group>

            <Form.Group controlId="aktivan">
                <Form.Check label="Vaučer" name="aktivan" 
                onChange={(e)=>setaktivan(e.target.checked)}
                checked={aktivan}  />
            </Form.Group>

        <Row className="akcije">
            <Col xs={6} sm={12} md={3} lg={6} xl={6} xxl={6}>
            <Link to={RouteNames.PROGRAM_PREGLED} 
            className="btn btn-danger siroko">Odustani</Link>
            </Col>
            <Col xs={6} sm={12} md={9} lg={6} xl={6} xxl={6}>
            <Button variant="success"
            type="submit"
            className="siroko">Promjeni program</Button>
            </Col>
        </Row>
        </Form>
        </>
    )
}