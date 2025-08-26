**Assunto:** Aprimoramento do Editor Tiptap para Formatação de Livros no App Escrivania Digital

**Contexto:**

Somos a Escrivania Digital, uma plataforma completa para escritores de ficção brasileiros, desenvolvida em **Next.js, React e TypeScript**. Nosso objetivo é oferecer um ecossistema semelhante ao Scrivener. O coração da nossa aplicação é um editor de texto avançado construído com **Tiptap**, que já conta com diversas extensões para formatação de texto.

**Objetivo Principal:**

Precisamos aprimorar nosso editor para que os escritores possam visualizar e formatar seus manuscritos em diferentes tamanhos de página padrão de livros, como **A4, A5, 16x23cm e 14x21cm**. A ideia é oferecer uma experiência _WYSIWYG (What You See Is What You Get)_, onde o editor simula a página de um livro, facilitando a formatação e a preparação para exportação.

**Solução Proposta:**

Queremos desenvolver uma **nova extensão customizada para o Tiptap** que gerencie a formatação da página. Esta extensão será responsável por aplicar os estilos necessários ao editor para simular visualmente os diferentes tamanhos de página.

**Requisitos Detalhados da Funcionalidade:**

1.  **Interface do Usuário (UI):**
    - Criar um novo componente de dropdown na barra de ferramentas do editor.
    - Este dropdown deve permitir que o usuário selecione um dos formatos de página predefinidos (A4, A5, 16x23, 14x21).
    - Ao selecionar um formato, os estilos do editor devem ser atualizados instantaneamente para refletir a escolha.

2.  **Extensão Tiptap Customizada (`PageFormat`):**
    - A principal tarefa é criar uma extensão que gerencie o estado do formato da página.
    - **Referência Técnica:** A criação de extensões no Tiptap está bem documentada. Utilize como base a documentação oficial: [Create a new extension](https://tiptap.dev/docs/editor/core-concepts/extensions#create-a-new-extension).
    - **Detalhes da Implementação da Extensão:**
      - **Nome:** `PageFormat`
      - **Atributos Globais (`addGlobalAttributes`):** A extensão deve adicionar um atributo ao nó principal (`doc`), como `pageSize`, para armazenar o formato selecionado (ex: `'a4'`, `'a5'`). Isso garante que o formato seja salvo junto com o conteúdo do documento.
      - **Comandos (`addCommands`):** Criar um comando `setPageFormat(format)` que permita atualizar o atributo `pageSize` no documento. Este comando será chamado pelo componente de UI do dropdown.
      - **Estilização Dinâmica (`addCSS`):** O ponto crucial é usar a função `addCSS` da extensão para injetar estilos CSS dinamicamente na página. Esses estilos devem ter como alvo a classe `.ProseMirror` (o contêiner do editor Tiptap) para aplicar:
        - `width` e `height` (ou `aspect-ratio`) correspondentes ao formato de página.
        - `padding` para simular as margens do livro.
        - `box-shadow` para dar a aparência de uma folha de papel.
        - Centralização na tela para uma melhor visualização.

**Exemplo Conceitual de CSS a ser injetado pela extensão:**

```css
.ProseMirror[pageSize="a4"] {
  width: 21cm;
  min-height: 29.7cm;
  padding: 2cm;
  margin: 2rem auto;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  background: white;
}

.ProseMirror[pageSize="16x23"] {
  width: 16cm;
  min-height: 23cm;
  padding: 1.5cm;
  margin: 2rem auto;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  background: white;
}
/* ... e assim por diante para os outros formatos. */
```

**Integração no Projeto:**

1.  Crie o arquivo da extensão (ex: `extensions/page-format.ts`).
2.  Implemente a lógica conforme descrito acima.
3.  Importe e adicione a nova extensão `PageFormat` à lista de extensões no nosso componente principal do editor (`components/editor/tiptap-editor.tsx`).
4.  Desenvolva o componente React para o dropdown de seleção de formato e integre-o à barra de ferramentas, utilizando o comando `setPageFormat` para interagir com a extensão.

O resultado final deve ser um editor que não apenas formata texto, mas também o próprio "papel" onde o escritor trabalha, proporcionando uma ferramenta muito mais poderosa e imersiva para a criação de livros.
