let jsonCreado = {};
let headerElements = {};
let elementsBody = {};
let numberBodyElements = 0;
let fileToFillOutTheJson = null; // Archivo para llenar el JSON
let fileKeys = []; // Claves del archivo
let keysJson = []; // Claves del JSON
let compatibleKeys = false
let numberOfRowsInFile = 0;
let differenceElementsAndRows = 0;



//!inicio del llenador de json

function showFinalJson(numberBodyElements, numberOfRowsInFile, elementsBody, fileToFillOutTheJson){
    if (fileToFillOutTheJson != null) {
        fillJson(numberBodyElements, numberOfRowsInFile, elementsBody, fileToFillOutTheJson);
        const finalJson = document.getElementById("fullJson");
        finalJson.value = JSON.stringify(elementsBody, null, 2);
        finalJson.scrollIntoView({ behavior: 'smooth' });
        fillButton.addEventListener('click', function() {
            showFinalJson(numberBodyElements, numberOfRowsInFile, elementsBody, fileToFillOutTheJson);
        });
        const fillButton = document.getElementById('fillFullJson');
        
        fillButton.style.display = 'block';
    }else{
        console.error('No se ha seleccionado ningún archivo para llenar el JSON');
    }
}

function showExtra(){
    fileInput();
    finalButton();

}

function fillJson(numberBodyElements, numberOfRowsInFile, elementsBody, fileToFillOutTheJson){
    keysFillJson(elementsBody);
    keysFileReader(fileToFillOutTheJson);
    CompareKeys(fileKeys, keysJson);
    countNumberOfRows(fileToFillOutTheJson)
    if (fileKeys.length === 0) {
        console.error('No se encontraron claves en el archivo');
    }else if (compatibleKeys === true) {
        // Lógica para llenar el JSON
        differenceElementsAndRows = differenceRowElement(numberBodyElements, numberOfRowsInFile)
        if (differenceElementsAndRows === 0) {
            // sin diferencias, llenar los campos del json(elementsBody) creado con los datos del archivo
            //asegurar que las claves del archivo (fileToFillOutTheJson) coincidan con el elementsBody y llenar segun eso
            for (let i = 0; i < fileKeys.length; i++) {
                if (keysJson.includes(fileKeys[i])) {
                    elementsBody[fileKeys[i]] = fileToFillOutTheJson[fileKeys[i]];
                }
            }
        }else if (differenceElementsAndRows > 0) {
            // diferencia a favor de elementos
            for (let i = 0; i < fileKeys.length; i++) {
                if (keysJson.includes(fileKeys[i])) {
                    elementsBody[fileKeys[i]] = fileToFillOutTheJson[fileKeys[i]];
                }
            }
        }else if (differenceElementsAndRows < 0) {
            // diferencia a favor de filas
            console.log('Demasiados datos para llenar el JSON');
        }
    }else{
        console.error('Las claves del archivo y del JSON no son compatibles');
    }
}

function finalButton(){
    const finalButton = document.getElementById('showFinalResult');
    finalButton.style.display = 'block';
    finalButton.addEventListener('click', function() {
        showFinalJson(numberBodyElements, numberOfRowsInFile, elementsBody, fileToFillOutTheJson);
    });
}



function fileInput(){
    const fileInput = document.getElementById('fileInputForFullJson');
    fileInput.style.display = 'block';
    fileInput.addEventListener('change', handleFileSelect);
    fileInput = fileToFillOutTheJson;
}

function differenceRowElement(numberBodyElements, numberOfRowsInFile){
    return numberBodyElements - numberOfRowsInFile;
}

function countNumberOfRows(fileToFillOutTheJson){
    // Lógica para contar el número de filas en el archivo sin contar la primera fila pues esta destinada a las claves
    const fileType = fileToFillOutTheJson.name.split('.').pop().toLowerCase();
    if (fileType === 'xlsx' || fileType === 'xls') {
        readExcelOrCSV(fileToFillOutTheJson, function(data) {
            if (data && data.length > 1) {
                numberOfRowsInFile = data.length - 1; // Restar 1 para no contar la fila de claves
            }
        });
    }else if (fileType === 'csv') {
        readCSV(fileToFillOutTheJson, function(data) {
            if (data && data.length > 1) {
                numberOfRowsInFile = data.length - 1; // Restar 1 para no contar la fila de claves
            }
        });
    } else if (fileType === 'xml') {
        readXML(fileToFillOutTheJson, function(data) {
            if (data && data.length > 0) {
                numberOfRowsInFile = data.length - 1; // Asumir que todas las filas son datos
            }
        });
    } else {
        console.error('Formato de archivo no compatible');
    }
    return numberOfRowsInFile;
}

function CompareKeys(fileKeys, keysJson) {
    // Lógica para comparar las claves del archivo con las del JSON
    let diferencias = 0;
    for (let i = 0; i < fileKeys.length; i++) {
        if (!keysJson.includes(fileKeys[i])) {
            diferencias.push(fileKeys[i]);
        }
    }
    if (diferencias > 0) {
        return diferencias, compatibleKeys = false;
    }else{
        compatibleKeys = true;
    }
}

function keysFileReader(fileToRead) {
    // Lógica para leer las claves del archivo (la primera fila de la hoja de cálculo debe contener las claves)
    const fileType = fileToRead.name.split('.').pop().toLowerCase();
    if (fileType === 'xlsx' || fileType === 'xls') {
        readExcelOrCSV(fileToRead, function(data) {
            if (data && data.length > 0) {
                fileKeys = data[0]; 
            }
        });
    }else if (fileType === 'csv') {
        readCSV(fileToRead, function(data) {
            if (data && data.length > 0) {
                fileKeys = data[0]; 
            }
        });
    } else if (fileType === 'xml') {
        readXML(fileToRead, function(data) {
            if (data && data.length > 0) {
                fileKeys = Object.keys(data); 
            }
        });
    } else {
        console.error('Formato de archivo no compatible');
    }
    return fileKeys;
}

function keysFillJson(elementsBody){
    //logica para leer las claves del JSON
    keysJson = Object.keys(elementsBody);
    return keysJson;
}



//lectores de archivos: (aun no se si los voy a ocupar)
function readExcelOrCSV(file, callback) {
    let reader = new FileReader();
    reader.onload = function(e) {
        let data = new Uint8Array(e.target.result);
        let workbook = XLSX.read(data, { type: 'array' });
        workbook.SheetNames.forEach(sheetName => {
            let sheet = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], { header: 1 });
            callback(sheet);
        });
    };
    reader.readAsArrayBuffer(file);
}
function readCSV(file, callback) {
    Papa.parse(file, {
        complete: function(results) {
            callback(results.data);
        }
    });
}
function readXML(file, callback) {
    let reader = new FileReader();
    reader.onload = function(e) {
        let x2js = new X2JS();
        let jsonObj = x2js.xml_str2json(e.target.result);
        callback(jsonObj);
    };
    reader.readAsText(file);
}



//!fin del llenador de json



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