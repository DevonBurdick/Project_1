
$(document).ready(function(){

    var shoppingList = [];
    var giftCount = 0
    
    function dumpButtons(){
        $("#buttons-view").empty();
        for(var i = 0; i < shoppingList.length; i++){
            var span = $("<span>");
            var giftButton = $("<button>");
            var removeButton = $("<button>").addClass("removeButton").text("x");
            giftButton.addClass("product-button").attr("data-name",shoppingList[i]).attr("id", "gift-" + giftCount).text(shoppingList[i]);
            span.append(removeButton, giftButton);
            $("#buttons-view").append(span);
        }
    }

    $(document.body).on("click", ".removeButton", function(){
        $(this).parent().remove();
    });
    
    $("#add-gift").on("click", function(event){
        event.preventDefault();
        var newProduct = $("#gift-input").val().trim();
        shoppingList.push(newProduct);
        dumpButtons();
        $("#gift-input").val("");
        

    });
    
    function displayProductData (){
        $(".productInfo").empty();
    
        var productSearch = $(this).attr("data-name");
        console.log(productSearch);
        
        $.ajax({
            url: "http://cors-anywhere.herokuapp.com/https://api.walmartlabs.com/v1/search?apiKey=c2dsw2ypw9kedr4kky5vw7dk&numItems=1&query=" + productSearch,
            method: "GET"
        }).then(function(response){
            console.log(response.items[0]);
            // product name 
            var productName = response.items[0].name;
            var name = $("<h1>").text(productName);
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
            var rating = $("<p>").text(productRating + "/5");
            $("#prodRating").append(rating);
            // product stars
            var productStars = response.items[0].customerRatingImage;
            var stars = $("<img>").attr({src: productStars, alt: productRating + "/5 stars"});
            $("#prodRating").append(stars);
            $.ajax({
                url: " https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&videoEmbeddable=true&maxResults=1&key=AIzaSyBxpyfAxI6oQ0SmlVVG1RLx8ArXQGYpLyY&q=" + productName + " review",          
                method: "GET"
            }).then(function(response) {
                console.log(response);
                var videoId = response.items[0].id.videoId;
                var video = $("<iframe>").attr({width: "560", height: "315", src: "https://www.youtube.com/embed/" + videoId, frameborder: "0", allow: "accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture", allowfullscreen: "allowfullscreen"});
                $("#prodVideo").append(video);
            });
        });
    }
    
    $(document).on("click", ".product-button", displayProductData);
})