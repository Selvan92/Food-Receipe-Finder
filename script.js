//selectors
var resultPage=$("#resultPage");
var submitButton=$("#submitButton");
var landingPage=$("#landingPage")
//dynamic elements added
var resultHeader=$("<h1>");
var engRecipe=$("<div>");
var translatedRecipe=$("<div>");
var homeButton=$("<button>");

//elements content add
homeButton.text("Home");
resultHeader.text("Recipe Name");
engRecipe.text("Ingrediants go here")
translatedRecipe.text("Translated language go's here")


//append the elements to the conatainer
resultPage.append(homeButton,resultHeader,engRecipe,translatedRecipe,homeButton);


submitButton.on("click",function showResultPage(){
    resultPage.removeClass("hide");
    landingPage.addClass("hide");
    resultPage.append(homeButton,resultHeader,engRecipe,translatedRecipe,homeButton);
    });


homeButton.on("click",
function showLandingPage(){
    landingPage.removeClass("hide");
    resultPage.addClass("hide")
})



                             