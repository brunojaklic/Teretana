import { HttpService } from "./HttpService"


async function get(){
    return await HttpService.get('/Vjezbac')
    .then((odgovor)=>{
        return odgovor.data;
    })
    .catch((e)=>{console.error(e)})
}

async function getBySifra(sifra){
    return await HttpService.get('/Vjezbac/' + sifra)
    .then((odgovor)=>{
        return {greska: false, poruka: odgovor.data}
    })
    .catch(()=>{
        return {greska: true, poruka: 'Ne postoji Vježbač!'}
    })
}

async function obrisi(sifra) {
    return await HttpService.delete('/Vjezbac/' + sifra)
    .then((odgovor)=>{
        return {greska: false, poruka: odgovor.data}
    })
    .catch(()=>{
        return {greska: true, poruka: 'Vježbač se ne može obrisati!'}
    })
}

async function dodaj(Vjezbac) {
    return await HttpService.post('/Vjezbac',Vjezbac)
    .then((odgovor)=>{
        return {greska: false, poruka: odgovor.data}
    })
    .catch((e)=>{
        switch (e.status) {
            case 400:
                let poruke='';
                for(const kljuc in e.response.data.errors){
                    poruke += kljuc + ': ' + e.response.data.errors[kljuc][0] + ', ';
                }
                return {greska: true, poruka: poruke}
            default:
                return {greska: true, poruka: 'Vježbač se ne može dodati!'}
        }
    })
}

async function promjena(sifra,Vjezbac) {
    return await HttpService.put('/Vjezbac/' + sifra,Vjezbac)
    .then((odgovor)=>{
        return {greska: false, poruka: odgovor.data}
    })
    .catch((e)=>{
        switch (e.status) {
            case 400:
                let poruke='';
                for(const kljuc in e.response.data.errors){
                    poruke += kljuc + ': ' + e.response.data.errors[kljuc][0] + ', ';
                }
                return {greska: true, poruka: poruke}
            default:
                return {greska: true, poruka: 'Vježbač se ne može promjeniti!'}
        }
    })
}

async function traziVjezbac(uvjet){
    return await HttpService.get('/Vjezbac/trazi/'+uvjet)
    .then((odgovor)=>{
        return {greska: false, poruka: odgovor.data}
    })
    .catch((e)=>{return {greska: true, poruka: 'Problem kod traženja vježbača'}})
}

async function getStranicenje(stranica,uvjet){
    return await HttpService.get('/Vjezbac/traziStranicenje/'+stranica + '?uvjet=' + uvjet)
    .then((odgovor)=>{return  {greska: false, poruka: odgovor.data};})
    .catch((e)=>{ return {greska: true, poruka: 'Problem kod traženja vježbača '}});
  }

  async function postaviSliku(sifra, slika) {
    return await HttpService.put('/Vjezbac/postaviSliku/' + sifra, slika)
    .then((odgovor)=>{return  {greska: false, poruka: odgovor.data};})
    .catch((e)=>{ return {greska: true, poruka: 'Problem kod postavljanja slike vježbača '}});
  }

  async function ukupnoVjezbaca(){
    return await HttpService.get('/Pocetna/UkupnoVjezbaca')
    .then((odgovor)=>{
        return odgovor.data;
    })
    .catch((e)=>{console.error(e)})
}



export default{
    get,
    getBySifra,
    obrisi,
    dodaj,
    promjena,
    traziVjezbac,
    getStranicenje,
    postaviSliku,
    ukupnoVjezbaca
}