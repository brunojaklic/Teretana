export default function Pocetna(){
    const { showLoading, hideLoading } = useLoading();

    const [vjezbaca, setVjezbaca] = useState(0); // Broj vježbača
    const [programi, setProgrami] = useState([]); // Lista programa

    // Dohvaća dostupne programe i sprema ih u state
    async function dohvatiPrograme() {
        await ProgramService.dostupniProgrami()
        .then((odgovor)=>{
            setProgrami(odgovor); // Postavljanje programa
        })
        .catch((e)=>{console.log(e)}); // Logiranje greške
    }

    // Dohvaća ukupni broj vježbača i sprema u state
    async function dohvatiBrojVjezbaca() {
        await VjezbacService.ukupnoVjezbaca()
        .then((odgovor)=>{
            setVjezbaca(odgovor.poruka);
        })
        .catch((e)=>{console.log(e)}); // Logiranje greške
    }

    // Funkcija koja učitava sve potrebne podatke
    async function ucitajPodatke() {
        showLoading(); // Prikaz loadera
        await dohvatiPrograme();
        await dohvatiBrojVjezbaca();
        hideLoading(); // Sakrivanje loadera
    }

    // Pozivanje ucitavanja podataka pri mountanju komponente
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
                        end={vjezbaca} // Animacija od 0 do broja vježbača
                        duration={10}
                        separator="."
                    />
                </div>
                vježbača
            </Col>
        </Row>
        </>
    )
}
