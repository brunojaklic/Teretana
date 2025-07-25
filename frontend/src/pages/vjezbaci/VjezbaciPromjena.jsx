import { Button, Col, Form, Row } from 'react-bootstrap';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Service from '../../services/VjezbacService';
import KategorijaService from '../../services/KategorijaService';
import { RouteNames } from '../../constants';


export default function VjezbaciPromjena() {
    const navigate = useNavigate();
    const routeParams = useParams();

    const [kategorije, setKategorije] = useState([]);
    const [kategorijaSifra, setKategorijaSifra] = useState(0);

    const [kategorija, setKategorija] = useState({});

    async function dohvatiKategorije() {
        const odgovor = await KategorijaService.get();
        setKategorije(odgovor.poruka);
    }

    async function dohvatiVjezbac() {
        const odgovor = await Service.getBySifra(routeParams.sifra);
        if (odgovor.greska) {
            alert(odgovor.poruka);
            return;
        }
        let vjezbac = odgovor.poruka;
        setKategorija(vjezbac);
        setKategorijaSifra(vjezbac.kategorijaSifra);
    }


    async function dohvatiInicijalnePodatke() {
        await dohvatiKategorije();
        await dohvatiVjezbac();
    }


    useEffect(() => {
        dohvatiInicijalnePodatke();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    async function promjena(e) {
        const odgovor = await Service.promjena(routeParams.sifra, e);
        if (odgovor.greska) {
            alert(odgovor.poruka);
            return;
        }
        navigate(RouteNames.VJEZBAC_PREGLED);
    }

    function obradiSubmit(e) {
        e.preventDefault();

        const podaci = new FormData(e.target);


        promjena({
            ime: podaci.get('ime'),
            prezime: podaci.get('prezime'),
            kategorijaSifra: parseInt(kategorijaSifra),
            email: podaci.get('email'),
        });
    }

    return (
        <>
            Mjenjanje podataka vježbača

            <Form onSubmit={obradiSubmit}>

                <Form.Group controlId="ime">
                    <Form.Label>Ime</Form.Label>
                    <Form.Control
                        type="text"
                        name="ime"
                        required
                        value={kategorija.ime || ''}
                        onChange={(e) =>
                            setKategorija({ ...kategorija, ime: e.target.value })
                        }
                    />
                </Form.Group>

                <Form.Group controlId="prezime">
                    <Form.Label>Prezime</Form.Label>
                    <Form.Control
                        type="text"
                        name="prezime"
                        required
                        value={kategorija.prezime || ''}
                        onChange={(e) =>
                            setKategorija({ ...kategorija, prezime: e.target.value })
                        }
                    />
                </Form.Group>

                <Form.Group className='mb-3' controlId='kategorija'>
                    <Form.Label>Kategorija</Form.Label>
                    <Form.Select
                        value={kategorijaSifra}
                        onChange={(e) => { setKategorijaSifra(e.target.value) }}
                    >
                        {kategorije && kategorije.map((k, index) => (
                            <option key={index} value={k.sifra}>
                                {k.naziv}
                            </option>
                        ))}
                    </Form.Select>

                    <Form.Group controlId="email">
                        <Form.Label>Email</Form.Label>
                        <Form.Control
                            type="text"
                            name="email"
                            required
                            value={kategorija.email || ''}
                            onChange={(e) =>
                                setKategorija({ ...kategorija, email: e.target.value })
                            }
                        />
                    </Form.Group>

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
                            Promjeni vježbača
                        </Button>
                    </Col>
                </Row>
            </Form>

        </>
    );
}