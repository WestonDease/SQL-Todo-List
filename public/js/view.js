$(document).ready(function() {
    const socket = io();
    // Getting a reference to the input field where user adds a new todo
    var $newItemInput = $("input.new-item");
    // Our new todos will go inside the todoContainer
    var $todoContainer = $(".todo-container");
    // Adding event listeners for deleting, editing, and adding todos
    //$(document).on("click", "button.delete", deleteTodo);
    $(document).on("click", "button.complete", toggleComplete);
    $(document).on("click", ".todo-item", editTodo);
    $(document).on("keyup", ".todo-item", finishEdit);
    $(document).on("blur", ".todo-item", cancelEdit);
    $(document).on("submit", "#todo-form", insertTodo);
  
    // Our initial todos array
    var todos = [];
  
    // Getting todos from database when page loads
    getTodos();


    socket.on('new-todo', function(data){
        console.log(data);
        setTimeout(function(){
          getTodos();  
      }, 125);
    });

    socket.on('check-todo', function(data) {
        console.log(data);
        let newdo = data;
      console.log(newdo.check);
      if(newdo.check >= 2){
        let id = newdo.description;
        console.log(id);
        $.ajax({
          method: "DELETE",
          url: "/api/task/" + id
        }).then(getTodos);
      } else {
      updateTodo(newdo);
      }
    });
  
    // This function resets the todos displayed with new todos from the database
    function initializeRows() {
      $todoContainer.empty();
      var rowsToAdd = [];
      for (var i = 0; i < todos.length; i++) {
        rowsToAdd.push(createNewRow(todos[i]));
      }
      $todoContainer.prepend(rowsToAdd);
    }
  
    // This function grabs todos from the database and updates the view
    function getTodos() {
      $.get("/api/task", function(data) {
        todos = data;
        console.log("todos:", data);
        initializeRows();
      });
    }
  
    // This function deletes a todo when the user clicks the delete button
    function deleteTodo(event) {
      event.stopPropagation();
      let id = $(this).parent().text().slice(0, -2);
      console.log(id);
      $.ajax({
        method: "DELETE",
        url: "/api/task/" + id
      }).then(getTodos);
    }
  
    // This function handles showing the input box for a user to edit a todo
    function editTodo() {
      var currentTodo = $(this).data("todo");
      $(this).children().hide();
      $(this).children("input.edit").val(currentTodo.text);
      $(this).children("input.edit").show();
      $(this).children("input.edit").focus();
    }
  
    // Toggles complete status
    function toggleComplete(event) {
      event.stopPropagation();
      var todo = $(this).parent().data("todo");
      console.log($(this).parent().data("todo"));
      todo.check += 1;
      socket.emit('check-todo', todo);
      console.log(todo.check);
      if(todo.check >= 2){
        let id = $(this).parent().text().slice(1, $(this).parent().text().length);
        console.log(id);
        $.ajax({
          method: "DELETE",
          url: "/api/task/" + id
        }).then(getTodos);
      } else {
      updateTodo(todo);
      }
    }
  
    // This function starts updating a todo in the database if a user hits the "Enter Key"
    // While in edit mode
    function finishEdit(event) {
      var updatedTodo = $(this).data("todo");
      if (event.which === 13) {
        updatedTodo.text = $(this).children("input").val().trim();
        $(this).blur();
        updateTodo(updatedTodo);
      }
    }
  
    // This function updates a todo in our database
    function updateTodo(todo) {
      $.ajax({
        method: "PUT",
        url: "/api/task/" + todo.description,
        data: todo
      }).then(getTodos);
    }
  
    // This function is called whenever a todo item is in edit mode and loses focus
    // This cancels any edits being made
    function cancelEdit() {
      var currentTodo = $(this).data("todo");
      if (currentTodo) {
        $(this).children().hide();
        $(this).children("input.edit").val(currentTodo.text);
        $(this).children("span").show();
        $(this).children("button").show();
      }
    }
  
    // This function constructs a todo-item row
    function createNewRow(todo) {
      if(todo.description !== ""){
        var $newInputRow = $(
          [
            "<li class='list-group-item todo-item'>",
            "<button class='complete btn btn-primary'>✓</button>",
            "<span>",
            todo.description,
            "</span>",
            "<input type='text' class='edit' style='display: none;'>",
            //"<button class='delete btn btn-danger'>x</button>",
            "</li>"
          ].join("")
        );
    
        $newInputRow.find("button.delete").data("id", todo.id);
        $newInputRow.find("input.edit").css("display", "none");
        $newInputRow.data("todo", todo);
        if (todo.complete) {
          $newInputRow.find("span").css("text-decoration", "line-through");
        }
        return $newInputRow;
      }
    }
  
    // This function inserts a new todo into our database and then updates the view
    function insertTodo(event) {
      event.preventDefault();
      var todo = {
        description: $newItemInput.val().trim(),
        check: 0
      };

      $.post("/api/task", todo, getTodos);
      console.log("new todo entered", todo);
      socket.emit('new-todo', todo);

      $newItemInput.val("");
    }
  });