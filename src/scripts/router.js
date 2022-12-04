
import {LoadCatalogDishes} from './dishes-catalog.js';
import {loadDishCard} from './item-details.js';
import {Login} from "./login.js";
import {Register} from "./register.js";
import {SetupHighlightingActivePage} from "./navbar.js";
import { searchParse } from './parseDish.js';
import { loadCartDishes } from './cart.js';

export var Router = {

    routes: {
        "/index.html": "dishesCatalog",
        "/": "dishesCatalog",
        //  "/dish?=page/=categories": "dishesCatalog",
         "/orders/": "",
         "/cart/": "cart",
         "/order/=id": "",
         "/item/=id": "itemDetails",
        "/login/": "login",
        "/register/": "register"
    },

    init: function () {
        this._routes = [];
        for (let route in this.routes) {

            let method = this.routes[route];
            this._routes.push({
                pattern: new RegExp('^' + route.replace(/=\w+/g, '([\\w\-]+)') + '$'),
                callback: this[method]
            });
        }
        this._routes.push({
            pattern: new RegExp('[\?&]page=(?<pageNumber>[1-9][0-7]*)|[\?&]categories=(?<category>\w*)|[\?&]vegetarian=(?<vegetarian>\w*)|[\?&]sorting=(?<sorting>\w*)'),
            callback: this.dishesCatalog
        })
        console.log(this._routes)
    },

    dispatch: function (path) {
        history.pushState({}, "", path)
        console.log(path)
        
        var i = this._routes.length;
        let flagFound = false;

        while (i--) {
            var args = path.match(this._routes[i].pattern);
            if (args) {
                flagFound = true;
                if (i == this._routes.length-1)
                this._routes[this._routes.length-1].callback.apply(this, [path])
                else this._routes[i].callback.apply(this, args.slice(1))
            }
        }
        if (!flagFound) {
            alert("Page not found");
        }
          
       // console.log(path);
    },

    dishesCatalog: function (searchParams) {
        document.documentElement.scrollIntoView(true);
        SetupHighlightingActivePage("dishes");
        $.get('/src/views/view-dishes.html', function(data){
            $("main").html(data);
            console.log(searchParams)
            let params = new URLSearchParams();
            let search
            if (searchParams){
             search = searchParse(searchParams)
                if(search.categories.length === 0 )
                throw new Error("Ошибка");
             search.categories.forEach((category)=>{
                params.append("categories",category)
            })

            params.append("vegetarian",search.vegetarian)
            params.append("sorting",search.sorting)
            params.append("page",search.page)
            }
            LoadCatalogDishes(params); 
        });
    },

    itemDetails: function (id) {
        document.documentElement.scrollIntoView(true);
        $.get('/src/views/view-dish-details.html', function(data){
            $("main").html(data);
            loadDishCard(id);
        });
    },

    cart: function () {
        document.documentElement.scrollIntoView(true);
        $.get('/src/views/view-cart.html', function(data){
            $("main").html(data);
          loadCartDishes()
        });
    },

    login: function () {
        document.documentElement.scrollIntoView(true);
        const user = JSON.parse(localStorage.getItem("user"));
        if (user.auth == true) {
            Router.dispatch("/profile/");
            return;
        }
        $.get('/src/views/view-login.html', function(data){
            $("main").html(data);
            Login();
        });
    },

    register: function () {
        document.documentElement.scrollIntoView(true);
        const user = JSON.parse(localStorage.getItem("user"));
        if (user.auth == true) {
            Router.dispatch("/profile/");
            return;
        }
        $.get('/src/views/view-register.html', function(data){
            $("main").html(data);
            Register();
        });
    },
}