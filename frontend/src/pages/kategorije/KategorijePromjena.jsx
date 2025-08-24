import { Form, Row, Col, Table, Button } from 'react-bootstrap';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import { FaTrash } from 'react-icons/fa';
import Service from '../../services/KategorijaService';
import VjezbacService from '../../services/VjezbacService';
import { RouteNames } from '../../constants';
import { AsyncTypeahead } from 'react-bootstrap-typeahead';
import useLoading from "../../hooks/useLoading";
import useError from '../../hooks/useError';


export default function KategorijePromjena() {
  const navigate = useNavigate();
  const { showLoading, hideLoading } = useLoading();
  const { prikaziError } = useError();
  const routeParams = useParams();

  const [vjezbaci, setVjezbaci] = useState([]);
  const [pronadeniVjezbaci, setPronadeniVjezbaci] = useState([]);

  const [kategorija, setKategorija] = useState({});

  const typeaheadRef = useRef(null);

  async function dohvatiKategorija() {
    showLoading();
    const odgovor = await Service.getBySifra(routeParams.sifra);
    hideLoading();
    if(odgovor.greska){
      prikaziError(odgovor.poruka)
      return;
  }
    let kategorija = odgovor.poruka;
    setKategorija(kategorija);
  }

  async function dohvatiVjezbaci() {
    showLoading();
    const odgovor = await Service.getVjezbaci(routeParams.sifra);
    hideLoading();
    if(odgovor.greska){
      prikaziError(odgovor.poruka)
      return;
    }
    setVjezbaci(odgovor.poruka);
  }

  async function traziVjezbac(uvjet) {
    showLoading();
    const odgovor =  await VjezbacService.traziVjezbac(uvjet);
    hideLoading();
    if(odgovor.greska){
      prikaziError(odgovor.poruka)
      return;
    }
    setPronadeniVjezbaci(odgovor.poruka);
  }

  async function dodajVjezbaca(e) {
    showLoading();
    const odgovor = await Service.dodajVjezbaca(routeParams.sifra, e[0].sifra);
    hideLoading();
    if(odgovor.greska){
      prikaziError(odgovor.poruka)
      return;
    }
      await dohvatiVjezbaci();
      typeaheadRef.current.clear();
  }

  async function obrisiVjezbaca(vjezbac) {
    showLoading();
    const odgovor = await Service.obrisiVjezbaca(routeParams.sifra, vjezbac);
    hideLoading();
    if(odgovor.greska){
      prikaziError(odgovor.poruka)
      return;
    }
      await dohvatiVjezbaci();
  }


  async function dohvatiInicijalnePodatke() {
    showLoading();
    await dohvatiKategorija();
    await dohvatiVjezbaci();
    hideLoading();
  }


  useEffect(()=>{
    dohvatiInicijalnePodatke();
  },[]);

  async function promjena(e){
    showLoading();
    const odgovor = await Service.promjena(routeParams.sifra,e);
    hideLoading();
    if(odgovor.greska){
        prikaziError(odgovor.poruka);
        return;
    }
    navigate(RouteNames.KATEGORIJA_PREGLED);
}

  function obradiSubmit(e) {
    e.preventDefault();

    const podaci = new FormData(e.target);


    promjena({
      naziv: podaci.get('naziv'),
      cijena: podaci.get('cijena')
    });
  }

  return (
      <>
      Mjenjanje podataka kategorije
      <Row>
        <Col key='1' sm={12} lg={6} md={6}>
          <Form onSubmit={obradiSubmit}>
              <Form.Group controlId="naziv">
                  <Form.Label>Naziv</Form.Label>
                  <Form.Control type="text" name="naziv" required defaultValue={kategorija.naziv}/>
              </Form.Group>

            <Form.Group controlId="cijena">
                <Form.Label>Cijena</Form.Label>
                <Form.Control type="number" step={0.01} name="cijena" defaultValue={kategorija.cijena}/>
            </Form.Group>


              <hr />
              <Row>
                  <Col xs={6} sm={6} md={3} lg={6} xl={6} xxl={6}>
                  <Link to={RouteNames.KATEGORIJA_PREGLED}
                  className="btn btn-danger siroko">
                  Odustani
                  </Link>
                  </Col>
                  <Col xs={6} sm={6} md={9} lg={6} xl={6} xxl={6}>
                  <Button variant="primary" type="submit" className="siroko">
                      Promjeni kategoriju
                  </Button>
                  </Col>
              </Row>
          </Form>
        </Col>
        <Col key='2' sm={12} lg={6} md={6}>
        <div style={{overflow: 'auto', maxHeight:'400px'}}>
        <Form.Group className='mb-3' controlId='uvjet'>
          <Form.Label>Traži vježbača</Form.Label>
            <AsyncTypeahead
            className='autocomplete'
            id='uvjet'
            emptyLabel='Nema rezultata'
            searchText='Tražim...'
            labelKey={(vjezbac) => `${vjezbac.prezime} ${vjezbac.ime}`}
            minLength={3}
            options={pronadeniVjezbaci}
            onSearch={traziVjezbac}
            placeholder='dio imena ili prezimena'
            renderMenuItemChildren={(vjezbac) => (
              <>
                <span>
                   {vjezbac.prezime} {vjezbac.ime}
                </span>
              </>
            )}
            onChange={dodajVjezbaca}
            ref={typeaheadRef}
            />
          </Form.Group>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Vježbači na kategoriji</th>
                <th>Akcija</th>
              </tr>
            </thead>
            <tbody>
              {vjezbaci &&
                vjezbaci.map((vjezbac, index) => (
                  <tr key={index}>
                    <td>
                       {vjezbac.ime} {vjezbac.prezime}
                      
                    </td>
                    <td>
                      <Button variant='danger' onClick={() =>
                          obrisiVjezbaca(vjezbac.sifra)
                        } >
                        <FaTrash />
                      </Button>
      
                    </td>
                  </tr>
                ))}
            </tbody>
          </Table>
          </div>
        </Col>
        </Row>
        </>
  );
}