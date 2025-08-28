import KategorijaService from "../../services/KategorijaService"
import { Button, Row, Col, Form } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { RouteNames } from "../../constants";
import useLoading from "../../hooks/useLoading";
import useError from '../../hooks/useError';

/**
 * KategorijeDodaj
 * 
 * Komponenta za dodavanje nove kategorije.
 * - Omogućava unos naziva i cijene kategorije.
 * - Koristi hookove `useLoading` i `useError` za prikaz loading statusa i grešaka.
 * - Nakon uspješnog dodavanja, preusmjerava korisnika na pregled kategorija.
 */
export default function KategorijeDodaj() {

    const navigate = useNavigate();
    const { showLoading, hideLoading } = useLoading();
    const { prikaziError } = useError();

    /**
     * dodaj
     * 
     * Funkcija koja šalje zahtjev za dodavanje nove kategorije.
     * Ako dođe do greške, prikazuje poruku greške.
     * Ako je uspješno, preusmjerava korisnika na stranicu pregleda kategorija.
     * 
     * @param {Object} kategorija - Objekt s podacima kategorije (naziv, cijena)
     */
    async function dodaj(kategorija) {
        showLoading();
        const odgovor = await KategorijaService.dodaj(kategorija);
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
     * Funkcija koja obrađuje submit forme.
     * - Sprema podatke iz forme u objekt.
     * - Poziva funkciju `dodaj` s tim podacima.
     * 
     * @param {Event} e - Submit event forme
     */
    function obradiSubmit(e) {
        e.preventDefault();
        let podaci = new FormData(e.target);
        dodaj({
            naziv: podaci.get('naziv'),
            cijena: parseFloat(podaci.get('cijena')),
        });
    }

    return (
        <>
        Dodavanje kategorije
        <Form onSubmit={obradiSubmit}>

            <Form.Group controlId="naziv">
                <Form.Label>Naziv</Form.Label>
                <Form.Control type="text" name="naziv" required />
            </Form.Group>

            <Form.Group controlId="cijena">
                <Form.Label>Cijena</Form.Label>
                <Form.Control type="number" step={0.01} name="cijena" />
            </Form.Group>

            <Row className="akcije">
                <Col xs={6} sm={12} md={3} lg={6} xl={6} xxl={6}>
                    <Link to={RouteNames.KATEGORIJA_PREGLED} 
                          className="btn btn-danger siroko">
                        Odustani
                    </Link>
                </Col>
                <Col xs={6} sm={12} md={9} lg={6} xl={6} xxl={6}>
                    <Button variant="success"
                            type="submit"
                            className="siroko">
                        Dodaj kategoriju
                    </Button>
                </Col>
            </Row>
        </Form>
        </>
    );
}
