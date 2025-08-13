// Muestra el JSON creado en el textarea
function showJsonOutput() {
    const jsonOutput = document.getElementById("jsonOutput");
    jsonOutput.value = JSON.stringify(jsonCreado, null, 4);
}
//documento encargado de la logica del convertidor a JSON
let  typemessage = "none";
const messageText = document.getElementById("messageText");
let tables = {}; //en donde se guarda la tabla para convertir a JSON
let archive = null; //variable para guardar el archivo subido
let jsonElements = []; //varible para guardar elementos del JSON
let jsonCreado = {}; //variable para guardar el JSON creado
let fileClaves = false; //variable para saber si las claves del archivo coinciden con las del creador de formato Json
let tableClaves = false; //vaiable para saber si las claves de la tabla coinciden con las del crador de formato Json



window.addEventListener('DOMContentLoaded', () => {
    guardarYActualizarTabla();
    closeMessage();
    closeConfirmation();
});
// funciones para los botones de control en el footer
//Funciones para la creacion del Json y los botones de la seccion final

function convert(){
    guardarYActualizarTabla();
    closeMessage();
    closeConfirmation();
    // Obtener encabezado
    const headerFields = document.getElementById("headerFields").getElementsByClassName("headerField");
    let encabezado = {};
    for (let i = 0; i < headerFields.length; i++) {
        const inputs = headerFields[i].getElementsByTagName("input");
        if (inputs.length >= 2) {
            const key = inputs[0].value.trim();
            const value = inputs[1].value.trim();
            if (key) encabezado[key] = value;
        }
    }

    // Obtener cuerpo
    let cuerpo = [];
    // Si hay archivo y es válido, usar los datos del archivo para el cuerpo
    if (archive != null && FileValidation() === true) {
        // El archivo debe ser un array de arrays, la primera fila son las claves
        let claves = archive[0];
        for (let i = 1; i < archive.length; i++) {
            let fila = archive[i];
            let obj = {};
            for (let j = 0; j < claves.length; j++) {
                obj[claves[j]] = fila[j];
            }
            cuerpo.push(obj);
        }
    } else if (archive == null && tableValidation() === true) {
        // Usar los datos de la tabla para el cuerpo
        if (tables && tables.rows) {
            cuerpo = tables.rows;
        }
    } else {
        typemessage = "error";
        messageError();
        messageText.innerHTML = "No se puede convertir a JSON. Verifica las claves y los datos.";
        return;
    }

    // Construir el JSON final
    let jsonFinal = { ...encabezado, conector: cuerpo };
    jsonCreado = jsonFinal;
    // Mostrar en el textarea
    const jsonOutput = document.getElementById("jsonOutput");
    jsonOutput.value = JSON.stringify(jsonFinal, null, 4);
}

function confirmation(){
    confirmationText.innerHTML = "la estructura del Json toma como claves los valores de la primera fila de la tabla o los archivos subidos, asegurese de que estos valores coincidan con las claves definidas en la estructura de Json, si no es asi se generara un error. etiende esto?"
    showConfirmation();
}

function FileValidation(){ 
    //valida que la primera fila del archivo subido coincida exactamente con las claves del crador de formato Json
    //la clase "clave" es la que tiene que coincidir con la primera fila del archivo
    //si el archivo esta vacio lansar un error asi= "fileClaves = "error"", de otro modo solo regresar "fileClaves = true" o "fileClaves = false" respectivamente
    // Solo tomar claves del selector de formato (estructura), no del encabezado global
    const jsonStructure = document.getElementById("jsonStructure");
    const claveInputs = jsonStructure.querySelectorAll(".jsonField .clave");
        let clavesJson = [];
        for (let i = 0; i < claveInputs.length; i++) {
            clavesJson.push(claveInputs[i].value.trim());
        }
        // Validar archivo
        if (!archive || !Array.isArray(archive) || archive.length === 0) {
            fileClaves = "error";
            typemessage = "error";
            messageError();
            messageText.innerHTML = "El archivo está vacío o no es válido.";
            return fileClaves;
        }
        // Tomar la primera fila del archivo como claves
        let clavesArchivo = archive[0];
        if (!Array.isArray(clavesArchivo)) {
            fileClaves = "error";
            typemessage = "error";
            messageError();
            messageText.innerHTML = "El formato del archivo no es válido.";
            return fileClaves;
        }
    // Comparar claves (solo que existan, sin importar el orden ni el contenido)
    let iguales = clavesJson.length === clavesArchivo.length && clavesJson.every(v => clavesArchivo.includes(v));
    fileClaves = iguales;
    return fileClaves;
}

