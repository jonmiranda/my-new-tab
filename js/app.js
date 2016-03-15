var should_hide = function(time) {
    if (time == undefined || time == "undefined") {
        return false;
    }
    try {
        var today = new Date();
        var then = new Date(JSON.parse(time));
        return today.getDate() > then.getDate();
    } catch (err) {
        return false;
    }
};

var build_checkbox = function(time) {
    var checked = !(!time || time == undefined || time == "undefined");
    var check_string = checked ? " checked " : "";
    return "<input type='checkbox'" + check_string + "data-done-time='" + time + "' class='done_button'>";
};

var build_li = function(li_class, created_time, done_time, text) {
    return "<li class='" + li_class + "'>"
        + build_checkbox(done_time)
        + "<button type='button' class='delete_button'>X</button>"
        + "<input class='text' type='text' value='" + text + "' data-created-time='" + created_time + "'/>"
        + "</li>";
}

var loadList = function (id, list) {
    if (list == undefined) {
        list = []
    }

    for (var i = 0; i < list.length; ++i) {
        var text = list[i]['text'];
        var done_time = list[i]['done_time'];
        var created_time = list[i]['created_time'];
        var li_class = should_hide(done_time) ? " hide " : "";
        $("#" + id + " ul").append(build_li(li_class, created_time, done_time, text));
    }
    return list;
};

var loadQuote = function(quote) {
    var threshold = 2 * 60 * 60 * 1000;
    var now = new Date();
    if (!quote || (now - new Date(JSON.parse(quote['time'])) > threshold)) {
        get_new_quote();
    } else {
        display_quote(quote['quote']);
    }
};

// TODO: Sync between tabs chrome.storage.onChanged.addListener(function(changes, namespace).
var loadItemsFromStorage = function () {
    chrome.storage.local.get(["must_do", "tasks", "quote"], function (storage) {
        loadList("must-do", storage.must_do);
        loadList("tasks", storage.tasks);
        loadQuote(storage.quote);
    });
};

var saveItems = function () {
    console.log("Saving items...");

    var must_do = [];
    var tasks = [];

    var lists = [must_do, tasks];
    var ids = ["must-do", "tasks"];
    for (var i = 0; i < ids.length; ++i) {
        $("#" + ids[i] + " li").each(function () {
            var done_time = $(this).children(".done_button").data("done-time");
            var created_time = $(this).children(".text").data("created-time");
            var text = $(this).children(".text").val();
            var data = {"text" : text, "done_time" : done_time, "created_time" : created_time};
            lists[i].push(data);
        });
    }

    chrome.storage.local.set(
        {'must_do': must_do, 'tasks': tasks},
        function () {
            if (chrome.runtime.lastError) {
                console.log(chrome.runtime.lastError);
            }
        });
};

var display_quote = function(quote) {
    $("#quote").html(quote);
}

var get_new_quote = function() {
    $.ajax({
       url: "http://api.forismatic.com/api/1.0/?method=getQuote&lang=en&format=json",
        success: function(result) {
            var quote = result['quoteText'];
            display_quote(quote);
            quote = {"quote": quote, "time": JSON.stringify(new Date())};
            chrome.storage.local.set({"quote": quote});
        }
    });
};

$(function () {
    $("#sortable1, #sortable2").sortable({
        connectWith: ".connectedSortable",
        update: function(event, ui) {
            saveItems();
        }
    }).disableSelection();

    loadItemsFromStorage();

    $("body").on("change keyup paste", '.text', function () {
        saveItems();
    });

    $("body").on("click", '.delete_button', function () {
        $(this).parent().remove();
        saveItems();
    });

    $("body").on("change", '.done_button', function () {
        $(this).removeAttr('data-done-time');
        if ($(this).is(':checked')) {
            $(this).attr('data-done-time', JSON.stringify(new Date()));
        }
        saveItems();
    });


    $("#quote").click(function() {
        get_new_quote();
    });

    $("#sortable2").hide();

    $("#toggle_tasks").click(function() {
        $("#sortable2").toggle(500);
    });

    $(".add-item").each(function () {
        $(this).on("click", function () {
            var selector = "#" + $(this).data('parent-id') + " ul";
            $(selector).append(build_li("", JSON.stringify(new Date()), false, ""));
            $(selector + " li:last-child input").focus();
        });
    });

    // http://www.sitepoint.com/javascript-generate-lighter-darker-color/
    function ColorLuminance(hex, lum) {
        // validate hex string
        hex = String(hex).replace(/[^0-9a-f]/gi, '');
        if (hex.length < 6) {
            hex = hex[0]+hex[0]+hex[1]+hex[1]+hex[2]+hex[2];
        }
        lum = lum || 0;

        // convert to decimal and change luminosity
        var rgb = "#", c, i;
        for (i = 0; i < 3; i++) {
            c = parseInt(hex.substr(i*2,2), 16);
            c = Math.round(Math.min(Math.max(0, c + (c * lum)), 255)).toString(16);
            rgb += ("00"+c).substr(c.length);
        }

        return rgb;
    }

    // TODO: See https://www.reddit.com/r/InternetIsBeautiful/comments/2p94dk/this_site_calculates_the_hex_colour_of_the/
    function displayTime() {
        var d = new Date();
        var h = d.getHours();
        var m = d.getMinutes();
        var s = d.getSeconds();

        if(h <= 9) h = '0' + h;
        if(m <= 9) m = '0' + m;
        if(s <= 9) s = '0' + s;

        var color = "#" + h + m + s;
        document.body.style.background = ColorLuminance(color, 0.5);
        setTimeout(displayTime, 500);
    }

    //call the function
    displayTime();
});
