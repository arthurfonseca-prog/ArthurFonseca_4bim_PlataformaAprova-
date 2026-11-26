const formulario = document.getElementById('loginForm');
const mensagem = document.getElementById('loginMessage');

formulario.addEventListener('submit', async (event) => {

    event.preventDefault();

    const email = document.getElementById('email').value;
    const senha = document.getElementById('senha').value;

    try {

        const resposta = await fetch('http://127.0.0.1:3001/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify({
                email: email,
                senha: senha
            })
        });

        const dados = await resposta.json();

        if (resposta.ok) {

            // Verifica o tipo de usuário
            if (dados.tipo_usuario === 'admin') {

                window.location.href = '../administrador/administrador.html';

            } else {

                window.location.href = '../area_inicial/area_inicial.html';

            }

        } else {

            mensagem.textContent = dados.mensagem;

        }

    } catch (error) {

        console.error('Erro ao realizar login:', error);
        mensagem.textContent = 'Não foi possível conectar ao servidor.';

    }

});