const navbarButton = document.querySelector("#navbar-toggle"); 
const navbarLinks = document.querySelector("#navbar-links");
const links = document.querySelectorAll(".navbar-link");

navbarButton.addEventListener("click", ()=>{
    navbarLinks.classList.toggle("show-navbar-links");
});

links.forEach( link => {
    link.addEventListener("click", ()=>{
        navbarLinks.classList.remove("show-navbar-links");
    })
})