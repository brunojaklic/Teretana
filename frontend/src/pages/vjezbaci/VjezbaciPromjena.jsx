import { Button, Col, Form, Image, Row } from "react-bootstrap";
import { Link, useNavigate, useParams } from "react-router-dom";
import { PRODUKCIJA, RouteNames } from "../../constants";
import VjezbacService from "../../services/VjezbacService";
import { useEffect, useState, useRef } from "react";
import useLoading from "../../hooks/useLoading";
import useError from '../../hooks/useError';
import Cropper from 'react-cropper';
import 'cropperjs/dist/cropper.css';
import nepoznato from '../../assets/nepoznato.jpg'; 

/**
 * VjezbaciPromjena
 * 
 * Komponenta za promjenu podataka vježbača:
 * - Ime, prezime, email
 * - Prikaz trenutne slike i omogućavanje upload/crop nove slike
 * - Spremanje promjena na server
 */
export default function VjezbaciPromjena() {

    const navigate = useNavigate();
    const routeParams = useParams();
    const { showLoading, hideLoading } = useLoading();
    const { prikaziError } = useError();

    const [vjezbac, setVjezbac] = useState({});
    const [trenutnaSlika, setTrenutnaSlika] = useState('');
    const [slikaZaCrop, setSlikaZaCrop] = useState('');
    const [slikaZaServer, setSlikaZaServer] = useState('');
    const cropperRef = useRef(null);

    /**
     * dohvatiVjezbac
     * 
     * Dohvaća podatke vježbača sa servera po šifri i postavlja trenutačnu sliku.
     */
    async function dohvatiVjezbac() {
        showLoading();
        const odgovor = await VjezbacService.getBySifra(routeParams.sifra);
        hideLoading();
        if (odgovor.greska) {
            prikaziError(odgovor.poruka);
            return;
        }
        setVjezbac(odgovor.poruka);
        setTrenutnaSlika(odgovor.poruka.slika 
            ? PRODUKCIJA + odgovor.poruka.slika + `?${Date.now()}`
            : nepoznato
        );
    }

    useEffect(() => {
        dohvatiVjezbac();
    }, []);

    /**
     * promjena
     * 
     * Sprema promjene imena, prezimena i emaila vježbača.
     */
    async function promjena(e) {
        showLoading();
        const odgovor = await VjezbacService.promjena(routeParams.sifra, e);
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
        promjena({
            ime: podaci.get('ime'),
            prezime: podaci.get('prezime'),
            email: podaci.get('email')
        });
    }

    /**
     * onChangeImage
     * 
     * Postavlja novu sliku za crop kada korisnik odabere datoteku.
     */
    function onChangeImage(e) {
        e.preventDefault();
        let files = e.dataTransfer ? e.dataTransfer.files : e.target.files;
        const reader = new FileReader();
        reader.onload = () => setSlikaZaCrop(reader.result);
        try { reader.readAsDataURL(files[0]); } 
        catch (error) { console.error(error); }
    }

    /**
     * onCrop
     * 
     * Ažurira sliku za server kada crop box promijeni položaj/veličinu.
     */
    function onCrop() {
        if (cropperRef.current) {
            setSlikaZaServer(cropperRef.current.cropper.getCroppedCanvas().toDataURL());
        }
    }

    /**
     * spremiSliku
     * 
     * Šalje izrezanu sliku u Base64 formatu na server i postavlja je kao trenutačnu.
     */
    async function spremiSliku() {
        showLoading();
        const base64 = slikaZaServer;
        const odgovor = await VjezbacService.postaviSliku(routeParams.sifra, {
            Base64: base64.replace('data:image/png;base64,', '')
        });
        hideLoading();
        if (odgovor.greska) {
            prikaziError(odgovor.podaci);
        } else {
            setTrenutnaSlika(slikaZaServer);
        }
    }

    return (
        <>
            Promjena Vježbača
            <Row>
                <Col key='1' sm={12} lg={6} md={6}>
                    <Form onSubmit={obradiSubmit}>
                        <Form.Group controlId="ime">
                            <Form.Label>Ime</Form.Label>
                            <Form.Control type="text" name="ime" required defaultValue={vjezbac.ime}/>
                        </Form.Group>

                        <Form.Group controlId="prezime">
                            <Form.Label>Prezime</Form.Label>
                            <Form.Control type="text" name="prezime" required defaultValue={vjezbac.prezime}/>
                        </Form.Group>

                        <Form.Group controlId="email">
                            <Form.Label>Email</Form.Label>
                            <Form.Control type="text" name="email" required defaultValue={vjezbac.email}/>
                        </Form.Group>

                        <Row className='mb-4'>
                            <Col key='1' sm={12} lg={6} md={12}>
                                <p className='form-label'>Trenutna slika</p>
                                <Image src={trenutnaSlika} className='slika'/>
                            </Col>
                            <Col key='2' sm={12} lg={6} md={12}>
                                {slikaZaServer && (
                                    <>
                                        <p className='form-label'>Nova slika</p>
                                        <Image src={slikaZaServer || slikaZaCrop} className='slika'/>
                                    </>
                                )}
                            </Col>
                        </Row>

                        <hr />
                        <Row>
                            <Col xs={6} sm={6} md={3} lg={6} xl={6} xxl={6}>
                                <Link to={RouteNames.VJEZBAC_PREGLED} className="btn btn-danger siroko">
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
                </Col>

                <Col key='2' sm={12} lg={6} md={6}>
                    <input className='mb-3' type='file' onChange={onChangeImage} />
                    <Button disabled={!slikaZaServer} onClick={spremiSliku}>
                        Spremi sliku
                    </Button>

                    <Cropper
                        src={slikaZaCrop}
                        style={{ height: 400, width: '100%' }}
                        initialAspectRatio={1}
                        guides={true}
                        viewMode={1}
                        minCropBoxWidth={50}
                        minCropBoxHeight={50}
                        cropBoxResizable={false}
                        background={false}
                        responsive={true}
                        checkOrientation={false}
                        cropstart={onCrop}
                        cropend={onCrop}
                        ref={cropperRef}
                    />
                </Col>
            </Row>
        </>
    )
}
