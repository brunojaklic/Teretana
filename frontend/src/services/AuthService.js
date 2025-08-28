import { HttpService } from './HttpService';

/**
 * Funkcija koja obavlja proces prijave korisnika.
 * 
 * @param {Object} podaci - Podaci za prijavu (npr. email i lozinka).
 * @returns {Promise<Object>} - Objekt s informacijom o grešci i porukom:
 *    - greska {boolean} - true ako je došlo do pogreške, false inače
 *    - poruka {any|string} - odgovor servera ili poruka o grešci
 */
export async function logInService(podaci) {
  return await HttpService
    .post('/Autorizacija/token', podaci)
    .then((odgovor) => {
      return { greska: false, poruka: odgovor.data };
    })
    .catch((e) => {
      return { greska: true, poruka: 'Problem kod autorizacije' };
    });
}
