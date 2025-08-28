import { HttpService } from "./HttpService";

/**
 * Dohvaća sve programe.
 * @returns {Promise<{greska: boolean, poruka: any[]|string}>} - Lista programa ili poruka o grešci
 */
async function get(){
    return await HttpService.get('/Program')
    .then((odgovor)=>{
        return {greska: false, poruka: odgovor.data}
    })
    .catch(()=>{
        return {greska: true, poruka: 'Problem kod dohvaćanja programa'}   
    })
}

/**
 * Briše program po šifri.
 * @param {number} sifra - Šifra programa za brisanje
 * @returns {Promise<{greska: boolean, poruka: string}>}
 */
async function brisanje(sifra){
    return await HttpService.delete('/Program/' + sifra)
    .then(()=>{
        return {greska: false, poruka: 'Obrisano'}
    })
    .catch(()=>{
        return {greska: true, poruka: 'Problem kod brisanja programa'}   
    })
}

/**
 * Dodaje novi program.
 * @param {Object} program - Objekt programa
 * @returns {Promise<{greska: boolean, poruka: any|string}>}
 */
async function dodaj(program){
    return await HttpService.post('/Program',program)
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
                return {greska: true, poruka: 'Program se ne može dodati!'}
        }
    })
}

/**
 * Mijenja program po šifri.
 * @param {number} sifra - Šifra programa
 * @param {Object} program - Podaci programa za promjenu
 * @returns {Promise<{greska: boolean, poruka: any|string}>}
 */
async function promjena(sifra,program){
    return await HttpService.put('/Program/' + sifra,program)
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
                return {greska: true, poruka: 'Program se ne može promjeniti!'}
        }
    })
}

/**
 * Dohvaća program po šifri.
 * @param {number} sifra - Šifra programa
 * @returns {Promise<{greska: boolean, poruka: any|string}>}
 */
async function getBySifra(sifra){
    return await HttpService.get('/Program/'+sifra)
    .then((odgovor)=>{
        return {greska: false, poruka: odgovor.data}
    })
    .catch(()=>{
        return {greska: true, poruka: 'Problem kod dohvaćanja programa s šifrom '+sifra}   
    })
}

/**
 * Dohvaća dostupne programe za prikaz na početnoj stranici.
 * @returns {Promise<any[]>} - Lista dostupnih programa
 */
async function dostupniProgrami(){
    return await HttpService.get('/Pocetna/DostupniProgrami')
    .then((odgovor)=>{
        return odgovor.data;
    })
    .catch((e)=>{console.error(e)})
}

export default {
    get,
    brisanje,
    dodaj,
    getBySifra,
    promjena,
    dostupniProgrami
}
