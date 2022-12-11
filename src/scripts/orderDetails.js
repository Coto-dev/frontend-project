import { api } from "../api.js";
import { Router } from "./router.js";

export async function loadOrderDetails(id){
    
    await fetch(`${api}/api/order/${id}`, {
         method: 'GET',
         headers: {
             'Accept': 'application/json',
             'Content-Type': 'application/json',
             'Authorization': `Bearer ${localStorage.getItem("JWT")}`
                  },
          })
          .then(response => { 
             if (!response.ok) {
             const user = JSON.parse(localStorage.getItem("user"));
             if (user.auth == false)
             Router.dispatch(`/login/`)
             }
            return response.json(); 
         })
         .then(json => {   
              json.dishes.forEach(function (dish) {
                createDishCard(dish);
                
             });     
             createDetails(json)
             $("#summary").text("Стоимость заказа: "+json.price+" руб.")     
         })
         .catch(err => {
             $("#orders-container").append($("#error").removeClass("d-none"))  
             console.log(err)
              });
              
 }
 export function createDishCard(dish){

    let template = $("#orderCard");
    let block = template.clone();
    block.find("#dish-picture").attr("src", dish.image);
    block.find("#name").text(dish.name);
    block.find("#totalPrice").text("Стоимость: "+dish.totalPrice+" руб.");
    block.find("#amount").text("Количество: "+dish.amount+" шт.");
    block.find("#price").text("Цена/шт: " + dish.price +" руб.")
    block.removeClass("d-none");
    $("#orders-container").append(block);

}
function createDetails(json){
    $("#orderTime").text("Дата заказа: " + new Date(json.orderTime).toLocaleString().slice(0,-3))
    $("#deliveryTime").text("Дата доставки: " + new Date(json.deliveryTime).toLocaleString().slice(0,-3))
    if (json.status == "Delivered"){
        $("#status").text("Статус: Доставлен")
        console.log("Wd")
        }
        else{
            
             $("#confirm").removeClass('d-none')
             $("#confirm").on('click', function(){
                confirmOrder(json.id);
            })
             $("#status").text("Статус заказа - В обработке")
        }
    $("#address").text("Адрес доставки: " + json.address)
}
export async function confirmOrder(id){

    await fetch(`${api}/api/order/${id}/status`, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem("JWT")}`
                 },
         })
         .then(response => { 
            if (!response.ok) {
            const user = JSON.parse(localStorage.getItem("user"));
            if (user.auth == false)
            Router.dispatch(`/login/`)
            return
            }
            else location.reload()
        })
        .catch(err => {
            $("#orders-container").append($("#error").removeClass("d-none"))  
            console.log(err)
             });
}