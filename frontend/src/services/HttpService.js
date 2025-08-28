import axios from "axios";
import { PRODUKCIJA } from "../constants";

/**
 * HttpService - konfigurirana instanca axios-a za komunikaciju s API-em.
 * 
 * Koristi se za sve HTTP zahtjeve prema backendu aplikacije.
 * Base URL je postavljen prema konstantama, a svi zahtjevi imaju Content-Type: application/json.
 */
export const HttpService = axios.create({
    baseURL: PRODUKCIJA + '/api/v1',
    headers:{
        'Content-Type': 'application/json'
    }
});

/**
 * Interceptor za zahtjeve
 * 
 * Automatski dodaje Authorization header sa Bearer tokenom iz localStorage-a
 * prije svakog slanja zahtjeva.
 */
HttpService.interceptors.request.use((config) => {
    config.headers.Authorization = 'Bearer ' + localStorage.getItem('Bearer');
    return config;
});

/**
 * Interceptor za odgovore
 * 
 * Globalno obrađuje HTTP odgovore. 
 * Ako server vrati 401 (Unauthorized), token se briše iz localStorage-a
 * i korisnik se preusmjerava na login stranicu.
 * 
 * @param {Object} response - Odgovor servera
 * @param {Object} error - Greška ako zahtjev nije uspješan
 * @returns {Promise} - Vraća response ili odbija Promise u slučaju greške
 */
HttpService.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response.status === 401) {
            localStorage.setItem('Bearer', '');
            window.location.href = '/';
        }
        return Promise.reject(error);
    }
);
