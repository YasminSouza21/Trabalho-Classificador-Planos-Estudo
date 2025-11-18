const selectSemestre = document.getElementById("semestre");
for (let i = 1; i <= 10; i++) {
    const opt = document.createElement("option");
    opt.value = i;
    opt.textContent = i;
    selectSemestre.appendChild(opt);
}

document.getElementById("formPlano").addEventListener("submit", async function (e) {
    e.preventDefault();

    const dados = {
        nome: document.getElementById("nome").value,
        idade: Number(document.getElementById("idade").value),
        semestre: Number(document.getElementById("semestre").value),
        tempo: document.getElementById("tempo").value,
        preferencia: document.getElementById("preferencia").value,
        nivel: document.getElementById("nivel").value
    };

    console.log("Enviando JSON:", dados);

    const resultDiv = document.getElementById("resultado");
    resultDiv.style.display = "block";
    resultDiv.innerHTML = `
        <h3>JSON enviado:</h3>
        <pre>${JSON.stringify(dados, null, 4)}</pre>
        <p>Aguardando resposta do servidor...</p>
    `;

    try {
        const response = await fetch("http://127.0.0.1:5000/api/prolog", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(dados)
        });

        const respostaBackend = await response.json();

        resultDiv.innerHTML += `
            <h3>Resposta do servidor:</h3>
            <pre>${JSON.stringify(respostaBackend, null, 4)}</pre>
        `;

    } catch (erro) {
        console.error("Erro ao enviar:", erro);
        resultDiv.innerHTML += `
            <p style="color:red;">Erro ao enviar para o servidor.</p>
        `;
    }
});
