const body = document.body;
// Obtener elementos del DOM
const subNtwkSelect = document.getElementById('subNtwk');
const netTypeSelect = document.getElementById('netType');
const hostInput = document.getElementById('host');
const generateBtn = document.getElementById('generate');
const subnetBtn = document.getElementById('subnetButton');
const hostResult = document.getElementById('hostrange');
const subnetsResult = document.getElementById('subnets');
const subnetsList = document.getElementById('subNetList');
const hostrangeList = document.getElementById('hostrangeList');
const errorSubnet = document.getElementById('error_nosubnets');
const clearSubNetBtn = document.getElementById('clearSubNetList');

//To Do: 
const initialIP = '192.168.1.1';
const net_type_select = [10, 66, 128, 192];
const subnets_select = [1, 2, 4, 8, 16, 32, 64, 128, 256];
let subnet = 1;
let netType = 10;
let host = 1;
let nets = [];
let hosts = [];
let info = {};
let subnetGenerated = false;
let departmentCount = 1; // Valor predeterminado
let subnetClass = 'A'; // Valor predeterminado

// Eventos que se ejecutan al cargar la pagina
document.addEventListener("DOMContentLoaded", function() {
    subnetGenerated = false;
    fillSubNetSelect();
    fillNetTypeSelect();
});

// Nuevo evento al cambiar la cantidad de departamentos
document.getElementById('departmentCount').addEventListener('change', function () {
    departmentCount = parseInt(this.value, 10);
    showDepartmentQuestions(departmentCount);
});

//llenar la seleccion de sub redes
function fillSubNetSelect() {
    subnets_select.forEach(e => {
        let option = document.createElement('option');
        option.value = e;
        option.text = e;
        subNtwkSelect.appendChild(option);
    });
}

//llenar la seleccion de tipos de redes
function fillNetTypeSelect() {
    net_type_select.forEach(e => {
        let option = document.createElement('option');
        option.value = e;
        option.text = e;
        netTypeSelect.appendChild(option);
    });
}

//evento generar subredes, esto llena el 
//diccionario info con: 
// llave = subnetid
// valor = cantidad de hosts (queda en 1 hasta que el usuario cambie algun valor)
subnetBtn.addEventListener('click', () => {
    subnet = subNtwkSelect.value;
    subnetsList.innerHTML = ' ';
    for(let i = 0; i < subnet; i++) {
        let p = document.createElement('p');
        let li = document.createElement('li');
        let input = document.createElement('input');
        p.textContent = String(i+1) + ': ';
        input.type = 'number';
        input.value = '1';
        input.id = 'subnet'+String(i+1);
        li.appendChild(p);
        li.appendChild(input);
        subnetsList.append(li);
        info[i+1] = 1;
        input.addEventListener('change', () => {
            const inputId = event.target.id;
            const index = parseInt(inputId.replace('subnet', ''), 10);
            info[index] = parseInt(event.target.value, 10);
        });
    }
    subnetGenerated = true;
    errorSubnet.classList.add('hidden');
    clearSubNetBtn.classList.remove('hidden');
});


// Modificar el evento del botón "Generar" para recopilar la información de los departamentos
generateBtn.addEventListener('click', () => {
    if (subnetGenerated) {
        netType = netTypeSelect.value;
        subnet = subNtwkSelect.value;
        host = hostInput.value;
        subnetClass = document.getElementById('subnetClass').value; // Obtener la clase de la subred
        showNets();
        showHostRange();
        // Recopilar información sobre departamentos
        const departmentInfo = collectDepartmentInfo();
        console.log(departmentInfo);

        // Calcular y mostrar el rango de direcciones IP utilizables
        const ipRange = calculateIPRange(netType, subnet, subnetClass);
        console.log("Rango de direcciones IP utilizables:", ipRange);

        // Mostrar la información de los departamentos como cartas
        showDepartmentCards(departmentInfo);

        // Resto del código después de mostrar las cartas
        // Puedes agregar aquí cualquier lógica adicional que desees ejecutar después de mostrar las cartas.

    } else {
        errorSubnet.classList.remove('hidden');
        clearSubNetBtn.classList.remove('hidden'); // Agrega esto si lo necesitas
    }
});

