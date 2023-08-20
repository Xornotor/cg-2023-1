[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-24ddc0f5d75046c5622901739e7c5dd533143b0c8e959d652212380cedb1ea36.svg)](https://classroom.github.com/a/RpV2jq3R)
[![Open in Visual Studio Code](https://classroom.github.com/assets/open-in-vscode-718a45dd9cf7e7f842a935f5ebbe5719a5e09af4491e668f4dbf3b35d5cca122.svg)](https://classroom.github.com/online_ide?assignment_repo_id=11027175&assignment_repo_type=AssignmentRepo)
# Acompanhamento de Raios - Exercícios

## Objetivos:

1. Entender o processo sintese de imagem por acompanhamento de raios;
2. Reforçar o modelo de iluminação de Phong, sua formulação, elementos e parâmetros;
3. Aprofundar o conceito e uso de *shaders* no contexto do *Three.JS*;

## Exercício:

Analise com cuidado os códigos do *Laboratório 04 - Acompanhamento de Raios* e a teoria apresentada durante a aula, detalhada no Capítulo 4 e 5 de [1]. 

1. Identifique a parte do código responsável pelo calculo da direção do raio a ser acompanhado;
2. Verifique como a interseção *Raio/Objeto* é calculada para a esfera do exemplo;
2. Localize as funções responsáveis pelo cálculo da iluminação do "*Modelo de Phong*", suas componentes e parâmetros.

Após entender as conexões entre a teoria e a prática e, usando como base o código fonte do exemplo **Modelo de Phong**, faça modificações para que:

1. A esfera se torne amarela;
2. A fonte de luz da cena se torne magenta;
3. O reflexo da fonte de luz na esfera fique azul;
4. O padrão do fundo se torne um tabuleiro de xadrex (quadriculado preto e branco);
5. O objeto visualizado seja algum outro objeto implícito (sugestões em [3]);

## Desafio:

Como seria a simulação de uma esfera transparente? Pense em uma solução baseada apenas na composição das cores da esfera e do fundo (levando em conta o canal alpha) e em uma solução mais "fisicamente correta" onde o desvio do raio de luz possa ser considerado.  

## Referências:

[1]	MARSCHNER, Steve; SHIRLEY, Peter. "**Fundamentals of Computer Graphics**". 5th Edition CRC Press, 2021.

[2] Shirley, Peter. **Ray tracing in one weekend**. Amazon Digital Services LLC 1 (2016). 

[3] wikipedia. "**Implicit surface**". Disponível em: https://en.wikipedia.org/wiki/Implicit_surface 
