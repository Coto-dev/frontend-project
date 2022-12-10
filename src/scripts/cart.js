import { api } from "../api.js";
import { Router } from "./router.js";

export async function loadCartDishes(){
   await fetch(`${api}/api/basket`, {
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
        .then(json => {var counter = 0;
            if(!json.length) $("#cart-container").append($("#error").removeClass("d-none")) 
    
             json.forEach(function (dish) {
            counter++;
            createDishCart(dish,counter);
            console.log(json)
            });          
        })
        .catch(err => {
            $("#cart-container").append($("#error").removeClass("d-none"))  
            console.log(err)
             });
            
}
export function createDishCart(dish,counter){
    console.log(dish)
    if(!dish){
        $("#cart-container").append($("#error").removeClass("d-none"))
        return
    }
    let template = $("#dishCard");
    let block = template.clone();
    block.find("#dish-picture").attr("src", dish.image);
    block.find(".name").text(dish.name);
    block.find(".number").text(counter + ".");
    block.find("#counter").val(dish.amount);
    block.find("#counter").attr("id", dish.id);
    block.find(".price").text("Цена/шт: " + dish.price +" руб.")
    block.find("#delete").on('click', function(){
        decreaseAmount(dish.id,false)
    })
    block.find("#minus").on('click', function(){
        decreaseAmount(dish.id,true)
    })
    block.find("#plus").on('click', function(){
        increaseAmount(dish.id)
    })
    block.removeClass("d-none");
    $("#cart-container").append(block);

}
 export async function decreaseAmount(id , increase){
    const user = JSON.parse(localStorage.getItem("user"));
            if (user.auth == false){
           Router.dispatch(`/login/`);
           return;
            }
            
   await fetch(`${api}/api/basket/dish/${id}?increase=${increase}`, {
        method: 'DELETE',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem("JWT")}`
                 }
                })
                .then(response =>  {
                    if (response.ok && increase == true && $("#"+id).val()>1){
                        let count = $("#"+id).val()
                        console.log($("#"+id).val())
                        $("#"+id).val(parseInt(count) - 1)
                        console.log( $("#"+id).val())
                    }
                    else location.reload()
                    
                })
                .catch(err => {
                    alert("Ошибка при удалении блюда");
                });
}
export async function increaseAmount(id){
  
const user = JSON.parse(localStorage.getItem("user"));
            if (user.auth == false){
           Router.dispatch(`/login/`);
           return;
            }

   await fetch(`${api}/api/basket/dish/${id}`, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem("JWT")}`
                 }
                })
                 .then(response => {
                    if(response.ok){
                        let count = $("#"+id).val()
                        $("#"+id).val(parseInt(count) + 1)
                    }
                 })
                .catch(err => {
                   // alert("Ошибка при добавлении блюда" +err);
                });  
}