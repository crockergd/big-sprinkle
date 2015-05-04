<!DOCTYPE html>
<html>
    <head>
        <title>Big Sprinkle</title>
        <link rel="stylesheet" type="text/css" href="css/idlegame.css">
        <link rel="icon" type="image/png" href="img/sm_icon.png">
        <meta property="og:description" content="Test Big Sprinkle!" />
    </head>
    <body>
        <script>
          window.fbAsyncInit = function() {
            FB.init({
              appId      : '907835265916117',
              xfbml      : true,
              version    : 'v2.2'
            });
          };

          (function(d, s, id){
             var js, fjs = d.getElementsByTagName(s)[0];
             if (d.getElementById(id)) {return;}
             js = d.createElement(s); js.id = id;
             js.src = "//connect.facebook.net/en_US/sdk.js";
             fjs.parentNode.insertBefore(js, fjs);
           }(document, 'script', 'facebook-jssdk'));
        </script>
        <div id="target" class="center"></div>
        <script src="js/pixit.js"></script>
        <script src="js/idlegame.js"></script>
    </body>
</html>
