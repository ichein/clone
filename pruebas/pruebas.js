let headerElements = {};
let elementsBody = {};
let numberBodyElements = 0;

//recibir datos
function receiveData() {
    const headerClave = document.getElementsByClassName('headerInputClave');
    const headerValor = document.getElementsByClassName('headerInputValor');
    const bodyClave = document.getElementsByClassName('bodyInputClave');
    const bodyValor = document.getElementsByClassName('bodyInputValor');
    const numbersOfBodyElements = document.getElementById('numberOfBodyElementsInput');
    for (let i = 0; i < headerClave.length; i++) {
        headerElements[headerClave[i].value] = headerValor[i].value;
    }
    for (let i = 0; i < bodyClave.length; i++) {
        elementsBody[bodyClave[i].value] = bodyValor[i].value;
    }
    numberBodyElements = parseInt(numbersOfBodyElements.value) || 0;
}


//añadir campos del tipo class= "headerInputFormatContainer" y class= "bodyInputFormatContainer"
function addHeaderInput() {
    const headerFormatInput = document.getElementById('headerFormatInput');
    const newHeaderInput = document.createElement('div');
    newHeaderInput.classList.add('headerInputFormatContainer');
    newHeaderInput.innerHTML = `
        <input type="text" placeholder="clave" class="headerInputClave">
        <input type="text" placeholder="valor" class="headerInputValor">
    `;
    headerFormatInput.appendChild(newHeaderInput);
}

function addBodyInput() {
    const bodyFormatInput = document.getElementById('bodyFormatInput');
    const newBodyInput = document.createElement('div');
    newBodyInput.classList.add('bodyInputFormatContainer');
    newBodyInput.innerHTML = `
        <input type="text" placeholder="clave" class="bodyInputClave">
        <input type="text" placeholder="valor" class="bodyInputValor" readonly>
    `;
    bodyFormatInput.appendChild(newBodyInput);
}

//eliminar campos del tipo class= "headerInputFormatContainer" y class= "bodyInputFormatContainer"

function removeHeaderInput() {
    const headerFormatInput = document.getElementById('headerFormatInput');
    const headerInputs = headerFormatInput.getElementsByClassName('headerInputFormatContainer');
    if (headerInputs.length > 0) {
        headerFormatInput.removeChild(headerInputs[headerInputs.length - 1]);
    }
}

function removeBodyInput() {
    const bodyFormatInput = document.getElementById('bodyFormatInput');
    const bodyInputs = bodyFormatInput.getElementsByClassName('bodyInputFormatContainer');
    if (bodyInputs.length > 0) {
        bodyFormatInput.removeChild(bodyInputs[bodyInputs.length - 1]);
    }
}

function showElements() {
    receiveData()
    const headerFormatJsonTextArea = document.getElementById('headerFormatJsonTextArea');
    const bodyFormatJsonTextArea = document.getElementById('bodyFormatJsonTextArea');
    const numbersOfBodyElements = document.getElementById('numbersOfBodyElements');
    // Show the elements in the respective text areas
    headerFormatJsonTextArea.value = JSON.stringify(headerElements, null, 10);
    bodyFormatJsonTextArea.value = JSON.stringify(elementsBody, null, 100);
    numbersOfBodyElements.value = `Number of Body Elements: ${numberBodyElements}`;
}   