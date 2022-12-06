import { Router } from "./router.js";
import { Authorization } from "./authorization.js";
import { SetupNavbar } from "./navbar.js";

window.addEventListener("load", async () => {
    SetupPage();
})

window.addEventListener("popstate", async () => {
    SetupPage();
})

export async function SetupPage() {
    await Authorization();
    SetupNavbar();
     RegisterClickReferenceEvents();
     Router.dispatch(window.location.pathname + window.location.search);
     console.log('SetupPage'+window.location.pathname + window.location.search)
}

function RegisterClickReferenceEvents() {
    Router.init();

    // let handler = event => {
    //     let url = new URL(event.currentTarget.href);
        
    //     Router.dispatch(url.pathname);
    //     event.preventDefault();
    // }
    
    // let anchors = $(".card-dish-catalog", ".navbar");

    // for (let anchor of anchors) {
    //     console.log(anchor)
    //     anchor.onclick = handler;
    // }
}
