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
	body: '[{"Text":"I would really like to drive your car around the block a few times."}]'
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
			recipeJson['name'] = data['meals'][0].strMeal;
			for (let i = 1; i <= 20; i++){
				let ingredientStr = "strIngredient"+i.toString();
				let measureStr = "strMeasure"+i.toString();
				//console.log(ingredientStr, data['meals'][0][`${ingredientStr}`]);
				if (data['meals'][0][`${ingredientStr}`] === ""){
					i = 21; // exit the loop 
				}
				else{
					recipeJson['ingredients'] += data['meals'][0][`${measureStr}`]+" "+data['meals'][0][`${ingredientStr}`] + "\n";
				}	
			}
			recipeJson['instructions'] = data['meals'][0].strInstructions;
			console.log(recipeJson);
			return recipeJson;
		})
		.catch(err => console.error(err));
}

/*The translate api used here throws the following error 
  net::ERR_CONTENT_DECODING_FAILED 200 on certain events. 
  Observed list of scenarios when the error has occured:
	  1. Translating Instructions. Depends on the size of the content provided for translation. 
	  2. Doesn't work for consecutive recipe fetch and its subsequent translation. A reload is required in between */
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
					console.log(translatedRecipe);
					return translatedRecipe;
				})					
			.catch(err => console.error(err)); 
	});
	
}

/* This function needs to be written for displaying the recipes and its translation. 
   Pls feel free to extend it. */
function displayRecipe(){
	//engDisplayEl = document.getElementById("engDisplayDiv");
	//engDisplayEl.innerHTML
}


