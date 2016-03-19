/**
 * Original: http://codepen.io/msaetre/pen/nlsJL
 * Minor modifications by Jon Miranda.
 */
var mouse = {x: 0, y: 0};
var myWidth = 0, myHeight = 0;
var mouseIsDown = false;
var mouseIsDownDivision = false;

var getRadians = function(degrees) {
    return degrees * Math.PI / 180;
};

// TODO: Cool idea would be to calculate "sunrise" and "sunset" based on location.
var getXYForTime = function(hour, minutes) {
    var xCenter = $(window).width() / 2;
    var yCenter = $(window).height() / 1.5;

    var hour_percentage = (hour / 23);
    var minute_percentage = (minutes / 60) / 60;

    var degrees = (hour_percentage + minute_percentage) * 360;
    var degrees_offset = 90;
    var radius = yCenter;
    var theta = getRadians(degrees + degrees_offset);
    var x = xCenter + (radius * Math.cos(theta));
    var y = yCenter + (radius * Math.sin(theta));
    return {x : x, y: y};
};

var setTime = function(time) {
    var xy = getXYForTime(time.getHours(), time.getMinutes());
    mouse.x = xy.x;
    mouse.y = xy.y;
    update();
};

var debug_test_date = new Date();
var debug_test_hours = debug_test_date.getHours();
var debug_test_minutes = debug_test_date.getMinutes();
var animate_day = function() {
    var debug = true;
    if (debug) {
        setInterval(function() {
            debug_test_minutes += 1;
            if (debug_test_minutes == 60) {
                debug_test_hours += 1;
                debug_test_minutes = 0;
            }
            debug_test_date.setHours(debug_test_hours);
            debug_test_date.setMinutes(debug_test_minutes);
            setTime(debug_test_date)
        }, 1);
    }
};

var setTimeWrapper = function() {
    setTime(new Date());
};

window.addEventListener('load', setTimeWrapper, false);
window.addEventListener('resize', setTimeWrapper, false);

