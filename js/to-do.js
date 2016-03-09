var delete_button = "<button type='button' class='delete_button'>X</button>";

var loadList = function(id, list) {
  if (list == undefined) {
    list = []
  }

  for (var i = 0; i < list.length; ++i) {
    $("#" + id + " ul").append("<li>" + delete_button  + "<input type='text' value='" + list[i] + "'/></li>");
  }
  return list;
};

// TODO: Sync between tabs chrome.storage.onChanged.addListener(function(changes, namespace).
var loadItemsFromStorage = function() {
  chrome.storage.local.get(["must_do", "tasks", "notes"], function(lists) {
    loadList("must-do", lists.must_do);
    loadList("tasks", lists.tasks);
    loadList("notes", lists.notes);
  });
}

var saveItems = function() {
  console.log("Saving items...");

  var must_do = [];
  var tasks = [];
  var notes = [];

  var lists = [must_do, tasks, notes];
  var ids = ["must-do", "tasks", "notes"];
  for (var i = 0; i < ids.length; ++i) {
    $("#" + ids[i] + " li input").each(function() {
      lists[i].push($(this).val());
    });
  }

  chrome.storage.local.set(
    {'must_do' : must_do, 'tasks' : tasks, 'notes' : notes}, 
    function() {
      if (chrome.runtime.lastError) {
        console.log(chrome.runtime.lastError);
      }
  });
}

var deleteStorage = function () {
  chrome.storage.local.clear();
}

$(function() {
  $( "#sortable1, #sortable2, #sortable3" ).sortable({
    connectWith: ".connectedSortable",
    receive: function(event, ui) {
      saveItems();
    }
  }).disableSelection();

  loadItemsFromStorage();

  $("body").on("change keyup paste", 'input', function() {
    saveItems();
  });

  $("body").on("click", '.delete_button', function() {
    $(this).parent().remove();
    saveItems();
  });

  $(".add-item").each(function() {
    $(this).on("click", function() {
      var parentId = $(this).data('parent-id');
      $("#" + parentId + " ul").append("<li><input type='text'/>" + delete_button + " </li>");
    });
  });
});
