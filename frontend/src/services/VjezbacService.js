import { HttpService } from "./HttpService"


async function get(){
    return await HttpService.get('/Vjezbac')
    .then((odgovor)=>{
        //console.table(odgovor.data);
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
        //console.log(odgovor);
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
                    poruke += kljuc + ': ' + e.response.data.errors[kljuc][0] + '\n';
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
                    poruke += kljuc + ': ' + e.response.data.errors[kljuc][0] + '\n';
                }
                return {greska: true, poruka: poruke}
            default:
                return {greska: true, poruka: 'Vježbač se ne može promjeniti!'}
        }
    })
}

export default{
    get,
    getBySifra,
    obrisi,
    dodaj,
    promjena
}