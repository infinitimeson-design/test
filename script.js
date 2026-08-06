document.addEventListener("DOMContentLoaded", () => {


/* ==========================
   TYPING EFFECT
========================== */

const typingData = [
  {
    element: "typing-name",
    text: "Sicily"
  },
  {
    element: "typing-role",
    text: "Designer & Builder"
  },
  {
    element: "typing-passion",
    text: "Creating premium digital experiences"
  }
];


function typeWriter(element, text, speed = 60){

  let index = 0;

  element.textContent = "";

  function typing(){

    if(index < text.length){

      element.textContent += text.charAt(index);

      index++;

      setTimeout(typing, speed);

    }

  }

  typing();

}


typingData.forEach((item, i)=>{

  const el = document.getElementById(item.element);

  if(el){

    setTimeout(()=>{

      typeWriter(el,item.text);

    }, i * 1200);

  }

});





/* ==========================
   SIDEBAR ACTIVE STATE
========================== */


const sections = document.querySelectorAll("main section[id]");
const navLinks = document.querySelectorAll(".sidebar-link");


function updateActiveLink(){


let current = "";


sections.forEach(section=>{


const sectionTop = section.offsetTop - 200;


if(window.scrollY >= sectionTop){

current = section.getAttribute("id");

}


});



navLinks.forEach(link=>{


link.classList.remove("active");



if(link.getAttribute("href") === "#" + current){

link.classList.add("active");

}


});


}



window.addEventListener("scroll", updateActiveLink);

updateActiveLink();






/* ==========================
   MOBILE SIDEBAR
========================== */


const toggle = document.getElementById("sidebar-toggle");

const sidebar = document.getElementById("sidebar");

const overlay = document.getElementById("sidebar-overlay");



function closeSidebar(){

sidebar.classList.remove("open");

overlay.classList.remove("show");

}


if(toggle){


toggle.addEventListener("click",()=>{


sidebar.classList.toggle("open");

overlay.classList.toggle("show");


});


}



if(overlay){

overlay.addEventListener("click",closeSidebar);

}



navLinks.forEach(link=>{

link.addEventListener("click",()=>{

closeSidebar();

});

});







/* ==========================
   COUNTER ANIMATION
========================== */


const counters = document.querySelectorAll(".stat-number");


const counterObserver = new IntersectionObserver(entries=>{


entries.forEach(entry=>{


if(entry.isIntersecting){


const counter = entry.target;

const target = parseInt(counter.dataset.target || counter.textContent);


let current = 0;

const step = Math.ceil(target / 80);



const timer = setInterval(()=>{


current += step;


if(current >= target){

counter.textContent = target;

clearInterval(timer);

}else{

counter.textContent = current;

}


},20);



counterObserver.unobserve(counter);


}



});


},{threshold:.5});



counters.forEach(counter=>{

counterObserver.observe(counter);

});






/* ==========================
   SKILL ANIMATION
========================== */


const skills = document.querySelectorAll(".skill-fill");


const skillObserver = new IntersectionObserver(entries=>{


entries.forEach(entry=>{


if(entry.isIntersecting){

entry.target.style.width =
entry.target.style.getPropertyValue("--level");


skillObserver.unobserve(entry.target);


}


});


},{threshold:.5});



skills.forEach(skill=>{

skillObserver.observe(skill);

});







/* ==========================
   SMOOTH SCROLL
========================== */


document.querySelectorAll('a[href^="#"]').forEach(anchor=>{


anchor.addEventListener("click",function(e){


const target = document.querySelector(this.getAttribute("href"));


if(target){

e.preventDefault();


target.scrollIntoView({

behavior:"smooth"

});


}



});


});





});
