function obtenerClaseDeRed(ip) {
    const octetos = ip.split('.').map(Number);

    if (octetos[0] >= 1 && octetos[0] <= 126) {
        return 'A';
    } else if (octetos[0] >= 128 && octetos[0] <= 191) {
        return 'B';
    } else if (octetos[0] >= 192 && octetos[0] <= 223) {
        return 'C';
    } else {
        throw new Error('Dirección IP no válida');
    }
}


function vslm(ip, nets) {
    const claseDeRed = obtenerClaseDeRed(ip);

    const subredesOrdenadas = Object.entries(nets)
        .filter(([_, hosts]) => hosts > 1)
        .sort((a, b) => b[1] - a[1]);

    console.log('Subredes ordenadas:', subredesOrdenadas);

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
    
        console.log(`${nombre}: Rango: ${redBase}.${rangoInicio}-${redBase}.${rangoFin}, Dirección de Red: ${direccionRed}, Dirección de Broadcast: ${direccionBroadcast}`);
    
        inicioHost += incremento;
    }
}

// Ejemplo de uso
const ip = '192.168.0.0';
const subredes = { 'red1': 10, 'red2': 5, 'red3': 4 };
vslm(ip, subredes);
