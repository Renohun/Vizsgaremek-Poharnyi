const GetMethodFetch = (url) =>{
    return fetch(url).then((response)=>{
        if(!response.ok){
            throw Error("Hiba")
        }
        return Response.json()
    })
    .catch((error)=>{
        throw new Error(error.message)
    })
}

document.addEventListener("DOMContentLoaded",()=>{
const gomb1 = document.getElementById("elso").addEventListener("click",()=>{
   console.log("f")

let url =`/Koktelok/${1}`
        const fetchMeghiv = async()=>{
            try {
                const data =   await GetMethodFetch(`/Koktelok/${id}`)
               
                console.log(data)
            } catch (error) {
                    console.log("hiba",error)
            }
            GetMethodFetch(`/Koktelok/${id}`)
        }

    })
})  


