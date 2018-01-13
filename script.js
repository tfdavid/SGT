/* information about jsdocs: 
* param: http://usejsdoc.org/tags-param.html#examples
* returns: http://usejsdoc.org/tags-returns.html
* 
/**
 * Listen for the document to load and initialize the application
 */
$(document).ready(initializeApp);

/**
 * Define all global variables here.  
 */
/***********************
 * student_array - global array to hold student objects
 * @type {Array}
 * example of student_array after input: 
 * student_array = [
 *  { name: 'Jake', course: 'Math', grade: 85 },
 *  { name: 'Jill', course: 'Comp Sci', grade: 85 }
 * ];
 */
student_array=[];

/***************************************************************************************************
* initializeApp 
* @params {undefined} none
* @returns: {undefined} none
* initializes the application, including adding click handlers and pulling in any data from the server, in later versions
*/
function initializeApp(){
    addClickHandlersToElements();
    dataUpdate();
}

/***************************************************************************************************
* addClickHandlerstoElements
* @params {undefined} 
* @returns  {undefined}
*     
*/
function addClickHandlersToElements(){
    $(".btn").attr("data-loading-text", "<i class='fa fa-spinner fa-spin'></i> Loading..");

    $('.btn').on('click', function() {
        $(this).button("loading");
    });

    $("#cancelBtn").on("click", handleCancelClick);
    $("#addBtn").on("click", handleAddClicked);
    $("#getData").on("click", dataUpdate);

    $(".studentNameTitle").on("click", )



}

function dataUpdate(){
    var ajaxConfig = {
        dataType: 'json',
        url: "https://s-apis.learningfuze.com/sgt/get",
        method: "post",
        data: {
            api_key: "bTS3bJ6on1",
            // "force-failure": "request"
        },
        // timeout: 5000,
        success: function(data){
            if(data.success) {
                $(".btn").button('reset');
                $('tbody > tr').remove();
                student_array = [];
                data.data.forEach((val) => {
                    student_array.push(val);
                    updateStudentList(student_array);

                })
                return;
            }
            errorModalDisplay(data.error);


        },
        error: function(data){
            console.log(data);
            errorModalDisplay(data.statusText);
        }
    }
    $.ajax(ajaxConfig);
}

/***************************************************************************************************
 * handleAddClicked - Event Handler when user clicks the add button
 * @param {object} event  The event object from the click
 * @return: 
       none
 */
function handleAddClicked(event){
    makeStudent();
}

/***************************************************************************************************
 * handleCancelClicked - Event Handler when user clicks the cancel button, should clear out student form
 * @param: {undefined} none
 * @returns: {undefined} none
 * @calls: clearAddStudentFormInputs
 */
function handleCancelClick(){
    clearAddStudentFormInputs();
    $(".btn").button('reset');
}
/***************************************************************************************************
 * addStudent - creates a student objects based on input fields in the form and adds the object to global student array
 * @param {undefined} none
 * @return undefined
 * @calls clearAddStudentFormInputs, updateStudentList
 */
function makeStudent(){
    var studentName = $("#studentName").val();
    var studentCourse = $("#course").val();
    var studentGrade = $("#studentGrade").val();
    var studentObject = {};
    if (isNaN(parseFloat(studentGrade))){
        errorModalDisplay("Not a valid grade number");
        clearAddStudentFormInputs();
        return;
    }
    if(studentName.length < 2){
        errorModalDisplay("Name must be at least two characters");
        clearAddStudentFormInputs();
        return;
    }
    if(studentGrade < 0 || studentGrade >100){
        errorModalDisplay("Grade needs to be between 0-100");
        clearAddStudentFormInputs();
        return;
    }
    if(studentCourse.length < 2){
        errorModalDisplay("Course must be greater than 2 chars");
        clearAddStudentFormInputs();
        return;
    }
    studentObject.name = studentName;
    studentObject.course = studentCourse;
    studentObject.grade = studentGrade;
    addStudentToServer(studentObject);
}

