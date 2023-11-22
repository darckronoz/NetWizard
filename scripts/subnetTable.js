
const subnetsData = [];

document.addEventListener('DOMContentLoaded', () => {
  
});

function getInfo() {
  var index = localStorage.getItem('redes');
  for(let i = 0; i < index; i++) {
      subnetsData.push(JSON.parse(localStorage.getItem(`info${i}`)));
  }
}

function mostrarTabla(subnets) {
  getInfo();
  const tabla = document.getElementById('miTabla');
  const cabecera = '<tr><th>ID</th><th>Nombre</th><th>Dirección IP</th><th>Máscara</th><th>Primera Dirección</th><th>Última Dirección</th><th>Broadcast</th><th>Cantidad de Dispositivos de Red</th></tr>';
  tabla.innerHTML = cabecera;

  subnets.forEach((subnet, index) => {
    const newRow = tabla.insertRow();
    const cellId = newRow.insertCell(0);
    const cellNombre = newRow.insertCell(1);
    const cellNetId = newRow.insertCell(2);
    const cellMask = newRow.insertCell(3);
    const cellFirst = newRow.insertCell(4);
    const cellLast = newRow.insertCell(5);
    const cellBroadcast = newRow.insertCell(6);
    const cellDispositivos = newRow.insertCell(7);

    cellId.textContent = index + 1;
    cellNombre.textContent = subnet.name;
    cellNetId.textContent = subnet.id;
    cellMask.textContent = subnet.mascara;
    cellFirst.textContent = subnet.first;
    cellLast.textContent = subnet.last;
    cellBroadcast.textContent = subnet.broadcast;
    cellDispositivos.textContent = subnet.netdevices;
  });
}

mostrarTabla(subnetsData);
