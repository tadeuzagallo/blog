---
lang: pt
title: "Por que Linguagens de Programação?"
date: 2022-01-17 16:38:14
description: Como e porque me interessei por linguagens de programação
slug: por-que-linguagens-de-programacao
category:
- linguagens
- pessoal
twitter_text: "Por que Linguagens de Programação? Como e porque me interessei por linguagens de programação"
---

Eu sempre fui muito curioso, queria entender como tudo funcionava... era aquela criança chata, que pergunta de tudo. Quando meu pai comprou o nosso primeiro computador eu devia ter uns 10 anos, e logo quis entender como funcionava. Quando fiquei um pouco mais velho, ficava numa loja que montava e vendia computadores, pedia para ver o dono montando as máquinas. Quando tinha uns 16 anos, fiz o famoso cursinho de "Montagem e manutenção de Computadores e Redes".

Que que isso tem a ver com a história? Diretamente, nada, rs. Mas eu sempre achei curioso que nunca me passou pela cabeça como software era feito. Eu sabia instalar programas, formatar computador, futucava na BIOS, mas NUNCA me perguntei como alguém criava aquilo...

Eu pensei bastante sobre isso, e só recentemente que me dei conta: software era um conceito muito abstrato, e eu não processo bem conceitos abstratos. Até que um dia, eu fui parar num tecnólogo de "Sistemas pra Internet", e o que era uma coisa tão abstrata, naquele momento que aprendi a criar um arquivo .html, editar com o bloco de notas, e arrastar pro navegador... de repente, eu entendia. E aí meu amigo, eu nunca mais parei de programar.

Renasceu em mim aquela criança chata: como eu faço pra mudar a cor do texto? Como eu faço pra botar o texto no rodapé? Como eu faço pra mostrar a hora do dia? Mas eu quero que fique trocando... e foi assim que eu ouvi falar pela primeira vez de CSS, PHP e JavaScript.

E apesar de só depois de tanto ter me dado conta que a minha dificuldade era a abstração, intuitivamente eu acho que já sabia disso lá no começo, porque eu fiz um "pacto" comigo mesmo: eu não usaria nenhuma biblioteca ou ferramenta que eu não entendesse como funcionava.

De início era tudo na unha, porque não entendia nada: no PHP o roteamento usando `$_GET`, usando as funções padrão pra acessar o MYSQL, e assim fui, programando dia e noite, por alguns meses, até que eu arrumei o meu primeiro estágio... agora não tinha jeito, eu ia TER que usar bibliotecas que eu não entendia.

Mas eu não abandonei meu pacto, só fiz um pequeno ajuste: eu teria que escrever a minha própria versão de cada biblioteca que usasse. Não pra usar no trabalho, mas provar que eu entendia como cada biblioteca funcionava. Uma das primeiras coisas que copiei foi um framework MVC, chamado Yii. Depois comecei a aprender mais JavaScript, e "tive" que fazer a minha cópia do jQuery. Ficou uma bosta, mas eu entendi como funcionava, vida que segue.

Lembra dos conceitos abstratos que eu não processava bem? Pois bem, eu NUNCA tinha me perguntado como que o PHP ou JavaScript funcionavam. Nem passava pela minha cabeça. Você cria o arquivo, e ele roda. Fim de papo.

Até que um dia... chegou um projeto em CoffeeScript. E por algum motivo, porque eu sabia que tinha que "transpilar" pra JavaScript, eu decidi que eu tinha que criar a minha própria versão. Foi aí que eu tentei criar o CopheeScript, o primo do CoffeeScript que "transpilava" pra PHP. Só que aí meu amigo, eu descobri que o buraco era mais embaixo...

Eu comecei a escrever uma penca de expressões regulares, no famoso GoHorse. Não tinha absolutamente a menor ideia do que tava fazendo, mas consegui fazer um "Hello, World" funcionar e fui mostrar pra um colega do trabalho todo orgulhoso.

DETALHE importante pra história: A essa altura eu já tinha largado o tecnólogo, só cursei 3 períodos.

Pois o meu colega não tinha largado a faculdade, ele tinha feito Ciência da Computação de verdade, na Federal, e sabia o que era um compilador. Ele deu um sorriso meio amarelo e falou: "bacana, mas... não assim que funciona". He he. Mas ele era muito gente boa, e se ofereceu pra me explicar. Ele me falou o que eram Tokens, Lexer, Parser, Automatos, de escolher os "firsts" da gramática... mas eu não tava entendo PORRA NENHUMA. Foi aí que ele me mostrou um livro, o famoso "Livro do Dragão".

O Livro do Dragão é um clássico escrito em 1986, oficialmente chamado "Compilers: Principles, Techniques and Tools", mas ninguém lembra, e como tem um dragão na capa, ficou conhecido como "O Livro do Dragão". Pois bem, eu comecei a ler o Livro do Dragão, e eu não sei se já contei isso pra alguem, mas acho que não consegui passar do quarto ou quinto capítulo 🥲.

Eu decidi que eu ia ser diferente, tinha aprendido tudo sozinho até então, ia continuar como sempre tinha feito. Achei que compilador era que nem palavra cruzada, decidi que os livros eram "spoilers", e assim devo ter ficado uns 2 ou 3 anos batendo cabeça. Quando começava a chegar perto de ter alguma coisa semi-funcional, o projeto já tava uma zona, cheio de bug... eu apagava tudo e recomeçava do zero.

Chegamos em 2014, já há 4~5 anos nessa luta, decidi apagar tudo e começar do zero de novo. A linguagem Go tava em alta, decidi que queria aprender, então ia reescrever em Go. Tudo pra dar certo... não sabia nem como escrever um compilador, nem conhecia a linguagem usada pra implementar, *tá serto*. Nessa época eu também tinha descoberto o "JavaScript Funcional", e foi aí que tive uma ideia brilhante.

Decidi escrever uma linguagem quase igual ao JavaScript, mas funcional *de verdade*. Todas as "variáveis" seriam na verdade constantes e todas as estruturas de dados eram imutáveis. E decidi chamar a linguagem de Ceos, só não me lembro porque.

Num feito que só posso atribuir a minha teimosia, eu fiz a maldita linguagem quase funcionar. Tinha chegado mais longe do que nunca: conseguia escrever "Hello, World", fatorial, fizzbuzz, essas coisas simples. Pensa na felicidade da criança. Resolvi que estava pronto pra escrever um "programa de verdade" em Ceos, uma "calculadora": uma função que recebia uma string com operações e retornava o resultado. 

E foi aí que eu me dei conta que eu não sabia absolutamente NADA de programação funcional. O JavaScript Funcional era *fake*, e de funcional não tinha nada. Minha linguagem "funcionava", mas eu não sabia usar. 🥲

Eu entendi que se quisesse fazer uma linguagem de verdade, não bastava aprender a escrever um compilador, mas tinha que estudar outras linguagens, outros paradigmas, outras teorias. Descobri que o mundo de linguagens era muito mais vasto do que eu imaginava. Que as pessoas não "escrevem" uma linguagem, elas fazem o *design*, pensam em como as pessoas vão escrever, ler e aprender a usar a linguagem.

Eu me apaixonei por essa ideia de entender como as pessoas programam, e tentar criar uma linguagem que torne isso mais intuitivo, agradável, rápido, seguro e etc.

E aí começa a história de como eu aprendi programação funcional pra poder testar a minha linguagem, mas essa vai ficar para um próximo post 👋
