//logica para el buscador



//manejo de mensajes

function closeMessage() {
    const messageContainer = document.getElementById("messages");
    messageContainer.style.display = "none";
};

function showMessage(message, typemessage) {
    const messageContainer = document.getElementById("messages");
    const messageText = messageContainer.querySelector("p");
    const acceptButton = document.getElementById("acceptMessage");
    const cancelButton = document.getElementById("cancelMessage");
    messageText.textContent = message;
    if (typemessage === "error") {
        messageContainer.style.backgroundColor = "#e74c3c";
        acceptButton.style.display = "none";
        cancelButton.style.display = "inline-block";
        messageText.style.color = '#e6e7f7ff';
    } else if (typemessage === "warning") {
        messageContainer.style.backgroundColor = "#e99000ff";
        acceptButton.style.display = "inline-block";
        cancelButton.style.display = "none";
        messageText.style.color = '#161618ff';
    } else if (typemessage === "info") {
        messageContainer.style.backgroundColor = "#3498db";
        acceptButton.style.display = "inline-block";
        cancelButton.style.display = "none";
        messageText.style.color = '#151516ff';
    } else if (typemessage === "confirm"){
        messageContainer.style.backgroundColor = "#cba9cfff";
        acceptButton.style.display = "inline-block";
        cancelButton.style.display = "inline-block";
        messageText.style.color = '#151516ff';
    }else{
        messageContainer.style.backgroundColor = "#e65715ff";
        acceptButton.style.display = "inline-block";
        cancelButton.style.display = "none";
        messageText.style.color = '#151516ff';
        messageText.textContent = "llamada desconocida"
    }
    messageContainer.style.display = "block";
};