[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-24ddc0f5d75046c5622901739e7c5dd533143b0c8e959d652212380cedb1ea36.svg)](https://classroom.github.com/a/HxTvj6bz)
[![Open in Visual Studio Code](https://classroom.github.com/assets/open-in-vscode-718a45dd9cf7e7f842a935f5ebbe5719a5e09af4491e668f4dbf3b35d5cca122.svg)](https://classroom.github.com/online_ide?assignment_repo_id=11113664&assignment_repo_type=AssignmentRepo)
# Lab05 - Transformações Geométricas e Sistema de Visualização

## Objetivos:

1. Apronfundar os conceitos de transformações Geométricas, sua representação matricial homogenea e seu papel dentro do *pipeline* gráfico;
2. Aplicar transformações geométricas para a geração de animações simples;
3. Reforçar os conceitos envolvidos no processo de formação de imagens de uma camera virtual;
4. Usar os parâmetros de controle de uma camera virtual para produzir animações simples.  

## Exercícios:

Após analisar com cuidado os códigos fornecidos nesse Lab e faça o que se pede:

1. Com base no código do exemplo *Sistema Planetário* implemente os movimentos do planeta Terra e de sua Lua. São eles: 
	- rotação ao redor do próprio eixo em cada um, 
	- rotação so satélite ao redor de seu planeta, e 
	- rotação do sistema Terra/Luz ao redor do Sol.
2. Analise o exemplo *Instancias*  que utiliza um mecanismo bastante usado para modelos que se repetem muitas vezes dentro de um cenário: a *InstancedMesh*[^1][^2]. Reproduza o mesmo tipo de movimento implementado no item anterior, agora controlando as matrizes de transformação de cada instancia. 
3. Com base no código de *cisalhamento*, que implementa uma transformação geométrica "diferente" diretamente no *Vertex Shader*, pense em uma outra transformação que não possui suporte direto no *Three.JS*. Tente generalizar o código fornecido para aplicar uma matriz cujos elementos são passados por parâmetro.
4. Modifique o posicionamento da camera do exercício 1 ou 2 para que o movimento dos planetas possa ser visto de três pontos de vista distintos alinhados aos eixos coordenados.
5. Crie uma animação que movimente o ponto de vista da câmera simulando um satélite ao Sol na órbita de Mercúrio ou Vênus. Considere duas situações de movimento:
	- Satélite estacionário, apontando para o espaço: dessa forma será possível acompanhar, de tempos em tempos, o movimento da Terra e da Lua;
	- Satélite com rotação em seu próprio eixo. 


## Referências:

- MARSCHNER, Steve; SHIRLEY, Peter. "**Fundamentals of Computer Graphics**". 5th Edition CRC Press, 2021.

- Dirksen, J., **Learn Three.JS: Program 3D animations and visualizations for the web with JavaScript and WebGL**. 4th Edition, Packt Publishing, 2023.

- https://threejs.org/docs/index.html

- https://www.npmjs.com/package/lil-gui


[^1]: Documentação das *InstancedMesh*: https://threejs.org/docs/index.html?q=instan#api/en/objects/InstancedMesh

[^2]: Exemplo de uso de vários modelos com o *InstancedMesh*: https://threejs.org/examples/?q=instanc#webgl_buffergeometry_instancing
