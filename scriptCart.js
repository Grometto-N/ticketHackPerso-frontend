let sum = 0;
// fonction écrivant un voyage en html
function one_cart(trip){
    let row = `<div class="row_cart"> 
    <div> ${trip.departure} > ${trip.arrival}</div> <div>${trip.dep_time }</div> <div>${trip.price}€</div> <div><button class="btn_delete_cart" >x</button></div>
    </div>`; 
    return row;
 }

 // fonction permettant d'écrire tous les voyages dans la div
 function all_carts(trips){
    let allRow = ``
    for(let item of trips){
        allRow += one_cart(item);
        sum += item.price;
    }
    return allRow;
 }

// fonction créant le container en cas de carts
function create_container(){
    return `<div id="display_carts">
    <h3>My carts</h3>
    <div id="table_cart"> </div>
   </div>
</div> 
<div id="footer_cart"><div id="total">Total : </div> <div><button class="btn_purchase" >Purchase</button></div>
</div>`
}

// function gérant les boutons delete
function update_Btn_delete(){
    for (let i = 0; i < document.querySelectorAll('.btn_delete_cart').length; i++) {
        document.querySelectorAll('.btn_delete_cart')[i].addEventListener('click', function () {
            console.log('click delete')
            // récuperation des données dans la div parente (class row)
            const departure = this.parentNode.parentNode.children[0].textContent.split('>')[0].trim();
            const arrival = this.parentNode.parentNode.children[0].textContent.split('>')[1].trim();
            const dep_time = this.parentNode.parentNode.children[1].textContent;
            const price = Number(this.parentNode.parentNode.children[2].textContent.split("€")[0]);
            console.log(departure, price, arrival, dep_time)
            // on appelle la route pour supprimer dans la collection cart
            fetch(`http://localhost:3000/carts/one`, { method: 'DELETE',  headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({departure, arrival, dep_time, price})})
            .then(response => response.json())
            .then(data => {  
                            if(data.result){
                                // mise à jour de la somme
                                sum =sum - price;
                                document.querySelector("#total").textContent = `Total : ${sum}€`;
                               // on efface la div row correspondante
                               this.parentNode.parentNode.remove();
                               console.log('done')
                            }
           })// fin du fetch 
        })
    }
}


// fonction permettant de gérer le bouton purchase
function update_Btn_purchase(){
    document.querySelector('.btn_purchase').addEventListener('click', function () {
        console.log('click purchase')
         //on récupère les données depuis carts
         fetch('http://localhost:3000/carts')
        .then(response => response.json())
        .then(dataCarts => {
              if(dataCarts.result){
                for(let itemCart of dataCarts.travels){
                    const departure = itemCart.departure;
                    const arrival = itemCart.arrival;
                    const dep_time = itemCart.dep_time;
                    const price = itemCart.price;
                    console.log(departure, price)
                    //
                    fetch('http://localhost:3000/books/purchase', { method: 'POST',  headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({departure, arrival, dep_time, price})} )
                           .then(response => response.json())
                            .then(data => {})
                }
                   // on efface les données de carts
                   fetch('http://localhost:3000/carts/all', { method: 'DELETE'} )
                    .then(response => response.json())
                    .then(data => {//on passe à la page booking    
                        window.location.assign("booking.html");})
                    
              } // fin du if result
              
        })
     
       
    })// fin event sur bouton purchase
}

// On affiche ce qu'il y a dans la collection carts
    fetch('http://localhost:3000/carts')
    .then(response => response.json())
    .then(data => { console.log(data);
      if(data.result && data.travels.length>0){
        document.querySelector("#container_cart").innerHTML = create_container();
        document.querySelector("#table_cart").innerHTML = all_carts(data.travels);
        document.querySelector("#total").textContent = `Total : ${sum}€`;
        update_Btn_delete()
        update_Btn_purchase()
      }   
 });