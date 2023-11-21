function vlsm(ip, nets) {
    // Ordenar las subredes de forma ascendente
    const sortedNets = Object.entries(nets).sort((a, b) => a[1] - b[1]);

    // Convertir la IP inicial a un array de números
    const ipArray = ip.split('.').map(Number);

    // Función para convertir un número a formato de dirección IP
    function numToIp(numArray) {
        return numArray.join('.');
    }

    // Función para calcular la máscara de subred en formato de array
    function calculateSubnetMask(prefixLength) {
        const mask = [0, 0, 0, 0];
        for (let i = 0; i < prefixLength; i++) {
            mask[Math.floor(i / 8)] |= 1 << (7 - (i % 8));
        }
        return mask;
    }

    // Función para calcular el rango de IPs utilizables en una subred
    function calculateIPRange(network, prefixLength) {
        const networkArray = network.split('.').map(Number);
        const subnetMask = calculateSubnetMask(prefixLength);
        const startIP = networkArray.map((octet, i) => octet & subnetMask[i]).join('.');
        const endIP = networkArray.map((octet, i) => octet | ~subnetMask[i] & 255).join('.');
        return [startIP, endIP];
    }

    // Resultado final
    const result = {};

    // Aplicar VLSM
    let currentIP = [...ipArray];

    sortedNets.forEach(([subnetName, subnetSize]) => {
        const subnetMaskLength = 32 - Math.log2(subnetSize);
        const [startIP, endIP] = calculateIPRange(numToIp(currentIP), subnetMaskLength);
        

        // Guardar el rango de IPs utilizables en el resultado
        result[subnetName] = {
            start: startIP,
            end: endIP
        };

       // Calcular la siguiente dirección IP disponible después del rango de la subred
        currentIP = endIP.split('.').map(Number);
        currentIP[3] += 1; // Incrementar la última parte del octeto

        // Actualizar la IP actual para la siguiente subred
        currentIP = currentIP.map((octet, i) => i === 3 ? octet : octet % 256);

    });

    return result;
}

// Ejemplo de uso:
const ip = '192.168.0.0';
const nets = { 'red1': 24, 'red2': 32, 'red3': 40, 'red4': 32, 'red5': 32, 'red6': 32 };

const result = vlsm(ip, nets);
console.log(result);
