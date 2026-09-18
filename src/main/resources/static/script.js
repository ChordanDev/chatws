let stompClient = null;

function connect() {
    const serverIp = document.getElementById("serverIp").value;
    const socket = new SockJS("http://" + serverIp + ":8080/chat");

    stompClient = Stomp.over(socket);

    //Conectar al tópico
    stompClient.connect(
        {},
        (frame) => {
            setConnected(true);
            console.log("Connected: " + frame);
            stompClient.subscribe("/topic/public", (message) => {
                try {
                    showMessage(JSON.parse(message.body));
                } catch (err) {
                    console.error("Error parsing message body: ", err);
                }
            });
        },
        (error) => {
            console.error("Error connecting: " + error);
            setConnected(false);
        },
    );

    //conexion y subcripcion
}

// biome-ignore lint/correctness/noUnusedVariables: used in HTML onclick
function disconnect() {
    // Desconectar
    if (stompClient !== null) {
        stompClient.disconnect();
    }
    setConnected(false);
    console.log("Disconnected");
}

function setConnected(connected) {
    const status = document.getElementById("status");
    if (connected) {
        status.className = "connected";
        status.textContent = "Conectado";
    } else {
        status.className = "disconnected";
        status.textContent = "Desconectado";
    }
    document.getElementById("message").disabled = !connected;
}

function sendMessage() {
    const username = document.getElementById("username").value;
    const content = document.getElementById("message").value;

    if (content.trim() === "") return;

    // Conexion
    stompClient.send(
        "/app/chat.sendMessage",
        {},
        JSON.stringify({
            tipo: "chat",
            usuario: username,
            contenido: content,
        }),
    );

    document.getElementById("message").value = "";
}

function showMessage(message) {
    const messages = document.getElementById("messages");
    const messageDiv = document.createElement("div");
    messageDiv.className = "message";

    const strong = document.createElement("strong");
    strong.textContent = message.usuario + ": ";
    messageDiv.appendChild(strong);

    const span = document.createElement("span");
    span.textContent = message.contenido;
    messageDiv.appendChild(span);

    messages.appendChild(messageDiv);
    messages.scrollTop = messages.scrollHeight;
}

// Allow sending message with Enter key
document.getElementById("message").addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
        sendMessage();
    }
});
