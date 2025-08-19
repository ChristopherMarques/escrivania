### **Funcionalidades Essenciais para a "Escrivania Digital" (Foco: Ficção Brasileira)**

Aqui está uma lista priorizada, partindo do mais essencial para o mais avançado, focando em uma implementação faseada e de alto impacto.

### **Módulo 1: O Essencial para Escrever (O Coração do App)**

Estas são as funcionalidades-base. Sem elas, o aplicativo não cumpre sua função primária.

1.  **Estrutura de Capítulos e Cenas**
    * **Descrição:** Permite ao escritor organizar o manuscrito de forma hierárquica, criando capítulos que contêm cenas individuais. Essa estrutura em árvore é a espinha dorsal de qualquer romance, permitindo fácil navegação e reordenação das partes da história.
    * **Dicas de Implementação:** Utilize um componente de "Tree View" (visão em árvore) no painel esquerdo. Cada item (capítulo ou cena) é um nó que pode ser arrastado e solto para reordenar.

2.  **Editor de Texto com Modo Foco**
    * **Descrição:** Uma área central para a escrita de cada cena. Deve ter formatação básica (negrito, itálico) e um "Modo Foco" que oculta todos os painéis e elementos da interface, deixando apenas o texto em uma tela limpa para minimizar distrações.
    * **Dicas de Implementação:** Integre o editor de texto **Tiptap**. O Modo Foco pode ser um estado que aplica classes de CSS para esconder os painéis laterais e o header, com uma animação suave.

3.  **Sinopse e Notas por Cena**
    * **Descrição:** Cada cena na estrutura deve ter campos associados para uma "Sinopse" (resumo do que acontece) e "Notas" (observações do autor, ideias, etc.). Isso é vital para que o escritor possa ter uma visão geral da história sem precisar ler cada cena na íntegra.
    * **Dicas de Implementação:** No painel direito (Inspetor), exiba campos de texto (`Textarea`) para a sinopse e as notas do item selecionado na árvore.

4.  **Salvamento Automático (`Auto-save`)**
    * **Descrição:** O aplicativo deve salvar o progresso do escritor automaticamente a cada poucos segundos ou a cada alteração. Perder trabalho é o maior medo de um escritor, e essa funcionalidade é inegociável para garantir a confiança do usuário.
    * **Dicas de Implementação:** Use um `useEffect` com um `debounce` (atraso) no componente do editor para disparar a função de salvar no `localStorage` após o usuário parar de digitar por um momento.

### **Módulo 2: Planejamento e Estrutura Visual (A Visão do Arquiteto)**

Funcionalidades que transformam o app de um simples editor para uma poderosa ferramenta de planejamento.

1.  **Quadro de Cortiça (Corkboard / Index Cards)**
    * **Descrição:** Uma visão alternativa ao editor, onde cada cena é representada por um "cartão de índice" virtual. Cada cartão exibe o título da cena e sua sinopse. O escritor pode arrastar e soltar os cartões para reorganizar a estrutura da história de forma visual e intuitiva. É uma das features mais amadas do Scrivener.
    * **Dicas de Implementação:** Crie uma nova rota ou estado de visualização que renderize os dados das cenas como uma grade de componentes de `Card`. Implemente uma biblioteca de drag-and-drop (como `dnd-kit`) para a reordenação.

2.  **Visão Estrutural (Outliner)**
    * **Descrição:** Outra visão crucial para planejamento. Apresenta o manuscrito como uma lista ou tabela, onde cada linha é uma cena. As colunas podem exibir metadados como Título, Sinopse, Status e Contagem de Palavras. Facilita a análise do ritmo e da estrutura geral da narrativa.
    * **Dicas de Implementação:** Use um componente de `Table` da Shadcn UI. Cada linha corresponde a uma cena, e as células são preenchidas com os metadados. A edição de campos como a sinopse pode ser feita diretamente na célula.

### **Módulo 3: Construção de Universo (O Mundo da Ficção)**

Essencial para escritores de ficção, principalmente fantasia, ficção científica e romances históricos.

1.  **Fichas de Personagens**
    * **Descrição:** Uma seção dedicada para criar e gerenciar perfis de personagens. Uma ficha básica deve conter campos para nome, idade, descrição física, biografia, motivações e defeitos. Ter isso centralizado ajuda a manter a consistência dos personagens ao longo da história.
    * **Dicas de Implementação:** Crie um "template" de documento para personagens. Ao criar um novo personagem, o editor central exibe esses campos de formulário estruturados.

2.  **Fichas de Mundos (Locais, Itens, etc.)**
    * **Descrição:** Similar às fichas de personagens, mas para elementos do universo da história. Permite ao escritor detalhar locais importantes, objetos mágicos, organizações, etc. Essencial para manter a coerência do mundo criado.
    * **Dicas de Implementação:** Crie templates para "Local" e "Item". Use abas (`Tabs`) para organizar as informações (ex: Aba "Descrição", aba "História").

### **Módulo 4: Ferramentas de Produtividade e Segurança (O Cinto de Utilidades)**

Funcionalidades que motivam e dão segurança ao escritor.

1.  **Metas de Escrita**
    * **Descrição:** Permite que o usuário defina uma meta de contagem de palavras para o projeto total e para a sessão de escrita diária. Barras de progresso e notificações de metas atingidas servem como um ótimo fator de motivação.
    * **Dicas de Implementação:** Armazene os valores das metas no objeto do projeto. Use a contagem de palavras do Tiptap para atualizar o progresso em tempo real em componentes de `Progress` da Shadcn UI.

2.  **Snapshots (Versões Anteriores)**
    * **Descrição:** Uma forma simples de controle de versão. Antes de uma grande reescrita de uma cena, o escritor pode "tirar um snapshot" do estado atual. Isso salva uma cópia daquele texto, que pode ser visualizada ou restaurada posteriormente. Reduz o medo de editar e perder boas ideias.
    * **Dicas de Implementação:** No painel do Inspetor, adicione uma aba "Snapshots". Crie uma função que salva o conteúdo atual da cena em um array associado àquela cena. A lista de snapshots é renderizada com um botão para restaurar.

3.  **Exportação Simples**
    * **Descrição:** Uma funcionalidade para exportar o manuscrito (ou partes dele) para formatos abertos. Para começar, exportar para **Markdown (.md)** ou **HTML** já seria extremamente útil, permitindo que o escritor utilize seu texto em outras ferramentas.
    * **Dicas de Implementação:** Crie uma função que concatene o conteúdo das cenas selecionadas e use uma biblioteca como `file-saver` para iniciar o download do arquivo no navegador.