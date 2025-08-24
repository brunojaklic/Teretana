import { Button, Col, Container, Form, Row } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Service from '../../services/VjezbacService';
import KategorijaService from '../../services/KategorijaService';
import { RouteNames } from '../../constants';
import useLoading from "../../hooks/useLoading";
import useError from '../../hooks/useError';


export default function KategorijeDodaj() {
    const navigate = useNavigate();
    const { showLoading, hideLoading } = useLoading();
    const { prikaziError } = useError();

    const [kategorije, setKategorije] = useState([]);
    const [kategorijaSifra, setKategorijaSifra] = useState(0);

    async function dohvatiKategorije() {
        const odgovor = await KategorijaService.get();
        setKategorije(odgovor.poruka);
        setKategorijaSifra(odgovor.poruka[0].sifra);
    }



    useEffect(() => {
        dohvatiKategorije();
    }, []);

    async function dodaj(e) {
        showLoading();
        const odgovor = await Service.dodaj(e);
        hideLoading();
        if (odgovor.greska) {
            prikaziError(odgovor.poruka);
            return;
        }
        navigate(RouteNames.VJEZBAC_PREGLED);
    }

    function obradiSubmit(e) {
        e.preventDefault();

        const podaci = new FormData(e.target);


        dodaj({
            ime: podaci.get('ime'),
            prezime: podaci.get('prezime'),
            kategorijaSifra: parseInt(kategorijaSifra),
            email: podaci.get('email')
        });
    }

    return (
        <>
            Dodavanje novog vježbača



            <Form onSubmit={obradiSubmit}>

                <Form.Group controlId="ime">
                    <Form.Label>Ime</Form.Label>
                    <Form.Control type="text" name="ime" required />
                </Form.Group>

                <Form.Group controlId="prezime">
                    <Form.Label>Prezime</Form.Label>
                    <Form.Control type="text" name="prezime" required />
                </Form.Group>

                <Form.Group className='mb-3' controlId='kategorija'>
                    <Form.Label>Kategorija</Form.Label>
                    <Form.Select
                        onChange={(e) => { setKategorijaSifra(e.target.value) }}
                    >
                        {kategorije && kategorije.map((k, index) => (
                            <option key={index} value={k.sifra}>
                                {k.naziv}
                            </option>
                        ))}
                    </Form.Select>
                </Form.Group>

                <Form.Group controlId="email">
                    <Form.Label>Email</Form.Label>
                    <Form.Control type="text" name="email" required />
                </Form.Group>

                <hr />
                <Row>
                    <Col xs={6} sm={6} md={3} lg={6} xl={6} xxl={6}>
                        <Link to={RouteNames.VJEZBAC_PREGLED}
                            className="btn btn-danger siroko">
                            Odustani
                        </Link>
                    </Col>
                    <Col xs={6} sm={6} md={9} lg={6} xl={6} xxl={6}>
                        <Button variant="primary" type="submit" className="siroko">
                            Dodaj novog vježbača
                        </Button>
                    </Col>
                </Row>
            </Form>
        </>
    );
}