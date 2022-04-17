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

function consultarCriptomonedas(){
    const url = 'https://min-api.cryptocompare.com/data/top/mktcapfull?limit=15&tsym=USD';
    
    fetch(url)
        .then(response => response.json())
        .then(data =>  obtenerCriptomonedas(data.Data))
        .then(criptomonedas => selectCriptomonedas(criptomonedas))

}


function selectCriptomonedas(criptomonedas){
    criptomonedas.forEach(cripto => {
        const {Name, FullName} = cripto.CoinInfo;
        const option = document.createElement('option');
        option.value = Name;
        option.textContent = FullName;
        criptomonedasSelect.appendChild(option);
    });
}

function leerValor(e){
    objBusqueda[e.target.name] = e.target.value;
    console.log(objBusqueda)
}



function submitFormulario(e){
    e.preventDefault();

    const {moneda, criptomoneda} = objBusqueda;

    if(moneda === '' || criptomoneda === ''){
        MostarAlerta('Todos los campos son obligatorios')
        return;
    }

}


function MostarAlerta(mensaje){
    console.log(mensaje)
    const divAlerta = document.createElement('div');
    divAlerta.classList.add('error')
    divAlerta.textContent = mensaje;

    formulario.appendChild(divAlerta);
    setTimeout(() => {
        divAlerta.remove();
    }, 3000);
}