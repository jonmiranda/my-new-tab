var delete_button = "<button type='button' class='delete_button'>X</button>";

var loadList = function (id, list) {
    if (list == undefined) {
        list = []
    }

    for (var i = 0; i < list.length; ++i) {
        $("#" + id + " ul").append("<li>" + delete_button + "<input type='text' value='" + list[i] + "'/></li>");
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
    chrome.storage.local.get(["must_do", "tasks", "notes", "quote"], function (storage) {
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
        $("#" + ids[i] + " li input").each(function () {
            lists[i].push($(this).val());
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

    $("body").on("change keyup paste", 'input', function () {
        saveItems();
    });

    $("body").on("click", '.delete_button', function () {
        $(this).parent().remove();
        saveItems();
    });

    $("#quote").click(function() {
        get_new_quote();
    });

    $(".add-item").each(function () {
        $(this).on("click", function () {
            var parentId = $(this).data('parent-id');
            $("#" + parentId + " ul").append("<li><input type='text'/>" + delete_button + " </li>");
        });
    });
});
