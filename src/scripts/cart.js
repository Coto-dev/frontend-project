import { api } from "../api.js";
import { Router } from "./router.js";

export function loadCartDishes(){
    fetch(`${api}/api/basket`, {
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
            Router.dispatch(`/login/`);
            }
           return response.json(); 
        })
        .then(json => {var counter = 0; json.forEach(function (dish) {
            counter++;
            createDishCart(dish,counter);
            });          
        })
        .catch(err => {
            $("#cart-container").append($("#error").removeClass("d-none"))  

             });
             console.log('cart '+window.location.pathname)
}
export function createDishCart(dish,counter){
    if(!dish){
        $("#cart-container").append($("#error").removeClass("d-none"))
        return
    }
    console.log(dish)
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
export function decreaseAmount(id , increase){
    fetch(`${api}/api/basket/dish/${id}?increase=${increase}`, {
        method: 'DELETE',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem("JWT")}`
                 }
                })
                .then(response => location.reload())
                .catch(err => {
                    alert("Ошибка при добавлении отзыва");
                });
}
export function increaseAmount(id){
//   let count = $("#"+id).val()
//   $("#"+id).val(parseInt(count) + 1)
    fetch(`${api}/api/basket/dish/${id}`, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem("JWT")}`
                 }
                })
                .then(response => location.reload())
                .catch(err => {
                    alert("Ошибка при добавлении отзыва");
                });  
}