import { api } from "../api.js";
import { decreaseAmount, increaseAmount } from "./cart.js";
import { searchParse } from "./parseDish.js";
import { Router } from "./router.js";


export async function LoadCatalogDishes(URLSearchParametrs) {
    let url = new URL(`${api}/api/dish`);
    let params = URLSearchParametrs
    
     url.search = URLSearchParametrs;
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
                
                return;
            }
            json.dishes.forEach(function (dish) {
                CreateDishCard(dish);
            });
          
          InitDishsNavigation(json);
        })
        .catch(err => {
            alert("Page not found!" + err);
         //  Router.dispatch(`/`);
        });
        const user = JSON.parse(localStorage.getItem("user"));
        if (user.auth == true)
       await initFooterBtn()
};
async function initFooterBtn(){
    fetch(`${api}/api/basket`, {
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
            throw new Error("Ошибка");
        })
        .then(json => { json.forEach(function (dishCart) {
            $("#footerid-"+dishCart.id).find("#groupbtn").removeClass('d-none')
            $("#footerid-"+dishCart.id).find("#"+dishCart.id).val(dishCart.amount)
            $("#footerid-"+dishCart.id).find("#minus").on('click', async function(){
                console.log(($("#"+dishCart.id)).val())
              await decreaseAmount(dishCart.id,true)
              console.log(($("#"+dishCart.id)).val())
            })
            $("#footerid-"+dishCart.id).find("#plus").on('click',async function(){
               await increaseAmount(dishCart.id)
            })
            $("#footerid-"+dishCart.id).find("#confirm").addClass('d-none')
            });          
        })
        .catch(err => {
           alert('page not found'+err) 

             });
             
}
function initSelections(url){
    
    let template = $("#selecter");
    let block = template.clone();
    block.find('.selectpicker').selectpicker();
    console.log(url.searchParams.getAll('categories'))
    let categories = url.searchParams.getAll('categories')
    console.log(categories)
    let sorting = url.searchParams.get('sorting')
    let vegan = (url.searchParams.get('vegetarian') === 'true')
    if (categories) block.find('#dishSelect').selectpicker('val',categories)
    if (sorting) block.find('#sortingSelect').selectpicker('val',sorting.toString())
    if (vegan)  block.find('#flexSwitchCheckDefault').prop('checked', vegan)

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
//   console.log(path)
//   console.log(url)
//   console.log(window.location.pathname + window.location.search)
  Router.dispatch(path)


}


function CreateDishCard(dish) {
    let template = $("#sample-card");
    let block = template.clone();
    block.find("#link").attr("data-id", dish.id);
    block.find("#link").attr("href", "/item/" + dish.id);
    block.find(".card-footer").attr("id","footerid-" +dish.id);
    block.find(".dish-poster-image").attr("src", dish.image);
    block.find(".dish-name").text(dish.name);
    block.find(".dish-description").text(dish.description);
    if (dish.vegetarian)
    block.find(".vegan").attr("src", "https://pro-ven.se/wp-content/uploads/2019/09/Suitable_for_Vegetarians_or_vegans.png");

    block.find(".rating").rating({displayOnly: true, step: 1});
    block.find(".rating").rating('update', dish.rating);

    block.find(".dish-category").text("Категория блюда - " + dish.category);
    block.find(".dish-price").text("Цена - " + dish.price + "р");
    block.find("#confirmBtn").on('click', async function(){
       await increaseAmount(dish.id)
       location.reload()
    })
    // block.find("#confirmBtn").on('click', function(){
    //     increaseAmount(dish.id)
    //     block.find("#confirm").addClass('d-none')
    //     block.find("#groupbtn").find("#"+dish.id).val(0)

    //     $("#footerid-"+dish.id).find("#minus").on('click', function(){
    //         console.log($("#"+dish.id).val())
    //         block.find("#"+dish.id).val()
    //         decreaseAmount(dish.id,true)
    //         if (block.find("#"+dish.id).val()<=1)
    //         {
    //             console.log(block.find("#"+dish.id).val())
    //             block.find("#groupbtn").addClass('d-none')
    //             block.find("#confirm").removeClass('d-none')
    //         }
    //      })
    //      $("#footerid-"+dish.id).find("#plus").on('click', function(){
    //          increaseAmount(dish.id)
    //      })

    //     block.find("#groupbtn").removeClass('d-none')
        
    // })
    block.find("#counter").attr("id", dish.id);
    block.removeClass("d-none");
    $("#dishes-catalog-container").append(block);
}
function InitDishsNavigation(json) {
    var search = new URLSearchParams(window.location.search)
    console.log(search.toString())
    console.log(json.pagination)
    for (let i=1;i<=json.pagination.count;i++){
        if (i==json.pagination.current) {
         $("#"+i.toString()).parent().addClass("active")
        }
        search.set('page', i.toString())
        $("#"+i.toString()).attr("href", "/?" + search)
         $("#"+i.toString()).parent().removeClass("d-none")
        console.log("#"+i);
    }
        if (json.pagination.current == json.pagination.count)
        search.set('page', json.pagination.current.toString())
        else  search.set('page', (json.pagination.current +1).toString())
        $("#page-item-next").attr("href", "/?" + search)

        if (json.pagination.current == 1)
        search.set('page', json.pagination.current.toString())
        else  search.set('page', (json.pagination.current -1).toString())
        $("#page-item-back").attr("href", "/?" + search)
        
}

 