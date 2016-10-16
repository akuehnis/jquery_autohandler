# jquery_autohandler
Autohandler Plugin for jQuery

## What it does
Scans a given container for elements having a *data-autohandler*-attribute. If found, the handler described in the attribute is applied to the element. If elements are added within the container, they are automatically scanned and the handler is applied.

## Format
<xxx data-autohandler="event:handler[;event2,handler2]" ...>

event may be click, change, submit, ... whatever
handler is a function name (string), such as "myFunc" or "myModule.func"
There may be multiple events and handlers, separated by a semicolon.

## The "now" Event
There is a special event, called "now". If Autohandler finds such an event, its handler is immediately executed. After that, autohandler removes the handler from the element to make sure it is not executed again.

## So what's the purpose?
Autohandler makes complex javascript applications easier to be read and maintained. Handler's are not hidden somewhere in the code but visible to designer and programmer.

## But why not use the standard handler attributes such as onclick or onsubmit etc?
There are two reasons for using autohandler instead of inline handlers. First, inline handlers have a different behavior regarding the "this"-variable. When an inline handler is called, "this" refers to the window. In a handler called via "addEventListener" or jQuery "this" refers to the calling object.

The second reason: If you are developing native apps with HTML and Javascript, inline handlers may not be executed at all.

# Example
```
<!DOCTYPE HTML>
<html>
<head>
<meta http-equiv="content-type" content="text/html; charset=UTF-8"/>
<script src="https://ajax.googleapis.com/ajax/libs/jquery/1.12.4/jquery.min.js"></script>
<!--<script src="https://ajax.googleapis.com/ajax/libs/jquery/2.2.4/jquery.min.js"></script>-->
<!-- <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.1.1/jquery.min.js"></script>-->
<script src="jquery.autohandler.js"></script>
</head>
<body>
<h1>Todo-List with Autohandler</h1>
<div id="todo-container">
    <form data-autohandler="submit:addTodo">
        <input type="text" required name="todo"/>
        <button type="submit">Add</button>
    </form>
    <ul id="todo-list">
    </ul>
</div>

<script type="text/javascript">
function addTodo(args){
    if (undefined != args.todo) {
        var todo = args.todo;
    } else {
        var todo = $("[name=todo]").val();
    }
    $("[name=todo]").val('');
    if ('' != todo) {
        $("#todo-list").append('<li>'+
            '<button data-autohandler="click:removeTodo">-</button>'+
            ' <span data-autohandler="now:showTodo">'+todo+'</span></li>');
    }
    return false;
}
function removeTodo() {
    $(this).closest('li').remove();
    return false;
}
function showTodo() {
    console.log(this.innerHTML + ' added');
    return false;
}

$(function(){
    addTodo({todo:'First'});
    addTodo({todo:'Second'});
    addTodo({todo:'Third'});
    $("#todo-container").autohandler();
});
</script>
</body>
</html>

```
