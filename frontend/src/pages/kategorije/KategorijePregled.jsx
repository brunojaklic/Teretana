import { useEffect, useState } from "react";
import KategorijaService from "../../services/KategorijaService";
import { Button, Table } from "react-bootstrap";
import { NumericFormat } from "react-number-format";
import { Link, useNavigate } from "react-router-dom";
import { RouteNames } from "../../constants";
import useLoading from "../../hooks/useLoading";
import useError from '../../hooks/useError';

/**
 * KategorijePregled
 * 
 * Komponenta za pregled svih kategorija u aplikaciji.
 * - Dohvaća sve kategorije iz backend-a i prikazuje ih u tablici.
 * - Omogućava brisanje i promjenu kategorija.
 * - Koristi hookove `useLoading` i `useError` za prikaz loading statusa i grešaka.
 */
export default function KategorijePregled() {

    const navigate = useNavigate();
    const { showLoading, hideLoading } = useLoading();
    const { prikaziError } = useError();

    const [kategorije, setKategorije] = useState();

    /**
     * dohvatiKategorije
     * 
     * Dohvaća sve kategorije iz backend-a i postavlja ih u stanje `kategorije`.
     * Ako dođe do greške, prikazuje poruku greške.
     */
    async function dohvatiKategorije() {
        showLoading();
        const odgovor = await KategorijaService.get();
        hideLoading();
        if (odgovor.greska) {
            prikaziError(odgovor.poruka);
            return;
        }
        setKategorije(odgovor.poruka);
    }

    useEffect(() => {
        dohvatiKategorije();
    }, []);

    /**
     * obrisi
     * 
     * Provjerava potvrdu korisnika prije brisanja kategorije.
     * @param {number} sifra - Šifra kategorije koja se briše
     */
    function obrisi(sifra) {
        if (!confirm('Sigurno obrisati')) {
            return;
        }
        brisanjeKategorije(sifra);
    }

    /**
     * brisanjeKategorije
     * 
     * Funkcija koja briše kategoriju po šifri i osvježava listu kategorija.
     * @param {number} sifra - Šifra kategorije koja se briše
     */
    async function brisanjeKategorije(sifra) {
        showLoading();
        const odgovor = await KategorijaService.brisanje(sifra);
        hideLoading();
        if (odgovor.greska) {
            prikaziError(odgovor.poruka);
            return;
        }
        dohvatiKategorije();
    }

    return (
        <>
        <Link to={RouteNames.KATEGORIJA_NOVA} className="btn btn-success siroko">
            Dodaj novu kategoriju
        </Link>
        <Table striped bordered hover responsive>
            <thead>
                <tr>
                    <th>Naziv</th>
                    <th>Cijena</th>
                    <th>Akcija</th>
                </tr>
            </thead>
            <tbody>
                {kategorije && kategorije.map((kategorija, index) => (
                    <tr key={index}>
                        <td>{kategorija.naziv}</td>
                        <td className={kategorija.cijena == null ? 'sredina' : 'desno'}>
                            {kategorija.cijena == null ? 'Nije definirano' : 
                                <NumericFormat 
                                    value={kategorija.cijena}
                                    displayType={'text'}
                                    thousandSeparator='.'
                                    decimalSeparator=','
                                    prefix={'€'}
                                    decimalScale={2}
                                    fixedDecimalScale
                                />
                            }
                        </td>
                        <td>
                            <Button
                                variant="danger"
                                onClick={() => obrisi(kategorija.sifra)}
                            >
                                Obriši
                            </Button>
                            &nbsp;&nbsp;&nbsp;
                            <Button
                                onClick={() => navigate(`/kategorije/${kategorija.sifra}`)}
                            >
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
