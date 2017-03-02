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
            homeHtml,
            function (responseText) {
                document.querySelector("#main-content")
                    .innerHTML = responseText;
            },
            false);
    });

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
                var menuItemsView = buildMenuItemsView(category,
                                                        menuItemsTitleHtml,
                                                        menuItemHtml);
                insertHtml("#main-content",menuItemsView);

            },false);

        }, false);

    };

    function buildMenuItemsView(categoryItem,
                                menuItemsTitleHtml,
                                menuItemHtml) {
        menuItemsTitleHtml=insertProperty(menuItemsTitleHtml,"name",categoryItem.category.name);
        menuItemsTitleHtml=insertProperty(menuItemsTitleHtml,"special_instructions",categoryItem.category.special_instructions);
        var finalHtml = menuItemsTitleHtml;
        finalHtml += "<section class='row'>";
        //TODO insert clearfix every second column
        finalHtml += "</section>";
        return finalHtml;
    }


    global.$dc = dc;

})(window);