function tableValidation(){
    // Solo tomar claves del selector de formato (estructura), no del encabezado global
    const jsonStructure = document.getElementById("jsonStructure");
    const claveInputs = jsonStructure.querySelectorAll(".jsonField .clave");
    let clavesJson = [];
    for (let i = 0; i < claveInputs.length; i++) {
        clavesJson.push(claveInputs[i].value.trim());
    }
    // Validar tabla
    if (!tables || !tables.headers || tables.headers.length === 0) {
        tableClaves = "error";
        typemessage = "error";
        messageError();
        messageText.innerHTML = "La tabla está vacía o no es válida.";
        return tableClaves;
    }
    // Tomar los encabezados de la tabla como claves
    let clavesTabla = tables.headers;
    if (!Array.isArray(clavesTabla)) {
        tableClaves = "error";
        typemessage = "error";
        messageError();
        messageText.innerHTML = "El formato de la tabla no es válido.";
        return tableClaves;
    }
    // Comparar claves (solo que existan, sin importar el orden ni el contenido)
    let iguales = clavesJson.length === clavesTabla.length && clavesJson.every(v => clavesTabla.includes(v));
    tableClaves = iguales;
    return tableClaves;
}

//funciones para el manejo del encabezado global y la estructura del JSON

function addFieldToHeader(){
    const headerFields = document.getElementById("headerFields");
    const fieldDiv = document.createElement("div");
    fieldDiv.className = "headerField";
    const inputKey = document.createElement("input");
    inputKey.type = "text";
    inputKey.placeholder = "clave";
    inputKey.value = "";
    const inputValue = document.createElement("input");
    inputValue.type = "text";
    inputValue.placeholder = "valor";
    inputValue.value = "";
    const removeBtn = document.createElement("button");
    removeBtn.className = "removeField";
    removeBtn.innerText = "eliminar";
    removeBtn.onclick = function() {
        // Elimina el campo específico, pero solo si hay más de uno
        const headerFields = document.getElementById("headerFields");
        const fields = headerFields.getElementsByClassName("headerField");
        if (fields.length > 1) {
            headerFields.removeChild(fieldDiv);
        } else {
            typemessage = "error";
            messageError();
            messageText.innerHTML = "no se puede eliminar el campo, debe haber al menos un campo";
        }
    };
    fieldDiv.appendChild(inputKey);
    fieldDiv.appendChild(inputValue);
    fieldDiv.appendChild(removeBtn);
    const addBtn = document.getElementById("addHeaderField");
    headerFields.insertBefore(fieldDiv, addBtn);
}

function addFieldToStructure(){
    const StructureFields = document.getElementById("jsonStructure");
    const fieldDiv = document.createElement("div");
    fieldDiv.className = "jsonField";
    const inputKey = document.createElement("input");
    inputKey.type = "text";
    inputKey.placeholder = "clave";
    inputKey.className = "clave";
    inputKey.value = "";
    const inputValue = document.createElement("input");
    inputValue.type = "text";
    inputValue.placeholder = "valor";
    inputValue.value = "";
    inputValue.readOnly = true;
    const removeBtn = document.createElement("button");
    removeBtn.className = "removeStructureField";
    removeBtn.innerText = "eliminar";
    removeBtn.onclick = function() {
        removeFieldToStructure(fieldDiv);
    };
    fieldDiv.appendChild(inputKey);
    fieldDiv.appendChild(inputValue);
    fieldDiv.appendChild(removeBtn);
    const addBtn = document.getElementById("addJsonField");
    StructureFields.insertBefore(fieldDiv, addBtn);
}

function removeFieldToStructure(){
    const structureFields = document.getElementById("jsonStructure");
    const fields = structureFields.getElementsByClassName("jsonField");
    if (fields.length > 1){
        structureFields.removeChild(fields[fields.length-1]);
    } else{
        typemessage = "error";
        messageError();
        messageText.innerHTML = "no se puede eliminar el campo, debe haber al menos un campo";
        return;
    }
}

