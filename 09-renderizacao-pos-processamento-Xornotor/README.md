[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-24ddc0f5d75046c5622901739e7c5dd533143b0c8e959d652212380cedb1ea36.svg)](https://classroom.github.com/a/hN9pBdeq)
[![Open in Visual Studio Code](https://classroom.github.com/assets/open-in-vscode-718a45dd9cf7e7f842a935f5ebbe5719a5e09af4491e668f4dbf3b35d5cca122.svg)](https://classroom.github.com/online_ide?assignment_repo_id=11394040&assignment_repo_type=AssignmentRepo)
# 09 Renderização e Pós-Processamento

## Objetivos do Lab e da Atividade:

1. Reforçar o uso das técnicas de mapeamento para aumentar o realismo no processo de renderização por rasterização;
2. Utilizar as técnicas de processamento de imagem vistas em sala de aula em efeitos práticos;
3. Consolidar o entendimento do processo de renderização e seus componentes: luz, material dos objetos, observador.

## O exemplos do Laboratório:

Nesse Lab. são apresentados 4 exemplos de aplicações:

1. Uso do mapeamento de texturas, em particular o **mapeamento de ambiente** para simular objetos de material espelhado;
2. *Bump Mapping* para simulação de superfícies rugosas;
3. *Normal Mapping* para simulação de detalhes na superfície dos objetos;
4. Uso da técnica de **renderização off-screen** para produzir texturas dinamicas de uma cena.

Os códigos serão analisados durante a aula. 

## A atividade:

Modifique o código do exemplo 4:

1. Substituindo os modelos do cubo e do cilindro por dois modelos geometricamente mais complexos, que possuam mapeamentos de textura e normais, e que não sejam espelhados (use modelos de [4]). 
2. Ajuste a iluminação da cena para que os modelos carregados fique integrados ao ambiente no qual estão imersos [^1];
3. Verifique como funcionam os filtros de pós-processamento que o Three.JS fornece [3] [5] e escolha 2 deles para aplicar na imagem gerada (em separado ou em conjunto). 

## Referências:

[1] 	Peter SHIRLEY, Michael ASHIKHMIN, Steve MARSCHNER. **Fundamentals of Computer Graphics**. AK Peters/CRC Press, 5th Edition, 2021.

[2] 	John F. Hughes, Andries van Dam, Morgan McGuire, David F. Sklar, James D. Foley, Steven K. Feiner. **Computer Graphics : Principles and Practice Third Edition in C**. Addison-Weslley. 2013.

[3] 	Dirksen, J., **Learn Three.JS: Program 3D animations and visualizations for the web with JavaScript and WebGL**. 4th Edition, Packt Publishing, 2023.

[4] 	*SketchFab*. Disponível em: https://sketchfab.com/.

[5] 	Three.JS Doc. **"How to use post-processing"**. Dispoível em: https://threejs.org/docs/#manual/en/introduction/How-to-use-post-processing 

[^1]: Se quiser pode modificar o mapeamento de ambiente para outro cenário a fim de conseguir uma melhor integração modelos/ambiente.
