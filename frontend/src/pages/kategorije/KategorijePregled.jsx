import { useEffect, useState } from "react"
import KategorijaService from "../../services/KategorijaService"
import { Button, Table } from "react-bootstrap";
import { NumericFormat } from "react-number-format";
import moment from "moment";
import { GrValidate } from "react-icons/gr";
import { Link, useNavigate } from "react-router-dom";
import { RouteNames } from "../../constants";
import useLoading from "../../hooks/useLoading";
import useError from '../../hooks/useError';


export default function KategorijePregled(){

    const navigate = useNavigate()
    const { showLoading, hideLoading } = useLoading();
    const { prikaziError } = useError();

    const[kategorije, setKategorije] = useState();

    async function dohvatiKategorije(){
        showLoading();
        const odgovor = await KategorijaService.get();
        hideLoading();
        if(odgovor.greska){
            prikaziError(odgovor.poruka)
            return
        }
        setKategorije(odgovor.poruka)
    } 

    useEffect(()=>{
       dohvatiKategorije();
    },[])


    function obrisi(sifra){
        if(!confirm('Sigurno obrisati')){
            return;
        }
        brisanjeKategorije(sifra)
    }

    async function brisanjeKategorije(sifra) {
        showLoading();
        const odgovor = await KategorijaService.brisanje(sifra);
        hideLoading();
        if(odgovor.greska){
            prikaziError(odgovor.poruka)
            return
        }
        dohvatiKategorije();
    }


    return(
        <>
        <Link to={RouteNames.KATEGORIJA_NOVA}
        className="btn btn-success siroko">Dodaj novu kategoriju</Link>
        <Table striped bordered hover responsive>
            <thead>
                <tr>
                    <th>Naziv</th>
                    <th>Cijena</th>
                    <th>Akcija</th>
                </tr>
            </thead>
            <tbody>
                {kategorije && kategorije.map((kategorija,index)=>(
                    <tr key={index}>
                        <td>
                            {kategorija.naziv}
                        </td>
                        <td className={kategorija.cijena==null ? 'sredina' : 'desno'}>

                             {kategorija.cijena==null ? 'Nije definirano' : 
                             <NumericFormat 
                             value={kategorija.cijena}
                             displayType={'text'}
                             thousandSeparator='.'
                             decimalSeparator=','
                             prefix={'€'}
                             decimalScale={2}
                             fixedDecimalScale
                             />
                             
                             }
                        </td>
                        <td>
                            <Button
                            variant="danger"
                            onClick={()=>obrisi(kategorija.sifra)}
                            >
                                Obriši
                            </Button>
                            &nbsp;&nbsp;&nbsp;
                            <Button
                            onClick={()=>navigate(`/kategorije/${kategorija.sifra}`)}
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