function removeFieldToHeader(){
    const headerFields = document.getElementById("headerFields");
    const fields = headerFields.getElementsByClassName("headerField");
    if (fields.length > 1){
        headerFields.removeChild(fields[fields.length-1]);
    } else{
        typemessage = "error";
        messageError();
        messageText.innerHTML = "no se puede eliminar el campo, debe haber al menos un campo";
        return;
    }
}


//funciones para la subida de archivos

function  upLoadFile(event){
    archive = event.target.files[0];
    if (!archive){
        typemessage = "error";
        messageError();
        messageText.innerHTML ="no se ha seleccionado ningun archivo";
        return;
    };
    const fileType = archive.type;
    if (fileType.includes("sheet") || fileType.includes("excel")|| archive.name.endsWith(".xlsx")|| archive.name.endsWith(".xls")){
        readExcelOrCSV(archive);
    } else if (fileType.includes("csv")|| archive.name.endsWith(".csv")){
        readCSV(archive);
    }else if (fileType.includes("xml")||archive.name.endsWith(".xml")){
        readXML(archive);
    }else{
        typemessage = "error";
        messageError();
        messageText.innerHTML ="formato de archivo no soportado, por favor suba un archivo de excel, csv o xml";
        return;
    }
    return archive;
}

function readExcelOrCSV(file) {
    let reader = new FileReader();
    reader.onload = function(e) {
        let data = new Uint8Array(e.target.result);
        let workbook = XLSX.read(data, { type: 'array' });
        // Tomar solo la primera hoja
        let sheetName = workbook.SheetNames[0];
        let sheet = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], { header: 1 });
        archive = sheet;
        console.log("Datos de la hoja guardados en archive:", archive);
    };
    reader.readAsArrayBuffer(file);
}

function readCSV(file) {
    Papa.parse(file, {
        complete: function(results) {
            archive = results.data;
            console.log("CSV parseado guardado en archive:", archive);
        }
    });
}

function readXML(file) {
    let reader = new FileReader();
    reader.onload = function(e) {
        let x2js = new X2JS();
        let jsonObj = x2js.xml_str2json(e.target.result);
        archive = jsonObj;
        console.log("XML como JSON guardado en archive:", archive);
    };
    reader.readAsText(file);
}


//funciones de los botones de la tabla

function guardarYActualizarTabla(){ //guardar y actualizar la tabla en la variable "tables"
    const datatable = document.getElementById("dataTable");
    const thead = datatable.tHead;
    const tbody = datatable.tBodies[0];
    if (!thead || !tbody) return;
    const headers = [];
    const headerRow = thead.rows[0];
    for (let i = 0; i < headerRow.cells.length; i++) {
        headers.push(headerRow.cells[i].innerText.trim());
    }
    const rowsData = [];
    for (let i = 0; i < tbody.rows.length; i++) {
        const row = tbody.rows[i];
        const obj = {};
        for (let j = 0; j < headers.length; j++) {
            obj[headers[j]] = row.cells[j] ? row.cells[j].innerText.trim() : "";
        }
        rowsData.push(obj);
    }
    tables = {
        headers: headers,
        rows: rowsData,
        numColumns: headers.length,
        numRows: tbody.rows.length
    };
};

function clearTable(){
    const datatable = document.getElementById("dataTable");
    const tbody = datatable.tBodies[0];
    while (tbody.rows.length > 0){
        tbody.deleteRow(0);
    }
    const thead = datatable.tHead;
    if (thead) {
        const headerRow = thead.rows[0];
        while (headerRow.cells.length > 1){
            headerRow.deleteCell(1);
        }
    }
    guardarYActualizarTabla();
};

function addRow(){
    const table = document.getElementById("dataTable");
    const Row = table.insertRow(-1);
    const cell1 = Row.insertCell(0);
    const cell2 = Row.insertCell(1);
    const cell3 = Row.insertCell(1);
    cell1.contentEditable = "true";
    cell2.contentEditable = "true";
    cell3.contentEditable = "true";
    cell1.innerHTML = "Nueva valor";
    cell2.innerHTML = "nuevo valor";
    cell3.innerHTML = "nuevo valor";
    if (table.rows.length >= 500){
        typemessage = "warning";
        messageWarning();
        messageText.innerHTML = "se ha alcanzado el limite de filas, no se pueden añadir mas filas";
        return
    };
    guardarYActualizarTabla();
};

