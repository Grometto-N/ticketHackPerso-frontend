let sum = 0;
// récupération des données des carts en local-storage
let the_carts = [];
const local_carts = JSON.parse(localStorage.getItem("carts_choice"));
console.log("local_carts",local_carts)
if(local_carts && local_carts.length >0){
    the_carts = the_carts.concat(local_carts);
    // on élimine les doublons
    the_carts = the_carts.filter((x, i) => the_carts.indexOf(x) === i);
}
console.log("the_carts",the_carts)

// fonction écrivant un voyage en html
function one_cart(trip){
    let row = `<div class="row_cart"> 
    <div> ${trip.departure} > ${trip.arrival}</div> <div>${trip.dep_time }</div> <div>${trip.price}€</div> <div><button class="btn_delete_cart" id=${trip.trip_id}>x</button></div>
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
            // const departure = this.parentNode.parentNode.children[0].textContent.split('>')[0].trim();
            // const arrival = this.parentNode.parentNode.children[0].textContent.split('>')[1].trim();
            // const dep_time = this.parentNode.parentNode.children[1].textContent;
             const price = Number(this.parentNode.parentNode.children[2].textContent.split("€")[0]);
            // console.log(departure, price, arrival, dep_time)
            
            const trip_id = this.id;
            // mise à jour de la somme
            sum =sum - price;
            document.querySelector("#total").textContent = `Total : ${sum}€`;
            // on efface la div row correspondante
            this.parentNode.parentNode.remove();
            // mise à jour du local-storage
            the_carts = the_carts.filter(elt => elt !== trip_id);
            localStorage.setItem("carts_choice", JSON.stringify(the_carts));

            // on appelle la route pour supprimer dans la collection cart
        //     fetch(`http://localhost:3000/carts/one`, { method: 'DELETE',  headers: { 'Content-Type': 'application/json' },
        //     body: JSON.stringify({departure, arrival, dep_time, price})})
        //     .then(response => response.json())
        //     .then(data => {  
        //                     if(data.result){
        //                         // mise à jour de la somme
        //                         sum =sum - price;
        //                         document.querySelector("#total").textContent = `Total : ${sum}€`;
        //                        // on efface la div row correspondante
        //                        this.parentNode.parentNode.remove();
        //                        console.log('done')
        //                     }
        //    })// fin du fetch 
        })
    }
}


// fonction permettant de gérer le bouton purchase
function update_Btn_purchase(){
    document.querySelector('.btn_purchase').addEventListener('click', function () {
        console.log('click purchase')
         //on enregistre les données dans book
        fetch('http://localhost:3000/books/purchase', {
            method: 'POST',  
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({trips : the_carts})} )
            .then(response => response.json())
            .then(data => {
                if(data.result){
                    // on efface les données de carts en local-storage
                    localStorage.setItem("carts_choice", JSON.stringify([]));
                    // on navigue à la page suivante
                    window.location.assign("booking.html");
                }
                
            })
    })// fin event sur bouton purchase
}


//  AFFICHAGE
if(the_carts && the_carts.length > 0 ){
    fetch('http://localhost:3000/trips/carts', { 
        method: 'POST',  
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({trips : the_carts})
        } )
    .then(response => response.json())
    .then(data => { 
        if(data.result && data.travels.length>0){
            document.querySelector("#container_cart").innerHTML = create_container();
            document.querySelector("#table_cart").innerHTML = all_carts(data.travels);
            document.querySelector("#total").textContent = `Total : ${sum}€`;
            update_Btn_delete()
            update_Btn_purchase()
         }   
    });
}


// On affiche ce qu'il y a dans la collection carts
// fetch('http://localhost:3000/carts')
// .then(response => response.json())
// .then(data => { console.log(data);
//   if(data.result && data.travels.length>0){
//     document.querySelector("#container_cart").innerHTML = create_container();
//     document.querySelector("#table_cart").innerHTML = all_carts(data.travels);
//     document.querySelector("#total").textContent = `Total : ${sum}€`;
//     update_Btn_delete()
//     update_Btn_purchase()
//   }   
// });