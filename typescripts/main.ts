/**
 * Represents a single joke about
 * Chuck Norris from icndb.com
 */
class ChuckNorrisJoke{
    /**
     * The unique ID of the joke
     */
    id:number;
    /**
     * The text of the joke
     */
    joke:string;
    /**
     * The categories the joke falls under.
     * Some jokes are not categorized.
     */
    categories:string[];
}

window.onload = function(){
    let jokeBtn = document.getElementById("get-joke");
    jokeBtn.onclick = fetchJoke;

    populateCategories();
}

function fetchJoke(){
    let jokeBtn = <HTMLButtonElement>this;
    jokeBtn.disabled = true;

    let loaderImg = document.getElementById("loader");
    loaderImg.classList.add("loader");

    let request = new XMLHttpRequest();
    request.onreadystatechange = handleJokeResponse;

    // Set URL to send request to
    request.open("GET", "https://api.icndb.com/jokes/random");
    // Initiate request
    request.send();
}

function handleJokeResponse(){
    let request = <XMLHttpRequest>this;

    // Ready state 4 means request is finished
    // Status 200 means "OK" - success
    if(request.readyState == 4 && request.status == 200){
        // Hold the JSON response from the server
        let responseData = JSON.parse(request.responseText);
        let myJoke = <ChuckNorrisJoke>responseData.value;
        displayJoke(myJoke);
        //alert(myJoke.joke);
        //console.log(myJoke);
    }
    else if(request.readyState == 4 && request.status != 200){
        alert("Please try again later. Something happened.");
    }
}

function displayJoke(j:ChuckNorrisJoke):void{
    let jokeTextPar = document.getElementById("joke-text");
    jokeTextPar.innerHTML = j.joke;

    let jokeIdPar = document.getElementById("joke-id");
    jokeIdPar.innerHTML = "Id: " + j.id.toString();

    let categoryList = document.getElementById("categories");
    // Clear out categories from any previous joke
    categoryList.innerHTML = "";

    let allCategories = j.categories;
    allCategories.sort();
    for(let i = 0; i < j.categories.length; i++){
        let item = document.createElement("li");
        item.innerHTML = allCategories[i];
        // Creating HTML - <li>Nerdy</li>

        categoryList.appendChild(item);
    }

    let catDisplay = document.getElementById("category-display");

    if(allCategories.length == 0){
        catDisplay.style.display = "none";
    }
    else{
        catDisplay.style.display = "block";
    }

    // Re-enable joke button 3 seconds after joke is displayed
    setTimeout(function(){
        let jokeBtn = <HTMLButtonElement>document.getElementById("get-joke");
        jokeBtn.disabled = false;
        let loaderImg = document.getElementById("loader");
        loaderImg.classList.remove("loader");
    }, 1500)
}

/**
 * Display categories in a dropdown list
 */
function populateCategories(){
    let request = new XMLHttpRequest();
    request.open("GET", "http://api.icndb.com/categories");

    request.onreadystatechange = function(){
        if(this.readyState == 4 && this.status == 200){
            let categories:string[] = JSON.parse(this.responseText).value;
            console.log(categories);
        }
    }

    request.send();
}