function addColumn(){
    const table = document.getElementById("dataTable");
    const thead = table.tHead;
    const tbody = table.tBodies[0];
    if (!thead || !tbody) return;
    const headerRow = thead.rows[0];
    if (headerRow.cells.length >= 500) {
        typemessage = "warning";
        messageWarning();
        messageText.innerHTML = "se ha alcanzado el limite de columnas, no se pueden añadir mas columnas";
        return;
    }
    
    const th = document.createElement("th");
    th.contentEditable = "true";
    th.innerHTML = "nueva columna";
    headerRow.appendChild(th);
    for (let i = 0; i < tbody.rows.length; i++) {
        const cell = tbody.rows[i].insertCell(-1);
        cell.contentEditable = "true";
        cell.innerHTML = "nueva columna";
    }
    guardarYActualizarTabla();
}

function removeColumn(){
    const table = document.getElementById("dataTable");
    const thead = table.tHead;
    const tbody = table.tBodies[0];
    if (!thead || !tbody) return;
    const headerRow = thead.rows[0];
    const rowCount = headerRow.cells.length;
    if (rowCount <= 1 ){
        typemessage = "error";
        messageError();
        messageText.innerHTML = "No se puede eliminar la columna, debe haber al menos una columna.";
        return;
    }
    headerRow.deleteCell(rowCount-1);
    for (let i = 0; i < tbody.rows.length; i++) {
        if (tbody.rows[i].cells.length > 1) {
            tbody.rows[i].deleteCell(rowCount - 1);
        }
    }
    guardarYActualizarTabla();
}

function removeRow(){
    const table = document.getElementById("dataTable");
    const rowCount = table.rows.length;
    // Solo elimina si hay más de una fila en tbody
    const tbody = table.tBodies[0];
    if (tbody.rows.length <= 1) {
        typemessage = "error";
        messageError();
        messageText.innerHTML = "No se puede eliminar la fila, debe haber al menos una fila.";
        return;
    }
    table.deleteRow(rowCount-1);
    guardarYActualizarTabla();
}

//manejo de mensajes

if (typemessage === "none") {
    messageclose();
} else if (typemessage === "error") {
    messageError();
} else if (typemessage === "warning") {
    messageWarning();
} else if (typemessage === "confirmation") {
    showConfirmation();
}


// FUNCIONES DE MENSAJES

function messageclose(){
    document.getElementById("messagepopap").style.display = "none"
}

function messageError(){  //cambia el css del id="messagepopap" a un rojo
    const error = document.getElementById("messagepopap");
    const errorText = document.getElementById("messageText");
    const errorButon = document.getElementById("closeMessage");
    error.style.display = "block";
    error.style.backgroundColor = "#f44336";
    errorText.style.color = "#c2e2ecff";
    error.style.padding = "10px";
    error.style.borderRadius = "8px";
    error.style.boxShadow = "0 2px 8px rgba(0,0,0,0.05)";
    errorButon.style.backgroundColor = "#c2e2ecff";
    errorButon.style.color = "#f44336";
    errorButon.style.border = "#85251eff 1px solid";
}
function messageWarning(){ //cambia el css del id="messagepopap" a un naranja 
    const warning = document.getElementById("messagepopap");
    const warningText = document.getElementById("messageText");
    const warningButon = document.getElementById("closeMessage");
    warning.style.display = "block";
    warning.style.backgroundColor = "#f79d27ff";
    warningText.style.color = "#1c1535ff";
    warning.style.padding = "10px";
    warning.style.borderRadius = "8px";
    warning.style.boxShadow = "0 2px 8px rgba(0,0,0,0.05)";
    warningButon.style.backgroundColor = "#f0bd30ff";
    warningButon.style.color = "#25221fff";
    warningButon.style.border = "#85251eff 1px solid";
    }

function closeMessage(){
    document.getElementById("messagepopap").style.display = "none";
    typemessage = "none";
    messageText.innerHTML = "";
}

function showConfirmation(){
    document.getElementById("messageConfirmacion").style.display="flex"

}

function closeConfirmation(){
    document.getElementById("messageConfirmacion").style.display="none"
}