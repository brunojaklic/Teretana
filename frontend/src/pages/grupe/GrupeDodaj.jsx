import { Button, Col, Container, Form, Row} from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Service from '../../services/GrupaService';
import ProgramService from '../../services/ProgramService';
import { RouteNames } from '../../constants';


export default function GrupeDodaj() {
  const navigate = useNavigate();

  const [programi, setProgrami] = useState([]);
  const [programSifra, setProgramSifra] = useState(0);

  async function dohvatiPrograme(){
    const odgovor = await ProgramService.get();
    setProgrami(odgovor.poruka);
    setProgramSifra(odgovor.poruka[0].sifra);
  }



  useEffect(()=>{
    dohvatiPrograme();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[]);

  async function dodaj(e) {
    const odgovor = await Service.dodaj(e);
    if(odgovor.greska){
      alert(odgovor.poruka);
      return;
    }
    navigate(RouteNames.GRUPA_PREGLED);
  }

  function obradiSubmit(e) {
    e.preventDefault();

    const podaci = new FormData(e.target);


    dodaj({
      naziv: podaci.get('naziv'),
      programSifra: parseInt(programSifra),
      trener: podaci.get('trener')
    });
  }

  return (
      <>
      Dodavanje nove grupe
      
      <Form onSubmit={obradiSubmit}>
          <Form.Group controlId="naziv">
              <Form.Label>Naziv</Form.Label>
              <Form.Control type="text" name="naziv" required />
          </Form.Group>

          <Form.Group className='mb-3' controlId='program'>
            <Form.Label>Program</Form.Label>
            <Form.Select 
            onChange={(e)=>{setProgramSifra(e.target.value)}}
            >
            {programi && programi.map((s,index)=>(
              <option key={index} value={s.sifra}>
                {s.naziv}
              </option>
            ))}
            </Form.Select>
          </Form.Group>

          <Form.Group controlId="trener">
              <Form.Label>Trener</Form.Label>
              <Form.Control type="text" name="trener" required />
          </Form.Group>


          <hr />
          <Row>
              <Col xs={6} sm={6} md={3} lg={6} xl={6} xxl={6}>
              <Link to={RouteNames.GRUPA_PREGLED}
              className="btn btn-danger siroko">
              Odustani
              </Link>
              </Col>
              <Col xs={6} sm={6} md={9} lg={6} xl={6} xxl={6}>
              <Button variant="primary" type="submit" className="siroko">
                  Dodaj novu grupu
              </Button>
              </Col>
          </Row>
      </Form>
  </>
  );
}