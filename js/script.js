document.addEventListener("DOMContentLoaded", () => {
    mostrarData();
    iniciarModoEscuro();
    iniciarCurtidas();
    iniciarCuriosidade();
    iniciarFormulario();
    destacarPaginaAtual();
});

function lerArmazenado(chave, padrao) {
    const texto = localStorage.getItem(chave);
    if (texto === null) {
        return padrao;
    }
    try {
        return JSON.parse(texto);
    } catch (erro) {
        return padrao;
    }
}

function mostrarData() {
    const data = document.getElementById("data");
    if (data) {
        data.textContent = new Date().toLocaleDateString("pt-BR", {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric"
        });
    }
}

function iniciarModoEscuro() {
    const btnModo = document.getElementById("btn-modo");

    function atualizarBotao() {
        if (!btnModo) return;
        const escuro = document.body.classList.contains("dark");
        btnModo.textContent = escuro ? "Modo claro" : "Modo escuro";
        btnModo.style.backgroundColor = escuro ? "#f8f9fa" : "#343a40";
        btnModo.style.color = escuro ? "#343a40" : "#f8f9fa";
    }

    if (localStorage.getItem("modo") === "dark") {
        document.body.classList.add("dark");
    }
    atualizarBotao();

    if (btnModo) {
        btnModo.addEventListener("click", () => {
            document.body.classList.toggle("dark");
            localStorage.setItem("modo", document.body.classList.contains("dark") ? "dark" : "light");
            atualizarBotao();
        });
    }
}

function iniciarCurtidas() {
    const botoes = document.querySelectorAll(".curtir");
    const salvas = lerArmazenado("curtidas", {});
    for (let i = 0; i < botoes.length; i++) {
        const chave = "noticia" + i;
        const contador = botoes[i].querySelector("span");
        let total = Number(salvas[chave]) || 0;
        contador.textContent = total;
        botoes[i].addEventListener("click", () => {
            total++;
            salvas[chave] = total;
            contador.textContent = total;
            localStorage.setItem("curtidas", JSON.stringify(salvas));
        });
    }
}

function iniciarCuriosidade() {
    const btnCuriosidade = document.getElementById("btn-curiosidade");
    const textoCuriosidade = document.getElementById("curiosidade");
    if (btnCuriosidade && textoCuriosidade) {
        const curiosidades = {
            tom: "Tom Holland foi escolhido para o papel depois de uma série de testes, e sua estreia como Homem-Aranha foi em Capitão América: Guerra Civil (2016).",
            filme: "Tobey Maguire e Andrew Garfield voltaram a interpretar seus Homens-Aranha neste filme, reunindo três gerações do herói."
        };
        const pagina = document.body.dataset.pagina;
        btnCuriosidade.addEventListener("click", () => {
            textoCuriosidade.textContent = curiosidades[pagina] || "Em breve, mais curiosidades!";
        });
    }
}

function iniciarFormulario() {
    const formulario = document.getElementById("formulario");
    if (!formulario) return;

    const lista = document.getElementById("lista-mensagens");
    const vazio = document.getElementById("vazio");
    const alerta = document.getElementById("alerta");
    const btnEnviar = document.getElementById("btn-enviar");
    const btnLimpar = document.getElementById("btn-limpar");

    function mostrarMensagens() {
        const mensagens = lerArmazenado("mensagens", []);
        lista.innerHTML = "";
        for (let i = mensagens.length - 1; i >= 0; i--) {
            const item = document.createElement("li");
            item.className = "list-group-item";
            const titulo = document.createElement("strong");
            titulo.textContent = mensagens[i].nome + " – " + mensagens[i].assunto;
            const texto = document.createElement("span");
            texto.textContent = mensagens[i].mensagem;
            const data = document.createElement("small");
            data.textContent = mensagens[i].data;
            item.append(titulo, texto, data);
            lista.appendChild(item);
        }
        if (mensagens.length === 0) {
            vazio.classList.remove("d-none");
        } else {
            vazio.classList.add("d-none");
        }
    }

    btnEnviar.addEventListener("click", () => {
        formulario.classList.add("tentou");
    });

    formulario.addEventListener("submit", (evento) => {
        evento.preventDefault();
        const campos = formulario.elements;
        const nome = campos["nome"].value.trim();
        const mensagens = lerArmazenado("mensagens", []);
        mensagens.push({
            nome: nome,
            email: campos["email"].value.trim(),
            telefone: campos["telefone"].value.trim(),
            assunto: campos["assunto"].value,
            mensagem: campos["mensagem"].value.trim(),
            data: new Date().toLocaleString("pt-BR")
        });
        localStorage.setItem("mensagens", JSON.stringify(mensagens));
        formulario.reset();
        formulario.classList.remove("tentou");
        alerta.textContent = "Mensagem enviada com sucesso, " + nome + "!";
        alerta.classList.remove("d-none");
        mostrarMensagens();
    });

    btnLimpar.addEventListener("click", () => {
        localStorage.removeItem("mensagens");
        alerta.classList.add("d-none");
        mostrarMensagens();
    });

    mostrarMensagens();
}

function destacarPaginaAtual() {
    const arquivo = decodeURIComponent(window.location.pathname.split("/").pop()) || "index.html";
    document.querySelectorAll(".menu-bs .nav-link").forEach((link) => {
        if (link.getAttribute("href") === arquivo) {
            link.classList.add("active");
            link.setAttribute("aria-current", "page");
        }
    });
}
