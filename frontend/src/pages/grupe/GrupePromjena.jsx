import { Button, Col, Form, Row} from 'react-bootstrap';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Service from '../../services/GrupaService';
import ProgramService from '../../services/ProgramService';
import { RouteNames } from '../../constants';


export default function GrupePromjena() {
  const navigate = useNavigate();
  const routeParams = useParams();

  const [programi, setProgrami] = useState([]);
  const [programSifra, setProgramSifra] = useState(0);

  const [grupa, setGrupa] = useState({});

  async function dohvatiPrograme(){
    const odgovor = await ProgramService.get();
    setProgrami(odgovor.poruka);
  }

  async function dohvatiGrupa() {
    const odgovor = await Service.getBySifra(routeParams.sifra);
    if(odgovor.greska){
      alert(odgovor.poruka);
      return;
  }
    let grupa = odgovor.poruka;
    setGrupa(grupa);
    setProgramSifra(grupa.programSifra); 
  }

  async function dohvatiInicijalnePodatke() {
    await dohvatiPrograme();
    await dohvatiGrupa();
  }


  useEffect(()=>{
    dohvatiInicijalnePodatke();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[]);

  async function promjena(e){
    const odgovor = await Service.promjena(routeParams.sifra,e);
    if(odgovor.greska){
        alert(odgovor.poruka);
        return;
    }
    navigate(RouteNames.GRUPA_PREGLED);
}

  function obradiSubmit(e) {
    e.preventDefault();

    const podaci = new FormData(e.target);


    promjena({
      naziv: podaci.get('naziv'),
      programSifra: parseInt(programSifra),
      trener: podaci.get('trener')
    });
  }

  return (
      <>
      Mjenjanje podataka grupe
      
      <Form onSubmit={obradiSubmit}>
          <Form.Group controlId="naziv">
              <Form.Label>Naziv</Form.Label>
              <Form.Control type="text" name="naziv" required defaultValue={grupa.naziv}/>
          </Form.Group>

          <Form.Group className='mb-3' controlId='program'>
            <Form.Label>Program</Form.Label>
            <Form.Select
            value={programSifra}
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
              <Form.Control type="text" name="trener" required defaultValue={grupa.trener}/>
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
                  Promjeni grupu
              </Button>
              </Col>
          </Row>
      </Form>
  </>
  );
}