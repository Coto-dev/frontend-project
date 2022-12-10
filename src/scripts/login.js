import { api } from "../api.js";

export function Login() {
    $("#btn-register").click(function () {
        location.pathname = "/register/";
    });
    $("#btn-login").click(function () {

        const login = $("#inputLogin").val(),
            password = $("#inputPassword").val();

           
        if (checkData(login,password)){
        const userData = {
            email: login,
            password: password,
        };

        PostRequestLogin(userData);
    }
    });
}
function checkData(login,password){
    let checkFlag = true
    if (login.length <= 1) {
        $("#inputLogin").addClass('is-invalid')
        checkFlag = false
    }
    else $("#inputLogin").removeClass('is-invalid')

    if (password.length <= 1) {
        $("#inputPassword").addClass('is-invalid')
        checkFlag = false
    }
    else $("#inputPassword").removeClass('is-invalid')
    
    return checkFlag
}

async function PostRequestLogin(userData) {
    fetch(`${api}/api/account/login`, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
    })
        .then(response => {
            if (response.ok) {
                return response.json();
            }
            $("#error").removeClass("d-none")
        })
        .then(json => {
            localStorage.setItem("JWT", json.token);
            location.pathname = "/";
        })
        .catch(err => {
            $("#error").removeClass("d-none")
        });
}