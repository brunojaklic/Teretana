import { Form, Row, Col, Table, Button } from 'react-bootstrap';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import { FaTrash } from 'react-icons/fa';
import Service from '../../services/GrupaService';
import ProgramService from '../../services/ProgramService';
import VjezbacService from '../../services/VjezbacService';
import { RouteNames } from '../../constants';
import { AsyncTypeahead } from 'react-bootstrap-typeahead';
import useLoading from "../../hooks/useLoading";
import useError from '../../hooks/useError';

/**
 * GrupePromjena
 * 
 * Komponenta za uređivanje podataka postojeće grupe.
 * - Dohvaća detalje grupe, pripadajuće vježbače i dostupne programe.
 * - Omogućava promjenu naziva, programa i trenera grupe.
 * - Omogućava dodavanje i brisanje vježbača iz grupe koristeći typeahead i tablicu.
 * - Koristi hookove `useLoading` i `useError` za prikaz loading statusa i grešaka.
 */
export default function GrupePromjena() {
  const navigate = useNavigate();
  const { showLoading, hideLoading } = useLoading();
  const routeParams = useParams();
  const { prikaziError } = useError();

  const [programi, setProgrami] = useState([]);
  const [programSifra, setProgramSifra] = useState(0);
  const [vjezbaci, setVjezbaci] = useState([]);
  const [pronadeniVjezbaci, setPronadeniVjezbaci] = useState([]);
  const [grupa, setGrupa] = useState({});

  const typeaheadRef = useRef(null);

  /**
   * dohvatiPrograme
   * 
   * Dohvaća sve programe iz backend-a i postavlja ih u stanje `programi`.
   */
  async function dohvatiPrograme() {
    const odgovor = await ProgramService.get();
    setProgrami(odgovor.poruka);
  }

  /**
   * dohvatiGrupa
   * 
   * Dohvaća podatke grupe po šifri iz routeParams i postavlja ih u stanje `grupa`.
   */
  async function dohvatiGrupa() {
    const odgovor = await Service.getBySifra(routeParams.sifra);
    if (odgovor.greska) {
      prikaziError(odgovor.poruka);
      return;
    }
    let grupa = odgovor.poruka;
    setGrupa(grupa);
    setProgramSifra(grupa.programSifra); 
  }

  /**
   * dohvatiVjezbaci
   * 
   * Dohvaća sve vježbače pridružene grupi.
   */
  async function dohvatiVjezbaci() {
    const odgovor = await Service.getVjezbaci(routeParams.sifra);
    if (odgovor.greska) {
      prikaziError(odgovor.poruka);
      return;
    }
    setVjezbaci(odgovor.poruka);
  }

  /**
   * traziVjezbac
   * 
   * Pretražuje vježbače prema uvjetu unesenom u typeahead komponentu.
   * @param {string} uvjet - Tekst za pretragu vježbača
   */
  async function traziVjezbac(uvjet) {
    const odgovor = await VjezbacService.traziVjezbac(uvjet);
    if (odgovor.greska) {
      prikaziError(odgovor.poruka);
      return;
    }
    setPronadeniVjezbaci(odgovor.poruka);
  }

  /**
   * dodajVjezbaca
   * 
   * Dodaje vježbača u grupu i osvježava listu vježbača.
   * @param {Array} e - Array odabranih vježbača iz typeahead komponente
   */
  async function dodajVjezbaca(e) {
    showLoading();
    const odgovor = await Service.dodajVjezbaca(routeParams.sifra, e[0].sifra);
    hideLoading();
    if (odgovor.greska) {
      prikaziError(odgovor.poruka);
      return;
    }
    await dohvatiVjezbaci();
    typeaheadRef.current.clear();
  }

  /**
   * obrisiVjezbaca
   * 
   * Briše vježbača iz grupe i osvježava listu vježbača.
   * @param {number} vjezbac - Šifra vježbača koji se briše
   */
  async function obrisiVjezbaca(vjezbac) {
    showLoading();
    const odgovor = await Service.obrisiVjezbaca(routeParams.sifra, vjezbac);
    hideLoading();
    if (odgovor.greska) {
      prikaziError(odgovor.poruka);
      return;
    }
    await dohvatiVjezbaci();
  }

  /**
   * dohvatiInicijalnePodatke
   * 
   * Dohvaća inicijalne podatke za komponentu: programe, grupu i vježbače.
   */
  async function dohvatiInicijalnePodatke() {
    showLoading();
    await dohvatiPrograme();
    await dohvatiGrupa();
    await dohvatiVjezbaci();
    hideLoading();
  }

  useEffect(() => {
    dohvatiInicijalnePodatke();
  }, []);

  /**
   * promjena
   * 
   * Funkcija koja šalje zahtjev za promjenu podataka grupe.
   * Nakon uspješne promjene preusmjerava na pregled grupa.
   * @param {Object} e - Objekt s podacima za promjenu grupe (naziv, programSifra, trener)
   */
  async function promjena(e) {
    showLoading();
    const odgovor = await Service.promjena(routeParams.sifra, e);
    hideLoading();
    if (odgovor.greska) {
      prikaziError(odgovor.poruka);
      return;
    }
    navigate(RouteNames.GRUPA_PREGLED);
  }

  /**
   * obradiSubmit
   * 
   * Obrada submit forme za promjenu podataka grupe.
   * Sprema podatke iz forme i poziva funkciju `promjena`.
   * @param {Event} e - Submit event forme
   */
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
      <Row>
        <Col key='1' sm={12} lg={6} md={6}>
          <Form onSubmit={obradiSubmit}>
            <Form.Group controlId="naziv">
              <Form.Label>Naziv</Form.Label>
              <Form.Control type="text" name="naziv" required defaultValue={grupa.naziv}/>
            </Form.Group>

            <Form.Group className='mb-3' controlId='program'>
              <Form.Label>Program</Form.Label>
              <Form.Select
                value={programSifra}
                onChange={(e) => { setProgramSifra(e.target.value) }}
              >
                {programi && programi.map((s, index) => (
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
                <Link to={RouteNames.GRUPA_PREGLED} className="btn btn-danger siroko">
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
                    <span>{vjezbac.prezime} {vjezbac.ime}</span>
                  </>
                )}
                onChange={dodajVjezbaca}
                ref={typeaheadRef}
              />
            </Form.Group>

            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Vježbači na grupi</th>
                  <th>Akcija</th>
                </tr>
              </thead>
              <tbody>
                {vjezbaci &&
                  vjezbaci.map((vjezbac, index) => (
                    <tr key={index}>
                      <td>{vjezbac.ime} {vjezbac.prezime}</td>
                      <td>
                        <Button variant='danger' onClick={() => obrisiVjezbaca(vjezbac.sifra)}>
                          <FaTrash />
                        </Button>
                      </td>
                    </tr>
                  ))
                }
              </tbody>
            </Table>
          </div>
        </Col>
      </Row>
    </>
  );
}
