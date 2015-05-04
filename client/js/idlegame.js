// Load them google fonts before starting...!
WebFontConfig = {
    google: {
        families: [ 'Snippet', 'Lato' ]
    },

    active: function() {
        init();
    }
};
(function() {
    var wf = document.createElement('script');
    wf.src = ('https:' == document.location.protocol ? 'https' : 'http') +
        '://ajax.googleapis.com/ajax/libs/webfont/1/webfont.js';
    wf.type = 'text/javascript';
    wf.async = 'true';
    var s = document.getElementsByTagName('script')[0];
    s.parentNode.insertBefore(wf, s);
})();

function init() {
    // Socket
    var socket = new WebSocket("ws://localhost:5700/");
    socket.onopen = connection_open;
    socket.onclose = connection_close;
    socket.onmessage = connection_msg;
    socket.onerror = connection_error;

    // Init
    var init_width = 768;
    var init_height = 586;
    var stage = new PIXI.Stage(0xFFE470);
    var renderer = PIXI.autoDetectRenderer(init_width, init_height);
    var target = document.getElementById("target");
    target.appendChild(renderer.view);

    // Textures
    var tx_donut = PIXI.Texture.fromImage("img/donut.png");
    var tx_thumb_farm = PIXI.Texture.fromImage("img/thumb_farm.png");
    var tx_thumb_factory = PIXI.Texture.fromImage("img/thumb_factory.png");
    var tx_thumb_lab = PIXI.Texture.fromImage("img/thumb_lab.png");
    var tx_thumb_wizard = PIXI.Texture.fromImage("img/thumb_wizard.png");
    var tx_thumb_planet = PIXI.Texture.fromImage("img/thumb_planet.png");
    var tx_blue_sprinkle = PIXI.Texture.fromImage("img/blue_sprinkle.png");
    var tx_pink_sprinkle = PIXI.Texture.fromImage("img/pink_sprinkle.png");
    var tx_yellow_sprinkle = PIXI.Texture.fromImage("img/yellow_sprinkle.png");
    var tx_icon_scores = PIXI.Texture.fromImage("img/icon_scores.png");
    var tx_icon_post = PIXI.Texture.fromImage("img/icon_post.png");
    var tx_icon_share = PIXI.Texture.fromImage("img/icon_share.png");
    var tx_hs_asset = PIXI.Texture.fromImage("img/hs_asset.png");

    // Data
    var buffer = 35;
    var upg_buffer = 108;
    var con_left = 15;
    var con_down = 5;
    var con_space = 15;
    var container_upg1 = new PIXI.DisplayObjectContainer();
    var container_upg2 = new PIXI.DisplayObjectContainer();
    var container_upg3 = new PIXI.DisplayObjectContainer();
    var container_upg4 = new PIXI.DisplayObjectContainer();
    var container_upg5 = new PIXI.DisplayObjectContainer();
    var container_stats = new PIXI.DisplayObjectContainer();
    var container_icons = new PIXI.DisplayObjectContainer();
    var container_scores = new PIXI.DisplayObjectContainer();

    // Renderables
    var donut = new PIXI.Sprite(tx_donut);
    var ui_1 = new PIXI.Sprite(tx_yellow_sprinkle);
    var ui_thumb_1 = new PIXI.Sprite(tx_thumb_farm);
    var ui_2 = new PIXI.Sprite(tx_pink_sprinkle);
    var ui_thumb_2 = new PIXI.Sprite(tx_thumb_factory);
    var ui_3 = new PIXI.Sprite(tx_blue_sprinkle);
    var ui_thumb_3 = new PIXI.Sprite(tx_thumb_lab);
    var ui_4 = new PIXI.Sprite(tx_yellow_sprinkle);
    var ui_thumb_4 = new PIXI.Sprite(tx_thumb_wizard);
    var ui_5 = new PIXI.Sprite(tx_pink_sprinkle);
    var ui_thumb_5 = new PIXI.Sprite(tx_thumb_planet);
    var icon_post = new PIXI.Sprite(tx_icon_post);
    var icon_scores = new PIXI.Sprite(tx_icon_scores);
    var icon_share = new PIXI.Sprite(tx_icon_share);
    var hs_asset = new PIXI.Sprite(tx_hs_asset);

    donut.anchor.x = 0.5;
    donut.anchor.y = 0.5;
    donut.position.x = (init_width / 2) + 185;
    donut.position.y = 185;
    donut.interactive = true;
    donut.mousedown = donut.touch = donut_click;

    container_upg1.position.x = buffer;
    container_upg1.position.y = buffer;
    container_upg1.interactive = true;
    container_upg1.mousedown = container_upg1.touch = buy_upg_1;

    container_upg2.position.x = buffer;
    container_upg2.position.y = buffer + upg_buffer;
    container_upg2.interactive = true;
    container_upg2.mousedown = container_upg2.touch = buy_upg_2;

    container_upg3.position.x = buffer;
    container_upg3.position.y = buffer + upg_buffer * 2;
    container_upg3.interactive = true;
    container_upg3.mousedown = container_upg3.touch = buy_upg_3;

    container_upg4.position.x = buffer;
    container_upg4.position.y = buffer + upg_buffer * 3;
    container_upg4.interactive = true;
    container_upg4.mousedown = container_upg4.touch = buy_upg_4;

    container_upg5.position.x = buffer;
    container_upg5.position.y = buffer + upg_buffer * 4;
    container_upg5.interactive = true;
    container_upg5.mousedown = container_upg5.touch = buy_upg_5;

    container_icons.position.x = init_width / 2 + buffer;
    container_icons.position.y = init_height - buffer * 3;
    icon_post.interactive = true;
    icon_post.mousedown = icon_post.touch = post_highscore;
    icon_scores.interactive = true;
    icon_scores.mousedown = icon_scores.touch = get_highscore;
    icon_scores.position.x += buffer * 3;
    icon_share.interactive = true;
    icon_share.mousedown = icon_share.touch = fb_share;
    icon_share.position.x += buffer * 6;

    container_scores.interactive = true;
    container_scores.mousedown = container_scores.touch = close_scores;
    container_scores.visible = false;

    container_scores.addChild(hs_asset);
    container_scores.position.x = 50;
    container_scores.position.y = 50;

    ui_thumb_1.position.x = con_space + con_left;
    ui_thumb_1.position.y = 10 + con_down;
    ui_thumb_2.position.x = con_space + con_left;
    ui_thumb_2.position.y = 10 + con_down;
    ui_thumb_3.position.x = con_space + con_left;
    ui_thumb_3.position.y = 10 + con_down;
    ui_thumb_4.position.x = con_space + con_left;
    ui_thumb_4.position.y = 10 + con_down;
    ui_thumb_5.position.x = con_space + con_left;
    ui_thumb_5.position.y = 10 + con_down;

    stage.addChild(donut);
    container_upg1.addChild(ui_1);
    container_upg1.addChild(ui_thumb_1);
    container_upg2.addChild(ui_2);
    container_upg2.addChild(ui_thumb_2);
    container_upg3.addChild(ui_3);
    container_upg3.addChild(ui_thumb_3);
    container_upg4.addChild(ui_4);
    container_upg4.addChild(ui_thumb_4);
    container_upg5.addChild(ui_5);
    container_upg5.addChild(ui_thumb_5);
    container_icons.addChild(icon_post);
    container_icons.addChild(icon_scores);
    container_icons.addChild(icon_share);

    // Text
    var text_format = {font:"14px Lato", fill:"white"};
    var text_format_stats = {font:"22px Snippet", fill:"white", stroke:"#666", strokeThickness:2}
    var text_format_big = {font:"20px Snippet", fill:"white"};
    var text_format_owned = {font:"28px Snippet", fill:"white"};

    var text_sprinkle_current = new PIXI.Text("Current Sprinkles: 0", text_format_stats);
    var text_sps = new PIXI.Text("Sprinkles Per Second: 0", text_format_stats);
    var text_sprinkle_total = new PIXI.Text("Total Sprinkles Earned: 0", text_format_stats);

    var text_upg1_desc = new PIXI.Text("SPRINKLE FARM", text_format_big);
    var text_upg1_sps = new PIXI.Text("SPS: 0", text_format);
    var text_upg1_owned = new PIXI.Text("0", text_format_owned);
    var text_upg1_cost = new PIXI.Text("Cost: 0", text_format);

    var text_upg2_desc = new PIXI.Text("SPRINKLE FACTORY", text_format_big);
    var text_upg2_sps = new PIXI.Text("SPS: 0", text_format);
    var text_upg2_owned = new PIXI.Text("0", text_format_owned);
    var text_upg2_cost = new PIXI.Text("Cost: 0", text_format);

    var text_upg3_desc = new PIXI.Text("SPRINKLE LAB", text_format_big);
    var text_upg3_sps = new PIXI.Text("SPS: 0", text_format);
    var text_upg3_owned = new PIXI.Text("0", text_format_owned);
    var text_upg3_cost = new PIXI.Text("Cost: 0", text_format);

    var text_upg4_desc = new PIXI.Text("SPRINKLE WIZARD", text_format_big);
    var text_upg4_sps = new PIXI.Text("SPS: 0", text_format);
    var text_upg4_owned = new PIXI.Text("0", text_format_owned);
    var text_upg4_cost = new PIXI.Text("Cost: 0", text_format);

    var text_upg5_desc = new PIXI.Text("SPRINKLE PLANET", text_format_big);
    var text_upg5_sps = new PIXI.Text("SPS: 0", text_format);
    var text_upg5_owned = new PIXI.Text("0", text_format_owned);
    var text_upg5_cost = new PIXI.Text("Cost: 0", text_format);

    var text_score_desc = new PIXI.Text("HIGH SCORES", text_format_stats);
    var text_scores = [];
    for (i=0; i < 9; i++) {
        text_scores[i] = new PIXI.Text("User 0 : 0", text_format_stats);
        text_scores[i].visible = false;
    }

    container_stats.width = 300;
    container_stats.height = 300;
    container_stats.position.x = init_width / 2 + buffer;
    container_stats.position.y = init_height / 2 + buffer + 40;
    text_sps.position.y = buffer;
    text_sprinkle_total.position.y = buffer * 2;

    text_upg1_desc.position.x = 80 + con_left;
    text_upg1_desc.position.y = 10 + con_down;
    text_upg1_owned.anchor.x = 0.5;
    text_upg1_owned.anchor.y = 0.5;
    text_upg1_owned.position.x = 290 + con_left;
    text_upg1_owned.position.y = 40 + con_down;
    text_upg1_sps.position.x = 80 + con_left;
    text_upg1_sps.position.y = 56 + con_down;
    text_upg1_cost.position.x = 170 + con_left;
    text_upg1_cost.position.y = 56 + con_down;

    text_upg2_desc.position.x = 80 + con_left;
    text_upg2_desc.position.y = 10 + con_down;
    text_upg2_owned.anchor.x = 0.5;
    text_upg2_owned.anchor.y = 0.5;
    text_upg2_owned.position.x = 290 + con_left;
    text_upg2_owned.position.y = 40 + con_down;
    text_upg2_sps.position.x = 80 + con_left;
    text_upg2_sps.position.y = 56 + con_down;
    text_upg2_cost.position.x = 170 + con_left;
    text_upg2_cost.position.y = 56 + con_down;

    text_upg3_desc.position.x = 80 + con_left;
    text_upg3_desc.position.y = 10 + con_down;
    text_upg3_owned.anchor.x = 0.5;
    text_upg3_owned.anchor.y = 0.5;
    text_upg3_owned.position.x = 290 + con_left;
    text_upg3_owned.position.y = 40 + con_down;
    text_upg3_sps.position.x = 80 + con_left;
    text_upg3_sps.position.y = 56 + con_down;
    text_upg3_cost.position.x = 170 + con_left;
    text_upg3_cost.position.y = 56 + con_down;

    text_upg4_desc.position.x = 80 + con_left;
    text_upg4_desc.position.y = 10 + con_down;
    text_upg4_owned.anchor.x = 0.5;
    text_upg4_owned.anchor.y = 0.5;
    text_upg4_owned.position.x = 290 + con_left;
    text_upg4_owned.position.y = 40 + con_down;
    text_upg4_sps.position.x = 80 + con_left;
    text_upg4_sps.position.y = 56 + con_down;
    text_upg4_cost.position.x = 170 + con_left;
    text_upg4_cost.position.y = 56 + con_down;

    text_upg5_desc.position.x = 80 + con_left;
    text_upg5_desc.position.y = 10 + con_down;
    text_upg5_owned.anchor.x = 0.5;
    text_upg5_owned.anchor.y = 0.5;
    text_upg5_owned.position.x = 290 + con_left;
    text_upg5_owned.position.y = 40 + con_down;
    text_upg5_sps.position.x = 80 + con_left;
    text_upg5_sps.position.y = 56 + con_down;
    text_upg5_cost.position.x = 170 + con_left;
    text_upg5_cost.position.y = 56 + con_down;

    container_upg1.addChild(text_upg1_desc);
    container_upg1.addChild(text_upg1_sps);
    container_upg1.addChild(text_upg1_owned);
    container_upg1.addChild(text_upg1_cost);

    container_upg2.addChild(text_upg2_desc);
    container_upg2.addChild(text_upg2_sps);
    container_upg2.addChild(text_upg2_owned);
    container_upg2.addChild(text_upg2_cost);

    container_upg3.addChild(text_upg3_desc);
    container_upg3.addChild(text_upg3_sps);
    container_upg3.addChild(text_upg3_owned);
    container_upg3.addChild(text_upg3_cost);

    container_upg4.addChild(text_upg4_desc);
    container_upg4.addChild(text_upg4_sps);
    container_upg4.addChild(text_upg4_owned);
    container_upg4.addChild(text_upg4_cost);

    container_upg5.addChild(text_upg5_desc);
    container_upg5.addChild(text_upg5_sps);
    container_upg5.addChild(text_upg5_owned);
    container_upg5.addChild(text_upg5_cost);

    container_stats.addChild(text_sprinkle_current);
    container_stats.addChild(text_sps);
    container_stats.addChild(text_sprinkle_total);

    text_score_desc.position.x = buffer;
    text_score_desc.position.y = buffer;
    container_scores.addChild(text_score_desc);
    for (i=0; i < text_scores.length; i++) {
        text_scores[i].position.x = buffer;
        text_scores[i].position.y = buffer * (i + 2);
        container_scores.addChild(text_scores[i]);
    }

    stage.addChild(container_upg1);
    stage.addChild(container_upg2);
    stage.addChild(container_upg3);
    stage.addChild(container_upg4);
    stage.addChild(container_upg5);
    stage.addChild(container_stats);
    stage.addChild(container_icons);
    stage.addChild(container_scores);

    // Render
    requestAnimFrame(update);
    function update() {
        if (donut.scale.x < 1) {
            donut.scale.x += 0.01;
        } else if (donut.scale.x > 1) {
            donut.scale.x = 1;
        }

        if (donut.scale.y < 1) {
            donut.scale.y += 0.01;
        } else if (donut.scale.x > 1) {
            donut.scale.y = 1;
        }

        requestAnimFrame(update);
        renderer.render(stage);
    }

    // Action Callbacks
    function donut_click() {
        donut.scale.x -= 0.06;
        donut.scale.y -= 0.06;
        var msg = {
            type: "donut"
        };

        socket.send(JSON.stringify(msg));
    }

    function buy_upg_1() {
        var msg = {
            type: "upg1"
        };

        socket.send(JSON.stringify(msg));
    }

    function buy_upg_2() {
        var msg = {
            type: "upg2"
        };

        socket.send(JSON.stringify(msg));
    }

    function buy_upg_3() {
        var msg = {
            type: "upg3"
        };

        socket.send(JSON.stringify(msg));
    }

    function buy_upg_4() {
        var msg = {
            type: "upg4"
        };

        socket.send(JSON.stringify(msg));
    }

    function buy_upg_5() {
        var msg = {
            type: "upg5"
        };

        socket.send(JSON.stringify(msg));
    }

    function post_highscore() {
        var msg = {
            type: "score"
        };

        socket.send(JSON.stringify(msg));
    }

    function get_highscore() {
        // Http
        var xmlhttp = new XMLHttpRequest();

        xmlhttp.onreadystatechange = function() {
            if(xmlhttp.readyState == 4 && xmlhttp.status == 200) {
                var msg = JSON.parse(xmlhttp.responseText);
                for (i=0; i < msg.length; i++) {
                    text_scores[i].setText("Name: " + msg[msg.length-(1+i)].name + " Score: " + msg[msg.length-(1+i)].score);
                    text_scores[i].visible = true;
                }
            }
        }

        xmlhttp.open("GET", "/scores", true);
        xmlhttp.send();

        container_scores.visible = true;
    }

    function close_scores() {
        container_scores.visible = false;
    }

    function fb_share() {
        FB.ui({
  method: 'share',
  href: 'https://www.facebook.com/dialog/share?app_id=145634995501895&display=popup&href=https%3A%2F%2Fdevelopers.facebook.com%2Fdocs%2F&redirect_uri=https%3A%2F%2Fdevelopers.facebook.com%2Ftools%2Fexplorer',
}, function(response){});
    }

    // Socket Callbacks
    function connection_msg(event) {
        var msg = JSON.parse(event.data);
        switch(msg.type) {
            case "init":
                text_upg1_cost.setText("Cost: " + msg.upg1_cost);
                text_upg1_sps.setText("SPS: " + msg.upg1_cps);
                text_upg2_cost.setText("Cost: " + msg.upg2_cost);
                text_upg2_sps.setText("SPS: " + msg.upg2_cps);
                text_upg3_cost.setText("Cost: " + msg.upg3_cost);
                text_upg3_sps.setText("SPS: " + msg.upg3_cps);
                text_upg4_cost.setText("Cost: " + msg.upg4_cost);
                text_upg4_sps.setText("SPS: " + msg.upg4_cps);
                text_upg5_cost.setText("Cost: " + msg.upg5_cost);
                text_upg5_sps.setText("SPS: " + msg.upg5_cps);
                break;
            case "values":
                text_sprinkle_current.setText("Current Sprinkles: " + Math.floor(msg.currency));
                text_sps.setText("Sprinkles Per Second: " + Math.floor(msg.cps));
                text_sprinkle_total.setText("Total Sprinkles Earned: " + Math.floor(msg.total));
                break;
            case "upg1_status":
                if(msg.status) {
                    text_upg1_owned.setText(msg.count);
                    text_upg1_cost.setText("Cost: " + Math.floor(msg.cost));
                } else {
                    console.log("Not enough sprinkles"); // fix
                }
                break;
            case "upg2_status":
                if(msg.status) {
                    text_upg2_owned.setText(msg.count);
                    text_upg2_cost.setText("Cost: " + Math.floor(msg.cost));
                } else {
                    console.log("Not enough sprinkles"); // fix
                }
                break;
            case "upg3_status":
                if(msg.status) {
                    text_upg3_owned.setText(msg.count);
                    text_upg3_cost.setText("Cost: " + Math.floor(msg.cost));
                } else {
                    console.log("Not enough sprinkles"); // fix
                }
                break;
            case "upg4_status":
                if(msg.status) {
                    text_upg4_owned.setText(msg.count);
                    text_upg4_cost.setText("Cost: " + Math.floor(msg.cost));
                } else {
                    console.log("Not enough sprinkles"); // fix
                }
                break;
            case "upg5_status":
                if(msg.status) {
                    text_upg5_owned.setText(msg.count);
                    text_upg5_cost.setText("Cost: " + Math.floor(msg.cost));
                } else {
                    console.log("Not enough sprinkles"); // fix
                }
                break;
        }
    }

    function connection_error(event) {
        console.log("Error: " + event.data);
    }

    function connection_open(event) {
        console.log("Connected to server");
    }

    function connection_close(event) {
        console.log("Connection closed")
    }
}
