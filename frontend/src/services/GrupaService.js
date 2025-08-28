import { HttpService } from "./HttpService";

/**
 * Dohvaća sve grupe.
 * @returns {Promise<Array>} - Niz objekata grupa ili undefined u slučaju greške
 */
async function get(){
    return await HttpService.get('/Grupa')
    .then((odgovor)=>{
        return odgovor.data;
    })
    .catch((e)=>{console.error(e)});
}

/**
 * Dohvaća grupu prema šifri.
 * @param {number|string} sifra - Šifra grupe
 * @returns {Promise<Object>} - Objekt s informacijom o grešci i podatcima grupe
 */
async function getBySifra(sifra){
    return await HttpService.get('/Grupa/' + sifra)
    .then((odgovor)=>{
        return {greska: false, poruka: odgovor.data};
    })
    .catch(()=>{
        return {greska: true, poruka: 'Ne postoji Grupa!'};
    });
}

/**
 * Briše grupu prema šifri.
 * @param {number|string} sifra - Šifra grupe
 * @returns {Promise<Object>} - Objekt s informacijom o grešci i poruci
 */
async function obrisi(sifra) {
    return await HttpService.delete('/Grupa/' + sifra)
    .then((odgovor)=>{
        return {greska: false, poruka: odgovor.data};
    })
    .catch(()=>{
        return {greska: true, poruka: 'Grupa se ne može obrisati!'};
    });
}

/**
 * Dodaje novu grupu.
 * @param {Object} Grupa - Podaci nove grupe
 * @returns {Promise<Object>} - Objekt s informacijom o grešci i poruci
 */
async function dodaj(Grupa) {
    return await HttpService.post('/Grupa', Grupa)
    .then((odgovor)=>{
        return {greska: false, poruka: odgovor.data};
    })
    .catch((e)=>{
        switch (e.status) {
            case 400:
                let poruke='';
                for(const kljuc in e.response.data.errors){
                    poruke += kljuc + ': ' + e.response.data.errors[kljuc][0] + ', ';
                }
                return {greska: true, poruka: poruke};
            default:
                return {greska: true, poruka: 'Grupa se ne može dodati!'};
        }
    });
}

/**
 * Mijenja postojeću grupu prema šifri.
 * @param {number|string} sifra - Šifra grupe
 * @param {Object} Grupa - Podaci grupe za promjenu
 * @returns {Promise<Object>} - Objekt s informacijom o grešci i poruci
 */
async function promjena(sifra, Grupa) {
    return await HttpService.put('/Grupa/' + sifra, Grupa)
    .then((odgovor)=>{
        return {greska: false, poruka: odgovor.data};
    })
    .catch((e)=>{
        switch (e.status) {
            case 400:
                let poruke='';
                for(const kljuc in e.response.data.errors){
                    poruke += kljuc + ': ' + e.response.data.errors[kljuc][0] + ', ';
                }
                console.log(poruke);
                return {greska: true, poruka: poruke};
            default:
                return {greska: true, poruka: 'Grupa se ne može promjeniti!'};
        }
    });
}

/**
 * Dohvaća sve vježbače u grupi prema šifri grupe.
 * @param {number|string} sifra - Šifra grupe
 * @returns {Promise<Object>} - Objekt s informacijom o grešci i vježbačima
 */
async function getVjezbaci(sifra){
    return await HttpService.get('/Grupa/Vjezbaci/'+ sifra)
    .then((odgovor)=>{
        return {greska: false, poruka: odgovor.data};
    })
    .catch((e)=>{
        return {greska: true, poruka: 'Problem kod dohvaćanja vježbača'};
    });
}

/**
 * Dodaje vježbača u grupu.
 * @param {number|string} grupa - Šifra grupe
 * @param {number|string} vjezbac - Šifra vježbača
 * @returns {Promise<Object>} - Objekt s informacijom o grešci i poruci
 */
async function dodajVjezbaca(grupa, vjezbac) {
    return await HttpService.post('/Grupa/' + grupa + '/dodaj/' + vjezbac)
    .then((odgovor)=>{
        return {greska: false, poruka: odgovor.data};
    })
    .catch(()=>{
        return {greska: true, poruka: 'Vježbač se ne može dodati na grupu'};
    });
}

/**
 * Briše vježbača iz grupe.
 * @param {number|string} grupa - Šifra grupe
 * @param {number|string} vjezbac - Šifra vježbača
 * @returns {Promise<Object>} - Objekt s informacijom o grešci i poruci
 */
async function obrisiVjezbaca(grupa, vjezbac) {
    return await HttpService.delete('/Grupa/' + grupa + '/obrisi/' + vjezbac)
    .then((odgovor)=>{
        return {greska: false, poruka: odgovor.data};
    })
    .catch(()=>{
        return {greska: true, poruka: 'Vježbač se ne može obrisati iz grupe'};
    });
}

/**
 * Dohvaća podatke za grafički prikaz grupa.
 * @returns {Promise<Array>} - Niz objekata s podacima za graf
 */
async function grafGrupe(){
    return await HttpService.get('/Grupa/GrafGrupe')
    .then((odgovor)=>{
        return odgovor.data;
    })
    .catch((e)=>{console.error(e)});
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
