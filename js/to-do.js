var loadList = function(id, list) {
  if (list == undefined) {
    list = []
  }

  for (var i = 0; i < list.length; ++i) {
    $("#" + id + " ul").append("<li> <input type='text' value='" + list[i] + "'/></li>");
  }
  return list;
};

// TODO: Sync between tabs chrome.storage.onChanged.addListener(function(changes, namespace).
var loadItemsFromStorage = function() {
  chrome.storage.local.get(["to_do", "doing", "done"], function(lists) {
    loadList("to-do", lists.to_do);
    loadList("doing", lists.doing);
    loadList("done", lists.done);
  });
}

var saveItems = function() {
  console.log("Saving items...");

  var to_do = [];
  var doing = [];
  var done = [];

  var lists = [to_do, doing, done];
  var ids = ["to-do", "doing", "done"];
  for (var i = 0; i < ids.length; ++i) {
    $("#" + ids[i] + " li input").each(function() {
      lists[i].push($(this).val());
    });
  }

  chrome.storage.local.set(
    {'to_do' : to_do, 'doing' : doing, 'done' : done}, 
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

  $("body").bind("change paste keyup", 'input', function() {
    saveItems();
  });

  $(".add-item").each(function() {
    $(this).on("click", function() {
      var parentId = $(this).data('parent-id');
      $("#" + parentId + " ul").append("<li><input type='text'/></li>");
    });
  });
});