// récupération des données sur les carts depuis le local-storage
let the_carts = [];
const local_carts = JSON.parse(localStorage.getItem("carts_choice"));
if(local_carts && local_carts.length >0){
    the_carts = the_carts.concat(local_carts);
    // on élimine les doublons
    the_carts = the_carts.filter((x, i) => the_carts.indexOf(x) === i);
}

// Date du jour dans le calendrier
document.querySelector('#date_input').valueAsDate = new Date();

// fonction permettant de mettre à jour les boutons books
function update_Btn_book(){
    for (let i = 0; i < document.querySelectorAll('.btn_book').length; i++) {
        document.querySelectorAll('.btn_book')[i].addEventListener('click', function () {
            // récuperation de l'id du voyage
            const trip_id = this.id;
            // on vérifie que ce voyage n'est pas déjà dans les carts et on l'enregistre dans le local-storage
            if(!the_carts.some(elt => elt === trip_id)){
                the_carts.push(trip_id);
            }

            localStorage.setItem("carts_choice", JSON.stringify(the_carts));
            
            // on navigue 
            window.location.assign("cart.html");
        })
    }
}

// fonction écrivant un voyage en html
function one_row(trip){
    let row = `<div class="row"> 
    <div class = "trip"> ${trip.departure} > ${trip.arrival}</div> <div>${trip.dep_time}</div> <div>${trip.price}€</div> <div><button class="btn_book"  id=${ trip.trip_id}>Book</button></div>
    </div>`;  
    return row;
 }

 // fonction permettant d'écrire tous les voyages dans la div
 function all_trips(trips){
    let allRow = ``
    for(let item of trips){
        allRow += one_row(item);
    }
    return allRow;
 }


 // EVENEMENT 
 // click sur le bouton de recherche
document.querySelector('#btn2').addEventListener('click', function(){
    const departure = document.querySelector('#dep_input').value;
    const arrival = document.querySelector('#arr_input').value;
    const date = document.querySelector('#date_input').value;
    fetch('https://ticket-hack-perso-backend.vercel.app/trips/travels',
    {method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({departure, arrival, date })})
    .then(response => response.json())
    .then(data => {

        if(data.result && data.travels.length>0){
            document.querySelector("#trip-found").innerHTML = all_trips(data.travels);
            update_Btn_book();
        }else {
            document.querySelector("#trip-found").innerHTML =  `<img id="photo" src="./images/notfound.png" />
            <p id="time">No trip found</p>`
        }

 });
});