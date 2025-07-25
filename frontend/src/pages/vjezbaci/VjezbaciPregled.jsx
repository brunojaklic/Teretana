import { useEffect, useState } from "react";
import { Button, Container, Table } from "react-bootstrap";
import { IoIosAdd } from "react-icons/io";
import { FaEdit, FaTrash } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

import Service from "../../services/VjezbacService"; // primjetite promjenu naziva
import { RouteNames } from "../../constants";

export default function VjezbaciPregled(){
    const [vjezbaci,setVjezbaci] = useState();
    let navigate = useNavigate(); 

    async function dohvatiVjezbace(){
        await Service.get()
        .then((odgovor)=>{
            //console.log(odgovor);
            setVjezbaci(odgovor);
        })
        .catch((e)=>{console.log(e)});
    }

    async function obrisiVjezbaca(sifra) {
        const odgovor = await Service.obrisi(sifra);
        //console.log(odgovor);
        if(odgovor.greska){
            alert(odgovor.poruka);
            return;
        }
        dohvatiVjezbace();
    }

    useEffect(()=>{
        dohvatiVjezbace();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[]);


    return (

        <Container>
            <Link to={RouteNames.VJEZBAC_NOVI} className="btn btn-success siroko">
                <IoIosAdd
                size={25}
                /> Dodaj
            </Link>
            <Table striped bordered hover responsive>
                <thead>
                    <tr>
                        <th>Ime</th>
                        <th>Prezime</th>
                        <th>Kategorija</th>
                        <th>Email</th>
                    </tr>
                </thead>
                <tbody>
                    {vjezbaci && vjezbaci.map((entitet,index)=>(
                        <tr key={index}>
                            <td>{entitet.ime}</td>
                            <td>{entitet.prezime}</td>
                            <td>{entitet.kategorijaNaziv}</td>
                            <td>{entitet.email}</td>
                            <td className="sredina">
                                    <Button
                                        variant='primary'
                                        onClick={()=>{navigate(`/vjezbaci/${entitet.sifra}`)}}
                                    >
                                        <FaEdit 
                                    size={25}
                                    />
                                    </Button>
                               
                                
                                    &nbsp;&nbsp;&nbsp;
                                    <Button
                                        variant='danger'
                                        onClick={() => obrisiVjezbaca(entitet.sifra)}
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