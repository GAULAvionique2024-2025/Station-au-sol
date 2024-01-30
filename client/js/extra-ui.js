/*
    Expand button for small screen
*/

let expanded = false;

function expand() {
    if (!expanded) {
        // Open
        document.getElementById("expand-menu").classList.remove("closed-menu");
        document.getElementById("expand-btn").classList.add("rotated");
    } else {
        // Close
        document.getElementById("expand-menu").classList.add("closed-menu");
        document.getElementById("expand-btn").classList.remove("rotated");
    }
    expanded = !expanded;
}