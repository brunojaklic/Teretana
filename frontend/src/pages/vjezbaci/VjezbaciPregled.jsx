import { Button, Table } from "react-bootstrap";
import VjezbacService from "../../services/VjezbacService";
import { useEffect, useState } from "react";
import { RouteNames } from "../../constants";
import { Link, useNavigate } from "react-router-dom";



export default function VjezbaciPregled(){

    const[vjezbaci,setVjezbaci] = useState();

    const navigate = useNavigate();

    async function dohvatiVjezbace() {

        // zaustavi kod u Chrome consoli i tamo se može raditi debug
        //debugger;
        
        await VjezbacService.get()
        .then((odgovor)=>{
            //console.log(odgovor);
            setVjezbaci(odgovor);
        })
        .catch((e)=>{console.log(e)});

    }

    // npm run lint
    // javlja upozorenje
    // 28:7  warning  React Hook useEffect has a missing dependency: 'dohvatie'. Either include it or remove the dependency array  react-hooks/exhaustive-deps

    useEffect(()=>{
        dohvatiVjezbace();
    },[]);

   

    async function obrisiAsync(sifra) {
        const odgovor = await VjezbacService.obrisi(sifra);
        //console.log(odgovor);
        if(odgovor.greska){
            alert(odgovor.poruka);
            return;
        }
        dohvatiVjezbace();
    }

    function obrisi(sifra){
        obrisiAsync(sifra);
    }


    return(
        <>
            <Link to={RouteNames.VJEZBAC_NOVI}>Dodaj novog vježbača</Link>
            <Table striped bordered hover responsive>
                <thead>
                    <tr>
                        <th>Ime</th>
                        <th>Prezime</th>
                        <th>Email</th>
                        <th>Akcija</th>
                    </tr>
                </thead>
                <tbody>
                    {vjezbaci && vjezbaci.map((e,index)=>(
                        <tr key={index}>
                            <td>{e.ime}</td>
                            <td>{e.prezime}</td>
                            <td>{e.email}</td>
                           
                            <td>
                            <Button
                                variant="primary"
                                onClick={()=>navigate(`/vjezbaci/${e.sifra}`)}>
                                    Promjeni
                                </Button>
                                &nbsp;&nbsp;&nbsp;
                                <Button
                                variant="danger"
                                onClick={()=>obrisi(e.sifra)}>
                                    Obriši
                                </Button>

                               
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </>
    )

}