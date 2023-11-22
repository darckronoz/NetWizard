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
    });
    return dict;
}

function getFisrt(ipdered) {
    var first = ipdered.split('.');
    console.log(first);
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

function getLast(broadcast) {
    var last = broadcast;
    if(broadcast[3]===0) {
        if(broadcast[2]===0) {
            if(broadcast[1]===0) {
                last[0]--;
            }
            last[1]--;
        }
        last[2]--;
    }else {
        last[3]--;
    }
    return last;
}

//obtiene a partir de un rango el direccionamiento
function setRange(begin, end) {
    var a = begin;
    var b = end;

    return red = {
        id: a.join('.'),
        broadcast: b.join('.'),
        mascara: 0
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
    var ranges = []

    for(const [nombre, hosts] of subredesOrdenadas) {

        const bitsParaHosts = Math.ceil(Math.log2(hosts + 2));

        var aux = newip;
        var result = setLastIp(hosts, aux);
        newip = getFisrt(result.broadcast);
        result.mascara = 32 - bitsParaHosts;
        ranges.push(result);
    }
    console.log(ranges);
}


function vslm(ip, nets) {
    const claseDeRed = localStorage.getItem('class');

    //ordenar redes
    const subredesOrdenadas = sortSubnets(nets);

    let redBase;
    if (claseDeRed === 'A') {
        redBase = ip.split('.').slice(0, 3).join('.');
    } else if (claseDeRed === 'B') {
        redBase = ip.split('.').slice(0, 2).join('.');
    } else if (claseDeRed === 'C') {
        redBase = ip.split('.').slice(0, 3).join('.');
    
        // Validar número máximo de hosts para la clase C
        const maxHosts = 253;
        const totalHosts = subredesOrdenadas.reduce((total, [, hosts]) => total + hosts, 0);
        if (totalHosts > maxHosts) {
            throw new Error(`El número total de hosts (${totalHosts}) excede el máximo permitido para la clase C (${maxHosts}).`);
        }
    }
    console.log(redBase);
    let inicioHost = 1;

    for (const [nombre, hosts] of subredesOrdenadas) {
        const bitsParaHosts = Math.ceil(Math.log2(hosts + 2));
        const bitsParaSubred = 32 - bitsParaHosts;
    
        // Validar desbordamiento de la red para clase A
        if (claseDeRed === 'A' && inicioHost + 2 ** bitsParaHosts - 2 > 2 ** 24 - 2) {
            throw new Error(`Desbordamiento de red en subred ${nombre}. El número total de hosts excede el máximo permitido para la clase A.`);
        }
    
        const mascaraSubred = (2 ** bitsParaSubred) - 1;
        const incremento = 2 ** bitsParaHosts;
    
        const rangoInicio = inicioHost ;
        const rangoFin = inicioHost + incremento - 3;
    
        // Validar desbordamiento de la dirección de broadcast para clase A
        if (claseDeRed === 'A' && inicioHost + incremento - 2 > 2 ** 24 - 2) {
            throw new Error(`Desbordamiento de dirección de broadcast en subred ${nombre}. El número total de hosts excede el máximo permitido para la clase A.`);
        }
    
        // Validar desbordamiento de la red para clase B
        if (claseDeRed === 'B' && inicioHost + 2 ** bitsParaHosts - 2 > 2 ** 16 - 2) {
            throw new Error(`Desbordamiento de red en subred ${nombre}. El número total de hosts excede el máximo permitido para la clase B.`);
        }
        const direccionRed = `${redBase}.${inicioHost- 1} `;
        const direccionBroadcast = `${redBase}.${inicioHost + incremento - 2}`;
    
        console.log(`${nombre}: Rango: ${redBase}.${rangoInicio}-${redBase}.${rangoFin}, Dirección de Red: ${direccionRed}, Dirección de Broadcast: ${direccionBroadcast}, mascara: ${bitsParaSubred}`);
    
        inicioHost += incremento;
    }
}


