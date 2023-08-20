# Atividades - CG 2023.1

Todas as atividades foram desenvolvidas utilizando o framework Three.js, e para visualizar no navegador, é necessário iniciar um servidor com o conteúdo desta pasta.

Um jeito simples de fazer isto é inicializando um servidor simples em Python, diretamente no terminal.

### Python 2

~~~bash
python -m SimpleHTTPServer 9000
~~~

### Python 3

~~~bash
python -m http.server 9000
~~~

Deste modo, a pasta raiz será acessível pelo navegador acessando [http://localhost:9000](http://localhost:9000).

Outra alternativa é utilizar um plugin como LiveServer ou FiveServer diretamente do Visual Studio Code. No entanto, recomendo **cuidado ao utilizar estes plugins**, pois os mesmos fazem correção automática de caminhos de arquivo, fazendo com que um projeto com caminhos de arquivo incorretamente configurados funcionem normalmente (não funcionarão na máquina do professor).