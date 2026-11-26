const logoutButton = document.getElementById('logoutButton');

if (logoutButton) {
    logoutButton.addEventListener('click', async () => {
        try {
            const resposta = await fetch('http://127.0.0.1:3001/login/logout', {
                method: 'POST',
                credentials: 'include'
            });

            if (resposta.ok) {
                window.location.href = '../login/login.html';
            } else {
                alert('Não foi possível sair da conta.');
            }

        } catch (erro) {
            console.error('Erro no logout:', erro);
            alert('Erro ao conectar com o servidor.');
        }
    });
}