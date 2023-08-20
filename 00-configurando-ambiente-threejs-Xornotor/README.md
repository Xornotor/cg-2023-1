[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-8d59dc4de5201274e310e4c54b9627a8934c3b88527886e3b421487c677d23eb.svg)](https://classroom.github.com/a/Wkzf6ZE9)
[![Open in Visual Studio Code](https://classroom.github.com/assets/open-in-vscode-c66648af7eb3fe8bc4f294546bfd86ef473780cde1dea487d3c4ff354943c9ae.svg)](https://classroom.github.com/online_ide?assignment_repo_id=10596879&assignment_repo_type=AssignmentRepo)
# Lab 00 - Configurando o Three.JS

## Objetivo:

Esse Laboratório tem por objetivo apenas a preparação do ambiente computacional necessário para criar e executar as aplicações que serão apresentadas ao longo do curso. 

## Sobre o Ambiente Computacional

As aplicações serão desenvolvidas em um ambiente bastante simples, baseado em um navegador com suporte a biblioteca [***WebGL***](https://www.khronos.org/api/webgl). A *WebGL* é um *port* para *web* da biblioteca [*OpenGL ES*](https://www.khronos.org/api/opengles), que por sua vez é uma versão para sistemas embarcados (*Embeded Systems*) da biblioteca gráfica [*OpenGL*](https://www.khronos.org/api/opengl). A Figura 1 ilustra o ecosistema de soluções mantidos pelo *Khronos Group* para suporte ao desenvolvimento de *APIs* (*Application Program Interfaces*) multiplataforma, que incluem as *APIs* gráfica usadas no curso.

![](https://www.khronos.org/assets/uploads/about/KHR-Ecosystem-Segmentation_May21.jpg)
Figura 1 - Ecosistema de *APIs* do *Khronos Group*

Além do suporte do navegador, para rodar aplicações gráficas WebGL é necessário que seu computador possua uma GPU com capacidade de executar *shaders*. Você pode fazer um teste se seu ambiente computacional tem capacidade suficiente clicando [aqui](https://get.webgl.org). Em caso afirmativo você verá o modelo de um cubo girando na tela. Caso contrário procure verificar se o que falta no seu ambiente é uma atualização do navegador ou a falta de uma GPU[^1]. 

Para o desenvolvimento precisaremos apenas de um editor de texto *ASCII*, como: [*Sublime*](), [*Atom*](), ou se mesmo uma *IDE* (*Integrated Development Environment*) como o [*VSCode*](). Só não vale editores com formatação como *Word* ou *Libreoffice Writer*. 

## Instalação do *Three.JS*

Como o suporte a *WebGL* e a linguagem *Javascript* são nativos ao seu navegador não é necessário instalar nada na sua máquina. Apenas proceder a verificação do suporte ao *WebGL* mencionada acima.

Como o *framework* ***Three.JS*** é feito em ambiente *web*, precisaremos desenvolver uma página *html* onde um código *Javascript* irá criar nosso ambiente gráfico. Portanto, é necessário que o código do *Three.JS* possa ser importado dentro da sua página e disponível no servidor *web*. 

Vamos adotar a forma mais simples e fácil de disponibilizar arquivos no servidor *web*: colocar os arquivos em um diretório local dentro servidor e utilizar caminhos relativos em nossas páginas. Chamaremos esse diretório de ***Assets*** e o colocaremos na raiz do nosso servidor. 

Dentro do diretório *Assets* colocaremos não só os *scripts* do *Three.JS* como também modelos 3D, imagens, texturas e outros recursos que utilizaremos no desenvolvimento dos Labs e Atividades. Esse conteúdo estará disponível no repositório do professor e pode ser baixado utilizando o comando git:

`git clone https://aapolinariojr.git.org/Assets.git`

Maiores detalhes sobre o processo de instalação podem ser encontradas na [documentação do *Three.JS*](https://www.threejs.org/).  

Importante notar que os códigos exemplo presumem a existencia do diretorio **Assets** em um certo posicionamento relativo. Caso voce prefira outra configuração de diretórios, deve modificar os caminhos dentro dos arquivos *.html* e *.js*. 

Outro detalhe: para executar códigos que utilizem recursos externos, como imagens, modelos, sons, etc, é necessário que seu computador esteja rodando um **servidor web local**. Dessa forma, as requisições desses arquivos, que serão feitas via protocolo *http*, poderão ser resolvidas de forma correta. Os exemplos desse Lab ainda não usam esses recursos e vão funcionar sem o servidor instalado, mas nas próximas aulas vamos começar a carregar modelos 3D e essa configuração se fará necessária. Você pode encontrar os detalhes de como configurar de forma simples esse servidor em:

https://threejs.org/docs/index.html#manual/en/introduction/How-to-run-things-locally 

Qualquer dúvida adicional, poste no *Discord* da disciplina, no canal de **dúvidas-prática**.

[^1]: A maioria dos computadores atuais, mesmo aqueles com placa gráfica *on board* tem suporte mínimo requerido pelo *OpenGL ES* para executar *shaders*. Mas para isso precisam ter instalado os *drivers* do fabricante. 
