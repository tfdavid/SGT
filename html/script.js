
$(document).ready(initializeApp);

student_array=[];
var globalSortType;
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
    $("#getData").on("click", ()=>dataUpdate(globalSortType));

    $(".studentNameTitle").on("click", ()=>{
        if(globalSortType==="name"){
            sortArray("nameRev");
            return;
        }
        sortArray('name');
    });
    $(".studentCourseTitle").on("click", ()=>{
        if(globalSortType==="course"){
            sortArray("courseRev");
            return;
        }
        sortArray('course');
    });
    $(".studentGradeTitle").on("click", ()=>{
        if(globalSortType==="grade"){
            sortArray("gradeRev");
            return;
        }
        sortArray('grade');
    });
    $(".dateSort").on("click", ()=>{
        if(globalSortType==="id"){
            sortArray("idRev");
            return;
        }
        sortArray();
    });
    
}
function sortArray(sortType){
    globalSortType = sortType;
    $(".btn").button('reset');
    $('tbody > tr').remove();
    switch(sortType) {
        case 'grade':             //sort by grade
            student_array.sort((a,b)=>{
                return b.grade-a.grade
            });
            globalSortType='grade';
            break;
        case 'gradeRev':             //sort by grade reverse
            student_array.sort((a,b)=>{
                return a.grade-b.grade
            });
            globalSortType='gradeRev';
            break;
        case 'name':              //sort by name
            student_array.sort((first, second)=> {
                return first.name.toLowerCase() < second.name.toLowerCase() ? -1 : 1;
            });
            globalSortType='name';
            break;
        case 'nameRev':              //sort by name reverse
            student_array.sort((first, second)=> {
                return first.name.toLowerCase() < second.name.toLowerCase() ? 1 : -1;
            });
            globalSortType='nameRev';
            break;
        case 'course':            //sort by course
            student_array.sort((first, second)=> {
                return first.course.toLowerCase() < second.course.toLowerCase() ? -1 : 1;
            });
            globalSortType='course';
            break;
        case 'courseRev':            //sort by course reverse
            student_array.sort((first, second)=> {
                return first.course.toLowerCase() < second.course.toLowerCase() ? 1 : -1;
            });
            globalSortType='courseRev';
            break;
        case "idRev" :                //sort by oldest
            student_array.sort((a,b)=>{
                return a.id - b.id;
            });
            globalSortType="idRev";
            break;
        default:                //sort by newest
            student_array.sort((a,b)=>{
                return b.id - a.id;
            });
            globalSortType="id"
    }
    student_array.forEach((val) => {
        updateStudentList(val);
    });
    $(".btn").button('reset');
}

