var debug_string = "";
var debug_string_element = document.getElementById("debug_string");
function Reset_Debug_String () {
    debug_string = [];
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
    debug_string_element.innerHTML = debug_string;
}