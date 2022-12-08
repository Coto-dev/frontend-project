import { api } from "../api.js";

export function LoadProfileInfo() {

    const user = (JSON.parse(localStorage.getItem("user"))).userData;

    $("#telephone").val(user.phoneNumber);
    $("#inputEmail").val(user.email);
    $("#inputName").val(user.fullName);
    $("#inputBirthdate").val(user.birthDate.slice(0, 10));
    $("#inputGender").val(user.gender);
    $("#address").val(user.address);
    $("#btnEdit").click(function () { EditProfile() });
    $("#btnSave").click(function () { SaveProfile(user) });
};

function EditProfile() {
    
    $("#telephone").mask("+7 (999) 999-99-99");

    $("#btnEdit").addClass("d-none");
    $("#btnSave").removeClass("d-none");

    $("#inputName").removeAttr("disabled");
    $("#telephone").removeAttr("disabled");
    $("#address").removeAttr("disabled");
    $("#inputBirthdate").removeAttr("disabled");
    $("#inputGender").removeAttr("disabled");
}

function SaveProfile(user) {
    const newUserData = {
        fullName: $("#inputName").val(),
        birthDate: (`${$("#inputBirthdate").val()}T00:00:00.000Z`),
        gender: $("#inputGender").val(),
        address: $("#address").val(),
        phoneNumber: $("#telephone").val(),
       
    }

    if (!CheckValidationData(newUserData)) return;

    PutRequestProfile(newUserData);
}

function PutRequestProfile(userData) {
    fetch(`${api}/api/account/profile`, {
        method: 'PUT',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem("JWT")}`
        },
        body: JSON.stringify(userData)
    })
        .then(response => {
            if (response.ok) {
                return location.reload();
            }
            throw new Error("Ошибка");
        })
        .catch(err => {
            alert("Ошибка");
        });
}

function CheckValidationData(userData) {
    

    if (userData.birthDate == "T00:00:00.000Z") {
        alert("Выберете дату рождения");
        return false;
    }
    else if (userData.phoneNumber.length < 10) {
        alert("Неккоректный номер телефона");
        return false;
    }
    else if (Date.parse(userData.birthDate) > Date.now()) {
        alert("Дата рождения неккоректна");
        return false;
    }

    else if (userData.name == "") {
        alert("Введите ФИО");
        return false;
    }

    return true;
}
