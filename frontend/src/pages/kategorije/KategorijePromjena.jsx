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

/**
 * KategorijePromjena
 * 
 * Komponenta za uređivanje podataka postojeće kategorije.
 * - Dohvaća detalje kategorije i pripadajuće vježbače.
 * - Omogućava promjenu naziva i cijene kategorije.
 * - Omogućava dodavanje i brisanje vježbača koristeći typeahead i tablicu.
 * - Koristi hookove `useLoading` i `useError` za prikaz loading statusa i grešaka.
 */
export default function KategorijePromjena() {
  const navigate = useNavigate();
  const { showLoading, hideLoading } = useLoading();
  const { prikaziError } = useError();
  const routeParams = useParams();

  const [vjezbaci, setVjezbaci] = useState([]);
  const [pronadeniVjezbaci, setPronadeniVjezbaci] = useState([]);
  const [kategorija, setKategorija] = useState({});
  const typeaheadRef = useRef(null);

  /**
   * dohvatiKategorija
   * 
   * Dohvaća podatke kategorije po šifri i postavlja ih u stanje `kategorija`.
   */
  async function dohvatiKategorija() {
    showLoading();
    const odgovor = await Service.getBySifra(routeParams.sifra);
    hideLoading();
    if (odgovor.greska) {
      prikaziError(odgovor.poruka);
      return;
    }
    setKategorija(odgovor.poruka);
  }

  /**
   * dohvatiVjezbaci
   * 
   * Dohvaća sve vježbače pridružene kategoriji i postavlja ih u stanje `vjezbaci`.
   */
  async function dohvatiVjezbaci() {
    showLoading();
    const odgovor = await Service.getVjezbaci(routeParams.sifra);
    hideLoading();
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
    showLoading();
    const odgovor = await VjezbacService.traziVjezbac(uvjet);
    hideLoading();
    if (odgovor.greska) {
      prikaziError(odgovor.poruka);
      return;
    }
    setPronadeniVjezbaci(odgovor.poruka);
  }

  /**
   * dodajVjezbaca
   * 
   * Dodaje vježbača u kategoriju i osvježava listu vježbača.
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
   * Briše vježbača iz kategorije i osvježava listu vježbača.
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
   * Dohvaća inicijalne podatke za komponentu: kategoriju i vježbače.
   */
  async function dohvatiInicijalnePodatke() {
    showLoading();
    await dohvatiKategorija();
    await dohvatiVjezbaci();
    hideLoading();
  }

  useEffect(() => {
    dohvatiInicijalnePodatke();
  }, []);

  /**
   * promjena
   * 
   * Funkcija koja šalje zahtjev za promjenu podataka kategorije.
   * Nakon uspješne promjene preusmjerava na pregled kategorija.
   * @param {Object} e - Objekt s podacima za promjenu kategorije (naziv, cijena)
   */
  async function promjena(e) {
    showLoading();
    const odgovor = await Service.promjena(routeParams.sifra, e);
    hideLoading();
    if (odgovor.greska) {
      prikaziError(odgovor.poruka);
      return;
    }
    navigate(RouteNames.KATEGORIJA_PREGLED);
  }

  /**
   * obradiSubmit
   * 
   * Obrada submit forme za promjenu podataka kategorije.
   * Sprema podatke iz forme i poziva funkciju `promjena`.
   * @param {Event} e - Submit event forme
   */
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
                <Link to={RouteNames.KATEGORIJA_PREGLED} className="btn btn-danger siroko">
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
                  <th>Vježbači na kategoriji</th>
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
