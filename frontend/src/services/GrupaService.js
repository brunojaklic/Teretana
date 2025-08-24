import { HttpService } from "./HttpService"


async function get(){
    return await HttpService.get('/Grupa')
    .then((odgovor)=>{
        return odgovor.data;
    })
    .catch((e)=>{console.error(e)})
}

async function getBySifra(sifra){
    return await HttpService.get('/Grupa/' + sifra)
    .then((odgovor)=>{
        return {greska: false, poruka: odgovor.data}
    })
    .catch(()=>{
        return {greska: true, poruka: 'Ne postoji Grupa!'}
    })
}

async function obrisi(sifra) {
    return await HttpService.delete('/Grupa/' + sifra)
    .then((odgovor)=>{
        return {greska: false, poruka: odgovor.data}
    })
    .catch(()=>{
        return {greska: true, poruka: 'Grupa se ne može obrisati!'}
    })
}

async function dodaj(Grupa) {
    return await HttpService.post('/Grupa',Grupa)
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
                return {greska: true, poruka: 'Grupa se ne može dodati!'}
        }
    })
}

async function promjena(sifra,Grupa) {
    return await HttpService.put('/Grupa/' + sifra,Grupa)
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
                console.log(poruke)
                return {greska: true, poruka: poruke}
            default:
                return {greska: true, poruka: 'Grupa se ne može promjeniti!'}
        }
    })
}


async function getVjezbaci(sifra){
    return await HttpService.get('/Grupa/Vjezbaci/'+ sifra)
    .then((odgovor)=>{
        return {greska: false, poruka: odgovor.data}
    })
    .catch((e)=>{return {greska: true, poruka: 'Problem kod dohvaćanja vježbača'}})
}

async function dodajVjezbaca(grupa,vjezbac) {
    return await HttpService.post('/Grupa/' + grupa + '/dodaj/'+vjezbac)
    .then((odgovor)=>{
        return {greska: false, poruka: odgovor.data}
    })
    .catch((e)=>{
                return {greska: true, poruka: 'Vježbač se ne može dodati na grupu'}
    })
}

async function obrisiVjezbaca(grupa,vjezbac) {
    return await HttpService.delete('/Grupa/' + grupa + '/obrisi/'+vjezbac)
    .then((odgovor)=>{
        return {greska: false, poruka: odgovor.data}
    })
    .catch((e)=>{
                return {greska: true, poruka: 'Vježbač se ne može obrisati iz grupe'}
    })
}

async function grafGrupe(){
    return await HttpService.get('/Grupa/GrafGrupe')
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

    getVjezbaci,
    dodajVjezbaca,
    obrisiVjezbaca,

    grafGrupe
}