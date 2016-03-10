var should_hide = function(time) {
    if (!time) {
        return false;
    }

    var today = new Date();
    var then = new Date(time);

    var threshold = 4 * 60 * 60 * 1000; // hide if older than 4 hours
    return (today - then) > threshold;
};

var build_checkbox = function(time, checked) {
    var check_string = checked ? " checked " : "";
    return "<input type='checkbox'" + check_string + "data-time='" + time + "' class='done_button'>";
};

var build_li = function(li_class, time, checked, text) {
    return "<li " + li_class + " >" + build_checkbox(time, checked) + "<button type='button' class='delete_button'>X</button><input class='text' type='text' value='" + text + "'/></li>"
}

var loadList = function (id, list) {
    if (list == undefined) {
        list = []
    }

    for (var i = 0; i < list.length; ++i) {
        var time = list[i]['time'];
        var checked = list[i]['done'];
        var text = list[i]['text'];
        var li_class = should_hide(time) ? " hide " : "";
        $("#" + id + " ul").append(build_li(li_class, time, checked, text));
    }
    return list;
};

var loadQuote = function(quote) {
    var day = 24 * 60 * 60 * 1000;
    var now = new Date();
    if (!quote || (now - new Date(JSON.parse(quote['time'])) > day)) {
        get_new_quote();
    } else {
        display_quote(quote['quote']);
    }
};

// TODO: Sync between tabs chrome.storage.onChanged.addListener(function(changes, namespace).
var loadItemsFromStorage = function () {
    chrome.storage.local.get(["must_do", "tasks", "notes", "quote", "done"], function (storage) {
        loadList("must-do", storage.must_do);
        loadList("tasks", storage.tasks);
        loadList("notes", storage.notes);
        loadQuote(storage.quote);
    });
};

var saveItems = function () {
    console.log("Saving items...");

    var must_do = [];
    var tasks = [];
    var notes = [];

    var lists = [must_do, tasks, notes];
    var ids = ["must-do", "tasks", "notes"];
    for (var i = 0; i < ids.length; ++i) {
        $("#" + ids[i] + " li").each(function () {
            var done = $(this).children(".done_button").is(':checked');
            var time = $(this).children(".done_button").data("time");
            var text = $(this).children(".text").val();
            var data = {"text" : text, "done" : done, "time" : time};
            lists[i].push(data);
        });
    }

    chrome.storage.local.set(
        {'must_do': must_do, 'tasks': tasks, 'notes': notes},
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
       url: "http://quotesondesign.com/api/3.0/api-3.0.json",
        success: function(result) {
            var quote = result['quote'];
            display_quote(quote);
            quote = {"quote": quote, "time": JSON.stringify(new Date())};
            chrome.storage.local.set({"quote": quote});
        }
    });
};

$(function () {
    $("#sortable1, #sortable2, #sortable3").sortable({
        connectWith: ".connectedSortable",
        receive: function (event, ui) {
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
        $(this).attr('data-time', JSON.stringify(new Date()));
        saveItems();
    });


    $("#quote").click(function() {
        get_new_quote();
    });

    $(".add-item").each(function () {
        $(this).on("click", function () {
            var selector = "#" + $(this).data('parent-id') + " ul";
            $(selector).append(build_li("", "", false, ""));
            $(selector + " li:last-child input").focus();
        });
    });
});
