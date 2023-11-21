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
    }

    let inicioHost = 1;

    for (const [nombre, hosts] of subredesOrdenadas) {
        const bitsParaHosts = Math.ceil(Math.log2(hosts + 2));
        const bitsParaSubred = 32 - bitsParaHosts;

        const mascaraSubred = (2 ** bitsParaSubred) - 1;
        const incremento = 2 ** bitsParaHosts;

        const rangoInicio = inicioHost + 1;
        const rangoFin = inicioHost + incremento - 2;

        const direccionRed = `${redBase}.${inicioHost}`;
        const direccionBroadcast = `${redBase}.${rangoFin + 1}`;

        console.log(`${nombre}: Rango: ${redBase}.${rangoInicio}-${redBase}.${rangoFin}, Dirección de Red: ${direccionRed}, Dirección de Broadcast: ${direccionBroadcast}`);

        inicioHost += incremento;
    }
}


// Ejemplo de uso
const ip = '192.168.0.0';
const subredes = { 'red1': 56, 'red2': 32, 'red3': 40 };
vslm(ip, subredes);
