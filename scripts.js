const key = "f321b3a7cbfb465abea493af6e579367";

function colocarDadosNaTela(dados) {
    document.querySelector(".cidade").innerHTML = "Tempo em " + dados.name;
    document.querySelector(".temp").innerHTML = Math.floor(dados.main.temp) + " °C";
    document.querySelector(".texto-previsao").innerHTML = dados.weather[0].description;
    document.querySelector(".umidade").innerHTML = "Umidade: " + dados.main.humidity + "%";
    document.querySelector(".img-previsao").src = `https://openweathermap.org/img/wn/${dados.weather[0].icon}.png`;
}

async function buscarCidade(cidade) {
    const dados = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cidade}&appid=${key}&lang=pt_br&units=metric`)
        .then(resposta => resposta.json());

    colocarDadosNaTela(dados);
}

function cliqueiNoBotao() {
    const cidade = document.querySelector(".input-cidade").value;
    buscarCidade(cidade);
}

// AUTO SUGESTÃO
async function sugerirCidades() {
    const input = document.querySelector(".input-cidade").value;
    const sugestoesDiv = document.getElementById("sugestoes-cidades");

    if (input.length < 2) {
        sugestoesDiv.innerHTML = "";
        return;
    }

    // Usando GeoDB Cities API
    const url = `https://wft-geo-db.p.rapidapi.com/v1/geo/cities?namePrefix=${input}&limit=3&languageCode=pt`;

    const options = {
        method: 'GET',
        headers: {
            'X-RapidAPI-Key': 'd545ee351bmsh95fc2c7922b768fp103dc4jsn327028b66d95',
            'X-RapidAPI-Host': 'wft-geo-db.p.rapidapi.com'
        }
    };

    try {
        const response = await fetch(url, options);
        const result = await response.json();

        sugestoesDiv.innerHTML = "";

        result.data.forEach(cidade => {
            const item = document.createElement("div");
            item.textContent = `${cidade.city}, ${cidade.countryCode}`;
            item.onclick = () => {
                document.querySelector(".input-cidade").value = cidade.city;
                sugestoesDiv.innerHTML = "";
                buscarCidade(cidade.city);
            };
            sugestoesDiv.appendChild(item);
        });

    } catch (error) {
        console.error("Erro ao buscar sugestões:", error);
    }
}
