let jsonCreado = {};
let headerElements = {};
let elementsBody = {};
let numberBodyElements = 0;

function convertToJson() {
    // datos para la prueba
    headerElements = {
        "titulo": "hola mundo",
        "idioma": "es",
        "autor": "pepesexo666"
    };
    elementsBody = {
        "clave": "valor",
        "clave2": "valor2",
        "clave3": "valor3"
    };
    numberBodyElements = 5;

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
    const textarea = document.getElementById("textarea");
    textarea.value = convertToJson();
    console.log(jsonCreado);
}