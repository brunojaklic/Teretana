
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { useNavigate } from 'react-router-dom';
import { PRODUKCIJA, RouteNames } from '../constants';

export default function NavBarEdunova(){

    const navigate = useNavigate(); // U pravilu ; ne treba

    function OpenSwaggerURL(){
        window.open(PRODUKCIJA + "/swagger/index.html", "_blank")
      }

    return(
        <>
            <Navbar expand="lg" className="bg-body-tertiary">
                <Navbar.Brand className='ruka'
                onClick={()=>navigate(RouteNames.HOME)}
                >Teretana APP</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                    
                    <NavDropdown title="Sadržaj" id="basic-nav-dropdown">
                        <NavDropdown.Item onClick={()=>navigate(RouteNames.PROGRAM_PREGLED)}>Programi</NavDropdown.Item>
                        <NavDropdown.Item onClick={()=>navigate(RouteNames.KATEGORIJA_PREGLED)}>Kategorije</NavDropdown.Item>
                        <NavDropdown.Item onClick={()=>navigate(RouteNames.GRUPA_PREGLED)}>Grupe</NavDropdown.Item>
                        <NavDropdown.Item onClick={()=>navigate(RouteNames.VJEZBAC_PREGLED)}>Vježbači</NavDropdown.Item>
                    </NavDropdown>
                    <Nav.Link  onClick={()=>OpenSwaggerURL()}>Swagger</Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </Navbar>
        </>
    )
}