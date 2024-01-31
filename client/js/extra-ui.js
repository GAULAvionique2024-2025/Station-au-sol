/*
    Expand button for small screen
*/

let expanded = false;

function expand() {
    if (!expanded) {
        // Open
        document.getElementsByTagName("body")[0].classList.add("expanded")
    } else {
        // Close
        document.getElementsByTagName("body")[0].classList.remove("expanded")
    }
    expanded = !expanded;
}