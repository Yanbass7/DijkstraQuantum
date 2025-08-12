# Algoritmo de Dijkstra - Sistema Genérico

Este é um sistema web que implementa o algoritmo de Dijkstra para encontrar os caminhos mais curtos entre todos os pares de nós em um grafo. O sistema inclui uma visualização interativa do grafo e uma nova funcionalidade para destacar a rota de menor custo.

## Funcionalidades

- **Cálculo de Caminhos**: Calcula todos os caminhos mais curtos entre todos os pares de nós
- **Visualização do Grafo**: Exibe o grafo de forma interativa usando a biblioteca vis.js
- **Cálculo de Rota Específica**: Permite escolher nó de início e destino para calcular a menor rota entre eles
- **Caminhos Quânticos**: **NOVA FUNCIONALIDADE** - Encontra múltiplos caminhos alternativos entre dois nós, incluindo o caminho clássico
- **Destaque da Rota de Menor Custo (Global)**: Destaca automaticamente a rota com o menor custo entre todos os pares de nós
- **Upload de Arquivo**: Permite carregar dados de um arquivo de texto
- **Interface Responsiva**: Funciona bem em diferentes tamanhos de tela

## Como Usar

### 1. Preparar os Dados

Os dados devem estar no seguinte formato:
```
4

1 2 2
1 3 4
2 3 1
2 4 7
3 4 3
```

- **Primeira linha**: Número total de nós no grafo
- **Segunda linha**: Linha vazia
- **Linhas seguintes**: Conexões no formato "nó_origem nó_destino distância"

### 2. Inserir Dados

Você pode:
- Colar os dados diretamente na área de texto
- Ou carregar um arquivo de texto usando o botão "carregue seu arquivo de topologia"

### 3. Calcular Caminhos

Clique no botão "Calcular Caminhos" para processar os dados e exibir os resultados.

### 4. Visualizar o Grafo

Após o cálculo, o grafo será exibido automaticamente na seção "Visualização do Grafo".

### 5. Calcular Rota Específica

Após a visualização do grafo, você pode:
- **Selecionar o Nó de Início**: Escolha o nó de partida no primeiro dropdown
- **Selecionar o Nó de Destino**: Escolha o nó de chegada no segundo dropdown
- **Calcular Rota**: Clique em "Calcular Rota" para encontrar o caminho mais curto entre os nós selecionados
- **Visualizar**: A rota será destacada no gráfico em verde e as informações serão exibidas

### 6. Calcular Caminhos Quânticos

**NOVA FUNCIONALIDADE**: Após a visualização do grafo, você pode:
- **Selecionar o Nó de Início**: Escolha o nó de partida no primeiro dropdown
- **Selecionar o Nó de Destino**: Escolha o nó de chegada no segundo dropdown
- **Definir Quantidade**: Escolha quantos caminhos quânticos deseja encontrar (1-10)
- **Calcular Caminhos**: Clique em "Calcular Caminhos Quânticos" para encontrar múltiplos caminhos alternativos
- **Visualizar**: Cada caminho será destacado com uma cor diferente no gráfico

### 7. Destacar a Rota de Menor Custo (Global)

Clique no botão "Destacar Rota de Menor Custo (Global)" para:
- Encontrar automaticamente a rota com o menor custo entre todos os pares de nós
- Destacar essa rota no gráfico com cor vermelha
- Mostrar informações detalhadas sobre a rota (origem, destino, caminho e distância)

### 7. Resetar Destaque

Clique no botão "Resetar Destaque" para remover o destaque da rota e voltar à visualização normal do grafo.

## Arquivos do Projeto

- `index.html` - Interface principal do sistema
- `script.js` - Lógica do algoritmo de Dijkstra e funcionalidades de visualização
- `style.css` - Estilos da interface
- `teste_exemplo.txt` - Arquivo de exemplo para testar o sistema
- `teste_quantico.txt` - Arquivo para testar caminhos quânticos
- `teste_quantico_complexo.txt` - Arquivo complexo para demonstrar múltiplos caminhos quânticos
- `teste_14_nos.txt` - Arquivo com 14 nós para testar caminhos quânticos em grafos maiores

## Tecnologias Utilizadas

- **HTML5**: Estrutura da página
- **CSS3**: Estilização e responsividade
- **JavaScript**: Lógica do algoritmo e interatividade
- **vis.js**: Biblioteca para visualização de grafos

## Como Funciona o Sistema

### Cálculo de Rota Específica
1. **Seleção de Nós**: O usuário escolhe o nó de início e destino nos dropdowns
2. **Cálculo Dijkstra**: O algoritmo calcula o caminho mais curto entre os nós selecionados
3. **Destaque Visual**: 
   - As arestas da rota são destacadas em verde e ficam mais grossas
   - Os nós da rota também são destacados em verde
   - Adiciona sombra às arestas para maior destaque
