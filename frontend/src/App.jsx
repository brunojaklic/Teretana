import 'bootstrap/dist/css/bootstrap.min.css'
import './App.css'
import { Container, Navbar } from 'react-bootstrap'
import NavbarEdunova from './components/NavBarEdunova'
import { Route, Routes } from 'react-router-dom'
import { RouteNames } from './constants'
import Pocetna from './pages/Pocetna'
import ProgramiPregled from './pages/programi/ProgramiPregled'

function App() {


  return (
    <Container>
      <NavbarEdunova />

      <Routes>
        <Route path={RouteNames.HOME} element={<Pocetna />} />

        <Route path={RouteNames.PROGRAM_PREGLED} element={<ProgramiPregled />} />
        
      </Routes>
      <hr />
      &copy; Bruno Jaklić

    </Container>
  )
}

export default App