function dataUpdate(sortType){
    var ajaxConfig = {
        dataType: 'json',
        url: "users",
        method: "get",
        success: function(data){
            if(data) {
                student_array = [];
                data.forEach((val) => {
                    student_array.push(val);
                });
                sortArray(sortType);
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

function checkValidValues(grade, name, course){
    if (isNaN(parseFloat(grade))) {
        errorModalDisplay("Not a valid grade number");
        clearAddStudentFormInputs();
        return false;
    }
    if (name.length < 2) {
        errorModalDisplay("Name must be at least two characters");
        clearAddStudentFormInputs();
        return false;
    }
    if (grade < 0 || grade > 100) {
        errorModalDisplay("Grade needs to be between 0-100");
        clearAddStudentFormInputs();
        return false;
    }
    if (course.length < 2) {
        errorModalDisplay("Course must be greater than 2 chars");
        clearAddStudentFormInputs();
        return false;
    }
    return true;
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
    
    if(checkValidValues(studentGrade, studentName, studentCourse)){
        studentObject.name = studentName;
        studentObject.course = studentCourse;
        studentObject.grade = studentGrade;
        addStudentToServer(studentObject);
    }
    else{
        return false
    } 
}

function addStudentToServer(student){
    var ajaxConfig = {
        dataType: 'json',
        url: "add",
        method: "post",
        data: student,
        success: function(data){
            if(data){
                $(".btn").button('reset');
                student.id = data.insertId;
                student_array.push(student);
                clearAddStudentFormInputs();
                sortArray(globalSortType);
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
    var opsContainer = $("<td>");
    var editButton = $("<button>").addClass("btn btn-success opBtn").text("Edit").attr("id", studentObject.id).on("click", () => {
        editStudentObject(studentObject, newRow, rowContents);
    });
    var deleteButton = $("<button>").addClass("btn btn-danger opBtn").text("Delete").attr("id", studentObject.id).on("click", ()=>{
        // deleteStudentObject(studentObject, newRow);
        confirmDeleteModal(studentObject, newRow);
    });
   
    $("tbody").append(newRow);
    $(opsContainer).append(editButton, deleteButton);
    $(newRow).append(studentNameElement, studentCourseElement, studentGradeElement, opsContainer);

    var rowContents = [studentNameElement, studentCourseElement, studentGradeElement, opsContainer];


    function editStudentObject() {
        newRow.empty();
        $('form').find('button.btn-danger').click();

        var td = $('<td>').attr('colspan', 4);
        var form = $('<form>').attr("autocomplete", 'off').on('submit', e=>{
            e.preventDefault();
            updateStudentDatabase(form[0], studentObject, cancelOrUpdateEdit, rowContents);
        })
        var nameInput = $('<input>', {
            'type': 'text',
            'name': 'student',
            'value': studentObject.name,
            'class': 'form-control inline-inputs'
        })
        var courseInput = $('<input>', {
            'type': 'text',
            'name': 'course',
            'value': studentObject.course,
            'class': 'form-control inline-inputs'
        })
        var gradeInput = $('<input>', {
            'type': 'text',
            'name': 'grade',
            'value': studentObject.grade,
            'class': 'form-control grade-input'
        });
        var opsContainer = $("<div>").addClass("editOpsContainer");
        var submitButton = $("<button>", {
            'type': 'submit',
            'text': 'Submit',
            'class': 'btn btn-success opBtn',
            'id': studentObject.id
        });
        var cancelButton = $("<button>", {
            'type': 'button',
            'text': 'Cancel',
            'class': 'btn btn-danger opBtn',
            'id': studentObject.id
        }).on("click", () => {
            cancelOrUpdateEdit();
        });
        opsContainer.append(submitButton, cancelButton);
        form.append(nameInput, courseInput, gradeInput, opsContainer);
        td.append(form)
        newRow.append(td);
    }
    function cancelOrUpdateEdit(contents = rowContents) {
        editButton.on("click", () => {
            editStudentObject(studentObject, newRow, contents)
        });
        deleteButton.on("click", () => {
            confirmDeleteModal(studentObject, newRow);
        });
        newRow.empty().append(contents);
    }
}


function updateStudentDatabase(newValues, student, modifyDomCallback, elementsForCallback){
    const { id, author } = student;
    const name = newValues[0].value
    ,     course = newValues[1].value
    ,     grade = newValues[2].value;
    var ajaxConfig = {
        dataType: 'json',
        url: "update",
        method: "post",
        data: {
            id, name, grade, course, author
        },
        success: function (data) {
            if (data) {
                student.name = name;
                student.course = course;
                student.grade = parseFloat(grade);

                elementsForCallback[0][0].textContent = name;
                elementsForCallback[1][0].textContent = course;
                elementsForCallback[2][0].textContent = grade;
                
                modifyDomCallback(elementsForCallback);
                
                return;
            }
            errorModalDisplay(data.errors);
        },
        error: function (data) {
            errorModalDisplay(data.statusText);
        }

    };
    if(checkValidValues(grade, name, course)){
        $.ajax(ajaxConfig);
    }
    else{
        modifyDomCallback();
        return false;
    }
}



/***************************************************************************************************
 * updateStudentList - centralized function to update the average and call student list update
 * @param students {array} the array of student objects
 * @returns {undefined} none
 * @calls renderStudentOnDom, calculateGradeAverage, renderGradeAverage
 */
function updateStudentList(student){
    renderStudentOnDom(student);
    calculateGradeAverage(student_array);

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
    var average= (studentArray.reduce((total,num)=>{return total+parseFloat(num.grade)}, 0)/studentArray.length).toFixed(2);
    $(".avgGrade").text(average);
}
/***************************************************************************************************
 * deleteStudentObject - removes student from database and DOM if success
 * @param: {student} studentRow - student data object and corresponding DOM row
 * @returns {undefined} none
 */


function deleteStudentObject(student, studentRow){
    var ajaxConfig = {
        dataType: 'json',
        url: "delete",
        method: "post",
        data: {
            student_id: student.id,
        },
        success: function(data){
            if(data){
                $(".btn").button('reset');
                student_array.splice(student_array.indexOf(student),1);
                $(studentRow).closest('tr').remove();
                calculateGradeAverage(student_array);
                return;
            }
            errorModalDisplay(data.errors);
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
    clearAddStudentFormInputs();
}
function confirmDeleteModal(data, newRow){
    $("#confirmedDeleteButton").off();
    $('#confirmDeleteModal .modal-body').text("");
    // let message = $("<div>").text("Are you sure you want to delete: ")
    let studentName = $('<div>').text(`Name:  ${data.name}`);
    let studentCourse = $('<div>').text(`Course: ${data.course}`);
    let studentGrade = $('<div>').text(`Grade: ${data.grade}`);

    // $('#confirmDeleteModal .modal-body').append(message);
    $('#confirmDeleteModal .modal-body').append(studentName);
    $('#confirmDeleteModal .modal-body').append(studentCourse);
    $('#confirmDeleteModal .modal-body').append(studentGrade);
    $("#confirmedDeleteButton").on("click", ()=> {
        console.log("confirmed to delete", data, newRow)

        deleteStudentObject(data, newRow);
    })

    $('#confirmDeleteModal').modal('show');
    $(".btn").button('reset');
}


