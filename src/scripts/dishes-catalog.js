import { api } from "../api.js";
import { searchParse } from "./parseDish.js";
import { Router } from "./router.js";

export function LoadCatalogDishes(URLSearchParams) {
    let url = new URL(`${api}/api/dish`);
    let params = URLSearchParams
    
    if (!params){
            params.append('categories',"Pizza");
            params.append('categories',"Wok");
            params.append('categories',"Soup");
            params.append('categories',"Drink");
            params.append('categories',"Dessert");
    }
    else
    url.search = params;
    initSelections(url)
    fetch(url)
        .then(response => {
            if (response.ok) {
                return response.json();
            }
            throw new Error("Ошибка");
        })
        .then(json => {
            if (json.pagination.count < json.pagination.page) {
                // TODO
               // Router.dispatch(`${url} ${json.pagination.count}`);
                return;
            }
            json.dishes.forEach(function (dish) {
                CreateDishCard(dish);
            });
          
          InitDishsNavigation(json);
        })
        .catch(err => {
            alert("Page not foundddd!");
           Router.dispatch(`/`);
        });
      //  $("#confirmBtn").click(function () { confirmSearch(url) });

};
function initSelections(url){
    console.log(url)
    let template = $("#selecter");
    let block = template.clone();
    if (url.search){
        let parse = searchParse(url.search)
        let vegan = (parse.vegetarian === 'true');
        let categories = parse.categories
        let sorting = parse.sorting
        block.find('#sortingSelect').val(sorting.toString())
       block.find('#flexSwitchCheckDefault').prop('checked', vegan)
       block.find('#dishSelect').val(categories.toString())
    }
    block.removeClass("d-none");
    block.find("#confirmBtn").click(function () { confirmSearch(url) });
    $("#forSelect").append(block);
    
}

function confirmSearch(url){
    let params = new URLSearchParams()
   let selectDish = $('#dishSelect').val()
   console.log(selectDish)
   if(selectDish.length === 0){
    alert("Page not foundddd!")
    Router.dispatch(history.back());
   }
   selectDish.forEach((category)=>{
    params.append("categories",category)
})
    let selectSort = $("#sortingSelect").val()
    params.append("sorting",selectSort.toString())

    let veg = ($("#flexSwitchCheckDefault").is(':checked'))
    params.append("vegetarian",veg)
    console.log(veg)
  url.search = params
  let path = url.search
 
  Router.dispatch(path.toString())
//   $('#flexSwitchCheckDefault').prop('checked', veg);

  // LoadCatalogDishes(params)
}


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

// let select = $("#select");
// var value = select.options[select.selectedIndex].value;
// console.log(value); 