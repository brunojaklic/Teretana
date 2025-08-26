import { Button, Card, Col, Form, Pagination, Row } from "react-bootstrap";
import VjezbacService from "../../services/VjezbacService";
import { useEffect, useState } from "react";
import { PRODUKCIJA, RouteNames } from "../../constants";
import { Link } from "react-router-dom";
import nepoznato from '../../assets/nepoznato.jpg'; 
import { IoIosAdd } from "react-icons/io";
import { FaEdit, FaTrash } from "react-icons/fa";
import useLoading from "../../hooks/useLoading";
import useError from '../../hooks/useError';



export default function VjezbaciPregled(){

    const[vjezbaci,setVjezbaci] = useState();
    const [stranica, setStranica] = useState(1);
    const [uvjet, setUvjet] = useState('');
    const { showLoading, hideLoading } = useLoading();
    const { prikaziError } = useError();



    async function dohvatiVjezbace() {
        showLoading();
        const odgovor = await VjezbacService.getStranicenje(stranica,uvjet);
        hideLoading();
        if(odgovor.greska){
            prikaziError(odgovor.poruka);
            
            return;
        }
        if(odgovor.poruka.length==0){
            setStranica(stranica-1);
            return;
        }
        setVjezbaci(odgovor.poruka);
    }

    useEffect(()=>{
        dohvatiVjezbace();
    },[stranica, uvjet]);

    async function obrisiAsync(sifra) {
        showLoading();
        const odgovor = await VjezbacService.obrisi(sifra);
        hideLoading();
        if(odgovor.greska){
            prikaziError(odgovor.poruka);
            return;
        }
        dohvatiVjezbace();
    }

    function obrisi(sifra){
        obrisiAsync(sifra);
    }

    function slika(vjezbac){
        if(vjezbac.slika!=null){
            return PRODUKCIJA + vjezbac.slika+ `?${Date.now()}`;
        }
        return nepoznato;
    }

    function promjeniUvjet(e) {
        if(e.nativeEvent.key == "Enter"){
            console.log('Enter')
            setStranica(1);
            setUvjet(e.nativeEvent.srcElement.value);
            setVjezbaci([]);
        }
    }

    function povecajStranicu() {
        setStranica(stranica + 1);
      }
    
      function smanjiStranicu() {
        if(stranica==1){
            return;
        }
        setStranica(stranica - 1);
      }


    return(
        <>
           <Row>
                <Col key={1} sm={12} lg={4} md={4}>
                    <Form.Control
                    type='text'
                    name='trazilica'
                    placeholder='Dio imena i prezimena [Enter]'
                    maxLength={255}
                    defaultValue=''
                    onKeyUp={promjeniUvjet}
                    />
                </Col>
                <Col key={2} sm={12} lg={4} md={4}>
                    {vjezbaci && vjezbaci.length > 0 && (
                            <div style={{ display: "flex", justifyContent: "center" }}>
                                <Pagination size="lg">
                                <Pagination.Prev onClick={smanjiStranicu} />
                                <Pagination.Item disabled>{stranica}</Pagination.Item> 
                                <Pagination.Next
                                    onClick={povecajStranicu}
                                />
                            </Pagination>
                        </div>
                    )}
                </Col>
                <Col key={3} sm={12} lg={4} md={4}>
                    <Link to={RouteNames.VJEZBAC_NOVI} className="btn btn-success gumb">
                        <IoIosAdd
                        size={25}
                        /> Dodaj
                    </Link>
                </Col>
            </Row>
            
                
            <Row>
                
            { vjezbaci && vjezbaci.map((p) => (
           
           <Col key={p.sifra} sm={12} lg={3} md={3}>
              <Card style={{ marginTop: '1rem' }}>
              <Card.Img variant="top" src={slika(p)} className="slika"/>
                <Card.Body>
                  <Card.Title>{p.ime} {p.prezime}</Card.Title>
                  <Card.Text>
                    {p.email}
                  </Card.Text>
                  <Row>
                      <Col>
                      <Link className="btn btn-primary gumb" to={`/vjezbaci/${p.sifra}`}><FaEdit /></Link>
                      </Col>
                      <Col>
                      <Button variant="danger" className="gumb"  onClick={() => obrisi(p.sifra)}><FaTrash /></Button>
                      </Col>
                    </Row>
                </Card.Body>
              </Card>
            </Col>
          ))
      }
      </Row>
      <hr />
              {vjezbaci && vjezbaci.length > 0 && (
                <div style={{ display: "flex", justifyContent: "center" }}>
                    <Pagination size="lg">
                    <Pagination.Prev onClick={smanjiStranicu} />
                    <Pagination.Item disabled>{stranica}</Pagination.Item> 
                    <Pagination.Next
                        onClick={povecajStranicu}
                    />
                    </Pagination>
                </div>
                )}
        </>
    )

}