//ordenar descendentemente por cantidad de hosts.
function sortSubnetsByHosts() {
    
}


clearSubNetBtn.addEventListener('click', () => {
    subnetsList.innerHTML = ' ';
    subnetGenerated = false;
    clearSubNetBtn.classList.add('hidden');
});

//función para generar las subredes
function generateSubNetAddress() {
    nets = [];
    const number = 256/subnet;
    for (let i = 0; i < subnet; i++) {
        nets.push(number*i);
    }
    return nets;
}

//función para mostrar las sub redes
function showNets() {
    subnetsList.innerHTML = '';
    generateSubNetAddress();
    for (let i = 0; i < nets.length; i++) {
        const li = document.createElement('li');
        li.textContent = `${i+1}: ${netType}.${nets[i]}.0.0`;
        subnetsList.appendChild(li);
    }
}

//función para generar los rangos de los hosts
function generateHostRange() {
    hosts = [];
    for (let i = 0; i < nets.length; i++) {
        let end = '';
        let begin = `${netType}.${nets[i]}.0.1`;
        if(i < nets.length-1) {
            end = `${netType}.${nets[i+1]-1}.255.254`;
        }else {
            end = `${netType}.255.255.254`;
        }
        hosts.push(begin + ' - ' + end);
    }
}

//función que muestra los rangos de red
function showHostRange() {
    hostrangeList.innerHTML = '';
    generateHostRange();
    let sn = 0;
    hosts.forEach(h => {
        sn++;
        const li = document.createElement('li');
        li.textContent = `Subnet ${sn}: ${h}`;
        hostrangeList.appendChild(li);
    });
}

// Nueva función para calcular el rango de direcciones IP utilizables
function calculateIPRange(netType, subnet, subnetClass) {
    const subnetNumber = parseInt(subnet);
    const subnetSize = 256 / subnetNumber;
    const subnetStart = subnetSize * (subnetNumber - 1);
    const subnetEnd = subnetSize * subnetNumber - 1;

    let rangeStart, rangeEnd;

    if (subnetClass === 'A') {
        rangeStart = `${netType}.0.0.1`;
        rangeEnd = `${netType}.${subnetStart - 1}.255.254`;
    } else if (subnetClass === 'B') {
        rangeStart = `${netType}.${subnetStart}.0.1`;
        rangeEnd = `${netType}.${subnetStart + subnetSize - 1}.255.254`;
    } else if (subnetClass === 'C') {
        rangeStart = `${netType}.${subnetStart}.0.1`;
        rangeEnd = `${netType}.${subnetStart}.255.254`;
    }

    return `${rangeStart} - ${rangeEnd}`;
}

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

// Nueva función para recopilar las respuestas sobre los departamentos
function collectDepartmentInfo() {
    const departmentInfo = [];

    for (let i = 0; i < departmentCount; i++) {
        const department = {
            name: document.getElementById(`departmentName${i}`).value,
            employeeCount: parseInt(document.getElementById(`employeeCount${i}`).value, 10),
            wifi: document.getElementById(`wifi${i}`).checked,
            networkDevices: parseInt(document.getElementById(`networkDevices${i}`).value, 10),
        };

        departmentInfo.push(department);
    }

    return departmentInfo;
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
// Declara una variable global para almacenar la información de los departamentos
let savedDepartmentInfo = [];

// Agrega el botón de "Guardar información"
const saveInfoBtn = document.createElement('button');
saveInfoBtn.textContent = 'Guardar información';
saveInfoBtn.addEventListener('click', saveDepartmentInfo);
document.body.appendChild(saveInfoBtn);

