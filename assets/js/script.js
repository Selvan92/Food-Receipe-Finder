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

/* The recipe and the translation language values are hard coded in variables meal and translateTo respectively */
let meal = "chicken";
let translateTo= "hi";
let recipeJson = {"name": "",  
				  "ingredients": "",
				  "instructions": ""};
let translatedRecipe ={};

/* function calls */ 
function getRecipe(){
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
	});
	console.log(translatedRecipe);	
}

/* This function needs to be written for displaying the recipes and its translation. 
   Pls feel free to extend it. */
function displayRecipe(){
	getRecipe();		
}


