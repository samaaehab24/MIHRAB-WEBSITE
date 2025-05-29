const header = document.querySelector("header");

window.addEventListener("scroll", function(){
    header.classList.toggle("sticky", window.scrollY > 0);
})



// Select the menu icon and the navigation menu
const menu = document.querySelector('#menu-icon');
const nav = document.querySelector('.nav');

// Toggle the 'active' class when the menu icon is clicked
menu.addEventListener('click', () => {
    nav.classList.toggle('active');
});

// Optional: Close the menu when a nav link is clicked (for mobile UX)
const navLinks = document.querySelectorAll('.nav a');

navLinks.forEach(link => {
    link.addEventListener('click', () => {
    nav.classList.remove('active');
})
});
//scroll Reveal
const sr=ScrollReveal(
    {
        distance: '60px',
        duration:2500,
        delay:400,
        reset:true
    }
)
sr.reveal('.home-txt', {delay:200, origin:'top'});


//smooth scroll
  document.getElementById("scrollToShop").addEventListener("click", function(e) {
    e.preventDefault();
    document.getElementById("shop").scrollIntoView({ behavior: "smooth" });
  });

