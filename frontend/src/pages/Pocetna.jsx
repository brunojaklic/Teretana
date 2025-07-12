import { Container } from "react-bootstrap";
import slika from '../assets/gym.png'

export default function Pocetna(){
    return(
        <>
        <img src={slika} style={{maxWidth:600, border: 2}}/>
        </>
    )
}