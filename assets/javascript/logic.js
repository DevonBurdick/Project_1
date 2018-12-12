
$(document).ready(function(){
    $("#productContainer").hide();
    $("#loadingContainer").hide();

    var shoppingList = JSON.parse(localStorage.getItem("giftList"));

    function dumpButtons(){
        $("#buttons-view").empty();
        for(var i = 0; i < shoppingList.length; i++){
            var span = $("<span>");
            var giftButton = $("<button>");
            var removeButton = $("<button>").addClass("removeButton").attr("data-name",shoppingList[i]).text("✓");
            giftButton.addClass("product-button").attr("data-name",shoppingList[i]).text(shoppingList[i]);
            span.append(removeButton, giftButton);
            $("#buttons-view").append(span);
        }
    }

    $(document.body).on("click", ".removeButton", function(){
        for (var i = 0; i < shoppingList.length; i++){
            if (shoppingList[i] === $(this).attr("data-name")){
                shoppingList.splice(i, 1);
            };
        };
        localStorage.setItem("giftList", JSON.stringify(shoppingList));
        
        $(this).parent().remove();
    });
    
    $("#add-gift").on("click", function(event){
        event.preventDefault();
        var newProduct = $("#gift-input").val().trim();
        if (newProduct !== "" && shoppingList.indexOf(newProduct)=== -1){
            shoppingList.push(newProduct);
            dumpButtons();

            localStorage.setItem("giftList", JSON.stringify(shoppingList));
            $("#gift-input").val("");
        }
        else {
            $("#gift-input").val("");
        }
    });

    function loadingGif (){
        $("#productContainer").show();
        $("#loadingContainer").hide();
    }
    
    function displayProductData (){
        $(".productInfo").empty();
        $("#productContainer").hide();    
    
        var productSearch = $(this).attr("data-name");
        
        $.ajax({
            url: "https://cors-anywhere.herokuapp.com/https://api.walmartlabs.com/v1/search?apiKey=c2dsw2ypw9kedr4kky5vw7dk&numItems=1&query=" + productSearch,
            method: "GET"
        }).then(function(response){
            // product name 
            var productName = response.items[0].name;
            var name = $("<h4>").text(productName);
            $("#prodName").append(name);
            // product price
            var productPrice = response.items[0].salePrice
            var price = $("<h5>").text("$" + productPrice + " USD");
            $("#prodPrice").append(price);
            // product image
            var productImage = response.items[0].largeImage;
            var image = $("<img>").attr({src: productImage, alt: productName});
            $("#prodImage").append(image);
            // product link
            var productLink = response.items[0].productUrl;
            var link = $("<a>").attr({href: productLink, target: "_blank"}).text("Go to product!");
            $("#prodBuy").append(link);
            // product description
            var productDescription = response.items[0].shortDescription;
            var description = $("<p>").text(productDescription);
            $("#prodDescription").append(description);
            // product rating
            var productRating = response.items[0].customerRating;
            if (productRating === undefined){
                var rating = $("<div>").text("Product rating not available");
                $("#prodRating").append(rating);
            }
            else {
                var rating = $("<div>").addClass("Ratediv").text("  " + productRating + "/5");
                $("#prodRating").append(rating);
                // product stars
                var productStars = response.items[0].customerRatingImage;
                var stars = $("<img>").addClass("stars").attr({src: productStars, alt: "  " +  productRating + "/5 stars"});
                $("#prodRatingStars").append(stars);
            };
            $.ajax({
                url: " https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&videoEmbeddable=true&maxResults=1&key=AIzaSyBxpyfAxI6oQ0SmlVVG1RLx8ArXQGYpLyY&q=" + productName + " review",          
                method: "GET"
            }).then(function(response) {
                if (response.items[0] === undefined){
                    var video = $("<p>").text("Video review not available")
                    $("#prodVideo").append(video);
                }
                else {
                    var ytVideoId = response.items[0].id.videoId;
                    var video = $("<iframe>").attr({width: "560", height: "315", src: "https://www.youtube.com/embed/" + ytVideoId, frameborder: "0", allow: "accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture", allowfullscreen: "allowfullscreen"});
                    $("#prodVideo").append(video);
                }
            });
        });
        $("#loadingContainer").show();
        setTimeout(loadingGif, 5000);
    }
    
    var clearButton = $("<button>");
    clearButton.attr("id", "clearButton").text("Clear");
    $("#clearButton").append(clearButton);
    

    $("#clearButton").on("click", function(){
        $("#prodName").empty();
        $("#prodPrice").empty();       
        $("#prodImage").empty();
        $("#prodBuy").empty();
        $("#prodDescription").empty();
         $("#prodRatingStars").empty();
        $("#prodRating").empty();
        $("#prodVideo").empty();
        $("#productContainer").hide();
    });

    $(document).on("click", ".product-button", displayProductData);


    
    if (!Array.isArray(shoppingList)){
        shoppingList = [];
    }
    dumpButtons();
});