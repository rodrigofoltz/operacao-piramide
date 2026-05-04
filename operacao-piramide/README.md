# 🏜️ Operação Pirâmide: Uma Aventura Matemática

![Status](https://img.shields.io/badge/Status-Concluído-success)
![Linguagem](https://img.shields.io/badge/Linguagem-JavaScript_Vanilla-yellow)
![Web](https://img.shields.io/badge/Tecnologia-HTML5_%7C_CSS3-orange)

**Operação Pirâmide** é um jogo de raciocínio lógico e matemático desenvolvido para navegadores. O jogador assume o papel de um aventureiro que precisa escalar uma pirâmide milenar resolvendo equações de soma antes que o tempo acabe e a múmia o alcance.

🎮 **[Jogue agora direto no navegador!] (https://rodrigofoltz.github.io/operacao-piramide/ProjetoCIDE/)**

---

## ✨ Funcionalidades e Mecânicas

O jogo foi projetado com uma curva de aprendizado progressiva, utilizando configurações orientadas a objetos no JavaScript para escalar a dificuldade de forma dinâmica:

*   **Matemática Procedural:** Os números da base da pirâmide são gerados aleatoriamente a cada nova partida, garantindo que o desafio nunca seja o mesmo.
*   **Sistema de Dificuldades (Escalabilidade):**
    *   🟢 **Iniciante / Fácil:** Números de 1 a 10 para focar no aprendizado.
    *   🟡 **Médio:** Números de 1 a 50 para cálculo mental avançado.
    *   🔴 **Difícil / Impossível:** Introdução da mecânica de *Morte Súbita* (apenas 1 erro permitido) e limite de tempo restrito.
*   **Pressão Passiva (Time-Attack):** Nas dificuldades com tempo, o vilão se aproxima gradativamente a cada segundo, utilizando cálculos em tempo real baseados nas coordenadas da tela.
*   **Single Page Application (SPA):** Transições de telas (Menu, Instruções, Jogo, Game Over) feitas puramente via manipulação do DOM com JavaScript, sem recarregar a página.

---

## 🛠️ Tecnologias Utilizadas

Este projeto foi construído do zero, sem a utilização de frameworks, para aprimorar os fundamentos do desenvolvimento Web:

*   **HTML5:** Estruturação semântica e divisão de camadas (UI, Modal, Grid do jogo).
*   **CSS3:** Animações (`@keyframes`), Efeitos de profundidade 3D (`z-index` e pseudo-classes) e responsividade estrutural usando Flexbox.
*   **JavaScript (Vanilla):** Lógica de jogo, controle de estado, temporizadores (`setInterval`, `setTimeout`) e manipulação de eventos do DOM.

---

## 🚀 Como rodar localmente

Como o projeto é estático (Client-side), não é necessária nenhuma instalação complexa de ambiente:

1. Faça o clone deste repositório:
   `git clone https://github.com/SEU_USUARIO/operacao-piramide.git`
2. Abra a pasta do projeto.
3. Dê um duplo clique no arquivo `index.html` para abri-lo no seu navegador de preferência.

---

## 👨‍💻 Autor

Desenvolvido como projeto acadêmico e peça de portfólio.