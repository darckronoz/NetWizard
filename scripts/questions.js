const body = document.body;
// Obtener elementos del DOM
const saveInfoBtn = document.getElementById('save-info');
const departmentCount = document.getElementById('departmentCount');
const subnetClass = document.getElementById('subnetClass');
const growthrate = document.getElementById('growthrate');

//al cargar la pagina
document.addEventListener('DOMContentLoaded', () => {

    //clean local storage on page load
    localStorage.setItem('departments', '');
    localStorage.setItem('growth', '');
    localStorage.setItem('class', '');
});


//boton siguiente pregunta.
saveInfoBtn.addEventListener('click', () => {
    if(parseInt(departmentCount.value) > 0) {
        localStorage.setItem('departments', departmentCount.value);
        localStorage.setItem('growth', growthrate.value);
        localStorage.setItem('class', subnetClass.value);

        window.location.href = "question_card.html";
    }else {
        alert("La cantidad de departamentos no puede ser 0 -.-");
    }
    
});


