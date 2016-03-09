var loadList = function(id, list) {
  if (list == undefined) {
    list = []
  } else {
    list = JSON.parse(list);
  }
  for (var i = 0; i < list.length; ++i) {
    $("#" + id + " ul").append("<li> <input type='text' value='" + list[i] + "'/></li>");
  }
  return list;
};

var loadItemsFromStorage = function() {
  loadList("to-do", sessionStorage.to_do);
  loadList("doing", sessionStorage.doing);
  loadList("done", sessionStorage.done);
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

  sessionStorage.to_do = JSON.stringify(to_do);
  sessionStorage.doing = JSON.stringify(doing);
  sessionStorage.done = JSON.stringify(done);
}

var deleteStorage = function () {
  sessionStorage.removeItem("to_do");
  sessionStorage.removeItem("doing");
  sessionStorage.removeItem("done");
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