const body = document.body;
// Obtener elementos del DOM
const subNtwkSelect = document.getElementById('subNtwk');
const netTypeSelect = document.getElementById('netType');
const hostInput = document.getElementById('host');
const generateBtn = document.getElementById('generate');
const hostResult = document.getElementById('hostrange');
const subnetsResult = document.getElementById('subnets');
const subnetsList = document.getElementById('subNetList');
const hostrangeList = document.getElementById('hostrangeList');

//To Do: 
const net_type_select = [10, 66, 128, 192];
const subnets_select = [1, 2, 4, 8, 16, 32, 64, 128, 256];
let subnet = 1;
let netType = 10;
let host = 1;
let nets = [];
let hosts = [];

// Eventos que se ejecutan al cargar la pagina
document.addEventListener("DOMContentLoaded", function() {
    fillSubNetSelect();
    fillNetTypeSelect();
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

//evento generar
generateBtn.addEventListener('click', () => {
    netType = netTypeSelect.value;
    subnet = subNtwkSelect.value;
    host = hostInput.value;
    showNets();
    showHostRange();
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

