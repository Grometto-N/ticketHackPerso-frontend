// Date du jour dans le calendrier
document.querySelector('#date_input').valueAsDate = new Date();

// fonction permettant de mettre à jour les boutons books
function update_Btn_book(){
    for (let i = 0; i < document.querySelectorAll('.btn_book').length; i++) {
        document.querySelectorAll('.btn_book')[i].addEventListener('click', function () {
            // récuperation des données dans la div parente (class row)
            const departure = this.parentNode.parentNode.children[0].textContent.split('>')[0].trim();
            const arrival = this.parentNode.parentNode.children[0].textContent.split('>')[1].trim();
            const dep_time = this.parentNode.parentNode.children[1].textContent;
            const price = Number(this.parentNode.parentNode.children[2].textContent.split("€")[0]);
            // on appelle la route pour sauver dans la collection cart
            fetch(`http://localhost:3000/carts/new`, { method: 'POST',  headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({departure, arrival, dep_time, price})})
            .then(response => response.json())
            .then(data => {  
                            if(data.result){
                                window.location.assign("cart.html");
                            }
           })// fin du fetch 
        })
    }
}

// fonction écrivant un voyage en html
function one_row(trip){
    let row = `<div class="row"> 
    <div> ${trip.departure} > ${trip.arrival}</div> <div>${trip.dep_time}</div> <div>${trip.price}€</div> <div><button class="btn_book" >Book</button></div>
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

document.querySelector('#btn2').addEventListener('click', function(){
    console.log('click search');
    const departure = document.querySelector('#dep_input').value;
    const arrival = document.querySelector('#arr_input').value;
    const date = document.querySelector('#date_input').value;
    
    fetch('http://localhost:3000/travels',
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