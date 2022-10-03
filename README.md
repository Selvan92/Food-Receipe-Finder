# gLocal recipe :plate_with_cutlery:
---

### Description
This project is to build an application which finds a recipe based on the desired meal category and recipe, and translates the recipe to the requested language. 

### Installation
N/A

### Usage
To use this application, select  `Meal Category`  and `Recipes`  from the dropdown menu and choose `Languages` for the recipe to be translated to.  After that, click on the `our Glocal Recipe` button and the recipe in your requested language will appear on the page.
<br>**NOTE:** The translate api used here throws the following error `net::ERR_CONTENT_DECODING_FAILED 200` on certain events.
<br>Observed list of scenarios when the error has occurred:
      1. Translating Instructions. Depends on the size of the content provided for translation. 
      2. Doesn't work for consecutive recipe fetch and its subsequent translation. A reload is required in between 
<br>The above stated issue has been resolved. This error happens when the http request's header claim the content to be gzip encoded but it is not. Hence gzip encoding needs to be disabled at the browser end. Follow the website [Solution 1: Disabling G-Zip Encoding](https://appuals.com/how-to-fix-err_content_decoding_failed-error/)

### Credits
N/A

### License
Licensed under the MIT license. <br>Please refer to the LICENSE in the repo.

