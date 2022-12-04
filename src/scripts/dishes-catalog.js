import { api } from "../api.js";
import { searchParse } from "./parseDish.js";
import { Router } from "./router.js";


export function LoadCatalogDishes(URLSearchParams) {
    let url = new URL(`${api}/api/dish`);
    let params = URLSearchParams
    console.log(URLSearchParams.toString())
    console.log(URLSearchParams.has('categories'))
    if (!URLSearchParams.has('categories')){
            params.append('categories',"Pizza");
            params.append('categories',"Wok");
            params.append('categories',"Soup");
            params.append('categories',"Drink");
            params.append('categories',"Dessert");
            console.log(params.toString())
    }
    else
    url.search = params;
    console.log(url)
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
          
          InitDishsNavigation(json,url.searchParams);
        })
        .catch(err => {
            alert("Page not foundddd!");
           Router.dispatch(`/`);
        });
        

};
function initSelections(url){
    
    //$('#dishSelect').selectpicker();

    let template = $("#selecter");
    let block = template.clone();
    block.find('.selectpicker').selectpicker();
    if (url.search){
        let parse = searchParse(url.search)
        let vegan = (parse.vegetarian === 'true');
        let categories = parse.categories
        let sorting = parse.sorting
        block.find('#sortingSelect').selectpicker('val',sorting.toString())
       block.find('#flexSwitchCheckDefault').prop('checked', vegan)
       block.find('#dishSelect').selectpicker('val',categories)
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
    alert("Выберите категория блюда")
    return
    Router.dispatch(history.back());
   }
   selectDish.forEach((category)=>{
    params.append("categories",category)
})
    let selectSort = $("#sortingSelect").val()
    params.append("sorting",selectSort.toString())

    let veg = ($("#flexSwitchCheckDefault").is(':checked'))
    params.append("vegetarian",veg)
    
  url.search = params
  let path = url.search
  console.log(path)
  
    
  //  window.location.search = path
    console.log(window.location.pathname)
  Router.dispatch(path)

  //SetupPage();

}


function CreateDishCard(dish) {
    let template = $("#sample-card");
    let block = template.clone();
    block.find("#link").attr("data-id", dish.id);
    block.find("#link").attr("href", "/item/" + dish.id);
    block.find("#link").attr("id", "dish" + dish.id);
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
function InitDishsNavigation(json,search) {
    console.log(search.toString())
    if (json.pagination.current == 1) {
        $("#page-item-back").attr("href", "/?" + search);
        $("#page-item-first").attr("href", "/?" + search).text("1");
        $("#page-item-second").attr("href", "/?" + search.set('page','2')).text("2");
        $("#page-item-third").attr("href", "/3").text("3");
        $("#page-item-fourth").attr("href", "/4").text("4");
        $("#page-item-fifth").attr("href", "/5").text("5");
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