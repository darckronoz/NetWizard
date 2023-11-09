const body = document.body;
const subNtwkSelect = document.getElementById('subNtwk');
const netTypeSelect = document.getElementById('netType');
const hostInput = document.getElementById('host');
const generateBtn = document.getElementById('generate');
const subnetList = document.getElementById('subNetList');
const resultsList = document.getElementById('resultsList');

let netType = 10;
let hosts = [];

document.addEventListener("DOMContentLoaded", function () {
    fillSubNetSelect();
    fillNetTypeSelect();
});

function fillSubNetSelect() {
    const subnets_select = [1, 2, 4, 8, 16, 32, 64, 128, 256];
    subnets_select.forEach(e => {
        let option = document.createElement('option');
        option.value = e;
        option.text = e;
        subNtwkSelect.appendChild(option);
    });
}

function fillNetTypeSelect() {
    const net_type_select = [10, 66, 128, 192];
    net_type_select.forEach(e => {
        let option = document.createElement('option');
        option.value = e;
        option.text = e;
        netTypeSelect.appendChild(option);
    });
}

generateBtn.addEventListener('click', () => {
    netType = netTypeSelect.value;
    const subnetCount = parseInt(subNtwkSelect.value);
    const totalHosts = parseInt(hostInput.value);

    calculateVLSM(subnetCount, totalHosts);
    displayResults();
});

function calculateVLSM(subnetCount, totalHosts) {
    hosts = [];
    let remainingHosts = totalHosts;
    let subnetSize = 256;

    for (let i = 0; i < subnetCount; i++) {
        const subnetMask = subnetSize - 1;
        const subnetBits = Math.log2(subnetSize);

        const hostsNeeded = subnetBits > 0 ? Math.pow(2, subnetBits) - 2 : 0;
        const subnetHosts = Math.min(remainingHosts, hostsNeeded);

        hosts.push({
            subnet: i + 1,
            subnetMask: `255.255.255.${subnetMask}`,
            networkAddress: `${netType}.${subnetSize * i}.0.0`,
            broadcastAddress: `${netType}.${subnetSize * (i + 1) - 1}.255.255`,
            routerAddress: `${netType}.${subnetSize * i}.0.1`,
            hostRange: `${netType}.${subnetSize * i}.0.2 - ${netType}.${subnetSize * (i + 1) - 1}.255.254`,
        });

        remainingHosts -= subnetHosts;
        subnetSize /= 2;
    }
}

function displayResults() {
    resultsList.innerHTML = '';
    hosts.forEach(host => {
        const li = document.createElement('li');
        li.textContent = `Subred ${host.subnet}\nMáscara de Subred: ${host.subnetMask}\nDirección de Red: ${host.networkAddress}\nDirección de Broadcast: ${host.broadcastAddress}\nDirección del Enrutador: ${host.routerAddress}\nRango de Direcciones IP: ${host.hostRange}\n`;
        resultsList.appendChild(li);
    });
}
