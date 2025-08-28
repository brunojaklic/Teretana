import 'bootstrap/dist/css/bootstrap.min.css'
import './App.css'
import { Container, Navbar } from 'react-bootstrap'
import { Route, Routes } from 'react-router-dom'
import { RouteNames } from './constants'
import NavBarEdunova from './components/NavBarEdunova'
import Pocetna from './pages/Pocetna'
import ProgramiPregled from './pages/programi/ProgramiPregled'
import ProgramiDodaj from './pages/programi/ProgramiDodaj'
import ProgramiPromjena from './pages/programi/ProgramiPromjena'
import KategorijePregled from './pages/kategorije/KategorijePregled';
import KategorijeDodaj from './pages/kategorije/KategorijeDodaj';
import KategorijePromjena from './pages/kategorije/KategorijePromjena';
import GrupePregled from './pages/grupe/GrupePregled';
import GrupeDodaj from './pages/grupe/GrupeDodaj';
import GrupePromjena from './pages/grupe/GrupePromjena';
import VjezbaciPregled from './pages/vjezbaci/VjezbaciPregled';
import VjezbaciDodaj from './pages/vjezbaci/VjezbaciDodaj';
import VjezbaciPromjena from './pages/vjezbaci/VjezbaciPromjena';

import LoadingSpinner from './components/LoadingSpinner'
import Login from "./pages/Login"
import useAuth from "./hooks/useAuth"
import NadzornaPloca from './pages/NadzornaPloca'
import useError from "./hooks/useError"
import ErrorModal from "./components/ErrorModal"
import EraDijagram from './pages/EraDiagram'

/**
 * Glavna komponenta aplikacije koja postavlja navigaciju, rute i opći layout.
 * @component
 * @returns {JSX.Element} - Glavna aplikacija s navigacijom, rutama i footerom
 */
function App() {

  const { isLoggedIn } = useAuth();
  const { errors, prikaziErrorModal, sakrijError } = useError();

  /**
   * Funkcija za prikaz trenutne godine ili raspona godina.
   * @returns {string|number} - Ako je trenutna godina jednaka 2025, vraća samo godinu,
   * inače vraća raspon "2025 - trenutna godina"
   */
  function godina(){
    const pocenta = 2025;
    const trenutna = new Date().getFullYear();
    if(pocenta===trenutna){
      return trenutna;
    }
    return pocenta + ' - ' + trenutna;
  }
  
  return (
    <>
      {/* Komponenta za prikaz globalnog učitavanja */}
      <LoadingSpinner />
      
      {/* Modal za prikaz svih grešaka */}
      <ErrorModal show={prikaziErrorModal} errors={errors} onHide={sakrijError} />
      
      <Container className='aplikacija'>
        {/* Navigacijska traka */}
        <NavBarEdunova />

        {/* Definicija svih ruta aplikacije */}
        <Routes>
          {/* Početna stranica dostupna svima */}
          <Route path={RouteNames.HOME} element={<Pocetna />} />
          
          {isLoggedIn ? (
            <>
              {/* Rute dostupne samo prijavljenim korisnicima */}
              <Route path={RouteNames.NADZORNA_PLOCA} element={<NadzornaPloca />} />

              {/* Programi */}
              <Route path={RouteNames.PROGRAM_PREGLED} element={<ProgramiPregled />} />
              <Route path={RouteNames.PROGRAM_NOVI} element={<ProgramiDodaj />} />
              <Route path={RouteNames.PROGRAM_PROMJENA} element={<ProgramiPromjena />} />

              {/* Kategorije */}
              <Route path={RouteNames.KATEGORIJA_PREGLED} element={<KategorijePregled />} />
              <Route path={RouteNames.KATEGORIJA_NOVA} element={<KategorijeDodaj />} />
              <Route path={RouteNames.KATEGORIJA_PROMJENA} element={<KategorijePromjena />} />

              {/* Grupe */}
              <Route path={RouteNames.GRUPA_PREGLED} element={<GrupePregled />} />
              <Route path={RouteNames.GRUPA_NOVI} element={<GrupeDodaj />} />
              <Route path={RouteNames.GRUPA_PROMJENA} element={<GrupePromjena />} />

              {/* Vježbači */}
              <Route path={RouteNames.VJEZBAC_PREGLED} element={<VjezbaciPregled />} />
              <Route path={RouteNames.VJEZBAC_NOVI} element={<VjezbaciDodaj />} />
              <Route path={RouteNames.VJEZBAC_PROMJENA} element={<VjezbaciPromjena />} />

              {/* ERA dijagram */}
              <Route path={RouteNames.ERA} element={<EraDijagram />} /> 
            </>
          ) : (
            <>
              {/* Ruta za login neprijavljenih korisnika */}
              <Route path={RouteNames.LOGIN} element={<Login />} />
            </>
          )}
        </Routes>
      </Container>

      {/* Footer sa godinom i imenom autora */}
      <Container>
        <hr />
        Bruno Jaklić &copy; {godina()}
      </Container>
    </>
  )
}

export default App
