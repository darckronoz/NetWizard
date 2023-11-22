const body = document.body;
// Obtener elementos del DOM
const generateBtn = document.getElementById('generate');
const saveInfoBtn = document.getElementById('save-info');
const divform = document.getElementById('principal');

//To Do: 
let depInfo = [];
let growthrate = 0;
let subnetClass = '';
let departments = 0;

//al cargar la pagina
document.addEventListener('DOMContentLoaded', () => {
    if(parseInt(localStorage.getItem('departments')) > 0) {
        departments = parseInt(localStorage.getItem('departments'));
        growthrate = parseInt(localStorage.getItem('growth'))/100;
        subnetClass = localStorage.getItem('class');
        createDepartmentsQuestions();
    }else {
        alert('no deberías estar aqui :0');
        window.location.href = "questions.html";
    }
});

//create departments
function createDepartmentsQuestions() {
    for(let i = 0; i < departments; i++) {
        createQuestion(i);
    }
    showQuestion(0);
}

//create question
function createQuestion(index) {
    let questdiv = document.createElement('div');
    questdiv.innerHTML=`<div class="form hidden" id="quest${index}">
    <h3>departamento ${index+1}</h3>
    <br>

    <label for="depname${index}">Nombre del departamento:</label>
    <input placeholder="name" type="text" id="depname${index}">

    <label for="dephost${index}">Cantidad de empleados:</label>
    <input type="number" id="dephost${index}" min="1">

    <label for="netdevices${index}">Cantidad de dispositivos de red:</label>
    <input type="number" id="netdevices${index}" min="1">

    <label for="subnetClass">Red de wifi?:</label>
    <select id="wifi${index}">
    <option value="no">no</option>
    <option value="si">si</option>
    </select>
    
    <button id="next${index}">Siguiente departamento</button>
    </div>`;
    divform.appendChild(questdiv);
}

//save department info
function saveDepartmentInfo(name, host, wifi, netdevices) {
    console.log(wifi);
    const dep1 = {
        name: name+'-eth',
        host: host,
        wifi: wifi,
        netdevices: netdevices
    };
    if(wifi) {
        const dep2 = {
            name: name+'-wifi',
            host: host,
            wifi: wifi,
            netdevices: netdevices
        };
        depInfo.push(dep2);
    }
    depInfo.push(dep1);
}

//show question with its index
function showQuestion(index) {
    let quest = document.getElementById(`quest${index}`);
    quest.classList.remove('hidden');
    document.getElementById(`next${index}`).addEventListener('click', () => {
        let name = document.getElementById(`depname${index}`).value;
        let hosts = parseInt(document.getElementById(`dephost${index}`).value);
        hosts = hosts + hosts*growthrate;
        let netdevices = parseInt(document.getElementById(`netdevices${index}`).value)
        hosts = Math.ceil(hosts + netdevices);
        let wifi = document.getElementById(`wifi${index}`).value=='si';
        saveDepartmentInfo(name, hosts, wifi, netdevices);
        if(index == departments-1) {
            lastQuestion();
        }else {
            quest.classList.add('hidden');
            showQuestion(index+1);
        }
    });
}

//function for the last question
function lastQuestion() {
    let subnetsdict = convertDepToDictionary();
    console.log('aqui iria el metodo que calcula con este info:');
    console.log(subnetsdict);
}

//pass the net objects to a dictionary
//key: subnetname
//value: hosts
function convertDepToDictionary() {
    let dict = {};
    depInfo.forEach(dep => {
        dict[dep.name] = dep.host;
    });
    return dict;
}

//ip = '192.168.0.0'
//nets = {'red1':24, 'red2':32, 'red3':40}
function vslm(ip, nets) {

}

