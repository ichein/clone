let jsonCreado = {};
let headerElements = {};
let elementsBody = {};
let numberBodyElements = 0;

function copyCleanJson(){
    const textarea = document.getElementById("cleanJson");
    textarea.select();
    document.execCommand("copy");
};

function downloadCleanJson(){
    const json = convertToJson();
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "newjson.json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}

function convertToJson() {
    
    receiveData();
    // generar array con "elementsBody" repetido
    let conexionArray = [];
    for (let i = 0; i < numberBodyElements; i++) {
        conexionArray.push({ ...elementsBody });
    }
    // estructura final
    jsonCreado = {
        ...headerElements,
        "conexion": conexionArray
    };
    return JSON.stringify(jsonCreado, null, 2);
}

function showJson() {
    convertToJson();
    //mostrar en textarea
    const textarea = document.getElementById("cleanJson");

    textarea.value = convertToJson();
    console.log(jsonCreado);
}

//recibir datos
function receiveData() {
    headerElements = {};
    elementsBody = {};
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
    headerFormatInput.insertBefore(newHeaderInput, headerFormatInput.firstChild);
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
    bodyFormatInput.insertBefore(newBodyInput, bodyFormatInput.firstChild);
    newBodyInput.innerHTML = `
        <input type="text" placeholder="clave" class="bodyInputClave">
        <input type="text" placeholder="valor" class="bodyInputValor" readonly>
    `;
    bodyFormatInput.appendChild(newBodyInput);
}

function removeHeaderInput() {
    const headerFormatInput = document.getElementById('headerFormatInput');
    const headerInputs = headerFormatInput.getElementsByClassName('headerInputFormatContainer');
    if (headerInputs.length > 1) {
        headerFormatInput.removeChild(headerInputs[headerInputs.length - 1]);
    }
}

function removeBodyInput() {
    const bodyFormatInput = document.getElementById('bodyFormatInput');
    const bodyInputs = bodyFormatInput.getElementsByClassName('bodyInputFormatContainer');
    if (bodyInputs.length > 2) {
        bodyFormatInput.removeChild(bodyInputs[bodyInputs.length - 1]);
    }
}