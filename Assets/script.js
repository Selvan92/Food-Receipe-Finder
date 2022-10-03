//selectors
var resultPage=document.getElementById("resultPage")
var landingPage=document.getElementById("landingPage")
//dynamic elements added
var resultHeader=document.getElementById("resultHeader");
var recipeResult=document.getElementById("recipeResult");
var homeButton=document.getElementById("homeButton");
var resultTranslater =document.getElementById("resultTranslater");
var rrIngredients =document.getElementById("rrIngredients");
var rrinstructions =document.getElementById("rrinstructions");
var rtName =document.getElementById("rtName");
var rtIngredients =document.getElementById("rtIngredients");
var rtinstructions =document.getElementById("rtinstructions");

var recipeButton=document.getElementById("Recipe");



/*homeButton.addEventListener("click",function(){ 
	homeButton.innerHTML="Home";
    landingPage.classList.remove("hide");
    resultPage.classList.add("hide");


});*/

const optionsMealDB = {
	method: 'GET',
	headers: {
		'X-RapidAPI-Key': 'c52b535671mshe1a06b44b7f40dfp159c1ajsn13d1052232bd',
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
let translateTo= "hi";
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
		.catch(err => {
			mealCategories =["Vegetarian", "Vegan", "Breakfast", "Dessert", "Chicken", "Beef", "Soups", "Salads"];
			populateMealCategory();
			console.error(err);
		})	
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
		.catch(err => {
			recipesByCategory = ["Arrabiatta Penne", "Avacado Sandwich", "Garlic Bread", "Enchidillas"];
			populateRecipeByCategory(recipesByCategory);
			console.error(err);
		}) 
	}
	/*$('#mealCategory').change(function(){
		alert($(this).val());
	})*/
var arrayIngredients;

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
			resultHeader.innerHTML="Recipe Name: "+recipeJson["name"];

			var splitIngredients=  recipeJson["ingredients"];
			arrayIngredients=splitIngredients.split("\n")
			console.log(arrayIngredients);
			arrayIngredients.pop()
			let listIngredients=""
			for (let i=0; i<arrayIngredients.length;i++){
				listIngredients += "*"+arrayIngredients[i]+"<br>";
			}
			
			var splitInstructions=  recipeJson["instructions"];

			var arrayInstructions=splitInstructions.split(",")
			arrayInstructions.pop()
			let listInstructions=""
			for (let i=0; i<arrayInstructions.length;i++){
				listInstructions += "*"+arrayInstructions[i]+"<br>";
			}

			recipeResult.innerHTML += "Ingredients: " +"<br>"+"<br/>"+ listIngredients +"<br/>"+"<br/>"+"Instructions: "+"<br>"+"<br/>"+listInstructions;
			
			//recipeResult.innerHTML= "Ingredients: " +"<br/>"+  recipeJson['ingredients']+"<br/>"+"<br/>"+"Instructions: "+"<br/>"+ recipeJson["instructions"];
			translateRecipe();		
		})
		.catch(err => {
			recipeJson['name'] = "Arrabiatta Penne";
			recipeJson['ingredients'] = ["250 gms penne pasta", "100 gms cheese", "5 ml olive oil"];
			recipeJson['instructions'] = ["Boil the water.\r\n Add Pasta. After the pasta is cooked strain it. \r\n Heat olive oil. Add pasta, cheese and salt. Add some tomato ketchup\r\n"];
			console.log(recipeJson);
			translateRecipe();
			console.error(err)});
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
	resultTranslater.innerHTML = "Translated Recipe:"+"<br/>";
	Object.keys(recipeJson).forEach((key) => {
		translateObj = [{"Text": `${recipeJson[`${key}`]}`}];
		optionsTranslate['body'] = JSON.stringify(translateObj);
		
		fetch('https://microsoft-translator-text.p.rapidapi.com/translate?to%5B0%5D='+`${translateTo}`+'&api-version=3.0&profanityAction=NoAction&textType=plain', optionsTranslate, {cache: "no-store"})
			.then((response) => {
				return response.json()})
			.then((data) => {
					translatedRecipe[`${key}`]=data[0].translations[0]['text'];
					resultTranslater.innerHTML+= `${key}`+"</br>"+data[0].translations[0]['text'];
					return translatedRecipe;
			
				})					
		
			
			
	});
	
}
// This function needs to be written for displaying the recipes and its translation. 
  // Pls feel free to extend it.

		
        	

  
function displayRecipe(){
	//landingPage.classList.add("hide");
    //resultPage.classList.remove("hide");
	getRecipe(); 	
	
}
   
            

recipeButton.addEventListener("click",input);
var storageArr;
var storagedata;

function input(event) {
event.preventDefault()
	localStorage.setItem("StorageKey",storagedata)
	storagedata=JSON.stringify(storageArr);
	storageArr=JSON.parse(localStorage.getItem("storageKey"));
	storageArr.push(arrayIngredients);
  
/*for (let i=0; i<storageArr.length;i--){
	console.log(storageArr[i]);
				//listIngredients += "*"+arrayIngredients[i]+"<br>";
			}*/

		}





