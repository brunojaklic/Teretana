import ProgramService from "../../services/ProgramService";
import { Button, Row, Col, Form } from "react-bootstrap";
import { Link, useNavigate, useParams } from "react-router-dom";
import { RouteNames } from "../../constants";
import { useEffect, useState } from "react";
import useLoading from "../../hooks/useLoading";
import useError from '../../hooks/useError';

/**
 * ProgramiPromjena
 * 
 * Komponenta za promjenu podataka postojećeg programa.
 * - Omogućava uređivanje naziva, cijene i statusa aktivan/neaktivan.
 * - Koristi hookove `useLoading` i `useError` za prikaz loading statusa i grešaka.
 * - Nakon uspješne promjene, preusmjerava korisnika na pregled programa.
 */
export default function ProgramiPromjena() {

    const [program, setProgram] = useState({});
    const [aktivan, setAktivan] = useState(false);
    const navigate = useNavigate();
    const { showLoading, hideLoading } = useLoading();
    const routeParams = useParams();
    const { prikaziError } = useError();

    /**
     * dohvatiProgram
     * 
     * Dohvaća podatke programa po šifri iz URL parametra.
     * Postavlja dobivene podatke u stanje `program` i `aktivan`.
     */
    async function dohvatiProgram() {
        showLoading();
        const odgovor = await ProgramService.getBySifra(routeParams.sifra);
        hideLoading();
        if (odgovor.greska) {
            prikaziError(odgovor.poruka);
            return;
        }
        let s = odgovor.poruka;
        setProgram(s);
        setAktivan(s.aktivan);
    }

    useEffect(() => {
        dohvatiProgram();
    }, []);

    /**
     * promjena
     * 
     * Funkcija koja šalje zahtjev za promjenu podataka programa.
     * Ako dođe do greške, prikazuje poruku greške.
     * Ako je uspješno, preusmjerava korisnika na stranicu pregleda programa.
     * 
     * @param {Object} program - Objekt s promijenjenim podacima programa
     */
    async function promjena(program) {
        showLoading();
        const odgovor = await ProgramService.promjena(routeParams.sifra, program);
        hideLoading();
        if (odgovor.greska) {
            prikaziError(odgovor.poruka);
            return;
        }
        navigate(RouteNames.PROGRAM_PREGLED);
    }

    /**
     * obradiSubmit
     * 
     * Funkcija koja obrađuje submit forme.
     * - Sprema podatke iz forme u objekt.
     * - Poziva funkciju `promjena` s tim podacima.
     * 
     * @param {Event} e - Submit event forme
     */
    function obradiSubmit(e) {
        e.preventDefault();
        let podaci = new FormData(e.target);
        promjena({
            naziv: podaci.get('naziv'),
            cijena: parseFloat(podaci.get('cijena')),
            aktivan: podaci.get('aktivan') === 'on' ? true : false
        });
    }

    return (
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
                <Form.Control type="number" step={0.01} name="cijena" defaultValue={program.cijena} />
            </Form.Group>

            <Form.Group controlId="aktivan">
                <Form.Check label="Aktivan" name="aktivan"
                    onChange={(e) => setAktivan(e.target.checked)}
                    checked={aktivan} />
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
    );
}
