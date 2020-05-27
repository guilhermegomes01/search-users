// Field search
const searchUser = document.querySelector("#searchUser");
const btnSearch = document.querySelector(".btnSearch");

// Preloader
const preloader = document.querySelector(".col-preloader")

// Results
const resultSection = document.querySelector(".result")
const resultUsers = document.querySelector(".result-users");
const resultStatistics = document.querySelector(".result-statistics")
const usersFound = document.querySelector('.usersFound');
const notFoundUsers = document.querySelector(".notFoundUsers");
const withContent = document.querySelectorAll(".with-content");
const withoutContent = document.querySelectorAll(".without-content");

// Only Statistics
const male = document.querySelector(".male");
const female = document.querySelector(".female");
const sumAges = document.querySelector(".sumAges");
const averageAges = document.querySelector(".averageAges");


async function getDados() {
    const url = "https://randomuser.me/api/?seed=javascript&results=100&nat=BR&noinfo";
    const response = await fetch(url);

    return response.json();
}

searchUser.addEventListener('input', function(e) {
    this.value !== '' ? btnSearch.classList.remove('disabled') : btnSearch.classList.add('disabled');
});

searchUser.addEventListener('keypress', function(e) {
    if(e.keyCode === 13) {
        e.preventDefault();
        resultUsers.innerHTML = "";
        searchUsers();
    }
})

btnSearch.addEventListener('click', function(e) {
    e.preventDefault();
    resultUsers.innerHTML = "";
    searchUsers();
})

function searchUsers() {
    withoutContent.forEach(content => content.style.display = 'none')
    withContent.forEach(content => content.style.display = 'none')
    preloader.style.display = "flex";
    notFoundUsers.style.display = "none";
    getDados().then(({ results }) => {
        let maleCount = 0;
        let femaleCount = 0;
        let totalAges = [];

        const foundUsers = results.filter(({ name: { first, last } }) => {
            const inputValue = searchUser.value.toLowerCase();
            return first.toLowerCase().includes(inputValue) || last.toLowerCase().includes(inputValue)
        });
        console.log(foundUsers.length)
        switch(foundUsers.length) {
            case 0:
                withContent.forEach(content => content.style.display = 'none')
                preloader.style.display = "none";
                notFoundUsers.style.display = "block";
                break;
            case 1:
                usersFound.innerHTML = `${foundUsers.length} usuário encontrado`;
                fillContent(maleCount, femaleCount, totalAges, foundUsers)
                break;
            default:
                usersFound.innerHTML = `${foundUsers.length} usuários encontrados`;
                fillContent(maleCount, femaleCount, totalAges, foundUsers)
                break;
        }


    })
}

function fillContent(maleCount, femaleCount, totalAges, foundUsers) {
    foundUsers.map(({ name, dob, picture, gender }) => {
        const li = document.createElement('li');
        const img = document.createElement('img');
        const span = document.createElement('span')

        li.classList.add('user-information')
        img.classList.add('img-user')
        img.src = picture.thumbnail
        span.innerHTML = `${name.first} ${name.last}, ${dob.age} anos`
        
        resultUsers.appendChild(li);
        li.appendChild(img)
        li.appendChild(span)

        totalAges = [...totalAges, dob.age]

        gender === 'male' ? maleCount += 1 : femaleCount += 1;
    })

    const sumFunction = (accumulator, currentValue) => accumulator + currentValue;

    male.innerHTML = `${maleCount} pessoas`
    female.innerHTML = `${femaleCount} pessoas`

    sumAges.innerHTML = `${totalAges.reduce(sumFunction)} anos`
    averageAges.innerHTML = `${totalAges.reduce(sumFunction)/totalAges.length} anos`

    preloader.style.display = "none";
    withContent.forEach(content => content.style.display = "block");
}