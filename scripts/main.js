const body = document.body;
// Obtener elementos del DOM
const generateBtn = document.getElementById('generate');
const saveInfoBtn = document.getElementById('save-info');

//To Do: 
let savedDepartmentInfo = [];
let ip = '192.168.0.0'; // Valor predeterminado
let subnets = {};
let growthrate = 0;

// Eventos que se ejecutan al cargar la pagina
document.addEventListener("DOMContentLoaded", function() {
});

// Nuevo evento al cambiar la cantidad de departamentos
document.getElementById('departmentCount').addEventListener('change', function () {
    departmentCount = parseInt(this.value, 10);
    showDepartmentQuestions(departmentCount);
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
    const departmentInfo = collectDepartmentInfo();
    // Almacena la información en una constante o variable
    // En este ejemplo, uso una variable global llamada 'savedDepartmentInfo'
    savedDepartmentInfo = departmentInfo;
    console.log("Información de departamentos guardada:", savedDepartmentInfo);
    alert("Información de departamentos guardada correctamente.");
}

saveInfoBtn.addEventListener('click', () => {
// Nueva función para recopilar las respuestas sobre los departamentos
    for (let i = 0; i < departmentCount; i++) {
        const department = {
            name: document.getElementById(`departmentName${i}`).value,
            employeeCount: parseInt(document.getElementById(`employeeCount${i}`).value, 10),
            wifi: document.getElementById(`wifi${i}`).checked,
            networkDevices: parseInt(document.getElementById(`networkDevices${i}`).value, 10),
        };

        const subnet = {
            name: 'marketuing',
            netid: '192.168.0.0',
            range: '192.168.0.1-192.168.0.255',
            networkDevices: 5
        }
        savedDepartmentInfo.push(department);
    }
});

//ip = '192.168.0.0'
//nets = {'red1':24, 'red2':32, 'red3':40}
function vslm(ip, nets) {

}

