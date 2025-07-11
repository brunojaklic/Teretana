import 'bootstrap/dist/css/bootstrap.min.css'
import './App.css'
import { Container, Navbar } from 'react-bootstrap'
import NavbarEdunova from './components/NavBarEdunova'
import { Route, Routes } from 'react-router-dom'
import { RouteNames } from './constants'

function App() {


  return (
    <Container>
      <NavbarEdunova />

      <Routes>
        <Route path={RouteNames.HOME} element={<Pocetna />} />
      </Routes>

      Hello
    </Container>
  )
}

export default App
