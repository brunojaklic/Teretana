import { useEffect, useState } from "react";
import { Button, Container, Table } from "react-bootstrap";
import { IoIosAdd } from "react-icons/io";
import { FaEdit, FaTrash } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

import Service from "../../services/GrupaService";
import { RouteNames } from "../../constants";

export default function GrupePregled(){
    const [grupe,setGrupe] = useState();
    let navigate = useNavigate(); 

    async function dohvatiGrupe(){
        await Service.get()
        .then((odgovor)=>{
            setGrupe(odgovor);
        })
        .catch((e)=>{console.log(e)});
    }

    async function obrisiGrupu(sifra) {
        const odgovor = await Service.obrisi(sifra);
        if(odgovor.greska){
            alert(odgovor.poruka);
            return;
        }
        dohvatiGrupe();
    }

    useEffect(()=>{
        dohvatiGrupe();
    },[]);


    return (

        <Container>
            <Link to={RouteNames.GRUPA_NOVI} className="btn btn-success siroko">
                <IoIosAdd
                size={25}
                /> Dodaj
            </Link>
            <Table striped bordered hover responsive>
                <thead>
                    <tr>
                        <th>Naziv</th>
                        <th>Program</th>
                        <th>Trener</th>
                        <th>Akcija</th>
                    </tr>
                </thead>
                <tbody>
                    {grupe && grupe.map((entitet,index)=>(
                        <tr key={index}>
                            <td>{entitet.naziv}</td>
                            <td>{entitet.programNaziv}</td>
                            <td>{entitet.trener}</td>
                            <td className="sredina">
                                    <Button
                                        variant='primary'
                                        onClick={()=>{navigate(`/grupe/${entitet.sifra}`)}}
                                    >
                                        <FaEdit 
                                    size={25}
                                    />
                                    </Button>
                               
                                
                                    &nbsp;&nbsp;&nbsp;
                                    <Button
                                        variant='danger'
                                        onClick={() => obrisiGrupu(entitet.sifra)}
                                    >
                                        <FaTrash
                                        size={25}/>
                                    </Button>

                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </Container>

    );

}