import { api } from "../api.js";
import { Router } from "./router.js";
import { bangeCount } from "./navbar.js";

export async function loadPurchase(){
    getUserData()   
    initMap()
    $("#confirm").on('click', function(){
        confirmOrder()
    })
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
         .then(json => {   var sum=0  
              json.forEach(function (dish) {
                createDishCard(dish);
                sum+=dish.totalPrice
             });     
             $("#summary").text("Стоимость заказа: "+sum+" руб.")     
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
function getUserData(){
    const user = (JSON.parse(localStorage.getItem("user"))).userData;
    $("#telephone").val(user.phoneNumber)
    $("#email").val(user.email)
}
function confirmOrder(){
    var data ={
        deliveryTime,
        address
    }
    if($("#address").val()){
        $("#address").addClass('is-valid')
        $("#address").removeClass('is-invalid')
        data.address = $("#address").val()
    }
    else{
        data.address=null
        $("#address").addClass('is-invalid')
         $("#address").removeClass('is-valid')
    }
    if(((new Date($("#deliveryTime").val()) - (new Date(Date.now())))/1000/60)>60 && ((new Date($("#deliveryTime").val()) - (new Date(Date.now())))/1000/60)<44640){
        data.deliveryTime = ($("#deliveryTime").val())
        $("#deliveryTime").addClass('is-valid') 
         $("#deliveryTime").removeClass('is-invalid')
        }
        else {
        data.deliveryTime = null
        $("#deliveryTime").addClass('is-invalid') 
        $("#deliveryTime").removeClass('is-valid')
     }
     
     if (data.address && data.deliveryTime) postOrder(data)
}
async function postOrder(data){
    fetch(`${api}/api/order`, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem("JWT")}`
        },
        body: JSON.stringify(data)
    })
        .then(async response => {
            if (response.ok) {
                await bangeCount()
                Router.dispatch("/orders/")
                
            }
            else{
           const user = JSON.parse(localStorage.getItem("user"));
           if (user.auth == false){
           Router.dispatch(`/login/`);
           return;
            }
            }
        })
        .catch(err => {
            alert("Ошибка"+err);
        });
}

function initMap(){
    ymaps.ready(init);
    $("#map").removeClass('d-none')
    
        function init(){
            var myMap = new ymaps.Map("map", {
                center: [55.76, 37.64],
                zoom: 14
            });

            var suggestViewFrom = new ymaps.SuggestView('address');
            suggestViewFrom.events.add('select', function (e) {
                geoceder(e.get('item').value,myMap)
            });
               myMap.events.add('click', function (e) {
               var cords = e.get('coords')
               geoceder(cords,myMap)
               

                ymaps.geocode(cords).then(function (res) {
                var firstGeoObject = res.geoObjects.get(0);
                $("#address").val(firstGeoObject.getAddressLine())
            })
            });
            myMap.events.add('sizechange', function (e) {
                // myMap.container.getElement().style.width = myMap.container.getSize()[0];
                // console.log( myMap.container.getElement().style.width)
                myMap.container.fitToViewport()
            })
            
        }
}
function geoceder(address,myMap){
    var geocoder = ymaps.geocode(address);
    console.log(geocoder)
    geocoder.then(
        function (res) {
 
            var coordinates = res.geoObjects.get(0).geometry.getCoordinates();
 
            var placemark = new ymaps.Placemark(
                coordinates, {
                    'hintContent': address,
                }, {
                    'preset': 'islands#redDotIcon'
                }
            );
            myMap.geoObjects.removeAll()
            myMap.setCenter(coordinates)
            myMap.geoObjects.add(placemark);
        }
    );
}