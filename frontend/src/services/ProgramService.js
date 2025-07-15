import { HttpService } from "./HttpService"


async function get() {
    return await HttpService.get('/Program')
        // sve je u redu, dobili smo odgovor
        .then((odgovor) => {
            //console.log(odgovor.data)
            return odgovor.data
        })
        // nastala je greška, obradi ju
        .catch((e) => { })
}


async function dodaj(program) {
    return await HttpService.post('/Program', program)
        .then((odgovor) => { return true })
        .catch((e) => { return false })
}

async function obrisi(sifra) {
    return await HttpService.delete('/Program/' + sifra)
        .then((odgovor) => { return true })
        .catch((e) => { return false })
}

export default {
    get,
    dodaj,
    obrisi
}