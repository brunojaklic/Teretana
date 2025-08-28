import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { RouteNames, PRODUKCIJA } from '../constants';
import { useNavigate } from 'react-router-dom';

import useAuth from '../hooks/useAuth';

/**
 * NavBarEdunova
 * 
 * Komponenta koja prikazuje navigacijsku traku aplikacije.
 * - Prikazuje različite linkove ovisno o tome je li korisnik prijavljen.
 * - Koristi hook `useAuth` za pristup funkcijama autentifikacije i statusu prijave.
 * - Omogućava navigaciju kroz aplikaciju koristeći `useNavigate`.
 * - Omogućava otvaranje Swagger dokumentacije u novom prozoru.
 */
export default function NavBarEdunova() {
    const navigate = useNavigate();
    const { logout, isLoggedIn } = useAuth();

    /**
     * OpenSwaggerURL
     * 
     * Funkcija koja otvara Swagger dokumentaciju aplikacije u novom prozoru/tabu.
     */
    function OpenSwaggerURL() {
        window.open(PRODUKCIJA + "/swagger/index.html", "_blank")
    }

    return (
        <Navbar expand="lg" className="bg-body-tertiary">
            <Navbar.Brand href="/">Teretana APP</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="me-auto">

                    {isLoggedIn ? (
                        <>
                            <Nav.Link onClick={() => navigate(RouteNames.NADZORNA_PLOCA)}>Nadzorna ploča</Nav.Link>

                            <NavDropdown title="Sadržaj" id="basic-nav-dropdown">
                                <NavDropdown.Item onClick={() => navigate(RouteNames.PROGRAM_PREGLED)}>Programi</NavDropdown.Item>
                                <NavDropdown.Item onClick={() => navigate(RouteNames.KATEGORIJA_PREGLED)}>Kategorije</NavDropdown.Item>
                                <NavDropdown.Item onClick={() => navigate(RouteNames.GRUPA_PREGLED)}>Grupe</NavDropdown.Item>
                                <NavDropdown.Item onClick={() => navigate(RouteNames.VJEZBAC_PREGLED)}>Vježbači</NavDropdown.Item>
                            </NavDropdown>
                                
                            <Nav.Link onClick={() => OpenSwaggerURL()}>Swagger</Nav.Link>
                            <Nav.Link onClick={() => navigate(RouteNames.ERA)}>ERA dijagram</Nav.Link>
                            <Nav.Link onClick={logout}>Odjava</Nav.Link>
                        </>
                    ) : (
                        <Nav.Link onClick={() => navigate(RouteNames.LOGIN)}>
                            Prijava
                        </Nav.Link>
                    )}
                </Nav>
            </Navbar.Collapse>
        </Navbar>
    );
}