4. **Informações**: Exibe um alerta com detalhes da rota calculada

### Cálculo de Caminhos Quânticos
1. **Seleção de Parâmetros**: O usuário escolhe nó de início, destino e quantidade de caminhos
2. **Algoritmo de Yen Melhorado**: Implementa uma variação aprimorada do algoritmo de Yen para encontrar múltiplos caminhos
3. **Estratégias de Busca de Alternativas**: 
   - **Estratégia 1**: Remove nós intermediários de caminhos existentes para forçar desvios
   - **Estratégia 2**: Remove arestas específicas dos caminhos existentes
   - **Estratégia 3**: Utiliza nós não utilizados como intermediários para criar novos caminhos
   - **Estratégia 4**: Combina múltiplos nós intermediários para criar caminhos complexos
   - **Estratégia 5**: Força caminhos através de nós não utilizados removendo conexões diretas
   - Encontra o caminho clássico (menor custo) primeiro
   - Aplica as estratégias sequencialmente até encontrar a quantidade solicitada de caminhos
4. **Destaque Visual Melhorado**: 
   - Cada caminho é destacado com uma cor única e distinta
   - O caminho clássico é sempre o primeiro (verde)
   - Caminhos alternativos têm cores diferentes (vermelho, laranja, roxo, azul, etc.)
   - Arestas compartilhadas são destacadas em cinza escuro
   - Nós de início e fim são destacados com a cor do caminho
       - Nós intermediários têm transparência para melhor visualização
         - **Legenda interativa**: Cada caminho é um botão clicável que destaca apenas aquele caminho específico
     - **Legenda sempre visível**: Os botões permanecem visíveis mesmo quando um caminho está destacado
     - **Navegação fácil**: Clique entre os botões para alternar entre caminhos sem recalcular
     - **Ranking ordenado**: Caminhos organizados por distância crescente com badges de ranking
     - **Medalhas visuais**: 🥇🥈🥉 para os 3 melhores caminhos
     - **Botão "Mostrar Todos"**: Restaura a visualização completa de todos os caminhos
     - **Hover effects**: Efeitos visuais ao passar o mouse sobre os botões
5. **Informações Detalhadas**: Exibe informações de todos os caminhos encontrados

### Destaque da Rota de Menor Custo (Global)
1. **Análise dos Resultados**: O sistema analisa todos os caminhos calculados
2. **Identificação da Menor Distância**: Encontra o caminho com a menor distância total
3. **Destaque Visual**: 
   - As arestas da rota são destacadas em vermelho e ficam mais grossas
   - Os nós da rota também são destacados em vermelho
   - Adiciona sombra às arestas para maior destaque
4. **Informações**: Exibe um alerta com detalhes da rota destacada

## Exemplo de Uso

1. Abra o arquivo `index.html` em um navegador
2. Cole o conteúdo do arquivo `teste_exemplo.txt` na área de texto
3. Clique em "Calcular Caminhos"
4. Observe a tabela de resultados e a visualização do grafo
5. **Para calcular uma rota específica:**
   - Selecione o "Nó de Início" (ex: Nó 1)
   - Selecione o "Nó de Destino" (ex: Nó 4)
   - Clique em "Calcular Rota" para ver o caminho mais curto destacado em verde
6. **Para calcular caminhos quânticos:**
   - Selecione o "Nó de Início" (ex: Nó 1)
   - Selecione o "Nó de Destino" (ex: Nó 8)
   - Defina a quantidade de caminhos (ex: 5)
   - Clique em "Calcular Caminhos Quânticos" para ver múltiplos caminhos com cores diferentes
   - **Clique nos botões da legenda** para destacar apenas um caminho específico
   - **Navegue entre os caminhos** clicando nos diferentes botões da legenda
   - **Observe o ranking** dos caminhos ordenados por distância crescente
   - **Use "Mostrar Todos os Caminhos"** para voltar à visualização completa
   - **Dica**: Use o arquivo `teste_quantico_complexo.txt` para testar com mais opções de caminhos
   - **Dica**: Use o arquivo `teste_14_nos.txt` para testar em grafos maiores (14 nós)
7. **Para ver a rota global de menor custo:**
   - Clique em "Destacar Rota de Menor Custo (Global)" para ver a rota com menor custo destacada em vermelho
8. Use "Resetar Destaque" para voltar à visualização normal

As rotas calculadas serão destacadas no gráfico, mostrando os caminhos mais eficientes entre os nós selecionados. 