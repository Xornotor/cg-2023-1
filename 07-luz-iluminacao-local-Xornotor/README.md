[![Open in Visual Studio Code](https://classroom.github.com/assets/open-in-vscode-718a45dd9cf7e7f842a935f5ebbe5719a5e09af4491e668f4dbf3b35d5cca122.svg)](https://classroom.github.com/online_ide?assignment_repo_id=11256734&assignment_repo_type=AssignmentRepo)
# Lab07 - Luzes e Iluminação Local

## Objetivos:

1. Entender melhor como definir e configurar diferentes fontes de luz em uma cena do *Three.JS*
2. Aprofundar os conceitos relacionados aos algoritmos de iluminação locais, seus parâmetros e seus efeitos visuais em modelos simples. 

## Exercícios:

Após analise cuidadosa do código, faça o que se pede:

1. Leia o material de [4] sobre fontes de luz. Para os tipo de fontes de luz pontual, direcional e spot, crie mais fontes, com posições e cores distintas iluminando o modelo do *teapot*. 
2. Acrescente outros tipos de fontes de a GUI e analise seus efeitos.
3. Crie uma opção na GUI que misture alguns tipos de fontes de modo a produzir um efeito que voce considere interessante. 
4. Leia o material de [5] sobre materiais e tente redefinir os materiais do modelos *Teapot*.
5. O Algoritmo de *Gouraud* é menos custoso que o algoritmo de *Phong* pois faz apenas 3 calculos de iluminação por face (um por vértice). Implemente um *Shader Material* que implemente o algoritmo de *Gouraud* no seu *Vertex Shader*.

## Referências:

[1] MARSCHNER, Steve; SHIRLEY, Peter. "**Fundamentals of Computer Graphics**". 5th Edition CRC Press, 2021.

[2] Dirksen, J., **Learn Three.JS: Program 3D animations and visualizations for the web with JavaScript and WebGL**. 4th Edition, Packt Publishing, 2023.

[3] https://threejs.org/docs/index.html

[4] https://threejs.org/manual/#en/lights

[5] https://threejs.org/manual/#en/materials