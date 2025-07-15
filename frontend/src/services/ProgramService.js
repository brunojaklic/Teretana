import { HttpService } from "./HttpService"


async function get(){
    return await HttpService.get('/Program')
    // sve je u redu, dobili smo odgovor
    .then((odgovor)=>{
        // console.log(odgovor.data)
        return odgovor.data
    })
    // nastala je greška, obradi ju
    .catch((e)=>{})
}

export default{
    get
}