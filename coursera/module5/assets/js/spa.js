/**
 * Created by yuri on 1/03/17.
 */

(function (global) {

    var dc = {};

    var homeHtml = "snippets/home-snippet.html";
    var allCategoriesUrl =
        "https://davids-restaurant.herokuapp.com/categories.json";
    var categoriesTitleHtml = "snippets/categories-title-snippet.html";
    var categoryHtml = "snippets/category-snippet.html";
    var menuItemsUrl =
        "https://davids-restaurant.herokuapp.com/menu_items.json?category=";
    var menuItemsTitleHtml = "snippets/menu-items-title.html";
    var menuItemHtml = "snippets/menu-item.html";

// Convenience function for inserting innerHTML for 'select'
    var insertHtml = function (selector, html) {
        var targetElem = document.querySelector(selector);
        targetElem.innerHTML = html;
    };

// Show loading icon inside element identified by 'selector'.
    var showLoading = function (selector) {
        var html = "<div class='text-center'>";
        html += "<img src='../assets/images/ajax-loader.gif'></div>";
        insertHtml(selector, html);
    };

    // Return substitute of '{{propName}}'
// with propValue in given 'string'
    var insertProperty = function (string, propName, propValue) {
        var propToReplace = "{{" + propName + "}}";
        string = string
            .replace(new RegExp(propToReplace, "g"), propValue);
        return string;
    };

// On page load (before images or CSS)
    document.addEventListener("DOMContentLoaded", function (event) {

// On first load, show home view
        showLoading("#main-content");
        $ajaxUtils.sendGetRequest(
            allCategoriesUrl,
            buildAndShowHomeHTML, //
            true); // Explicitely setting the flag to get JSON from server processed into an object literal

    });

    function buildAndShowHomeHTML (categories) {
        // Load home snippet page
        $ajaxUtils.sendGetRequest(
            homeHtml,
            function (homeHtml) {
                var chosenCategory =chooseRandomCategory(categories);
                homeHtml = insertProperty(homeHtml,"randomCategoryShortName","'"+chosenCategory.short_name+"'");
                var homeHtmlToInsertIntoMainPage = "<section class='row'>" + homeHtml + "</section>";
                insertHtml("#main-content",homeHtmlToInsertIntoMainPage);
            },
            false);
    }
    // Given array of category objects, returns a random category object.
    function chooseRandomCategory (categories) {
        // Choose a random index into the array (from 0 inclusively until array length (exclusively))
        var randomArrayIndex = Math.floor(Math.random() * categories.length);
        // return category object with that randomArrayIndex
        return categories[randomArrayIndex];
    }

    // Load the menu categories view
    dc.loadMenuCategories = function () {
        showLoading("#main-content");
        $ajaxUtils.sendGetRequest(
            allCategoriesUrl,
            buildAndShowCategoriesHTML);
    };
    // Load the item of a selected menu
    dc.loadMenuItems = function (categorie) {
        showLoading("#main-content");
        $ajaxUtils.sendGetRequest(menuItemsUrl+categorie,
            buildAndShowMenuItemsHTML);
    }


// Builds HTML for the categories page based on the data
// from the server
    function buildAndShowCategoriesHTML (categories) {
        // Load title snippet of categories page
        $ajaxUtils.sendGetRequest(
            categoriesTitleHtml,
            function (categoriesTitleHtml) {
                // Retrieve single category snippet
                $ajaxUtils.sendGetRequest(
                    categoryHtml,
                    function (categoryHtml) {
                        var categoriesViewHtml =
                            buildCategoriesViewHtml(categories,
                                categoriesTitleHtml,
                                categoryHtml);
                        insertHtml("#main-content", categoriesViewHtml);
                    },
                    false);
            },
            false);
    }


// Using categories data and snippets html
// build categories view HTML to be inserted into page
    function buildCategoriesViewHtml(categories,
                                     categoriesTitleHtml,
                                     categoryHtml) {

        var finalHtml = categoriesTitleHtml;
        finalHtml += "<section class='row'>";

        // Loop over categories
        for (var i = 0; i < categories.length; i++) {
            // Insert category values
            var html = categoryHtml;
            var name = "" + categories[i].name;
            var short_name = categories[i].short_name;
            html =
                insertProperty(html, "name", name);
            html =
                insertProperty(html,
                    "short_name",
                    short_name);
            finalHtml += html;
        }

        finalHtml += "</section>";
        return finalHtml;
    }

    //Function to fill the menu items
    function buildAndShowMenuItemsHTML(category){
        //category is a object with the data od the category and the list of items
        //load the the title snippet
        $ajaxUtils.sendGetRequest(menuItemsTitleHtml, function (menuItemsTitleHtml) {
            //load single menu snippet to build whole menu page
            $ajaxUtils.sendGetRequest(menuItemHtml, function (menuItemHtml) {
                var menuItemsView = buildMenuItemsViewHtml(category,
                    menuItemsTitleHtml,
                    menuItemHtml);
                insertHtml("#main-content",menuItemsView);

            },false);

        }, false);

    };
//todo make more clean code


// Using category and menu items data and snippets html
// build menu items view HTML to be inserted into page
    function buildMenuItemsViewHtml(categoryMenuItems,
                                    menuItemsTitleHtml,
                                    menuItemHtml) {

        menuItemsTitleHtml =
            insertProperty(menuItemsTitleHtml,
                "name",
                categoryMenuItems.category.name);
        menuItemsTitleHtml =
            insertProperty(menuItemsTitleHtml,
                "special_instructions",
                categoryMenuItems.category.special_instructions);

        var finalHtml = menuItemsTitleHtml;
        finalHtml += "<section class='row'>";

        // Loop over menu items
        var menuItems = categoryMenuItems.menu_items;
        var catShortName = categoryMenuItems.category.short_name;
        for (var i = 0; i < menuItems.length; i++) {
            // Insert menu item values
            var html = menuItemHtml;
            html =
                insertProperty(html, "short_name", menuItems[i].short_name);
            html =
                insertProperty(html,
                    "catShortName",
                    catShortName);
            html =
                insertItemPrice(html,
                    "price_small",
                    menuItems[i].price_small);
            html =
                insertItemPortionName(html,
                    "small_portion_name",
                    menuItems[i].small_portion_name);
            html =
                insertItemPrice(html,
                    "price_large",
                    menuItems[i].price_large);
            html =
                insertItemPortionName(html,
                    "large_portion_name",
                    menuItems[i].large_portion_name);
            html =
                insertProperty(html,
                    "name",
                    menuItems[i].name);
            html =
                insertProperty(html,
                    "description",
                    menuItems[i].description);

            // Add clearfix after every second menu item
            if (i % 2 != 0) {
                html +=
                    "<div class='clearfix visible-lg-block visible-md-block'></div>";
            }

            finalHtml += html;
        }

        finalHtml += "</section>";
        return finalHtml;
    }


// Appends price with '$' if price exists
    function insertItemPrice(html,
                             pricePropName,
                             priceValue) {
        // If not specified, replace with empty string
        if (!priceValue) {
            return insertProperty(html, pricePropName, "");
        }

        priceValue = "$" + priceValue.toFixed(2);
        html = insertProperty(html, pricePropName, priceValue);
        return html;
    }


// Appends portion name in parens if it exists
    function insertItemPortionName(html,
                                   portionPropName,
                                   portionValue) {
        // If not specified, return original string
        if (!portionValue) {
            return insertProperty(html, portionPropName, "");
        }

        portionValue = "(" + portionValue + ")";
        html = insertProperty(html, portionPropName, portionValue);
        return html;
    }

    global.$dc = dc;

})(window);
//todo fill the notfounded images with a placeholder
//todo put in special the name of the random selected menu and the picture