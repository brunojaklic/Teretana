import { useEffect, useState } from "react";
import { Container, Table } from "react-bootstrap";
import ProgramService from "../../services/ProgramService";

export default function ProgramiPregled() {

    const [programi, setProgrami] = useState([]);



    async function dohvatiPrograme() {
        await ProgramService.get()
        const odgovor = await ProgramService.get()
        setProgrami(odgovor)
    }



    // hooks (kuka) se izvodi prilikom dolaska na stranicu Programi
    // ovo "glumi" konstruktor u OOP
    useEffect(() => {
        dohvatiPrograme()
    }, [])
    return (
        <>
            Pregled programa
            <Table striped bordered hover responsive>
                <thead>
                    <tr>
                        <th>Naziv</th>
                        <th>Cijena</th>
                        <th>Aktivan</th>
                    </tr>
                </thead>
                <tbody>
                    {programi && programi.map((program,index)=>(
                        <tr key={index}>
                            <td>{program.naziv}</td>
                            <td>{program.cijena}</td>
                            <td>{program.aktivan}</td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </>
    )
}
