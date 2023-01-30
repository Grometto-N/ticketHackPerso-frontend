
function oneBook(trip){
    let row = `<div class="travel"> 
    <div class = "trip"> ${trip.departure} > ${trip.arrival}</div> <div>${trip.dep_time}</div> <div>${trip.price}€</div> <div>Departure in ${trip.before_departure} </div></div>`;  
    return row;
};



 
 function all_books(trips){
    let allRow = ``
    for(let item of trips){
        allRow += oneBook(item);
    }
    return allRow;
 };

 fetch('https://ticket-hack-perso-backend.vercel.app/books').then(response => response.json())
 .then(data => {
    if ( data.result){
    document.querySelector('#travelTable').innerHTML = all_books(data.travels)}
    else{}
 });
 