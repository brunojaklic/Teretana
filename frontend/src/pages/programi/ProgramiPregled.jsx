import { useEffect, useState } from "react"
import ProgramService from "../../services/ProgramService"
import { Button, Table } from "react-bootstrap";
import { NumericFormat } from "react-number-format";
import moment from "moment";
import { GrValidate } from "react-icons/gr";
import { Link, useNavigate } from "react-router-dom";
import { RouteNames } from "../../constants";
import useLoading from "../../hooks/useLoading";
import useError from '../../hooks/useError';


export default function ProgramiPregled(){

    const navigate = useNavigate()
    const { showLoading, hideLoading } = useLoading();
    const { prikaziError } = useError();

    const[programi, setProgrami] = useState([]);

    async function dohvatiPrograme(){
        showLoading();
        const odgovor = await ProgramService.get();
        hideLoading();
        if(odgovor.greska){
            prikaziError(odgovor.poruka)
            return
        }
        setProgrami(odgovor.poruka)
    } 

    useEffect(()=>{
       dohvatiPrograme();
    },[])

    function aktivan(v){
        if(v==null) return 'gray'
        if(v) return 'green'
        return 'red'
    }

    function obrisi(sifra){
        if(!confirm('Sigurno obrisati')){
            return;
        }
        brisanjePrograma(sifra)
    }

    async function brisanjePrograma(sifra) {
        showLoading();
        const odgovor = await ProgramService.brisanje(sifra);
        hideLoading();
        if(odgovor.greska){
            prikaziError(odgovor.poruka)
            return
        }
        dohvatiPrograme();
    }


    return(
        <>
        <Link to={RouteNames.PROGRAM_NOVI}
        className="btn btn-success siroko">Dodaj novi program</Link>
        <Table striped bordered hover responsive>
            <thead>
                <tr>
                    <th>Naziv</th>
                    <th>Cijena</th>
                    <th>Aktivan</th>
                    <th>Akcija</th>
                </tr>
            </thead>
            <tbody>
                {programi && programi.map((program,index)=>(
                    <tr key={index}>
                        <td>
                            {program.naziv}
                        </td>
                        <td className={program.cijena==null ? 'sredina' : 'desno'}>

                             {program.cijena==null ? 'Nije definirano' : 
                             <NumericFormat 
                             value={program.cijena}
                             displayType={'text'}
                             thousandSeparator='.'
                             decimalSeparator=','
                             prefix={'€'}
                             decimalScale={2}
                             fixedDecimalScale
                             />
                             
                             }
                        </td>
                        <td className="sredina">
                            <GrValidate 
                            size={30}
                            color={aktivan(program.aktivan)}
                            />
                            
                        </td>
                        <td>
                            <Button
                            variant="danger"
                            onClick={()=>obrisi(program.sifra)}
                            >
                                Obriši
                            </Button>
                            &nbsp;&nbsp;&nbsp;
                            <Button
                            onClick={()=>navigate(`/programi/${program.sifra}`)}
                            >
                                Promjena
                            </Button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </Table>
        </>
    )
}