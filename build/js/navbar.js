// Function for the mobile navbar
const navLinks = document.querySelector('.nav-links')

function onToggleMenu(e){
    e.name = e.name === 'menu-outline' ? 'close-outline' : 'menu-outline'
    if (navLinks.classList.contains('top-[-100%]')) {
        navLinks.classList.replace('top-[-100%]', 'top-[9%]')
    } else {
        navLinks.classList.replace('top-[9%]', 'top-[-100%]')
    }
}