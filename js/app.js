const criptomonedasSelect = document.querySelector('#criptomonedas');
const monedaSelect = document.querySelector('#moneda');


const resultado = document.querySelector('#resultado');
const formulario = document.querySelector('#formulario');


const objBusqueda = {
    moneda: '',
    criptomoneda: ''
}

const obtenerCriptomonedas = criptomonedas => new Promise(resolve => {
    resolve(criptomonedas)
});

window.onload = () => {
    consultarCriptomonedas();
    formulario.addEventListener('submit', submitFormulario);
    criptomonedasSelect.addEventListener('change', leerValor);
    monedaSelect.addEventListener('change', leerValor);


}

async function consultarCriptomonedas() {
    const url = 'https://min-api.cryptocompare.com/data/top/mktcapfull?limit=15&tsym=USD';

    try {
        const respuesta = await fetch(url);
        const data = await respuesta.json();
        const criptomonedas = await obtenerCriptomonedas(data.Data);
        selectCriptomonedas(criptomonedas);


    } catch (error) {
        console.log(error);
    }

}


function selectCriptomonedas(criptomonedas) {
    criptomonedas.forEach(cripto => {
        const { Name, FullName } = cripto.CoinInfo;
        const option = document.createElement('option');
        option.value = Name;
        option.textContent = FullName;
        criptomonedasSelect.appendChild(option);
    });
}

function leerValor(e) {
    objBusqueda[e.target.name] = e.target.value;
    console.log(objBusqueda)
}



function submitFormulario(e) {
    e.preventDefault();

    const { moneda, criptomoneda } = objBusqueda;

    if (moneda === '' || criptomoneda === '') {
        MostarAlerta('Todos los campos son obligatorios')
        return;
    }

    // Consultar API
    consultarAPI();

}


function MostarAlerta(mensaje) {
    const existeError = document.querySelector('.error');
    if (!existeError) {
        console.log(mensaje)
        const divAlerta = document.createElement('div');
        divAlerta.classList.add('error')
        divAlerta.textContent = mensaje;

        formulario.appendChild(divAlerta);
        setTimeout(() => {
            divAlerta.remove();
        }, 3000);
    }

}

async function consultarAPI() {
    const { moneda, criptomoneda } = objBusqueda;
    const url = `https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${criptomoneda}&tsyms=${moneda}`;

    try {
        mostrarSpinner();
        const response = await fetch(url);
        const data = await response.json();
        mostrarCotizacionHTML(data.DISPLAY[criptomoneda][moneda]);
    } catch (error) {
        console.log(error);
    }
}


function mostrarCotizacionHTML(cotizacion) {
    limpiarHTML();
    const { PRICE, HIGHDAY, LOWDAY, CHANGEPCT24HOUR, LASTUPDATE } = cotizacion;
    const precio = document.createElement('p');
    precio.classList.add('precio');
    precio.innerHTML = `El precio es: <span>${PRICE}</span>`

    const precioAlto = document.createElement('p');
    precioAlto.innerHTML = `<p>El precio más alto: <span>${HIGHDAY}</span></p>`;

    const precioBajo = document.createElement('p');
    precioBajo.innerHTML = `<p>El precio más bajo: <span>${LOWDAY}</span></p>`;

    const ultimasHoras = document.createElement('p');
    ultimasHoras.innerHTML = `<p>Variación últimas 24H: <span>${CHANGEPCT24HOUR}%</span></p>`;

    const ultimaActualizacion = document.createElement('p');
    ultimaActualizacion.innerHTML = `<p>Última actualización: <span>${LASTUPDATE}</span></p>`;

    resultado.appendChild(precio);
    resultado.appendChild(precioAlto);
    resultado.appendChild(precioBajo);
    resultado.appendChild(ultimasHoras);
    resultado.appendChild(ultimaActualizacion);
    console.log(cotizacion);
}


function limpiarHTML() {
    while (resultado.firstChild) {
        resultado.removeChild(resultado.firstChild);
    }
}

function mostrarSpinner() {
    limpiarHTML();
    const Spinner = document.createElement('div');
    Spinner.classList.add('spinner');
    Spinner.innerHTML = `
        <div class="bounce1"></div>
        <div class="bounce2"></div>
        <div class="bounce3"></div>
    `;

    resultado.appendChild(Spinner);

}