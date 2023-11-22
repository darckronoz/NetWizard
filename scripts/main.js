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
let netdevicesdict = {};
let ranges = []

//al cargar la pagina
document.addEventListener('DOMContentLoaded', () => {
    if(parseInt(localStorage.getItem('departments')) > 0) {
        departments = parseInt(localStorage.getItem('departments'));
        growthrate = parseInt(localStorage.getItem('growth'))/100;
        subnetClass = setclass(localStorage.getItem('class'));
        createDepartmentsQuestions();
    }else {
        alert('no deberías estar aqui :0');
        window.location.href = "questions.html";
    }
});

function setclass(letter) {
    if(letter == 'A') {
        return '10.0.0.0';
    }else if(letter == 'B') {
        return '172.16.0.0';
    }else {
        return '192.168.0.0';
    }
}

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
    //vslm(subnetClass, subnetsdict);
    vslmDOS(subnetClass, subnetsdict);
}

//pass the net objects to a dictionary
//key: subnetname
//value: hosts
function convertDepToDictionary() {
    let dict = {};
    depInfo.forEach(dep => {
        dict[dep.name] = dep.host;
        netdevicesdict[dep.name] = dep.netdevices;
    });
    return dict;
}

function getFisrt(ipdered) {
    var first = ipdered.split('.');
    if(ipdered[3] == 255) {
        first[3]=0;
        if(ipdered[2] == 255) {
            first[2]=0;
            if(ipdered[1] == 255) {
                first[1]=0;
                first[0]++;
            }
            first[1]++;
        }
        first[2]++;
    }else{
        first[3]++;
    }
    return first.join('.');
}

function getLast(ipdered) {
    var first = ipdered.split('.');
  if(first[3]==0) {
    if(first[2]==0) {
      if(first[1]==0) {
        first[0]--;
      	return first.join('.');
      }
      first[1]--;
      return first.join('.');
    }
    first[2]--;
  }else{
  	first[3]--;
  }
  return first.join('.');
}

//obtiene a partir de un rango el direccionamiento
function setRange(begin, end) {
    var a = begin;
    var b = end;
    var fisrt = getFisrt(a.join('.'));
    var last = getLast(b.join('.'));

    return red = {
        name: '',
        id: a.join('.'),
        mascara: 0,
        first: fisrt,
        last: last,
        broadcast: b.join('.'),
        netdevices: 0
    };
}

//obtener la ultima dirección de ip a partir de una ip y un numero de hosts
function setLastIp(host, ip) {
    var ipsplited = ip.split('.');
    var aux = ip.split('.');
    for(let i = 0; i < host+2; i++) {
        if(ipsplited[3] == 255) {
            ipsplited[2]++;
            ipsplited[3] = 0;
        }
        if(ipsplited[2] == 255) {
            ipsplited[1]++;
          ipsplited[2] = 0;
          ipsplited[3] = 0;
        }
        ipsplited[3]++;
      }
    
    return setRange(aux, ipsplited);
}

//ordenar subredes desc por numero de hosts
function sortSubnets(subnets) {
    return Object.entries(subnets)
    .filter(([_, hosts]) => hosts > 1)
    .sort((a, b) => b[1] - a[1]);
}

function vslmDOS(ip, nets) {
    const subredesOrdenadas = sortSubnets(nets);
    var newip = ip;

    for(const [nombre, hosts] of subredesOrdenadas) {
        const bitsParaHosts = Math.ceil(Math.log2(hosts + 2));
        var aux = newip;
        var result = setLastIp(hosts, aux);
        newip = getFisrt(result.broadcast);
        result.mascara = 32 - bitsParaHosts;
        result.name = nombre;
        result.netdevices = netdevicesdict[nombre];
        ranges.push(result);
    }
    console.log(ranges);
    saveInfo();
}

function saveInfo() {
    var index = 0;
    ranges.forEach(o => {
        localStorage.setItem(`info${index}`, JSON.stringify(o));
        index++;
    });
    localStorage.setItem('redes', index);
}





