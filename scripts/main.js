// Obtener elementos del DOM
const subNtwkInput = document.getElementById('subNtwk');
const hostInput = document.getElementById('host');
const generateBtn = document.getElementById('generate');
const hostResult = document.getElementById('hostrange');
const subnetsResult = document.getElementById('subnets');
const subnetsList = document.getElementById('subNetList');
const body = document.body;
const net_type = 10;

// Agregar evento al botón Generar
generateBtn.addEventListener('click', () => {
    const subnet = parseInt(subNtwkInput.value);
    const host = parseInt(hostInput.value);
    hostResult.textContent = `${net_type}.${generateHostRange(subnet, host)}`;
    showNets(generateSubNetAddress(subnet));
});

function generateSubNetAddress(subnet) {
    const nets = [];
    const number = 256/subnet;
    for (let i = 0; i < subnet; i++) {
        nets.push(number*i);
    }
    return nets;
}

function showNets(nets) {
    subnetsList.innerHTML = '';
    for (let i = 0; i < nets.length; i++) {
        const li = document.createElement('li');
        li.textContent = `${i+1}: ${net_type}.${nets[i]}.0.0`;
        subnetsList.appendChild(li);
    }
}

function generateHostRange(host) {
    return host+net_type;
}

