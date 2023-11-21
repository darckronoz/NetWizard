const body = document.body;
// Obtener elementos del DOM
const generateBtn = document.getElementById('generate');
const saveInfoBtn = document.getElementById('save-info');

//To Do: 
let savedDepartmentInfo = [];
let ip = '192.168.0.0'; // Valor predeterminado
let subnets = {};
let growthrate = 0;
let subnetClass = '';
let departments = 0;

//al cargar la pagina
document.addEventListener('DOMContentLoaded', () => {
    if(parseInt(localStorage.getItem('departments')) > 0) {
        departments = parseInt(localStorage.getItem('departments'));
        growthrate = parseInt(localStorage.getItem('growth'));
        subnetClass = localStorage.getItem('class');
    }else {
        alert('no deberías estar aqui :0');
        window.location.href = "questions.html";
    }
});

//boton siguiente pregunta.
saveInfoBtn.addEventListener('click', () => {
    for (let i = 0; i < departmentCount; i++) {
        const department = {
            name: '',
            employeeCount: 0,
            wifi: false,
            networkDevices: 0
        };
        savedDepartmentInfo.push(department);
    }
    saveDepartmentInfo();
    window.location.href = "question_card.html";
});

// Función para mostrar las preguntas adicionales sobre cada departamento
function showDepartmentQuestions(count) {
    const departmentQuestionsContainer = document.getElementById('departmentQuestions');
    departmentQuestionsContainer.innerHTML = ''; // Limpiar el contenedor

    for (let i = 0; i < count; i++) {
        const departmentDiv = document.createElement('div');
        departmentDiv.innerHTML = `
            <h3>Departamento ${i + 1}</h3>
            <label for="departmentName${i}">Nombre del departamento:</label>
            <input type="text" id="departmentName${i}">

            <label for="employeeCount${i}">Cantidad de empleados:</label>
            <input type="number" id="employeeCount${i}" value="1">

            <label for="wifi${i}">¿Crear subred de Wi-Fi en este departamento?</label>
            <input type="checkbox" id="wifi${i}">

            <label for="networkDevices${i}">Cantidad de dispositivos de red:</label>
            <select id="networkDevices${i}">
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
                <option value="6">6</option>
                <option value="7">7</option>
                <option value="8">8</option>
                <option value="9">9</option>
                <option value="10">10</option>
            </select>
        `;

        departmentQuestionsContainer.appendChild(departmentDiv);
    }

    // Mostrar el contenedor de preguntas adicionales
    departmentQuestionsContainer.classList.remove('hidden');
}

// Nueva función para guardar la información en un array
function saveDepartmentInfo() {

    console.log("Información de departamentos guardada:", savedDepartmentInfo);
    alert("Información de departamentos guardada correctamente.");
}



//ip = '192.168.0.0'
//nets = {'red1':24, 'red2':32, 'red3':40}
function vslm(ip, nets) {

}

