document.addEventListener("DOMContentLoaded", () => {
    
    // --- LÓGICA DO MENU INICIAL ---
    document.getElementById('btn-novo-jogo').addEventListener('click', () => {
        // Esconde a div inteira do menu
        document.getElementById('start-menu').style.display = 'none'; 
    });

    document.getElementById('btn-como-jogar').addEventListener('click', () => {
        // Mostra a janela de instruções
        document.getElementById('instructions-modal').style.display = 'block';
    });

    document.getElementById('btn-fechar-instrucoes').addEventListener('click', () => {
        // Esconde a janela de instruções e volta para o menu
        document.getElementById('instructions-modal').style.display = 'none';
    });

    // ... O resto do seu script continua normal aqui (const base = [...], etc.)
    
    // 1. Gera 4 números aleatórios entre 1 e 10 para a base
    const base = [
        Math.floor(Math.random() * 10) + 1, //[cite: 1]
        Math.floor(Math.random() * 10) + 1, //[cite: 1]
        Math.floor(Math.random() * 10) + 1, //[cite: 1]
        Math.floor(Math.random() * 10) + 1  //[cite: 1]
    ];

    // Preenche os blocos da base no HTML[cite: 1]
    document.getElementById('block-1-1').innerText = base[0]; //[cite: 1]
    document.getElementById('block-1-2').innerText = base[1]; //[cite: 1]
    document.getElementById('block-1-3').innerText = base[2]; //[cite: 1]
    document.getElementById('block-1-4').innerText = base[3]; //[cite: 1]

    // 2. Calcula as respostas corretas (O "Gabarito" secreto)[cite: 1]
    const gabarito = {
        'block-2-1': base[0] + base[1], //[cite: 1]
        'block-2-2': base[1] + base[2], //[cite: 1]
        'block-2-3': base[2] + base[3], //[cite: 1]
        'block-3-1': (base[0] + base[1]) + (base[1] + base[2]), //[cite: 1]
        'block-3-2': (base[1] + base[2]) + (base[2] + base[3]), //[cite: 1]
        'block-4-1': ((base[0] + base[1]) + (base[1] + base[2])) + ((base[1] + base[2]) + (base[2] + base[3])) //[cite: 1]
    };

    const adventurer = document.getElementById('adventurer'); //[cite: 1]
    const villain = document.getElementById('villain'); //[cite: 1]

    // Variáveis de controle do jogo
    let errosTotais = 0; //[cite: 1]
    const maxErros = 3; //[cite: 1]
    let inputAtivoId = null; // Guarda qual quadrado o jogador clicou

    // Controle de progresso por fileira
    const totalBlocosPorLinha = { 2: 3, 3: 2, 4: 1 };
    const blocosResolvidosPorLinha = { 2: 0, 3: 0, 4: 0 };
    
    // Coordenadas baseadas nas suas imagens (ajuste esses valores de left/bottom se precisar)
    // Coordenadas ajustadas para ele subir pela lateral esquerda da pirâmide
    const coordenadasLinha = {
        2: { bottom: '400px', left: '100px' }, // Empurramos mais para a esquerda
        3: { bottom: '500px', left: '200px' }, // Acompanha a inclinação da pirâmide
        4: { bottom: '600px', left: '260px' }  // Fica ao lado do bloco do topo
    };

    // --- NOVA LÓGICA DE CLIQUE NOS BLOCOS ---
    for (const idBloco in gabarito) { 
        const inputElement = document.getElementById(idBloco); 
        const divBloco = inputElement.parentElement;

        // Lógica 1: Quando clica no bloco para abrir a caixa
        divBloco.addEventListener('click', () => {
            if (inputElement.disabled) return; 

            if (inputAtivoId && inputAtivoId !== idBloco) {
                const inputAnterior = document.getElementById(inputAtivoId);
                if (!inputAnterior.disabled) inputAnterior.style.display = 'none';
            }

            inputElement.style.display = 'block';
            inputElement.focus();
            inputAtivoId = idBloco;
        });

        // Lógica 2: NOVO! Escuta a tecla Enter dentro da caixa de texto
        inputElement.addEventListener('keypress', (event) => {
            // Se a tecla pressionada for o Enter...
            if (event.key === 'Enter') {
                event.preventDefault(); // Evita que a página recarregue
                document.getElementById('verify-btn').click(); // "Clica" no botão verde automaticamente
            }
        });
    }

    // --- LÓGICA DE VERIFICAÇÃO REESCRITA ---
    document.getElementById('verify-btn').addEventListener('click', () => { //[cite: 1]
        if (!inputAtivoId) {
            alert("Clique em um bloco da pirâmide primeiro para responder!");
            return;
        }

        const inputElement = document.getElementById(inputAtivoId); //[cite: 1]
        const valorDigitado = parseInt(inputElement.value); //[cite: 1]
        const valorCorreto = gabarito[inputAtivoId]; //[cite: 1]

        if (isNaN(valorDigitado)) return; // Se não digitou nada e clicou em verificar, ignora

        if (valorDigitado === valorCorreto) { //[cite: 1]
            // ACERTOU!
            inputElement.style.backgroundColor = '#2ecc71'; //[cite: 1]
            inputElement.style.color = 'white'; //[cite: 1]
            inputElement.disabled = true; // Trava o quadrado
            
            // Pega o número da linha a partir do ID (ex: "block-2-1" -> linha 2)
            let linha = parseInt(inputAtivoId.split('-')[1]);
            blocosResolvidosPorLinha[linha]++;

            if (linha === 4) {
                // ACERTOU O TOPO!
                adventurer.src = 'aventureiro_subindo.png'; // Aparece escalando
                adventurer.style.bottom = coordenadasLinha[4].bottom;
                adventurer.style.left = coordenadasLinha[4].left;

                // Espera 2 segundos e abre a tela de vitória
                setTimeout(() => {
                    document.getElementById('celebration-screen').style.display = 'flex';
                }, 2000);

            } else {
                // FILEIRAS NORMAIS (2 e 3)
                if (blocosResolvidosPorLinha[linha] === 1) {
                    // Acertou o PRIMEIRO quadrado da fileira
                    adventurer.src = 'aventureiro_subindo.png';
                } 
                
                if (blocosResolvidosPorLinha[linha] === totalBlocosPorLinha[linha]) {
                    // Acertou TODOS os quadrados da fileira
                    adventurer.src = 'aventureiro_idle.png'; // Volta pra pose normal
                    adventurer.style.bottom = coordenadasLinha[linha].bottom;
                    adventurer.style.left = coordenadasLinha[linha].left;
                }
            }

            inputAtivoId = null; // Reseta a seleção

        } else {
            // ERROU!
            inputElement.style.backgroundColor = '#e74c3c'; 
            inputElement.value = ""; // Limpa a resposta errada
            errosTotais++; 
            
            // --- NOVA LÓGICA DE MOVIMENTO DO VILÃO ---
            // Pega a posição atual de Y (bottom) e X (left)
            let posicaoAtualVilaoY = parseInt(window.getComputedStyle(villain).bottom);
            let posicaoAtualVilaoX = parseInt(window.getComputedStyle(villain).left);

            // A Múmia sobe mais rápido (120px) e anda para a esquerda (-120px) na diagonal
            villain.style.bottom = (posicaoAtualVilaoY + 120) + 'px'; 
            villain.style.left = (posicaoAtualVilaoX - 120) + 'px'; 

            if (errosTotais >= maxErros) {
                setTimeout(() => { 
                    // Esconde os inputs para a tela ficar limpa
                    document.querySelectorAll('.block input').forEach(inp => inp.style.display = 'none');
                    
                    // Mostra a tela de Game Over
                    document.getElementById('game-over-screen').style.display = 'flex';
                }, 500); 
            } else {
                alert(`Cuidado! Tem soma errada aí. A Múmia está se aproximando! (Vidas restantes: ${maxErros - errosTotais})`); 
            }
        }
    });
});
