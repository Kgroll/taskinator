var formEl = document.querySelector("#task-form");
var tasksToDoEl = document.querySelector("#tasks-to-do");
var taskIdCounter = 0;
var pageContentEl = document.querySelector("#page-content");
var tasksInProgressEl = document.querySelector("#tasks-in-progress");
var tasksCompletedEl = document.querySelector("#tasks-completed");
var tasks = [];

var taskStatusChangeHandler = function(event) {
    //get the task iten's id
    var taskId = event.target.getAttribute("data-task-id");

    //get currently secected option's value and convert to lowercase
    var statusValue = event.target.value.toLowerCase();

    //find the parent task item element based on the id
    var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");
      
    if (statusValue === "to do") {
        tasksToDoEl.appendChild(taskSelected);
    }    
    else if (statusValue === "in progress") {
        tasksInProgressEl.appendChild(taskSelected);
    }
    else if (statusValue === "completed") {
        tasksCompletedEl.appendChild(taskSelected);
    }
    //update task's in tasks array
    for (var i = 0; i < tasks.length; i++) {
        if (tasks[i].id === parseInt(taskId)) {
            tasks[i].status = statusValue;
        }
    }console.log(tasks);
    };

//delete Task
var deleteTask = function(taskId) {
    var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");
    taskSelected.remove();    
};
//edit task
var editTask = function(taskId) {
    document.querySelector("#save-task").textContent = "Save Task";  
//get task list element
var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");
//get content fron task name
var taskName = taskSelected.querySelector("h3.task-name").textContent;

var taskType = taskSelected.querySelector("span.task-type").textContent;
document.querySelector("input[name='task-name']").value = taskName;
document.querySelector("select[name='task-type']").value = taskType;

formEl.setAttribute("data-task-id", taskId);
};
//complete edit
var completeEditTask = function(taskName, taskType, taskId){
   //find the matching task list
   var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");

   //set new values
   taskSelected.querySelector("h3.task-name").textContent = taskName;
   taskSelected.querySelector("span.task-type").textContent = taskType;

   //loop throught tasks array and task obuect withi new content
   for (var i = 0; i < tasks.length; i++) {
       if (tasks[i].id === parseInt(taskId)) {
        tasks[i].name = taskName;
        tasks[i].type = taskType;
       }
   };

   alert("Task Updated!");

   formEl.removeAttribute("data-task-id");
   document.querySelector("#save-task").textContent = "Add Task";
};

var taskFormHandler = function(event) {
    event.preventDefault();

    var taskNameInput= document.querySelector("input[name='task-name']").value;
    var taskTypeInput= document.querySelector("select[name='task-type']").value;
    // check if input values are empty strings
    if (!taskNameInput || !taskTypeInput) {
        alert("You need to fill out the task form!");
        return false;
    }

    var isEdit = formEl.hasAttribute("data-task-id");
    
    //has data attribut so get task id and call function complete edit process
    if (isEdit) {
        var taskId = formEl.getAttribute("data-task-id");
        completeEditTask(taskNameInput, taskTypeInput, taskId);
    }
    //no data attribute so create object as normal and pass to createTaskEl function
    else {
       var taskDataObj = {
        name: taskNameInput,
        type: taskTypeInput,
        status: "to do"
    };

//send it as an argument to createTaskEl
createTaskEl(taskDataObj);
    }
formEl.reset();
};
   
