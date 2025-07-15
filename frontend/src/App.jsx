import 'bootstrap/dist/css/bootstrap.min.css'
import './App.css'
import { Container, Navbar } from 'react-bootstrap'
import NavbarEdunova from './components/NavBarEdunova'
import { Route, Routes } from 'react-router-dom'
import { RouteNames } from './constants'
import Pocetna from './pages/Pocetna'
import ProgramiPregled from './pages/programi/ProgramiPregled'
import ProgramiDodaj from './pages/programi/ProgramiDodaj'

function App() {


  return (
    <Container>
      <NavbarEdunova />
      <Container className="app">
        <Routes>
          <Route path={RouteNames.HOME} element={<Pocetna />} />

          <Route path={RouteNames.PROGRAM_PREGLED} element={<ProgramiPregled />} />

          <Route path={RouteNames.PROGRAM_NOVI} element={<ProgramiDodaj />} />

        </Routes>
      </Container>
      <hr />
      &copy; Bruno Jaklić

    </Container>
  )
}

export default App
