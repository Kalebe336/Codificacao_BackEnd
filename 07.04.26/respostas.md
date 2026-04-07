     Atividade 1
Por que PATCH é a melhor escolha nesse caso?
=>Porque o PATCH muda apenas a requisição escolhida, ele pega apenas uma informação ao invés de alterar toda a informação.
O que significa atualização parcial?
=>Alterar apenas uma informação do campo em vez de alterar o campo todo.
O que acontece quando você envia apenas um campo?
=>Ele modifica apenas o campo enviado.

     Atividade 2

Por que PUT é considerado uma substituição completa?
=>Porque o PUT envia o campo inteiro e o servidor subtitui. Também para modificar um campo inteiramente e não apenas uma ou duas informações.
Qual é a diferença entre substituir e atualizar parcialmente?
=>O PUT subtitui todo o campo, enquanto o PATCH atualiza apenas os selecionados.
Se o objeto tivesse mais campos, o que poderia acontecer se eles não fossem enviados?
=>Com o PUT, os campos não enviados podem ser perdidos. Com PATCH, os campos não enviados permanecem como estavam.