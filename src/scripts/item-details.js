import { api } from "../api.js";
import { Router } from "./router.js";

export function loadDishCard(id) {
    fetch(`${api}/api/dish/${id}`)
        .then(response => {
            if (response.ok) {
                return response.json();
            }
            throw new Error("Ошибка");
        })
        .then((json) => { createDishCard(json, id) })
        .catch(err => {
            alert("Page not found");
            Router.dispatch(`/`);
        });
}
 async function createDishCard(dish, id){
    let block = $("#dish-details-container")
    block.find(".card-title").text(dish.name)
    block.find("#dish-picture").attr("src", dish.image)
    block.find(".category").text("Категория блюда - " + dish.category)
    if (dish.vegetarian)
    block.find(".vegan").text("Вегетарианское")
    else  block.find(".vegan").text(" Не вегетарианское")
    block.find(".description").text(dish.description)

    const user = JSON.parse(localStorage.getItem("user"));
        if (user.auth == true) {
            if (await checkRating(id)){
                console.log(checkRating(id))
                block.find(".rating").rating({displayOnly: false, step: 1});
                block.find(".rating").on('rating:change', function (event, value) {
                    postRating(id, value)
                   });
                   
            }
            else block.find(".rating").rating({displayOnly: true, step: 1});
        }
        else block.find(".rating").rating({displayOnly: true, step: 1});
    

    block.find(".rating").rating('update', dish.rating);
    block.find(".price").text("Цена: " + dish.price + " руб./шт")
}

export function postRating(id, ratingScore){
    
    fetch(`${api}/api/dish/${id}/rating?ratingScore=${ratingScore}`, {
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

  export function checkRating(id){
   return fetch(`${api}/api/dish/${id}/rating/check`, {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem("JWT")}`
                 },
         })
        .then(response => {
            if (response.ok) {
                return response.json();
            }
            throw new Error("Ошибка при проверке рейтинга");
        })
        .then((json) => {console.log(json); return json;  })
        .catch(err => {
            alert("Page not found");
            Router.dispatch(`/`);
        });
}