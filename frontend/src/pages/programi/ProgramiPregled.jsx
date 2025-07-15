import { useEffect, useState } from "react";
import { Container, Table } from "react-bootstrap";
import ProgramService from "../../services/ProgramService";
import { NumericFormat } from "react-number-format";
import { GrStatusGood, GrStatusCritical } from "react-icons/gr";
import { Link } from "react-router-dom";
import { RouteNames } from "../../constants";

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

            <Link
                className="btn btn-success"
                to={RouteNames.PROGRAM_NOVI} >
                Dodavanje novog programa
            </Link>

            <Table striped bordered hover responsive>
                <thead>
                    <tr>
                        <th>Naziv</th>
                        <th>Cijena</th>
                        <th>Aktivan</th>
                    </tr>
                </thead>
                <tbody>
                    {programi && programi.map((program, index) => (
                        <tr key={index}>
                            <td>{program.naziv}</td>
                            <td className="desno">
                                <NumericFormat
                                    value={program.cijena}
                                    displayType={'text'}
                                    thousandSeparator='.'
                                    decimalSeparator=','
                                    fixedDecimalScale={true}
                                    decimalScale={2}
                                    suffix='€'
                                />
                            </td>
                            <td className="sredina">
                                {program.aktivan ? (
                                    <GrStatusGood
                                        size={30}
                                        color="green"
                                        title="DA"
                                    />
                                ) : (
                                    <GrStatusCritical
                                        size={30}
                                        color="red"
                                        title="NE"
                                    />
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </>
    )
}
