import { useEffect, useState } from "react";
import {  Col, Row } from "react-bootstrap";
import ProgramService from "../services/ProgramService";
import VjezbacService from "../services/VjezbacService";
import useLoading from "../hooks/useLoading";
import CountUp from "react-countup";


export default function Pocetna(){

    const { showLoading, hideLoading } = useLoading();

    const [vjezbaca, setVjezbaca] = useState(0);
    const [programi, setProgrami] = useState([]);

    async function dohvatiPrograme() {
        
        await ProgramService.dostupniProgrami()
        .then((odgovor)=>{
            setProgrami(odgovor);
        })
        .catch((e)=>{console.log(e)});

    }

    async function dohvatiBrojVjezbaca() {
        await VjezbacService.ukupnoVjezbaca()
        .then((odgovor)=>{
            setVjezbaca(odgovor.poruka);
        })
        .catch((e)=>{console.log(e)});
    }


    async function ucitajPodatke() {
        showLoading();
        await dohvatiPrograme();
        await dohvatiBrojVjezbaca();
        hideLoading();
      }


    useEffect(()=>{
        ucitajPodatke()
    },[]);

   

    return(
        <>
        <Row>
           
                    <Col xs={6} sm={6} md={3} lg={6} xl={6} xxl={6}>
                    Naši programi:
                    <ul>
                    {programi && programi.map((program,index)=>(
                            <li key={index}>{program.naziv}</li>
                            
                    ))}
                    </ul>
                    </Col>
                    <Col xs={6} sm={6} md={9} lg={6} xl={6} xxl={6}>
                    Do sada nam je povjerenje pokazalo
                    <div className="brojVjezbaca">
                    <CountUp
                    start={0}
                    end={vjezbaca}
                    duration={10}
                    separator="."></CountUp>
                    </div>
                    vježbača
                    </Col>
                </Row>
            </>
    )
}