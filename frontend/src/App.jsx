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


function App() {

  const { isLoggedIn } = useAuth();
  const { errors, prikaziErrorModal, sakrijError } = useError();

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
      <LoadingSpinner />
      <ErrorModal show={prikaziErrorModal} errors={errors} onHide={sakrijError} />
      <Container className='aplikacija'>
        <NavBarEdunova />
        <Routes>
          <Route path={RouteNames.HOME} element={<Pocetna />} />
          {isLoggedIn ? (
        <>
        <Route path={RouteNames.NADZORNA_PLOCA} element={<NadzornaPloca />} />

          <Route path={RouteNames.PROGRAM_PREGLED} element={<ProgramiPregled />} />
          <Route path={RouteNames.PROGRAM_NOVI} element={<ProgramiDodaj />} />
          <Route path={RouteNames.PROGRAM_PROMJENA} element={<ProgramiPromjena />} />

          <Route path={RouteNames.KATEGORIJA_PREGLED} element={<KategorijePregled />} />
          <Route path={RouteNames.KATEGORIJA_NOVA} element={<KategorijeDodaj />} />
          <Route path={RouteNames.KATEGORIJA_PROMJENA} element={<KategorijePromjena />} />

          <Route path={RouteNames.GRUPA_PREGLED} element={<GrupePregled />} />
          <Route path={RouteNames.GRUPA_NOVI} element={<GrupeDodaj />} />
          <Route path={RouteNames.GRUPA_PROMJENA} element={<GrupePromjena />} />

          <Route path={RouteNames.VJEZBAC_PREGLED} element={<VjezbaciPregled />} />
          <Route path={RouteNames.VJEZBAC_NOVI} element={<VjezbaciDodaj />} />
          <Route path={RouteNames.VJEZBAC_PROMJENA} element={<VjezbaciPromjena />} />


          <Route path={RouteNames.ERA} element={<EraDijagram />} /> 
          </>
        ) : (
          <>
            <Route path={RouteNames.LOGIN} element={<Login />} />
          </>
        )}
        </Routes>
      </Container>
      <Container>
        <hr />
        Bruno Jaklić &copy; {godina()}
      </Container>
    </>
  )
}

export default App