import { api } from "../api.js";
import { Router } from "./router.js";

export function loadOrders(){
    fetch(`${api}/api/order`, {
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
        .then(json => {
            if(!json.length) $("#orders-container").append($("#error").removeClass("d-none")) 
            json.forEach(function (order) {
            createOrder(order);
            });          
        })
        .catch(err => {
            $("#orders-container").append($("#error").removeClass("d-none"))  

             });
}
export function createOrder(order){
    if(!order){
        $("#orders-container").append($("#error").removeClass("d-none"))
        return
    }
    console.log(order)
    let template = $("#orderCard");
    let block = template.clone();
    block.find("#link").text("Заказ от "+ new Date(order.orderTime).toLocaleDateString());
    if (order.status == "Delivered"){
    block.find("#status").text("Статус заказа - Доставлен")
    block.find("#deliv").text("Доставлен "+ new Date(order.deliveryTime).toLocaleString().slice(0,-3))
    }
    else{
         block.find("#confirm").removeClass('d-none')
         block.find("#status").text("Статус заказа - В обработке")
         block.find("#deliv").text("Доставка ожидается "+ new Date(order.deliveryTime).toLocaleString().slice(0,-3))
    }
    block.find(".price").text("Стоимость заказа: "+order.price+" руб.")
    block.removeClass("d-none");
    $("#orders-container").append(block);
}