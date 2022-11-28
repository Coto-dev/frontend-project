import { api } from "../api.js";
import { Router } from "./router.js";

export function LoadCatalogDishes(page) {
    fetch(`${api}/api/dish?`)
        .then(response => {
            if (response.ok) {
                return response.json();
            }
            throw new Error("Ошибка");
        })
        .then(json => {
            if (json.pagination.count < page) {
                Router.dispatch(`/page = ${json.pagination.count}`);
                return;
            }
            json.dishes.forEach(function (dish) {
                CreateDishCard(dish);
            });

            //$('#lang').selectpicker();
           // $('select').selectpicker();
           // $('.selectpicker').selectpicker();
          InitDishsNavigation(json);
        })
        .catch(err => {
            alert("Page not foundddd!");
            Router.dispatch(`/`);
        });
};

function CreateDishCard(dish) {
    let template = $("#sample-card");
    let block = template.clone();
    block.attr("id", "dish" + dish.id);
    block.attr("data-id", dish.id);
    block.attr("href", "/dish/" + dish.id);
    block.find(".dish-poster-image").attr("src", dish.image);
    block.find(".dish-name").text(dish.name);
    block.find(".dish-description").text(dish.description);
    if (dish.vegetarian)
    block.find(".vegan").attr("src", "https://pro-ven.se/wp-content/uploads/2019/09/Suitable_for_Vegetarians_or_vegans.png");

    block.find(".rating").rating({displayOnly: true, step: 1});
    block.find(".rating").rating('update', dish.rating);

    block.find(".dish-category").text("Категория блюда - " + dish.category);
    block.find(".dish-price").text("Цена - " + dish.price + "р");;
    block.removeClass("d-none");
    $("#dishes-catalog-container").append(block);
}
function InitDishsNavigation(json) {
    if (json.pagination.current == 1) {
        $("#page-item-back").attr("href", "/1");
        $("#page-item-first").attr("href", "/1").text("1");
        $("#page-item-second").attr("href", "/2").text("2");
        $("#page-item-third").attr("href", "/3").text("3");
        $("#page-item-next").attr("href", "/2");
        $("#page-item-first").parent().addClass("active");
    }
    else if (json.pagination.current == json.pagination.count) {
        $("#page-item-back").attr("href", `/${json.pagination.current - 1}`);
        $("#page-item-first").attr("href", `/${json.pagination.current - 2}`).text(json.pagination.current - 2);
        $("#page-item-second").attr("href", `/${json.pagination.current - 1}`).text(json.pagination.current - 1);
        $("#page-item-third").attr("href", `/${json.pagination.current}`).text(json.pagination.current);
        $("#page-item-next").attr("href", `/${json.pagination.current}`);
        $("#page-item-third").parent().addClass("active");
    }
    else {
        $("#page-item-back").attr("href", `/${json.pagination.current - 1}`);
        $("#page-item-first").attr("href", `/${json.pagination.current - 1}`).text(json.pagination.current - 1);
        $("#page-item-second").attr("href", `/${json.pagination.current}`).text(json.pagination.current);
        $("#page-item-third").attr("href", `/${json.pagination.current + 1}`).text(json.pagination.current + 1);
        $("#page-item-next").attr("href", `/${json.pagination.current + 1}`);
        $("#page-item-second").parent().addClass("active");
    }
}