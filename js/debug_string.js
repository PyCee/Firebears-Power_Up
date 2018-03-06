var temp_debug_string = "";
var temp_debug_string_element = document.getElementById("temp_debug_string");

var debug_string = "";
var debug_string_element = document.getElementById("debug_string");
debug_string_element.style.left = "1000px";
function Reset_Temp_Debug_String () {
    temp_debug_string = [];
    Update_Debug_String();
}
function Add_Temp_Debug_String (string) {
    if(temp_debug_string.length > 1000){
        return;
    }
    if(temp_debug_string.length > 0){
        temp_debug_string += "</br>";
    }
    temp_debug_string += string;
    Update_Debug_String();
}
function Add_Debug_String (string) {
    if(debug_string.length > 1000){
        return;
    }
    if(debug_string.length > 0){
        debug_string += "</br>";
    }
    debug_string += string;
    Update_Debug_String();
}
function Update_Debug_String () {
    temp_debug_string_element.innerHTML = temp_debug_string;
    debug_string_element.innerHTML = debug_string;
}