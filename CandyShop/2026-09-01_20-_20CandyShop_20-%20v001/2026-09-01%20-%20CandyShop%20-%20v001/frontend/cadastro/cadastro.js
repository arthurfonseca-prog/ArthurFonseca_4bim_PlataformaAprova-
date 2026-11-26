
const formulario = document.getElementById('formCadastro');
const paineis = document.querySelectorAll('[data-painel]');
const indicadores = document.querySelectorAll('[data-indicador]');
const botaoVoltar = document.getElementById('voltar');
const botaoAvancar = document.getElementById('avancar');
const mensagem = document.getElementById('mensagem');

let etapaAtual = 1;

// Informações dos planos
const planos = {
    trimestral: {
        nome: 'Trimestral',
        parcelas: '3x de R$ 80,00',
        total: 'R$ 240,00'
    },

    semestral: {
        nome: 'Semestral',
        parcelas: '6x de R$ 100,00',
        total: 'R$ 600,00'
    },

    anual: {
        nome: 'Anual',
        parcelas: '12x de R$ 120,00',
        total: 'R$ 1.440,00'
    }
};

// Plano atualmente selecionado
let planoSelecionado = null;

// Verifica se veio algum plano pela URL
const parametroPlano = new URLSearchParams(window.location.search).get('plano');

if (parametroPlano && planos[parametroPlano]) {
    const opcao = document.querySelector(
        `input[name="plano"][value="${parametroPlano}"]`
    );

    if (opcao) {
        opcao.checked = true;
        planoSelecionado = parametroPlano;
    }
}

// Atualiza as informações da sacolinha
function atualizarSacola() {
    const sacolaPlano = document.getElementById('sacolaPlano');
    const sacolaPreco = document.getElementById('sacolaPreco');
    const sacolaTotal = document.getElementById('sacolaTotal');
    const sacolaStatus = document.getElementById('sacolaStatus');

    if (!planoSelecionado || !planos[planoSelecionado]) {
        sacolaPlano.textContent = 'Escolha um plano acima';
        sacolaPreco.textContent = 'R$ 0,00';
        sacolaTotal.textContent = 'R$ 0,00';
        sacolaStatus.textContent = 'Nenhum plano escolhido';
        return;
    }

    const plano = planos[planoSelecionado];

    sacolaPlano.textContent = `${plano.nome} · ${plano.parcelas}`;
    sacolaPreco.textContent = plano.total;
    sacolaTotal.textContent = plano.total;
    sacolaStatus.textContent = 'Plano selecionado';
}

// Detecta quando o aluno escolhe um plano
document.querySelectorAll('input[name="plano"]').forEach((opcao) => {
    opcao.addEventListener('change', () => {
        planoSelecionado = opcao.value;

        atualizarSacola();
        mensagem.textContent = '';
    });
});

// Controla as etapas do cadastro
function mostrarEtapa(numero) {
    etapaAtual = numero;

    paineis.forEach((painel) => {
        painel.hidden = Number(painel.dataset.painel) !== numero;
    });

    indicadores.forEach((indicador) => {
        const numeroIndicador = Number(indicador.dataset.indicador);

        indicador.classList.toggle('ativa', numeroIndicador === numero);
        indicador.classList.toggle('concluida', numeroIndicador < numero);
    });

    botaoVoltar.hidden = numero === 1;

    botaoAvancar.textContent =
        numero === 3 ? 'Concluir cadastro' : 'Continuar';

    mensagem.textContent = '';
}

// Valida os campos da etapa atual
function validarEtapaAtual() {
    const painelAtual = document.querySelector(
        `[data-painel="${etapaAtual}"]`
    );

    const campos = painelAtual.querySelectorAll('input');

    // Verifica se o aluno escolheu um plano
    if (etapaAtual === 2 && !planoSelecionado) {
        mensagem.textContent = 'Escolha um plano para continuar com a compra.';
        return false;
    }

    for (const campo of campos) {
        if (campo.type === 'radio') {
            const grupo = formulario.querySelectorAll(
                `input[name="${campo.name}"]`
            );

            const algumSelecionado = Array.from(grupo).some(
                (item) => item.checked
            );

            if (campo.required && !algumSelecionado) {
                mensagem.textContent =
                    campo.name === 'plano'
                        ? 'Escolha um plano para continuar.'
                        : 'Selecione uma forma de pagamento para continuar.';

                return false;
            }

            continue;
        }

        if (!campo.checkValidity()) {
            campo.reportValidity();
            return false;
        }
    }

    // Confere se as senhas são iguais
    if (etapaAtual === 1) {
        const senha = document.getElementById('senha').value;
        const confirmarSenha = document.getElementById('confirmarSenha').value;

        if (senha !== confirmarSenha) {
            mensagem.textContent =
                'As senhas não coincidem. Confira os dois campos.';

            return false;
        }
    }

    return true;
}

// Preenche a tela de confirmação
function preencherResumo() {
    const plano = planos[planoSelecionado];

    document.getElementById('resumoNome').textContent =
        document.getElementById('nome').value;

    document.getElementById('resumoEmail').textContent =
        document.getElementById('email').value;

    document.getElementById('resumoPlano').textContent =
        plano.nome;

    document.getElementById('resumoPreco').textContent =
        `${plano.parcelas} — total de ${plano.total}`;

    document.getElementById('resumoPagamento').textContent =
        formulario.querySelector('input[name="pagamento"]:checked').value;
}

// Envia os dados do cadastro para o backend
async function finalizarCadastro() {

    const dadosCadastro = {
        nome: document.getElementById('nome').value.trim(),
        email: document.getElementById('email').value.trim(),
        senha: document.getElementById('senha').value,
        plano: planoSelecionado,
        pagamento: formulario.querySelector(
            'input[name="pagamento"]:checked'
        ).value
    };

    botaoAvancar.disabled = true;
    botaoVoltar.disabled = true;
    botaoAvancar.textContent = 'Enviando...';

    try {
        const resposta = await fetch('http://127.0.0.1:3001/cadastro', {
            method: 'POST',

            headers: {
                'Content-Type': 'application/json'
            },

            body: JSON.stringify(dadosCadastro)
        });

        const resultado = await resposta.json();

        if (!resposta.ok) {
            throw new Error(
                resultado.mensagem || 'Erro ao realizar cadastro.'
            );
        }

        mensagem.style.color = '#245c43';
        mensagem.textContent = resultado.mensagem;

        botaoAvancar.textContent = 'Cadastro realizado';

    } catch (erro) {
        console.error('Erro no cadastro:', erro);

        mensagem.style.color = '#b42318';

        mensagem.textContent = erro.message ||
            'Não foi possível conectar ao servidor. Tente novamente.';

        botaoAvancar.disabled = false;
        botaoVoltar.disabled = false;
        botaoAvancar.textContent = 'Concluir cadastro';
    }
}

// Botão continuar/concluir
botaoAvancar.addEventListener('click', async () => {

    if (!validarEtapaAtual()) return;

    if (etapaAtual === 1) {

        mostrarEtapa(2);

    } else if (etapaAtual === 2) {

        preencherResumo();
        mostrarEtapa(3);

    } else {

        await finalizarCadastro();

    }
});

// Botão voltar
botaoVoltar.addEventListener('click', () => {

    if (etapaAtual > 1) {
        mostrarEtapa(etapaAtual - 1);
    }

});

// Inicialização
atualizarSacola();
mostrarEtapa(1);
