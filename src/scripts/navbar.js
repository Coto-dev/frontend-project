import { Logout } from "./logout.js";
import { api } from "../api.js";

export async function SetupNavbar() {
    const user = JSON.parse(localStorage.getItem("user"));

    if (user.auth == true) {
        $(".nav-item-auth").removeClass("d-none");
        $(".nav-item-not-auth").addClass("d-none");
        $("#nameUser").text(user.userData.email);
        $("#btnLogout").click(function () { Logout() });
        await bangeCount()
        
    }
    else {
        $(".nav-item-auth").addClass("d-none");
        $(".nav-item-not-auth").removeClass("d-none");
    }
}

export function SetupHighlightingActivePage(key) {
    if (key == "dishes") {
        $("#navDishes").addClass("active");
        $("#navOrdes").removeClass("active");
        $("#navBasket").removeClass("active");
        $("#navProfile").removeClass("active");
    }
    else if (key == "basket") {
        $("#navDishes").removeClass("active");
        $("#navBasket").addClass("active");
        $("#navOrdes").removeClass("active");
        $("#navProfile").removeClass("active");
    }
    else if (key == "order") {
        $("#navDishes").removeClass("active");
        $("#navOrdes").addClass("active");
        $("#navBasket").removeClass("active");
        $("#navProfile").removeClass("active");
    }
    else {
        $("#navDishes").removeClass("active");
        $("#navOrdes").removeClass("active");
        $("#navBasket").removeClass("active");
        $("#navProfile").removeClass("active");
    }
}

export async function bangeCount(){
    await fetch(`${api}/api/basket`, {
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
        .then(json => { 
            $("#count").removeClass("d-none");
            $("#count").text(json.length)
        })
        .catch(err => {
           alert('page not found'+err) 

             });
}