//selectors
var resultPage=document.getElementById("resultPage")
var landingPage=document.getElementById("landingPage")
//dynamic elements added
var resultHeader=document.createElement("h1");
var recipeResult=document.createElement("div");
//var resultTranslater=document.createElement("div");
var homeButton=document.createElement("button");


homeButton.addEventListener("clic",function(){ 
	homeButton.innerHTML="Home";
    landingPage.classList.remove("hide");
    resultPage.classList.add("hide");
	resultPage.append(homeButton);

});

const optionsMealDB = {
	method: 'GET',
	headers: {
		'X-RapidAPI-Key': '9f71e19262msh37c303dd17e0edbp15e1d3jsn1c30fd01ec29',
		'X-RapidAPI-Host': 'themealdb.p.rapidapi.com'
	}
};

const optionsTranslate = {
	method: 'POST',
	headers: {
		'content-type': 'application/json',
		'X-RapidAPI-Key': 'c52b535671mshe1a06b44b7f40dfp159c1ajsn13d1052232bd',
		'X-RapidAPI-Host': 'microsoft-translator-text.p.rapidapi.com'
	},
	body: '[{"Text":""}]'
};

const optionsLanguageList = {
	method: 'GET',
	headers: {
		'X-RapidAPI-Key': 'c52b535671mshe1a06b44b7f40dfp159c1ajsn13d1052232bd',
		'X-RapidAPI-Host': 'microsoft-translator-text.p.rapidapi.com'
	}
};


/* The recipe and the translation language values are hard coded in variables meal and translateTo respectively */
let meal = "chicken";
let translateTo="hi";
let recipeJson = {"name": "",  
				  "ingredients": "",
				  "instructions": ""};
let translatedRecipe ={};
let mealCategories = [];
let languages =[];

function populateMealCategory(){
	for(let i = 0; i < mealCategories.length; i++){
		let optEl = document.createElement('option');
		optEl.innerHTML = mealCategories[i];
		optEl.value = mealCategories[i];
		document.getElementById("mealCategory").appendChild(optEl);
	}
}

function populateLanguages(){
	Object.keys(languages).forEach((language) => { 
		let optEl = document.createElement('option');	
		optEl.innerHTML = languages[`${language}`];
		optEl.value = language;
		document.getElementById("languages").appendChild(optEl);
	})	
}

function populateRecipeByCategory(recipesByCategory){
	for(let i = 0; i < recipesByCategory.length; i++){
		let optEl = document.createElement('option');
		optEl.innerHTML = recipesByCategory[i];
		optEl.value = recipesByCategory[i];
		document.getElementById("recipes").appendChild(optEl);
	}
}

function getMealCategory(){
	console.log("Getting Meal Category");
	fetch('https://themealdb.p.rapidapi.com/list.php?c=list', optionsMealDB)
		.then(response => response.json())
		.then((data) => {
			for (let i = 0; i < data['meals'].length; i++){
				mealCategories.unshift(data['meals'][i]['strCategory']);
			}
			console.log(mealCategories);
			populateMealCategory();
			return data;
		})
		//.catch(err => console.error(err));	
} 

function getLanguages(){
	fetch('https://microsoft-translator-text.p.rapidapi.com/languages?api-version=3.0', optionsLanguageList)
		.then(response => response.json())
		.then((data) => {
			Object.keys(data['translation']).forEach((key) => {
				languages[`${key}`] = data['translation'][`${key}`]['name'];
			})
			console.log(languages);	
			populateLanguages();
			return data;		
		})
		.catch(err => console.error(err));
}

function getData(){
	getMealCategory();
	getLanguages();
}

