const apiKey = '18adea6bbe7c4910aa085546232907'
const formCity = document.querySelector('.form')
const card = document.querySelector('.card')


function showPreloader() {
    card.innerHTML = `
    <img style = "width:50%;display:block;margin:0 auto" src="spinner.svg" alt="pls, stand by...">
    <div style = "text-align: center">Wait...</div>
    `
}

function showError(data) {
    card.innerHTML = `
        <div style = "text-align:center;color:red; font-weight: 700; font-size: 20px; padding-top: 30%">${data.error.message}</div>
    `
}

function showWether(obj) {
    // в таком варианте элементы подружались в разнобой

    // const degrees = document.querySelector('.degrees');
    // const city = document.querySelector('.city__name');
    // const img = document.querySelector('.card img');
    // const wetherDescr = document.querySelector('.wether-descr')

    // degrees.innerHTML = obj.degrees + `<sup>°c</sup>`;
    // city.textContent = obj.city;
    // img.src = obj.imgUrl;
    // wetherDescr.textContent = obj.wetherDescr;

    card.innerHTML = `
    <div class="card__inner">
        <div class="city">
            <div class="city__name">${obj.city}</div>
            <div class="city__republic">${obj.region}</div>
        </div>
        <div class="card__wrapper">
            <div class="report">
                <div class="degrees">${obj.degrees}<sup>°c</sup></div>
                <div class="wether-descr">${obj.wetherDescr}</div>
            </div>
            <img src=${obj.imgUrl} alt="wether-image">
        </div>
    </div>
    `

    
}

// ==================================FETCH========================================================

// function getWether(apiKey, form, city = 'Blagoveshchensk') {
//     const formData = new FormData(form);
//     const inputValue = Object.fromEntries(formData.entries())['city'];

//     fetch('http://api.weatherapi.com/v1/current.json?q=' + (inputValue ? inputValue.trim() : city) + '&key=' + apiKey)
//         .then(response => response.json())
//         .then(data => {
//             const city = data.location.name;
//             const region = data.location.tz_id.split('/')[0];
//             const degrees = Math.floor(data.current.temp_c);
//             const wetherDescr = data.current.condition.text;
//             const imgUrl = data.current.condition.icon;
//             return dataObj = {city, region, degrees, wetherDescr, imgUrl};
//         })
//         .then(dataObj => showWether(dataObj))
// }



//==================== getWether через async/await====================================================

function formingData (data) {
    const city = data.location.name;
    const region = data.location.tz_id.split('/')[0];
    const degrees = Math.floor(data.current.temp_c);
    const wetherDescr = data.current.condition.text;
    const imgUrl = data.current.condition.icon;
    return dataObj = {city, region, degrees, wetherDescr, imgUrl};
} 


async function getWether(apiKey, form, city = 'Blagoveshchensk') {
    showPreloader();

    const formData = new FormData(form);
    const inputValue = Object.fromEntries(formData.entries())['city'];

    const response = await fetch('https://api.weatherapi.com/v1/current.json?q=' + (inputValue ? inputValue.trim() : city) + '&key=' + apiKey);

    const data = await response.json();

    if (data.error) {
        showError(data);
    } else{
        const dataObj = formingData(data);
        showWether(dataObj);
    }
}


// =============================XMLHttpRequest + Promise=====================================================
// async function getWether(apiKey, form, city = 'Blagoveshchensk') {
//     showPreloader();

//     return await new Promise((resolve, reject) => {

//         const formData = new FormData(form);
//         const inputValue = Object.fromEntries(formData.entries())['city'];
        
//         const xhr = new XMLHttpRequest();
         
//         xhr.open("GET", "http://api.weatherapi.com/v1/current.json?q=" + (inputValue ? inputValue.trim() : city) + "&key=" + apiKey);
        
//         xhr.send();

//         xhr.onload = function() {
//             if (xhr.status >= 200 && xhr.status < 300) {
//                 resolve(xhr.response)
//             } else {
//                 // Коды ошибок, например 404 или 500
//                 reject(JSON.parse(xhr.response))
//             }
//         };
//     }).then(response => JSON.parse(response))
//     .then(data => formingData(data))
//     .then(dataObj =>  showWether(dataObj))
//     .catch(error => showError(error))
// }

//=========================================================================

getWether(apiKey);

formCity.addEventListener('submit', (e) => {
    e.preventDefault();
    getWether(apiKey, formCity);
    e.target.reset();
})


//=============DROPDOWN=============================================================


function dropdown() {
    const dropdownBtn = document.querySelector('.dropdown button')
    const list = document.querySelector('.city-list')
    const overlay = document.querySelector('.overlay')
    const dropCities = document.querySelectorAll('.city-list li')
    const formInput = document.querySelector('.form input')

    function openDropdown() {
        list.style.display = 'block'
        overlay.style.display = 'block'
    }

    function closeDropdown() {
        list.style.display = 'none'
        overlay.style.display = 'none'
    }

    function chooseCity(e) {
        const choosenCity = e.target.textContent;
        formInput.value = choosenCity;
        closeDropdown();
        getWether(apiKey, formCity);

    }

    dropdownBtn.onclick = (e) => {
        e.preventDefault();
        openDropdown();

    }

    overlay.onclick = () => {
        closeDropdown();
    }

    dropCities.forEach(city => {
        city.onclick = (e) => chooseCity(e);
    })
}

dropdown();
