import { useEffect, useState } from "react";
import ProgramService from "../../services/ProgramService";
import { Button, Table } from "react-bootstrap";
import { NumericFormat } from "react-number-format";
import { GrValidate } from "react-icons/gr";
import { Link, useNavigate } from "react-router-dom";
import { RouteNames } from "../../constants";
import useLoading from "../../hooks/useLoading";
import useError from '../../hooks/useError';

/**
 * ProgramiPregled
 * 
 * Komponenta za pregled svih programa.
 * - Prikazuje tablicu sa svim programima: naziv, cijena, status aktivan/neaktivan.
 * - Omogućava brisanje i uređivanje programa.
 * - Koristi hookove `useLoading` i `useError` za prikaz loading statusa i grešaka.
 */
export default function ProgramiPregled() {

    const navigate = useNavigate();
    const { showLoading, hideLoading } = useLoading();
    const { prikaziError } = useError();

    const [programi, setProgrami] = useState([]);

    /**
     * dohvatiPrograme
     * 
     * Dohvaća sve programe s backenda i postavlja ih u stanje `programi`.
     * Ako dođe do greške, prikazuje poruku greške.
     */
    async function dohvatiPrograme() {
        showLoading();
        const odgovor = await ProgramService.get();
        hideLoading();
        if (odgovor.greska) {
            prikaziError(odgovor.poruka);
            return;
        }
        setProgrami(odgovor.poruka);
    }

    useEffect(() => {
        dohvatiPrograme();
    }, []);

    /**
     * aktivan
     * 
     * Funkcija koja određuje boju statusa programa.
     * @param {boolean|null} v - Status programa
     * @returns {string} - Boja: 'green' ako aktivan, 'red' ako neaktivan, 'gray' ako null
     */
    function aktivan(v) {
        if (v == null) return 'gray';
        if (v) return 'green';
        return 'red';
    }

    /**
     * obrisi
     * 
     * Funkcija koja prikazuje potvrdu za brisanje programa i poziva brisanje.
     * @param {number} sifra - Šifra programa koji se briše
     */
    function obrisi(sifra) {
        if (!confirm('Sigurno obrisati')) {
            return;
        }
        brisanjePrograma(sifra);
    }

    /**
     * brisanjePrograma
     * 
     * Funkcija koja šalje zahtjev za brisanje programa.
     * Ako dođe do greške, prikazuje poruku greške.
     * Nakon uspješnog brisanja, ponovno dohvaća listu programa.
     * @param {number} sifra - Šifra programa koji se briše
     */
    async function brisanjePrograma(sifra) {
        showLoading();
        const odgovor = await ProgramService.brisanje(sifra);
        hideLoading();
        if (odgovor.greska) {
            prikaziError(odgovor.poruka);
            return;
        }
        dohvatiPrograme();
    }

    return (
        <>
        <Link to={RouteNames.PROGRAM_NOVI} className="btn btn-success siroko">Dodaj novi program</Link>
        <Table striped bordered hover responsive>
            <thead>
                <tr>
                    <th>Naziv</th>
                    <th>Cijena</th>
                    <th>Aktivan</th>
                    <th>Akcija</th>
                </tr>
            </thead>
            <tbody>
                {programi && programi.map((program, index) => (
                    <tr key={index}>
                        <td>{program.naziv}</td>
                        <td className={program.cijena == null ? 'sredina' : 'desno'}>
                            {program.cijena == null ? 'Nije definirano' :
                                <NumericFormat
                                    value={program.cijena}
                                    displayType={'text'}
                                    thousandSeparator='.'
                                    decimalSeparator=','
                                    prefix={'€'}
                                    decimalScale={2}
                                    fixedDecimalScale
                                />
                            }
                        </td>
                        <td className="sredina">
                            <GrValidate
                                size={30}
                                color={aktivan(program.aktivan)}
                            />
                        </td>
                        <td>
                            <Button variant="danger" onClick={() => obrisi(program.sifra)}>
                                Obriši
                            </Button>
                            &nbsp;&nbsp;&nbsp;
                            <Button onClick={() => navigate(`/programi/${program.sifra}`)}>
                                Promjena
                            </Button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </Table>
        </>
    );
}
