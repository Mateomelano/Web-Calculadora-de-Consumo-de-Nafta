// === Función utilitaria ===
function formatear(valor) {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
  }).format(valor);
}

function calcularConsumo() {
  const km = parseFloat(document.getElementById("km").value);
  const litros = parseFloat(document.getElementById("litros").value);

  const precioSuper = parseFloat(
    document.getElementById("precioSuper").value.replace(",", ".")
  );
  const precioPremium = parseFloat(
    document.getElementById("precioPremium").value.replace(",", ".")
  );
  const precioDiesel = parseFloat(
    document.getElementById("precioDiesel").value.replace(",", ".")
  );
  const precioGnc = parseFloat(
    document.getElementById("precioGnc").value.replace(",", ".")
  );

  if (
    isNaN(km) ||
    km <= 0 ||
    isNaN(litros) ||
    litros <= 0 ||
    isNaN(precioSuper) ||
    isNaN(precioPremium) ||
    isNaN(precioDiesel) ||
    isNaN(precioGnc)
  ) {
    Swal.fire({
      icon: "warning",
      title: "Datos incompletos",
      text: "Por favor, completá los kilómetros y litros válidos.",
    });
    return;
  }

  const consumo = km / litros;

  const costoSuper = formatear(litros * precioSuper);
  const costoPremium = formatear(litros * precioPremium);
  const costoDiesel = formatear(litros * precioDiesel);
  const costoGnc = formatear(litros * precioGnc);

  const costoPorKmSuper = formatear(precioSuper / consumo);
  const costoPorKmPremium = formatear(precioPremium / consumo);
  const costoPorKmDiesel = formatear(precioDiesel / consumo);
  const costoPorKmGnc = formatear(precioGnc / consumo);

  document.getElementById("resultado").innerHTML = `
    <p>Consumo: <strong>${consumo.toFixed(2)} km/L</strong></p>
    <p>Costo total con Nafta Súper: <strong>${costoSuper}</strong></p>
    <p>Costo total con Nafta Premium: <strong>${costoPremium}</strong></p>
    <p>Costo total con Diésel: <strong>${costoDiesel}</strong></p>
    <p>Costo total con GNC: <strong>${costoGnc}</strong></p>
    <p>Costo por kilómetro con Nafta Súper: <strong>${costoPorKmSuper}</strong></p>
    <p>Costo por kilómetro con Nafta Premium: <strong>${costoPorKmPremium}</strong></p>
    <p>Costo por kilómetro con Diésel: <strong>${costoPorKmDiesel}</strong></p>
    <p>Costo por kilómetro con GNC: <strong>${costoPorKmGnc}</strong></p>
  `;
}

function actualizarPrecios() {
  const precioSuper = parseFloat(
    document.getElementById("precioSuper").value.replace(",", ".")
  );
  const precioPremium = parseFloat(
    document.getElementById("precioPremium").value.replace(",", ".")
  );
  const precioDiesel = parseFloat(
    document.getElementById("precioDiesel").value.replace(",", ".")
  );
  const precioGnc = parseFloat(
    document.getElementById("precioGnc").value.replace(",", ".")
  );

  if (
    isNaN(precioSuper) ||
    precioSuper <= 0 ||
    isNaN(precioPremium) ||
    precioPremium <= 0 ||
    isNaN(precioDiesel) ||
    precioDiesel <= 0 ||
    isNaN(precioGnc) ||
    precioGnc <= 0
  ) {
    Swal.fire({
      icon: "error",
      title: "Precios inválidos",
      text: "Por favor, ingresá todos los precios correctamente.",
    });
    return;
  }

  Swal.fire({
    icon: "success",
    title: "Precios actualizados",
    text: "Los nuevos precios fueron aplicados correctamente.",
  });
}

// Animación de logos de Shell cayendo
const shellLogoURL = "Shell.png";
function crearLogo() {
  const img = document.createElement("img");
  img.src = shellLogoURL;
  img.classList.add("logo");
  img.style.left = `${Math.random() * 100}vw`;
  img.style.animationDuration = `${Math.random() * 5 + 5}s`;
  document.body.appendChild(img);

  setTimeout(() => img.remove(), 10000);
}

setInterval(crearLogo, 70);

function exportarPDF() {
  const resultado = document.getElementById("resultado");
  if (!resultado.innerHTML.trim()) {
    Swal.fire({
      icon: "info",
      title: "Sin datos",
      text: "Calculá primero el consumo antes de exportar.",
    });

    return;
  }

  const fecha = new Date().toLocaleDateString("es-AR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const pdfContent = document.createElement("div");
  pdfContent.style.width = "210mm";
  pdfContent.style.padding = "20mm";
  pdfContent.style.background = "white";
  pdfContent.style.fontFamily = "Poppins, sans-serif";
  pdfContent.innerHTML = `
    <h2 style="color:#cc0000; margin-bottom: 10px;">Resumen de Consumo de Combustible</h2>
    <p style="font-size: 14px; color: #666; margin-bottom: 20px;">Fecha: ${fecha}</p>
    ${resultado.innerHTML}
    <div id="grafico-wrapper" style="margin-top: 20px; text-align:center;">
      <canvas id="graficoCostos" width="600" height="300"></canvas>
    </div>
  `;

  document.body.appendChild(pdfContent);

  const ctx = pdfContent.querySelector("#graficoCostos").getContext("2d");
  const valores = Array.from(resultado.querySelectorAll("p"))
    .filter((p) => p.textContent.includes("Costo por kilómetro"))
    .map((p) => {
      const texto = p.textContent;
      const match = texto.match(/\$\s?([\d.,]+)/);
      if (!match) return 0;
      return parseFloat(
        match[1]
          .replace(/\./g, "") // quitar puntos de miles
          .replace(",", ".") // convertir coma decimal a punto
      );
    });

  const chart = new Chart(ctx, {
    type: "bar",
    data: {
      labels: ["Nafta Súper", "Nafta Premium", "Diésel", "GNC"],
      datasets: [
        {
          label: "Costo por km ($)",
          data: valores,
          backgroundColor: ["#ffcc00", "#cc0000", "#666666", "#00aa88"],
        },
      ],
    },
    options: {
      responsive: false,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: { y: { beginAtZero: true } },
    },
  });

  setTimeout(() => {
    const canvas = pdfContent.querySelector("#graficoCostos");
    const imgData = canvas.toDataURL("image/png");
    const img = document.createElement("img");
    img.src = imgData;
    img.style.width = "100%";
    img.style.height = "auto";
    img.style.marginTop = "20px";
    const wrapper = pdfContent.querySelector("#grafico-wrapper");
    wrapper.innerHTML = "";
    wrapper.appendChild(img);

    html2pdf()
      .from(pdfContent)
      .set({
        filename: `consumo_${fecha.replace(/\s+/g, "_")}.pdf`,
        html2canvas: { scale: 2 },
        jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
      })
      .save()
      .then(() => {
        chart.destroy();
        pdfContent.remove();
      });
  }, 1000);
}
