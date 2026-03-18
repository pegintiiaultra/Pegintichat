// --- WIDGET PEGINTI ---
// Affiche une bulle en bas à droite et ouvre le chat dans une fenêtre

(function () {
    const bubble = document.createElement("div");
    bubble.id = "peginti-bubble";
    bubble.style.position = "fixed";
    bubble.style.bottom = "20px";
    bubble.style.right = "20px";
    bubble.style.width = "70px";
    bubble.style.height = "70px";
    bubble.style.borderRadius = "50%";
    bubble.style.background = "url('bulle-peginti.jpeg') center/cover";
    bubble.style.cursor = "pointer";
    bubble.style.zIndex = "99999";
    bubble.style.boxShadow = "0 0 12px rgba(0,0,0,0.4)";
    document.body.appendChild(bubble);

    // Fenêtre du chat
    const chatWindow = document.createElement("div");
    chatWindow.id = "peginti-window";
    chatWindow.style.position = "fixed";
    chatWindow.style.bottom = "100px";
    chatWindow.style.right = "20px";
    chatWindow.style.width = "350px";
    chatWindow.style.height = "500px";
    chatWindow.style.background = "#0d0d0d";
    chatWindow.style.border = "2px solid gold";
    chatWindow.style.borderRadius = "12px";
    chatWindow.style.overflow = "hidden";
    chatWindow.style.display = "none";
    chatWindow.style.zIndex = "99999";
    chatWindow.style.boxShadow = "0 0 20px rgba(0,0,0,0.5)";
    document.body.appendChild(chatWindow);

    // Iframe du chat
    const iframe = document.createElement("iframe");
    iframe.src = "/peginti-chat";
    iframe.style.width = "100%";
    iframe.style.height = "100%";
    iframe.style.border = "none";
    chatWindow.appendChild(iframe);

    // Ouvrir / fermer
    bubble.onclick = () => {
        chatWindow.style.display =
            chatWindow.style.display === "none" ? "block" : "none";
    };
})();
