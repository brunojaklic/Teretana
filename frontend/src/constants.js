/**
 * Objekt koji sadrži sve nazive ruta u aplikaciji.
 * Svaka ruta se koristi za navigaciju u React Routeru.
 * @constant {Object}
 */
export const RouteNames = {
    /** Početna stranica aplikacije */
    HOME: '/',

    /** Rute vezane uz programe */
    PROGRAM_PREGLED: '/programi', // pregled svih programa
    PROGRAM_NOVI: '/programi/dodaj', // dodavanje novog programa
    PROGRAM_PROMJENA: '/programi/:sifra', // promjena postojećeg programa prema šifri

    /** Rute vezane uz vježbače */
    VJEZBAC_PREGLED: '/vjezbaci', // pregled svih vježbača
    VJEZBAC_NOVI: '/vjezbaci/dodaj', // dodavanje novog vježbača
    VJEZBAC_PROMJENA: '/vjezbaci/:sifra', // promjena postojećeg vježbača prema šifri

    /** Rute vezane uz grupe */
    GRUPA_PREGLED: '/grupe', // pregled svih grupa
    GRUPA_NOVI: '/grupe/dodaj', // dodavanje nove grupe
    GRUPA_PROMJENA: '/grupe/:sifra', // promjena postojeće grupe prema šifri

    /** Autentikacija */
    LOGIN: '/login', // login stranica

    /** Nadzorna ploča */
    NADZORNA_PLOCA: '/nadzornaploca', // nadzorna ploča za administratore

    /** ERA dijagram */
    ERA: '/era', // ERA dijagram

    /** Rute vezane uz kategorije */
    KATEGORIJA_PREGLED: '/kategorije', // pregled svih kategorija
    KATEGORIJA_NOVA: '/kategorije/dodaj', // dodavanje nove kategorije
    KATEGORIJA_PROMJENA: '/kategorije/:sifra', // promjena postojeće kategorije prema šifri
}

/**
 * URL baze za produkcijsku verziju API-ja.
 * Koristi se pri konfiguraciji Axios HttpService.
 * @constant {string}
 */
export const PRODUKCIJA = 'https://brunojaklic-001-site1.ktempurl.com';
