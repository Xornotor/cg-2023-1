[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-24ddc0f5d75046c5622901739e7c5dd533143b0c8e959d652212380cedb1ea36.svg)](https://classroom.github.com/a/0xcBfOcX)
# **Imersão em Maquete Virtual**

**Disciplina:** MATA65 - Computação Gráfica - 2023.1

**Aluno:** André Paiva Conrado Rodrigues

**Descrição**: O presente repositório contém um projeto de imersão e visita em uma maquete virtual.

---

## **1 - Instruções de uso**

### **1.1 - Controles de menu (GUI)**

O usuário tem os seguintes controles de menu a disposição:
*   `Visita`, onde o usuário pode selecionar se quer fazer a visita interna, externa ou guiada;
*   `PlanoCorte`, onde o usuário pode selecionar o plano de corte da maquete (só funciona na visita externa);
*   `PosicaoCorte`, que permite ao usuário deslocar o plano de corte pelo eixo correspondente.

### **1.2 - Funcionamento**

#### **1.2.1 - Visita Guiada**

A visita guiada é conduzida por uma câmera que transiciona automaticamente em corte seco para pontos de visita pré-determinados no código. O usuário não consegue interagir com a câmera e o ambiente, ficando apenas em observação.

#### **1.2.2 - Visita Interna**

A visita interna é mostrada por uma câmera em primeira pessoa com a qual o usuário pode interagir. A câmera começa na região da cozinha da casa. O usuário tem liberdade para visitar o térreo e o primeiro andar da casa (é possível subir as escadas internas). Neste modo de visitação, o usuário fica limitado apenas à área interna da casa, não podendo sair.

#### **1.2.3 - Visita Externa**

A visita externa é mostrada por uma câmera em voo, simulando o comportamento de um drone. A câmera começa pousada na frente da casa. O usuário tem liberdade para voar ao derredor da casa, podendo até mesmo pousar no telhado. No entanto, ele está confinado à região próxima ao redor da casa, não podendo se afastar muito, nem entrar no imóvel.

#### **1.2.4 - Planos de corte**

A visualização dos planos de corte só funciona no modo de visita externa. É possível selecionar um dentre três planos (XY, XZ e YZ) e mover os planos ao longo dos eixos.

---

## **2 - Estrutura do repositório**

O repositório contém três pastas principais:
*   `Assets` (localização dos arquivos do Three.js);
*   `gltf` (localização dos modelos 3D utilizados no projeto);
*   `MaqueteVirtual` (localização dos arquivos da página web).

Dentro da pasta `MaqueteVirtual` estão os seguintes arquivos:
*   `index.html` (arquivo HTML que importa o script do projeto);
*   `MaqueteVirtual.js` (arquivo do script utilizando Three.js);
*   `MaqueteVirtual.css` (arquivo de estilização para correções no HTML).

---

## **3 - Modelos 3D utilizados**

Foi utilizado um modelo arquitetônico baixado do [SketchFab](https://sketchfab.com/) e levemente modificado pelo aluno, além de três avatares animados, também baixados do [SketchFab](https://sketchfab.com/) e sem alteração feita.

Todos os arquivos utilizados estão em formato `gltf`.

Lista de modelos utilizados:
*   [Wooden House](https://sketchfab.com/3d-models/wooden-house-ca7e3d72a11441b6b04012eda6efe85b), by [Home Design 3D](https://sketchfab.com/homedesign3d) (modificado)
*   [Animated Instructor Avatar](https://sketchfab.com/3d-models/animated-instructor-avatar-dd71bd5460434b8bbebefbefb2634238), by [sage.freeman](https://sketchfab.com/sagefreeman)
*   [Movie Star Ryan Reynolds Animated Avatar](https://sketchfab.com/3d-models/movie-star-ryan-reynolds-animated-avatar-1d1e8a79157e4c5d801f51b5182aab41), by [LasquetiSpice](https://sketchfab.com/LasquetiSpice)
*   [Woman 2_c4d](https://sketchfab.com/3d-models/woman-2-c4d-79853f26b0424c89baf7d8f0020c08b6), by [Dimass](https://sketchfab.com/dvkipr)

---

## **4 - Configurações de câmeras, cenário e render**

### **4.1 - Câmeras**

Na função `main` é chamada a função `createCameras`.

A função `createCameras` cria três instâncias de câmera:
* `camInterna` (câmera utilizada na visita interna);
* `camExterna` (câmera utilizada na visita externa);
* `camGuiada` (câmera utilizada na visita guiada).

À câmera de visita interna, foi atribuído o controlador `ctrlInterna`, que consiste de uma instância de `FirstPersonControls`, de modo a simular uma câmera em primeira pessoa.

À câmera de visita externa, foi atribuído o controlador `ctrlExterna`, que consiste de uma instância de `FlyControls`, de modo a simular uma câmera de drone.

A câmera de visita guiada não teve nenhum controlador associado. Ela foi configurada com um campo de visão maior do que as outras câmeras. Foi criada a função `transicaoGuiada` que ciclicamente transiciona a câmera em corte seco por entre posições e ângulos predefinidos nos vetores `posicoesGuia` e `angulosGuia`.

### **4.2 - Cenário**

Na função `main` são chamadas as funções `addLights` e `loadAllModels`.

A função `addLights` é responsável por criar, configurar e adicionar os dispositivos de iluminação utilizados na cena.

A função `loadAllModels` utiliza o `GLTFLoader` para carregar os modelos 3D utilizados utilizando 4 funções de callback, cada uma responsável por um modelo.

As funções de callback configuram, escalam e posicionam corretamente cada um dos modelos na cena, além de fazer configurações necessárias para o recurso dos planos de corte, como será explicado mais adiante.

### **4.3 - Render**

O renderizador foi configurado com uso de antialias. A aplicação foi configurada para preencher todo o espaço da janela do browser, considerando também os casos de redimensionamento da janela.

---

## **5 - Sobre as limitações de movimento**

Foram criadas funções específicas para limitação dos movimentos das câmeras de visita interna e externa. Tais funções são chamadas ciclicamente a cada atualização de renderização.

### **5.1 - Limitações da visita interna**

As limitações da visita interna são definidas pela função `internalBoundaries`, que é chamada ciclicamente a cada atualização de renderização.

Esta função chama as funções `internalTerreoBoundaries`, `internalEscadaBoundaries` e `internalAndarBoundaries`, que definem regiões do espaço do mundo por onde a câmera de visita interna pode passar. Além disso, a função `internalEscadaBoundaries` faz o ajuste automático a posição em Y da câmera de visita interna, para simular o subir/descer de uma escada.

A função `internalBoundaries` retorna `true` caso a câmera interna esteja dentro dos limites previstos, e `false` caso contrário. Caso a câmera saia do limite, é feito um ajuste automático para reposicionar a câmera para a última posição onde a câmera se encontrou dentro dos limites.

### **5.2 - Limitações da visita externa**

As limitações da visita interna são definidas pela função `externalBoundaries`, que é chamada ciclicamente a cada atualização de renderização.

De modo similar à função de limites de visita externa, a função `externalBoundaries` retorna `true` caso a câmera externa esteja dentro dos limites previstos, e `false` caso contrário. Caso a câmera saia do limite, é feito um ajuste automático para reposicionar a câmera para a última posição onde a câmera se encontrou dentro dos limites.

---

## **6 - Sobre os planos de corte**

Foi criado um plano de corte associado como um *clippingPlane* aos materiais do modelo 3D da casa.

Para controlar a visibilidade do clipping e assegurar que o mesmo não é visto nas visitas interna e guiada, foi criada a função `configClipping` que habilita ou desabilita o `localClippingEnabled` do renderizador em caso de modificação dos controles do menu de usuário.