function addStudentToServer(student){
    student.api_key = "bTS3bJ6on1";
    var ajaxConfig = {
        dataType: 'json',
        url: "https://s-apis.learningfuze.com/sgt/create",
        method: "post",
        data: student,
        success: function(data){
            if(data.success){
                $(".btn").button('reset');
                student.id = data.new_id;
                delete student.api_key;
                student_array.push(student);
                clearAddStudentFormInputs();
                updateStudentList(student_array);
                return;
            }
            errorModalDisplay(data.error);
        },
        error: function(data){
            console.log(data);
            errorModalDisplay(data.statusText);
        }
    };
    $.ajax(ajaxConfig);
}

/***************************************************************************************************
 * clearAddStudentForm - clears out the form values based on inputIds variable
 */
function clearAddStudentFormInputs(){
    $("#studentName").val("");
    $("#course").val("");
    $("#studentGrade").val("");
}
/***************************************************************************************************
 * renderStudentOnDom - take in a student object, create html elements from the values and then append the elements
 * into the .student_list tbody
 * @param {object} studentObj a single student object with course, name, and grade inside
 */
function renderStudentOnDom(studentObject){
    var newRow = $("<tr>");
    var studentNameElement = $("<td>").text(studentObject.name);
    var studentCourseElement = $("<td>").text(studentObject.course);
    var studentGradeElement = $("<td>").text(studentObject.grade);
    var deleteContainer = $("<td>");
    var deleteButton = $("<button>").addClass("btn btn-danger").text("Delete").attr("id", studentObject.id).on("click", ()=>{
        deleteStudentObject(studentObject, newRow);
    });
    $("tbody").append(newRow);
    $(deleteContainer).append(deleteButton);
    $(newRow).append(studentNameElement, studentCourseElement, studentGradeElement, deleteContainer);
}

/***************************************************************************************************
 * updateStudentList - centralized function to update the average and call student list update
 * @param students {array} the array of student objects
 * @returns {undefined} none
 * @calls renderStudentOnDom, calculateGradeAverage, renderGradeAverage
 */
function updateStudentList(studentArray){
    renderStudentOnDom(studentArray[studentArray.length-1]);
    var currentAverage = calculateGradeAverage(studentArray);
    renderGradeAverage(currentAverage);
}
/***************************************************************************************************
 * calculateGradeAverage - loop through the global student array and calculate average grade and return that value
 * @param: {array} students  the array of student objects
 * @returns {number}
 */
function calculateGradeAverage(studentArray){
    if(!student_array.length){
        return "";
    }
    return (studentArray.reduce((total,num)=>{return total+parseFloat(num.grade)}, 0)/studentArray.length).toFixed(2);
}
/***************************************************************************************************
 * renderGradeAverage - updates the on-page grade average
 * @param: {number} average    the grade average
 * @returns {undefined} none
 */
function renderGradeAverage(average){
    $(".avgGrade").text(average);
}

function deleteStudentObject(student, studentRow){
    var ajaxConfig = {
        dataType: 'json',
        url: "https://s-apis.learningfuze.com/sgt/delete",
        method: "post",
        data: {
            api_key: "bTS3bJ6on1",
            student_id: student.id
        },
        success: function(data){
            if(data.success){
            $(".btn").button('reset');
            student_array.splice(student_array.indexOf(student),1);
            $(studentRow).closest('tr').remove();
            var currentAverage = calculateGradeAverage(student_array);
            renderGradeAverage(currentAverage);
            return;
        }
        errorModalDisplay(data.error);
                  },
        error: function(data){
            errorModalDisplay(data.statusText);
        }

    };
    $.ajax(ajaxConfig);
}

function errorModalDisplay(data){
    $('#errorModal .modal-body').text();
    $('#errorModal .modal-body').text(data);
    $('#errorModal').modal('show');
    $(".btn").button('reset');
}


