document.addEventListener('DOMContentLoaded', function() {
    const ufSelect = document.getElementById('uf-select');
    const municipiosTableBody = document.getElementById('municipios-table').getElementsByTagName('tbody')[0];

    // Função para buscar UFs da API do IBGE
    function fetchUfs() {
        const url = 'https://servicodados.ibge.gov.br/api/v1/localidades/estados';
        fetch(url)
            .then(response => response.json())
            .then(data => {
                data.forEach(uf => {
                    const option = document.createElement('option');
                    option.value = uf.sigla;
                    option.textContent = uf.nome;
                    ufSelect.appendChild(option);
                });
            })
            .catch(error => console.error('Erro ao buscar UFs:', error));
    }

    // Função para buscar municípios de uma UF da API do IBGE
    function fetchMunicipios(uf) {
        const url = `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${uf}/municipios`;
        fetch(url)
            .then(response => response.json())
            .then(data => {
                displayMunicipios(data);
            })
            .catch(error => console.error('Erro ao buscar municípios:', error));
    }

    // Função para exibir os municípios na tabela em três colunas
    function displayMunicipios(municipios) {
        municipiosTableBody.innerHTML = ''; 

        const numRows = Math.ceil(municipios.length / 3);
        for (let i = 0; i < numRows; i++) {
            const row = document.createElement('tr');

            for (let j = 0; j < 3; j++) {
                const cell = document.createElement('td');
                const municipioIndex = i + j * numRows;
                if (municipios[municipioIndex]) {
                    cell.textContent = municipios[municipioIndex].nome;
                }
                row.appendChild(cell);
            }

            municipiosTableBody.appendChild(row);
        }
    }

    // Evento de mudança na seleção de UF
    ufSelect.addEventListener('change', function() {
        const uf = ufSelect.value;
        if (uf) {
            fetchMunicipios(uf);
        } else {
            municipiosTableBody.innerHTML = ''; 
        }
    });

    // Inicializa a busca de UFs
    fetchUfs();
});