//create task
var createTaskEl = function(taskDataObj) {
     //create list item
    var listItemEl = document.createElement("li");
    listItemEl.className = "task-item";


    console.log(taskDataObj);
    console.log(taskDataObj.status);

    //add taks id as a custom attribute
    listItemEl.setAttribute("data-task-id", taskIdCounter);
    listItemEl.setAttribute("draggable", "true");

    //create div to hold task info and add to list item
    var taskInfoEl = document.createElement("div");
    //give it a class name
    taskInfoEl.className = "task-info";
    //add HTML content to div
    taskInfoEl.innerHTML = "<h3 class = 'task-name'>" + taskDataObj.name + "</h3><span class='task-type'>" + taskDataObj.type + "</span>";
 
   
    listItemEl.appendChild(taskInfoEl);

    var taskActionsEl = createTaskActions(taskIdCounter);
    listItemEl.appendChild(taskActionsEl);
    taskDataObj.id = taskIdCounter;

    tasks.push(taskDataObj);
  
    var pushedArr = [1, 2, 3];

    pushedArr.push(4); 
    // pushedArr is now [1,2,3,4]

    pushedArr.push("Taskinator"); 
    // pushedArr is now [1,2,3,4,"Taskinator"]

    pushedArr.push(10, "push", false); 
    // pushedArr is now [1,2,3,4,"Taskinator",10,"push",false]

    //add entire list item to list
    tasksToDoEl.appendChild(listItemEl);

    //increas task counter for next unique id
    taskIdCounter++;
};
var createTaskActions = function(taskId){
    var actionContainerEl = document.createElement("div");
    actionContainerEl.className = "task-actions";

    //create edit button
    var editButtonEl = document.createElement("button");
    editButtonEl.textContent = "Edit";
    editButtonEl.className = "btn edit-btn";
    editButtonEl.setAttribute("data-task-id", taskId);

    actionContainerEl.appendChild(editButtonEl);

    //create delete button
    var deleteButtonEl = document.createElement("button");
    deleteButtonEl.textContent = "Delete";
    deleteButtonEl.className = "btn delete-btn";
    deleteButtonEl.setAttribute("data-task-id", taskId);

    actionContainerEl.appendChild(deleteButtonEl);
    
var statusSelectEl = document.createElement("select");
statusSelectEl.className = "select-status";
statusSelectEl.setAttribute("name", "status-change");
statusSelectEl.setAttribute("data-task-id", taskId);

actionContainerEl.appendChild(statusSelectEl);


var statusChoices = ["To Do", "In Progress", "Completed"];

for (var i = 0; i < statusChoices.length; i++) {
    //create option element
    var statusOptionEl = document.createElement("option");
    statusOptionEl.textContent = statusChoices[i];
    statusOptionEl.setAttribute("value", statusChoices[i]);

    //append to select
    statusSelectEl.appendChild(statusOptionEl);
}
    return actionContainerEl;
};
formEl.addEventListener("submit", taskFormHandler);

var taskButttonHandler = function(event) {
    //get target element from event
    var targetEl = event.target;

    //edit button clicked
    if (targetEl.matches(".edit-btn")) {
        var taskId = targetEl.getAttribute("data-task-id");
        editTask(taskId);
    }
    //delete button clicked
    else if (targetEl.matches(".delete-btn")) {
        var taskId = targetEl.getAttribute("data-task-id");
        deleteTask(taskId);
        
    }
};

var dragTaskHandler = function(event) {
    var taskId = event.target.getAttribute("data-task-id");
    event.dataTransfer.setData("text/plain", taskId);
    var getId = event.dataTransfer.getData("text/plain");
   
}

var dropZoneDragHandler = function(event) {
    var taskListEl = event.target.closest(".task-list");
    if (taskListEl) {   
        event.preventDefault(); 
        taskListEl.setAttribute("style", "background: rgba(68, 233, 255, 0.7); border-style: dashed;");       
    };   
}
var dropTaskHandler = function(event) {
    var id = event.dataTransfer.getData("text/plain");
    var draggableElement = document.querySelector("[data-task-id='" + id + "']");
    var dropZoneEl = event.target.closest(".task-list");
    var statusType = dropZoneEl.id;
    

    //set status of task based on droZone id
    var statusSelectEl = draggableElement.querySelector("select[name='status-change']");
   
    if (statusType === "tasks-to-do") {
        statusSelectEl.selectedIndex = 0;
    }
    else if (statusType === "tasks-in-progress") {
        statusSelectEl.selectedIndex = 1;
    }
    else if (statusType === "tasks-completed") {
        statusSelectEl.selectedIndex = 2;
    }
    dropZoneEl.removeAttribute("style");
    dropZoneEl.appendChild(draggableElement);   
    
    //loop through tasks array to find and update the updated task's status
    for (var i = 0; i < tasks.lengths; i++) {
        if (tasks[i].id === parseInt(id)) {
            tasks[i].status = statusSelectEl.value.toLowerCase();
        }
    }console.log(tasks);
};
    var dragLeaveHandler = function(event) {
    var taskListEl = event.target.closest(".task-list");
    if (taskListEl) {
        taskListEl.removeAttribute("style");
    }
}


pageContentEl.addEventListener("click", taskButttonHandler);
pageContentEl.addEventListener("change", taskStatusChangeHandler);
pageContentEl.addEventListener("dragstart", dragTaskHandler);
pageContentEl.addEventListener("dragover", dropZoneDragHandler);
pageContentEl.addEventListener("drop", dropTaskHandler);
pageContentEl.addEventListener("dragleave", dragLeaveHandler);