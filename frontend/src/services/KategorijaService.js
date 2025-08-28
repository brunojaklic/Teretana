import { HttpService } from "./HttpService";

/**
 * Dohvaća sve kategorije.
 * @returns {Promise<{greska: boolean, poruka: any[]|string}>} - Lista kategorija ili poruka o grešci
 */
async function get() {
    return await HttpService.get('/Kategorija')
        .then((odgovor) => {
            return { greska: false, poruka: Array.isArray(odgovor.data) ? odgovor.data : [] }
        })
        .catch(() => {
            return { greska: true, poruka: 'Problem kod dohvaćanja kategorije' }
        });
}

/**
 * Briše kategoriju po šifri.
 * @param {number} sifra - Šifra kategorije za brisanje
 * @returns {Promise<{greska: boolean, poruka: string}>}
 */
async function brisanje(sifra) {
    return await HttpService.delete('/Kategorija/' + sifra)
        .then(() => {
            return { greska: false, poruka: 'Obrisano' }
        })
        .catch(() => {
            return { greska: true, poruka: 'Problem kod brisanja kategorije' }
        });
}

/**
 * Dodaje novu kategoriju.
 * @param {Object} kategorija - Objekt kategorije
 * @returns {Promise<{greska: boolean, poruka: any|string}>}
 */
async function dodaj(kategorija) {
    return await HttpService.post('/Kategorija', kategorija)
        .then((odgovor) => {
            return { greska: false, poruka: odgovor.data }
        })
        .catch((e) => {
            if (e.response && e.response.status === 400) {
                let poruke = '';
                for (const kljuc in e.response.data.errors) {
                    poruke += kljuc + ': ' + e.response.data.errors[kljuc][0] + '\n';
                }
                return { greska: true, poruka: poruke }
            }
            return { greska: true, poruka: 'Kategorija se ne može dodati!' }
        });
}

/**
 * Mijenja podatke kategorije po šifri.
 * @param {number} sifra - Šifra kategorije
 * @param {Object} kategorija - Podaci kategorije za promjenu
 * @returns {Promise<{greska: boolean, poruka: any|string}>}
 */
async function promjena(sifra, kategorija) {
    return await HttpService.put('/Kategorija/' + sifra, kategorija)
        .then((odgovor) => {
            return { greska: false, poruka: odgovor.data }
        })
        .catch((e) => {
            if (e.response && e.response.status === 400) {
                let poruke = '';
                for (const kljuc in e.response.data.errors) {
                    poruke += kljuc + ': ' + e.response.data.errors[kljuc][0] + '\n';
                }
                return { greska: true, poruka: poruke }
            }
            return { greska: true, poruka: 'Kategorija se ne može promjeniti!' }
        });
}

/**
 * Dohvaća kategoriju po šifri.
 * @param {number} sifra - Šifra kategorije
 * @returns {Promise<{greska: boolean, poruka: any|string}>}
 */
async function getBySifra(sifra) {
    return await HttpService.get('/Kategorija/' + sifra)
        .then((odgovor) => {
            return { greska: false, poruka: odgovor.data }
        })
        .catch(() => {
            return { greska: true, poruka: 'Problem kod dohvaćanja kategorije s šifrom ' + sifra }
        });
}

/**
 * Dohvaća sve vježbače unutar kategorije.
 * @param {number} sifra - Šifra kategorije
 * @returns {Promise<{greska: boolean, poruka: any[]|string}>}
 */
async function getVjezbaci(sifra){
    return await HttpService.get('/Kategorija/Vjezbaci/'+ sifra)
    .then((odgovor)=>{ return {greska: false, poruka: Array.isArray(odgovor.data) ? odgovor.data : []} })
    .catch(()=>{ return {greska: true, poruka: 'Problem kod dohvaćanja vježbača'} })
}

/**
 * Dodaje vježbača u kategoriju.
 * @param {number} kategorija - Šifra kategorije
 * @param {number} vjezbac - Šifra vježbača
 * @returns {Promise<{greska: boolean, poruka: any|string}>}
 */
async function dodajVjezbaca(kategorija, vjezbac) {
    return await HttpService.post('/Kategorija/' + kategorija + '/dodaj/' + vjezbac)
        .then((odgovor) => {
            return { greska: false, poruka: odgovor.data }
        })
        .catch(() => {
            return { greska: true, poruka: 'Vježbač se ne može dodati na kategoriju' }
        });
}

/**
 * Briše vježbača iz kategorije.
 * @param {number} kategorija - Šifra kategorije
 * @param {number} vjezbac - Šifra vježbača
 * @returns {Promise<{greska: boolean, poruka: any|string}>}
 */
async function obrisiVjezbaca(kategorija, vjezbac) {
    return await HttpService.delete('/Kategorija/' + kategorija + '/obrisi/' + vjezbac)
        .then((odgovor) => {
            return { greska: false, poruka: odgovor.data }
        })
        .catch(() => {
            return { greska: true, poruka: 'Vježbač se ne može obrisati iz kategorije' }
        });
}

export default {
    get,
    brisanje,
    dodaj,
    getBySifra,
    promjena,
    getVjezbaci,
    dodajVjezbaca,
    obrisiVjezbaca
}