var update = function() {
    updateDimensions();

    document.getElementById("sun").style.background = '-webkit-radial-gradient(' + mouse.x + 'px ' + mouse.y + 'px, circle, rgba(242,248,247,1) 0%,rgba(249,249,28,1) 3%,rgba(247,214,46,1) 8%, rgba(248,200,95,1) 12%,rgba(201,165,132,1) 30%,rgba(115,130,133,1) 51%,rgba(46,97,122,1) 85%,rgba(24,75,106,1) 100%)';
    document.getElementById("sun").style.background = '-moz-radial-gradient(' + mouse.x + 'px ' + mouse.y + 'px, circle, rgba(242,248,247,1) 0%,rgba(249,249,28,1) 3%,rgba(247,214,46,1) 8%, rgba(248,200,95,1) 12%,rgba(201,165,132,1) 30%,rgba(115,130,133,1) 51%,rgba(46,97,122,1) 85%,rgba(24,75,106,1) 100%)';
    document.getElementById("sun").style.background = '-ms-radial-gradient(' + mouse.x + 'px ' + mouse.y + 'px, circle, rgba(242,248,247,1) 0%,rgba(249,249,28,1) 3%,rgba(247,214,46,1) 8%, rgba(248,200,95,1) 12%,rgba(201,165,132,1) 30%,rgba(115,130,133,1) 51%,rgba(46,97,122,1) 85%,rgba(24,75,106,1) 100%)';

    document.getElementById("sunDay").style.background = '-webkit-radial-gradient(' + mouse.x + 'px ' + mouse.y + 'px, circle, rgba(252,255,251,0.9) 0%,rgba(253,250,219,0.4) 30%,rgba(226,219,197,0.01) 70%, rgba(226,219,197,0.0) 70%,rgba(201,165,132,0) 100%)';
    document.getElementById("sunDay").style.background = '-moz-radial-gradient(' + mouse.x + 'px ' + mouse.y + 'px, circle, rgba(252,255,251,0.9) 0%,rgba(253,250,219,0.4) 30%,rgba(226,219,197,0.01) 70%, rgba(226,219,197,0.0) 70%,rgba(201,165,132,0) 100%)';
    document.getElementById("sunDay").style.background = '-ms-radial-gradient(' + mouse.x + 'px ' + mouse.y + 'px, circle, rgba(252,255,251,0.9) 0%,rgba(253,250,219,0.4) 30%,rgba(226,219,197,0.01) 70%, rgba(226,219,197,0.0) 70%,rgba(201,165,132,0) 100%)';

    document.getElementById("sunSet").style.background = '-webkit-radial-gradient(' + mouse.x + 'px ' + mouse.y + 'px, circle, rgba(254,255,255,0.8) 5%,rgba(236,255,0,1) 10%,rgba(253,50,41,1) 25%, rgba(243,0,0,1) 40%,rgba(93,0,0,1) 100%)';
    document.getElementById("sunSet").style.background = '-moz-radial-gradient(' + mouse.x + 'px ' + mouse.y + 'px, circle, rgba(254,255,255,0.8) 5%,rgba(236,255,0,1) 10%,rgba(253,50,41,1) 25%, rgba(243,0,0,1) 40%,rgba(93,0,0,1) 100%)';
    document.getElementById("sunSet").style.background = '-ms-radial-gradient(' + mouse.x + 'px ' + mouse.y + 'px, circle, rgba(254,255,255,0.8) 5%,rgba(236,255,0,1) 10%,rgba(253,50,41,1) 25%, rgba(243,0,0,1) 40%,rgba(93,0,0,1) 100%)';

    document.getElementById("waterReflectionContainer").style.perspectiveOrigin = (mouse.x / myWidth * 100).toString() + "% -15%";
    document.getElementById("waterReflectionMiddle").style.left = (mouse.x - myWidth - (myWidth * .03)).toString() + "px";

    var bodyWidth = document.getElementsByTagName("body")[0].clientWidth;

    document.getElementById("sun").style.width = (bodyWidth);
    document.getElementById("sun").style.left = "0px";
    document.getElementById("sunDay").style.width = (bodyWidth);
    document.getElementById("sunDay").style.left = "0px";

    var sky = document.getElementById("sun");
    var water = document.getElementById("water");
    document.getElementById("darknessOverlay").style.opacity = Math.min((mouse.y - (myHeight / 2)) / (myHeight / 2), 1);
    document.getElementById("darknessOverlaySky").style.opacity = Math.min((mouse.y - (myHeight * 7 / 10)) / (myHeight - (myHeight * 7 / 10)), 1);
    document.getElementById("moon").style.opacity = Math.min((mouse.y - (myHeight * 9 / 10)) / (myHeight - (myHeight * 9 / 10)), 0.65);
    document.getElementById("horizonNight").style.opacity = (mouse.y - (myHeight * 4 / 5)) / (myHeight - (myHeight * 4 / 5));

    document.getElementById("starsContainer").style.opacity = (mouse.y / myHeight - 0.6);

    document.getElementById("waterDistance").style.opacity = (mouse.y / myHeight + 0.6);
    document.getElementById("sunDay").style.opacity = (1 - mouse.y / myHeight);
    document.getElementById("sky").style.opacity = Math.min((1 - mouse.y / myHeight), 0.99);

    document.getElementById("sunSet").style.opacity = (mouse.y / myHeight - 0.2);


    if (mouse.y > 0) {
        var clouds = document.getElementsByClassName("cloud");
        for (var i = 0; i < clouds.length; i++) {
            clouds[i].style.left = Math.min(myWidth * (Math.pow(mouse.y, 2) / Math.pow(myHeight / 2, 2)) * -1, 0);
        }

        var stars = document.getElementsByClassName('star');
        for (var i = 0; i < stars.length; i++) {
            stars[i].style.opacity = (mouse.y / myHeight - 0.6);
        }


        if (mouse.y > myHeight / 2) {
            document.getElementById("sun").style.opacity = Math.min((myHeight - mouse.y) / (myHeight / 2) + 0.2, 0.5);
            document.getElementById("horizon").style.opacity = (myHeight - mouse.y) / (myHeight / 2) + 0.2;

            document.getElementById("waterReflectionMiddle").style.opacity = (myHeight - mouse.y) / (myHeight / 2) - 0.1;
        } else {
            document.getElementById("horizon").style.opacity = Math.min(mouse.y / (myHeight / 2), 0.99);

            document.getElementById("sun").style.opacity = Math.min(mouse.y / (myHeight / 2), 0.5);
            document.getElementById("waterReflectionMiddle").style.opacity = mouse.y / (myHeight / 2) - 0.1;
        }

    } else if (mouseIsDownDivision) {
        var sunElement = document.getElementById("sun");
        var water = document.getElementById("water");
        var division = document.getElementById("division");
        sunElement.style.height = (mouse.y).toString() + "px";
        document.getElementById("sunDay").style.height = (mouse.y).toString() + "px";
        division.style.top = (mouse.y).toString() + "px";
        var waterHeight = myHeight - mouse.y;
        water.style.height = waterHeight.toString() + "px";

        document.getElementById("sun").style.height = (mouse.y).toString() + "px";
        document.getElementById("sunDay").style.height = (mouse.y).toString() + "px";
        document.getElementById("horizon").style.height = (mouse.y).toString() + "px";
        document.getElementById("waterDistance").style.height = (myHeight - mouse.y).toString() + "px";
        document.getElementById("oceanRippleContainer").style.height = (myHeight - mouse.y).toString() + "px";
        document.getElementById("darknessOverlay").style.height = (myHeight - mouse.y).toString() + "px";
    }


};

function updateDimensions() {
    if (typeof( window.innerWidth ) == 'number') {
        // Non-IE
        myWidth = window.innerWidth;
        myHeight = window.innerHeight;
    } else if (document.documentElement && ( document.documentElement.clientWidth || document.documentElement.clientHeight )) {
        myWidth = document.documentElement.clientWidth;
        myHeight = document.documentElement.clientHeight;
    } else if (document.body && ( document.body.clientWidth || document.body.clientHeight )) {
        myWidth = document.body.clientWidth;
        myHeight = document.body.clientHeight;
    }

}

function startMove() {
    mouseIsDown = true;
}

function stopMove() {
    mouseIsDown = false;
    mouseIsDownDivision = false;
    var sky = document.getElementById("sun");
}

function startDraggingDivision() {
    mouseIsDownDivision = true;
}

function windowResize() {
    updateDimensions();
    // update to new sky height
    skyHeight = document.getElementById("sun").clientHeight;
    document.getElementById("waterDistance").style.height = myHeight - skyHeight;
    document.getElementById("division").style.top = skyHeight;
}