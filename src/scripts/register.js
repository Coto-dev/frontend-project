import { api } from "../api.js";

export function Register() {

    $("#telephone").click(function(){
        $(this).setCursorPosition(3);
      }).mask("+7 (999) 999-99-99");

    $("#btn-register").click(function () {
        const userData = {
            address: String($("#address").val()),
            fullName: $("#inputName").val(),
            phoneNumber: $("#telephone").val(),
            password: String($("#inputPassword").val()),
            email: String($("#inputEmail").val()),
            birthDate: (`${$("#inputBirthDate").val()}T00:00:00.000Z`),
            gender: $("#inputGender").val() == "Мужской" ? 1 : 0
        };

        if (!CheckValidationData(userData)) return;  

        PostRequestRegister(userData);
    });
}

function PostRequestRegister(userData) {
    fetch(`${api}/api/account/register`, {
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
            throw new Error("Ошибка");
        })
        .then(json => {
            localStorage.setItem("JWT", json.token);
            location.pathname = "/"
        })
        .catch(err => {
            alert("Ошибка регистрации");
        });
}

function CheckValidationData(userData) {
let checkIscomplete = true

    if (userData.fullName == "") {
        $("#inputName").addClass('is-invalid')
        checkIscomplete = false
    }
    else $("#inputName").removeClass('is-invalid')

    if (userData.fullName.length < 1) {
        $("#inputName").addClass('is-invalid')
        checkIscomplete = false
    }
    else $("#inputName").removeClass('is-invalid')

    if (userData.password == "") {
        $("#inputPassword").addClass('is-invalid')
        checkIscomplete = false
    }
    else $("#inputPassword").removeClass('is-invalid')

    if (userData.password.length < 6) {
        $("#inputPassword").addClass('is-invalid')
        checkIscomplete = false
    }
    else $("#inputPassword").removeClass('is-invalid')

    if (userData.email == "") {
        $("#inputEmail").addClass('is-invalid')
        checkIscomplete = false
    }
    else $("#inputEmail").removeClass('is-invalid')

    if (!userData.email.match(/^\S+@\S+\.\S+$/)) {
        $("#inputEmail").addClass('is-invalid')
        checkIscomplete = false
    }
    else $("#inputEmail").removeClass('is-invalid')

     if (userData.birthDate == "T00:00:00.000Z" || Date.parse(userData.birthDate) > Date.now() || new Date(userData.birthDate).getFullYear() < 1900) {
        console.log(userData.birthDate)

        $("#inputBirthDate").addClass('is-invalid')
        checkIscomplete = false
    }
    else  $("#inputBirthDate").removeClass('is-invalid')

    if (userData.address == "") {
        $("#address").addClass('is-invalid')
        checkIscomplete = false
    }
    else $("#address").removeClass('is-invalid')

    if (userData.phoneNumber == "") {
        $("#telephone").addClass('is-invalid')
        checkIscomplete = false
    }
    else $("#telephone").removeClass('is-invalid')
    
    return checkIscomplete;
}

$.fn.setCursorPosition = function(pos) {
    if ($(this).get(0).setSelectionRange) {
      $(this).get(0).setSelectionRange(pos, pos);
    } else if ($(this).get(0).createTextRange) {
      var range = $(this).get(0).createTextRange();
      range.collapse(true);
      range.moveEnd('character', pos);
      range.moveStart('character', pos);
      range.select();
    }
  };