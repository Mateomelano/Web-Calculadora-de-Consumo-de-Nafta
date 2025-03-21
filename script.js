let precioSuper = 1.156;
let precioPremium = 1.411;

function calcularConsumo() {
    const km = parseFloat(document.getElementById("km").value);
    const litros = parseFloat(document.getElementById("litros").value);

    if (isNaN(km) || isNaN(litros) || km <= 0 || litros <= 0) {
        alert("Por favor, ingrese valores válidos.");
        return;
    }

    const consumo = km / litros;
    const costoSuper = (litros * precioSuper).toFixed(2);
    const costoPremium = (litros * precioPremium).toFixed(2);
    const costoPorKmSuper = (precioSuper / consumo).toFixed(2);
    const costoPorKmPremium = (precioPremium / consumo).toFixed(2);

    document.getElementById("resultado").innerHTML = `
        <p>Consumo: <strong>${consumo.toFixed(2)} km/L</strong></p>
        <p>Costo total con Nafta Súper: <strong>$${costoSuper}</strong></p>
        <p>Costo total con Nafta Premium: <strong>$${costoPremium}</strong></p>
        <p>Costo por kilómetro con Nafta Súper: <strong>$${costoPorKmSuper}</strong></p>
        <p>Costo por kilómetro con Nafta Premium: <strong>$${costoPorKmPremium}</strong></p>
    `;
}

function actualizarPrecios() {
    precioSuper = parseFloat(document.getElementById("precioSuper").value.replace(',', '.'));
    precioPremium = parseFloat(document.getElementById("precioPremium").value.replace(',', '.'));

    if (isNaN(precioSuper) || isNaN(precioPremium) || precioSuper <= 0 || precioPremium <= 0) {
        alert("Por favor, ingrese precios válidos.");
        return;
    }

    alert("Precios actualizados correctamente.");
}
