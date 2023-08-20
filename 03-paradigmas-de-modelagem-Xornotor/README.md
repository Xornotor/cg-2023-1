[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-24ddc0f5d75046c5622901739e7c5dd533143b0c8e959d652212380cedb1ea36.svg)](https://classroom.github.com/a/kVMh9tNc)
[![Open in Visual Studio Code](https://classroom.github.com/assets/open-in-vscode-718a45dd9cf7e7f842a935f5ebbe5719a5e09af4491e668f4dbf3b35d5cca122.svg)](https://classroom.github.com/online_ide?assignment_repo_id=10913333&assignment_repo_type=AssignmentRepo)
# Lab 03 - Paradigmas de Modelagem de Formas em CG

## Objetivos:

1. Entender as caracteríticas e formas de avaliação dos 2 principais paradigmas de modelagem de Formas em CG: **Implícito** e **Paramétrico**;
2. Aprofundar o conceito e uso de *shaders* no contexto do *Three.JS*;
3. Reforçar os conceitos de modelos de representação de cores;
4. Identificar quando aplicar um ou outro modelo de cor, em função dos requisitos do problema. 

## Exercício:

1. Analise com cuidado o exemplo *1-formaParametrica-Bezier*. Perceba seu funcionamento e como está baseado em um novo objeto do *Three.JS*: *CubicBezierCurve3*. Perceba como a animação é feita a partir da movimentação dos pontos de controle da curva de Bezier e como a curva é regerada após essa mudança.

2. Leia com atenção o capítulo "*Curves*" em  [1], escrito por *Michael Gleicher*, em especial as seções 15.1 e 15.6.1 para entender melhor as questões teóricas da representação paramétrica de objetos. Ou consulte também [2].

3. Analise com cuidado o exemplo *2-formaImplicita*. Perceba seu funcionamento e como está baseado na avaliação de uma função implicita no *Fragment Shader*, definida a partir de um ponto fixo (passado para o *shader*). 

4. Para entender melhor o mecanismo e os parâmetros utilizados no *shader*, leia com atenção o capítulo "*Implicit Modeling*" em [1], escrito por *Brian Wyvill*, em especial as seções 21.1 (até 21.1.2) e 21.2 (até a 21.3.3) para compreender melhor as questões teóricas da representação implícita de objetos. Ou consulte também [3].

## Atividades:

1. A partir do exemplo *1-formaParametrica-Bezier*, construa uma aplicação em *Three.JS* que faça a avaliação da curva paramétrica no *Vertex Shader* [4] [5]. Ou seja, a avaliação da curva deve ser feita na GPU e não na CPU como o objeto *CubicBezierCurve3* faz.

2. Acrescente uma compontente de cor a curva, de forma que as cores variem pelo espectro das cores visíveis, e que conforme a curva fique mais alta ou mais baixa sua intensidade e/ou brilho variem. 

3. A partir do exemplo *2-formaImplicita* construa um simulador de "*Lampa de Lava*", objeto de decoração mostrado na Figura a seguir.

<img src="./imgs/lavaLamp.gif">

Sua aplicação não precisa simular o objeto de decoração, apenas o processo de combinação das bolhas coloridas na tela e seu movimento. 

Mantenha a ideia da visualização poder ser feita com os 3 diferentes tipos de função implícita do exemplo *2-formaImplicita* e do tipo "*Mix*", controlado pela *GUI*.

4. Modifique sua aplicação para gerar bolhas com cores diferentes.  

## Referências:

[1]	MARSCHNER, Steve; SHIRLEY, Peter. "**Fundamentals of Computer Graphics**". 5th Edition CRC Press, 2021.

[2] 	wikipedia, "**Bézier curve**". Disponível em: https://en.wikipedia.org/wiki/B%C3%A9zier_curve

[3] 	Bourke, P., "**Implicit surfaces - Also known as "Metaballs", "Blobbies", "Soft objects"**", 1997. Disponível em: http://paulbourke.net/geometry/implicitsurf/


[4] 	https://threejs.org/docs/index.html?q=shader#api/en/materials/ShaderMaterial

[5] 	https://threejs.org/manual/?q=shader#en/shadertoy