function getRecipesForCategory(){
	categoryValue = document.getElementById("mealCategory").value;
	let recipesByCategory = [];
	fetch('https://themealdb.p.rapidapi.com/filter.php?c='+`${categoryValue}`, optionsMealDB)
		.then(response => response.json())
		.then(data => {
			for (let i = 0; i < data['meals'].length; i++){
				recipesByCategory.unshift(data['meals'][i]['strMeal']);
			}
			populateRecipeByCategory(recipesByCategory);
			console.log(recipesByCategory); 
			console.log(data);
			return data;
		})
		.catch(err => console.error(err)); 
	
}

function getRecipe(){
	meal = document.getElementById("recipes").value;
	translateTo = document.getElementById("languages").value;
	fetch('https://themealdb.p.rapidapi.com/search.php?s='+`${meal}`, optionsMealDB)
		.then((response) => {
			return response.json();
		})
		.then((data) => {
			console.log(data);
			recipeJson['name'] = data['meals'][0].strMeal;
			for (let i = 1; i <= 20; i++){
				let ingredientStr = "strIngredient"+i.toString();
				let measureStr = "strMeasure"+i.toString();
				
				if (data['meals'][0][`${ingredientStr}`] === ""){
					i = 21; // exit the loop 
				}
				else{
					recipeJson['ingredients'] += data['meals'][0][`${measureStr}`]+" "+data['meals'][0][`${ingredientStr}`] + "\n";
				}	
			}
			recipeJson['instructions'] = data['meals'][0].strInstructions;
			console.log(recipeJson);
			translateRecipe();	

            
		})
		.catch(err => console.error(err));
}

/*The translate api used here throws the following error 
  net::ERR_CONTENT_DECODING_FAILED 200 on certain events.
  Observed list of scenarios when the error has occured:
	  1. Translating Instructions. Depends on the size of the content provided for translation. 
	  2. Doesn't work for consecutive recipe fetch and its subsequent translation. A reload is required in between */
/* The above stated issue has been resolved. 
   This error happens when the hhtp request's header claim the content to be gzip encoded but it is not. 
   Hence gzip encoding needs to be disabled at the browser end. Follow the below link
   Solution 1: Disabling G-Zip Encoding @ https://appuals.com/how-to-fix-err_content_decoding_failed-error/ */ 


function translateRecipe(){
	let translateObj = "";
	let resultTranslater =document.createElement("div");
	resultPage.appendChild(resultTranslater);
	Object.keys(recipeJson).forEach((key) => {
		translateObj = [{"Text": `${recipeJson[`${key}`]}`}];
		optionsTranslate['body'] = JSON.stringify(translateObj);
		
		fetch('https://microsoft-translator-text.p.rapidapi.com/translate?to%5B0%5D='+`${translateTo}`+'&api-version=3.0&profanityAction=NoAction&textType=plain', optionsTranslate, {cache: "no-store"})
			.then((response) => {
				return response.json()})
			.then((data) => {
					translatedRecipe[`${key}`]=data[0].translations[0]['text'];
					return translatedRecipe;
				})					
			.catch(err => console.error(err)); 
            console.log(translatedRecipe);	
			resultTranslater.innerHTML += translatedRecipe[`${key}`];
			console.log(resultTranslater);
 	});
	
	
}

// This function needs to be written for displaying the recipes and its translation. 
  // Pls feel free to extend it.
function display(){
	
    resultHeader.innerHTML=recipeJson["name"];
    recipeResult.innerHTML=recipeJson["ingredients"] + recipeJson["instructions"];
	//resultTranslater.innerHTML=translatedRecipe["name"] + translatedRecipe["ingredients"] + translatedRecipe["instructions"];          
   	resultPage.append(resultHeader,recipeResult,resultTranslater);
}
		
        	

  
function displayRecipe(){
	landingPage.classList.add("hide");
    resultPage.classList.remove("hide");
	//getRecipe(); this have been temporarily commented out because the server is down
	recipeJson={"ingredients":"1kg ham,1 pound chicken", "name":"Arrabita", "instructions":"Take a bowl and boil the water."};
 
	translateRecipe();
}
   
            

