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
student_array=[

];



/***************************************************************************************************
* initializeApp 
* @params {undefined} none
* @returns: {undefined} none
* initializes the application, including adding click handlers and pulling in any data from the server, in later versions
*/
function initializeApp(){
    addClickHandlersToElements();
}

/***************************************************************************************************
* addClickHandlerstoElements
* @params {undefined} 
* @returns  {undefined}
*     
*/
function addClickHandlersToElements(){
    $(".btn-default").on("click", handleCancelClick);
    $(".btn-success").on("click", handleAddClicked);
    $(".getData").on("click", handleGetDataClicked);

}
function handleGetDataClicked(){
    var getData;
    var ajaxConfig = {
        dataType: 'json',
        url: "https://s-apis.learningfuze.com/sgt/get",
        method: "post",
        data: {
            api_key: "bTS3bJ6on1"
        },
        success: function(data){
            getData = data;
            getData.data.forEach((val) => {student_array.push(val);
                updateStudentList(student_array);})

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
    addStudent();

}
/***************************************************************************************************
 * handleCancelClicked - Event Handler when user clicks the cancel button, should clear out student form
 * @param: {undefined} none
 * @returns: {undefined} none
 * @calls: clearAddStudentFormInputs
 */
function handleCancelClick(){
    clearAddStudentFormInputs();

}
/***************************************************************************************************
 * addStudent - creates a student objects based on input fields in the form and adds the object to global student array
 * @param {undefined} none
 * @return undefined
 * @calls clearAddStudentFormInputs, updateStudentList
 */
function addStudent(){

    var studentName = $("#studentName").val();
    var studentCourse = $("#course").val();
    var studentGrade = $("#studentGrade").val();
    var studentObject = {};
    if (isNaN(parseFloat(studentGrade))){
        window.alert("Not a valid grade number");
        return;
    }
    studentObject.name = studentName;
    studentObject.course = studentCourse;
    studentObject.grade = studentGrade;
    student_array.push(studentObject);
    clearAddStudentFormInputs();
    updateStudentList(student_array);


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
    $("thead").append(newRow);
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
    var average = studentArray.reduce((total,num)=>{return total+parseFloat(num.grade)}, 0)/studentArray.length;
    average = Math.round(average*100)/100;
    return average;
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
    student_array.splice(student_array.indexOf(student),1);
    $(studentRow).closest('tr').remove();
    var currentAverage = calculateGradeAverage(student_array);
    renderGradeAverage(currentAverage);
}







