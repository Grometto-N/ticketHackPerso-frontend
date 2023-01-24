
function oneBook(trip){
    let row = `<div class="travel"> 
    <div> ${trip.departure} > ${trip.arrival}</div> <div>${trip.dep_time}</div> <div>${trip.price}€</div> <div>Departure in  </div></div>`;  
    return row;
};



 
 function all_books(trips){
    let allRow = ``
    for(let item of trips){
        allRow += oneBook(item);
    }
    return allRow;
 };

 fetch('http://localhost:3000/books').then(response => response.json())
 .then(data => {console.log('Nico')
    if ( data.result){
    document.querySelector('#travelTable').innerHTML = all_books(data.travels)}
    else{}
 });
 