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
        <p>Aguarde a resposta...</p>
    `;

    try { 
        const response = await fetch("http://127.0.0.1:8000/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(dados)
        });

        const respostaBackend = await response.json();

        let texto = respostaBackend.resultado;

        texto = texto
            .replace(/```json/g, "")
            .replace(/```/g, "")
            .trim();

        let dadosFinal = JSON.parse(texto);

        resultDiv.innerHTML = `
            <h2>Resumo</h2>
            <p>${dadosFinal.resumo}</p>

            <h2>Metodologia</h2>
            <p>${dadosFinal.metodologia}</p>

            <h2>Cronograma</h2>
            ${dadosFinal.cronograma.map(item => `
                <div style="margin-bottom:12px; padding:10px; border:1px solid #ddd; border-radius:6px;">
                    <h3>${item.dia}</h3>
                    <ul>
                        ${item.atividades.map(a => `<li>${a}</li>`).join("")}
                    </ul>
                </div>
            `).join("")}

            <h2>Materiais Recomendados</h2>
            <ul>
                ${dadosFinal.materiais_recomendados.map(m => `<li>${m}</li>`).join("")}
            </ul>

            <h2>Observações</h2>
            <p>${dadosFinal.observacoes}</p>
        `;

    } catch (erro) {
        console.error("Erro ao enviar:", erro);
        resultDiv.innerHTML = `
            <p style="color:red;">Erro ao enviar para o servidor.</p>
        `;
    }

});
