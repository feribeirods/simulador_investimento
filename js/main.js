var btnSelecionado1 = ""
var btnSelecionado2 = ""

// Conexão com a API

function fazGet(url) {
    let request = new XMLHttpRequest()
    request.open("GET", url, false)
    request.send()
    return request.responseText
}

// Busca os resultados da API via GET

function buscaInformacoes(tipo, parametro){
    var url = "http://localhost:3000/"
    data = JSON.parse(fazGet(url + tipo + parametro))
    
    return data
}

// Atribui os valores de IPCA e CDI aos inputs

function montaInputs() {
    buscaInformacoes("indicadores", "") 
    console.log(data)
    document.querySelector("#input-cdi").value = `${data[0].valor} %`
    document.querySelector("#input-ipca").value = `${data[1].valor} %`

}

// Função que insere máscara de moeda enquanto o usuário digita no campo

String.prototype.reverse = function(){
    return this.split('').reverse().join('');
}
  
function mascaraMoeda(campo, evento){

    var tecla = (!evento) ? window.event.keyCode : evento.which
    var valor  =  campo.value.replace(/[^\d]+/gi,'').reverse()
    var resultado  = ""
    var mascara = "##.###.###,##".reverse()

    for (var x=0, y=0; x<mascara.length && y<valor.length;) {
        if (mascara.charAt(x) != '#') {
        resultado += mascara.charAt(x)
        x++;
        } else {
        resultado += valor.charAt(y)
        y++;
        x++;
        }
    }

    campo.value = resultado.reverse()
}

// Atribui os valores selecionados aos botões de Rendimento e Indexação

function selecionaBtn1(id) {
    document.querySelector(`#bruto`).classList.remove("btn-selecionado")
    document.querySelector(`#liquido`).classList.remove("btn-selecionado")

    document.querySelector(`#${id}`).classList.add("btn-selecionado")

    btnSelecionado1 = id
}

function selecionaBtn2(id) {
    document.querySelector(`#pre`).classList.remove("btn-selecionado")
    document.querySelector(`#pos`).classList.remove("btn-selecionado")
    document.querySelector(`#ipca`).classList.remove("btn-selecionado")

    document.querySelector(`#${id}`).classList.add("btn-selecionado")

    btnSelecionado2 = id
}

// Traz os resultados requisitados via GET e monta o resto do HTML

function trazResultados() {
    console.log(btnSelecionado1, btnSelecionado2)

    aporteInicial = document.querySelector("#aporte-inicial").value
    aporteMensal = document.querySelector("#aporte-mensal").value
    prazoMeses = document.querySelector("#prazo-meses").value
    rentabilidade = document.querySelector("#rentabilidade").value

    arrayInputs = [aporteInicial, aporteMensal, prazoMeses, rentabilidade]
    arrayFalhas = []

    arrayInputs.forEach(function(input, index) {

        console.log(input)

        if(input == '') {
            document.querySelector(`#verifica-${index}`).style.display = "block"
            document.querySelector(`#label-${index}`).style.color = "red"
            arrayFalhas.push(index)
        } else {
            document.querySelector(`#verifica-${index}`).style.display = "none"
            document.querySelector(`#label-${index}`).style.color = "black"
        }
    })

    if(btnSelecionado1 == "" || btnSelecionado2 == "") {
        Swal.fire({
            icon: 'error',
            text: 'Por favor, selecione o Rendimento e o Tipo de Indexação!',
          })
    }

    console.log(arrayFalhas)
    console.log(arrayInputs)

    if(arrayFalhas.length > 0) {

    } else {
    
        var resultado = buscaInformacoes("simulacoes", `?tipoIndexacao=${btnSelecionado2}&tipoRendimento=${btnSelecionado1}`)

        console.log(resultado)

        var htmlResultados = `<div class="linha">
                                <div class="box-resultados">
                                    <h3>Valor Final Bruto</h3>
                                    <h3 class="sem-negrito">${resultado[0].valorFinalBruto.toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'})}</h3>
                                </div>
                                <div class="box-resultados">
                                    <h3>Aliquota do IR</h3>
                                    <h3 class="sem-negrito">${resultado[0].aliquotaIR} %</h3>
                                </div>
                                <div class="box-resultados">
                                    <h3>Valor pago em IR</h3>
                                    <h3 class="sem-negrito">${resultado[0].valorPagoIR.toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'})}</h3>
                                </div>
                            </div>

                            <div class="linha">
                                <div class="box-resultados">
                                    <h3>Valor Final Líquido</h3>
                                    <h3 class="texto-verde">${resultado[0].valorFinalLiquido.toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'})}</h3>
                                </div>
                                <div class="box-resultados">
                                    <h3>Valor Total Investido</h3>
                                    <h3 class="sem-negrito">${resultado[0].valorTotalInvestido.toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'})}</h3>
                                </div>
                                <div class="box-resultados">
                                    <h3>Ganho Líquido</h3>
                                    <h3 class="texto-verde">${resultado[0].ganhoLiquido.toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'})}</h3>
                                </div>
                            </div>

                            <div class="linha">
                                <div class="container-grafico"><canvas id="myChart"></canvas></div>
                            </div>`

        var containerResultados = document.querySelector(".container-resultados")
        
        containerResultados.innerHTML = htmlResultados
        
        containerResultados.style.display = "flex"

        if(window.innerWidth <= 700) {
            containerResultados.style.width = "90%"
        } else {
            containerResultados.style.width = "60%"
        }
        
        containerResultados.style.transition = "all 1s ease 0s"
      
        const data = {
        labels: [
        "0",
        '1',
        '2',
        '3',
        '4',
        '5',
        '6',
        '7',
        '8',
        '9',
        '10'
        ],
        datasets: [{
            type: 'bar',
            label: 'Sem Aporte',
            data: resultado[0].graficoValores.semAporte,
            borderColor: 'rgb(255, 99, 132)',
            backgroundColor: '#ED8E53'
        }, {
            type: 'bar',
            label: 'Com Aporte',
            data: resultado[0].graficoValores.comAporte,
            fill: false,
            backgroundColor: 'green'
            }]
        };

        const config = {
            type: 'scatter',
            data: data,
            options: {
                maintainAspectRatio: false,
            scales: {
            y: {
            beginAtZero: false,
            min: 500,
            max: 2500,
            ticks: {
                // forces step size to be 50 units
                stepSize: 500
              }
            }
            }
        }
        };
        const myChart = new Chart(
        document.getElementById('myChart'),
        config
        );

    }    

}

// Limpa os campos

function limparCampos() {
    document.querySelector("#aporte-inicial").value = ""
    document.querySelector("#aporte-mensal").value = ""
    document.querySelector("#prazo-meses").value = ""
    document.querySelector("#rentabilidade").value = ""
}

console.log(window.innerWidth)

document.onload = montaInputs()