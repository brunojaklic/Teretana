import { HttpService } from "./HttpService";

/**
 * Dohvaća sve vježbače.
 * @returns {Promise<any[]>} - Lista vježbača
 */
async function get(){
    return await HttpService.get('/Vjezbac')
    .then((odgovor)=>{
        return odgovor.data;
    })
    .catch((e)=>{console.error(e)})
}

/**
 * Dohvaća vježbača po šifri.
 * @param {number} sifra - Šifra vježbača
 * @returns {Promise<{greska: boolean, poruka: any|string}>}
 */
async function getBySifra(sifra){
    return await HttpService.get('/Vjezbac/' + sifra)
    .then((odgovor)=>{
        return {greska: false, poruka: odgovor.data}
    })
    .catch(()=>{
        return {greska: true, poruka: 'Ne postoji Vježbač!'}
    })
}

/**
 * Briše vježbača po šifri.
 * @param {number} sifra - Šifra vježbača
 * @returns {Promise<{greska: boolean, poruka: any|string}>}
 */
async function obrisi(sifra) {
    return await HttpService.delete('/Vjezbac/' + sifra)
    .then((odgovor)=>{
        return {greska: false, poruka: odgovor.data}
    })
    .catch(()=>{
        return {greska: true, poruka: 'Vježbač se ne može obrisati!'}
    })
}

/**
 * Dodaje novog vježbača.
 * @param {Object} Vjezbac - Objekt vježbača
 * @returns {Promise<{greska: boolean, poruka: any|string}>}
 */
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

/**
 * Mijenja podatke vježbača po šifri.
 * @param {number} sifra - Šifra vježbača
 * @param {Object} Vjezbac - Objekt s podacima za promjenu
 * @returns {Promise<{greska: boolean, poruka: any|string}>}
 */
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

/**
 * Traži vježbače prema uvjetu.
 * @param {string} uvjet - Tekstualni uvjet za pretragu
 * @returns {Promise<{greska: boolean, poruka: any|string}>}
 */
async function traziVjezbac(uvjet){
    return await HttpService.get('/Vjezbac/trazi/'+uvjet)
    .then((odgovor)=>{
        return {greska: false, poruka: odgovor.data}
    })
    .catch(()=>{return {greska: true, poruka: 'Problem kod traženja vježbača'}})
}

/**
 * Dohvaća vježbače s paginacijom i uvjetom.
 * @param {number} stranica - Broj stranice
 * @param {string} uvjet - Tekstualni uvjet pretrage
 * @returns {Promise<{greska: boolean, poruka: any|string}>}
 */
async function getStranicenje(stranica,uvjet){
    return await HttpService.get('/Vjezbac/traziStranicenje/'+stranica + '?uvjet=' + uvjet)
    .then((odgovor)=>{return  {greska: false, poruka: odgovor.data};})
    .catch(()=>{ return {greska: true, poruka: 'Problem kod traženja vježbača '}} );
}

/**
 * Postavlja sliku vježbača.
 * @param {number} sifra - Šifra vježbača
 * @param {Object} slika - Objekt sa slikom u Base64 formatu
 * @returns {Promise<{greska: boolean, poruka: any|string}>}
 */
async function postaviSliku(sifra, slika) {
    return await HttpService.put('/Vjezbac/postaviSliku/' + sifra, slika)
    .then((odgovor)=>{return  {greska: false, poruka: odgovor.data};})
    .catch(()=>{ return {greska: true, poruka: 'Problem kod postavljanja slike vježbača '}} );
}

/**
 * Dohvaća ukupan broj vježbača.
 * @returns {Promise<number>}
 */
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
