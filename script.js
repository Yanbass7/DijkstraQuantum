document.addEventListener('DOMContentLoaded', function() {
    // Elementos da DOM
    const inputData = document.getElementById('input-data');
    const calculateBtn = document.getElementById('calculate-btn');
    const fileInput = document.getElementById('file-input');
    const resultsBody = document.getElementById('results-body');
    const graphContainer = document.getElementById('graph-container');
    const networkContainer = document.getElementById('network');
    const startNodeSelect = document.getElementById('start-node');
    const endNodeSelect = document.getElementById('end-node');
    const calculateSpecificPathBtn = document.getElementById('calculate-specific-path-btn');
    const quantumStartNodeSelect = document.getElementById('quantum-start-node');
    const quantumEndNodeSelect = document.getElementById('quantum-end-node');
    const quantumCountInput = document.getElementById('quantum-count');
    const calculateQuantumPathsBtn = document.getElementById('calculate-quantum-paths-btn');
    const quantumLegend = document.getElementById('quantum-legend');
    const legendContent = document.getElementById('legend-content');
    
    // Variáveis globais
    let network = null;
    let currentGraph = null;
    let currentNumNodes = null;
    let currentResults = null;
    let highlightedEdges = new Set();

    // Evento para upload de arquivo
    fileInput.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                inputData.value = e.target.result;
            };
            reader.readAsText(file);
        }
    });

    // Eventos para os botões de destaque
    document.getElementById('highlight-shortest-btn').addEventListener('click', function() {
        if (currentResults && currentResults.length > 0) {
            highlightShortestPath();
        } else {
            alert('Calcule os caminhos primeiro antes de destacar a rota de menor custo');
        }
    });

    document.getElementById('reset-highlight-btn').addEventListener('click', function() {
        resetHighlight();
    });

    // Evento para calcular rota específica
    calculateSpecificPathBtn.addEventListener('click', function() {
        const startNode = parseInt(startNodeSelect.value);
        const endNode = parseInt(endNodeSelect.value);
        
        if (!startNode || !endNode) {
            alert('Por favor, selecione tanto o nó de início quanto o nó de destino');
            return;
        }
        
        if (startNode === endNode) {
            alert('O nó de início e destino não podem ser iguais');
            return;
        }
        
        if (currentGraph && currentNumNodes) {
            calculateAndHighlightSpecificPath(startNode, endNode);
        } else {
            alert('Calcule os caminhos primeiro antes de calcular uma rota específica');
        }
    });

    // Evento para calcular caminhos quânticos
    calculateQuantumPathsBtn.addEventListener('click', function() {
        const startNode = parseInt(quantumStartNodeSelect.value);
        const endNode = parseInt(quantumEndNodeSelect.value);
        const quantumCount = parseInt(quantumCountInput.value);
        
        if (!startNode || !endNode) {
            alert('Por favor, selecione tanto o nó de início quanto o nó de destino');
            return;
        }
        
        if (startNode === endNode) {
            alert('O nó de início e destino não podem ser iguais');
            return;
        }
        
        if (quantumCount < 1 || quantumCount > 10) {
            alert('A quantidade de caminhos deve estar entre 1 e 10');
            return;
        }
        
        if (currentGraph && currentNumNodes) {
            calculateAndHighlightQuantumPaths(startNode, endNode, quantumCount);
        } else {
            alert('Calcule os caminhos primeiro antes de calcular caminhos quânticos');
        }
    });

    // Função principal que processa os dados
    calculateBtn.addEventListener('click', function() {
        const data = inputData.value.trim();
        if (data) {
            try {
                const {graph, numNodes} = parseInputData(data);
                if (numNodes < 2) {
                    throw new Error('O grafo deve ter pelo menos 2 nós');
                }
                const results = calculateAllPaths(graph, numNodes);
                displayResults(results, graph, numNodes);
            } catch (error) {
                alert('Erro ao processar os dados:\n' + error.message);
                console.error(error);
            }
        } else {
            alert('Por favor, insira os dados ou carregue um arquivo');
        }
    });

    // Função para parsear os dados de entrada
    function parseInputData(data) {
        const lines = data.split('\n').map(line => line.trim()).filter(line => line !== '');
        if (lines.length < 1) {
            throw new Error('Arquivo vazio ou formato inválido');
        }
        
        const numNodes = parseInt(lines[0]);
        if (isNaN(numNodes)) {
            throw new Error('A primeira linha deve conter o número de nós (valor numérico)');
        }
        
        const graph = {};
        // Inicializar o grafo
        for (let i = 1; i <= numNodes; i++) {
            graph[i] = {};
        }
        
        // Adicionar arestas
        for (let i = 1; i < lines.length; i++) {
            const parts = lines[i].trim().split(/\s+/);
            if (parts.length !== 3) {
                throw new Error(`Formato inválido na linha ${i+1}: "${lines[i]}"\nEsperado: "origem destino peso"`);
            }
            
            const source = parseInt(parts[0]);
            const target = parseInt(parts[1]);
            const weight = parseFloat(parts[2]);
            
            if (isNaN(source) || isNaN(target) || isNaN(weight)) {
                throw new Error(`Valores inválidos na linha ${i+1}: "${lines[i]}"`);
            }
            
            if (source < 1 || source > numNodes || target < 1 || target > numNodes) {
                throw new Error(`Nó inválido na linha ${i+1}: "${lines[i]}"\nOs nós devem estar entre 1 e ${numNodes}`);
            }
            
            graph[source][target] = weight;
        }
        
        return {graph, numNodes};
    }

    // Implementação do algoritmo de Dijkstra
    function dijkstra(graph, start, numNodes) {
        const distances = {};
        const previous = {};
        const unvisited = new Set();
        
        // Inicialização
        for (let i = 1; i <= numNodes; i++) {
            distances[i] = Infinity;
            previous[i] = null;
            unvisited.add(i);
        }
        distances[start] = 0;
        
        while (unvisited.size > 0) {
            // Encontrar o nó não visitado com a menor distância
            let closestNode = null;
            for (const node of unvisited) {
                if (closestNode === null || distances[node] < distances[closestNode]) {
                    closestNode = node;
                }
            }
            
            // Se a menor distância for Infinity, podemos parar
            if (distances[closestNode] === Infinity) break;
            
            unvisited.delete(closestNode);
            
            // Atualizar distâncias para os vizinhos
            for (const neighbor in graph[closestNode]) {
                const alt = distances[closestNode] + graph[closestNode][neighbor];
                if (alt < distances[neighbor]) {
                    distances[neighbor] = alt;
                    previous[neighbor] = closestNode;
                }
            }
        }
        
        return { distances, previous };
    }

    // Função para reconstruir o caminho
    function getPath(previous, start, end) {
        const path = [];
        let current = end;
        
        while (current !== start && current !== null) {
            path.unshift(current);
            current = previous[current];
        }
        
        if (current === null) return null; // Não há caminho
        
        path.unshift(start);
        return path.join('-');
    }

    // Calcular todos os caminhos para todos os pares de nós
    function calculateAllPaths(graph, numNodes) {
        const results = [];
        
        for (let start = 1; start <= numNodes; start++) {
            const { distances, previous } = dijkstra(graph, start, numNodes);
            
            for (let end = 1; end <= numNodes; end++) {
                if (start === end) continue;
                
                const path = getPath(previous, start, end);
                if (path) {
                    results.push({
                        start,
                        end,
                        path,
                        distance: distances[end]
                    });
                }
            }
        }
        
        return results;
    }

    // Função para criar a visualização do grafo 
    function createGraphVisualization(graph, numNodes) {
        if (network !== null) {
            network.destroy();
        }
    
        const nodes = new vis.DataSet();
        for (let i = 1; i <= numNodes; i++) {
            nodes.add({
                id: i,
                label: `Nó ${i}`,
                color: '#3498db'
            });
        }
    
        const edges = new vis.DataSet();
        const addedEdges = new Set();
    
        for (const source in graph) {
            for (const target in graph[source]) {
                const edgeKey = `${Math.min(source,target)}-${Math.max(source,target)}`;
                
                // Se já existe conexão inversa, cria seta bidirecional
                if (graph[target] && graph[target][source] && !addedEdges.has(edgeKey)) {
                    edges.add({
                        from: source,
                        to: target,
                        label: graph[source][target].toString(), // Mostra apenas um valor
                        arrows: {
                            to: { enabled: true, scaleFactor: 0.5 },
                            from: { enabled: true, scaleFactor: 0.5 }
                        },
                        smooth: {
                            type: 'curvedCW',
                            roundness: 0.2
                        }
                    });
                    addedEdges.add(edgeKey);
                } 
                // Conexão unidirecional
                else if (!addedEdges.has(edgeKey)) {
                    edges.add({
                        from: source,
                        to: target,
                        label: graph[source][target].toString(),
                        arrows: 'to',
                        smooth: {
                            type: 'curvedCW',
                            roundness: 0.2
                        }
                    });
                }
            }
        }
    
    
        
        // Configurações do grafo
        const data = { nodes, edges };
        const options = {
            nodes: {
                shape: 'circle',
                size: 20,
                font: {
                    size: 14,
                    color: '#333'
                },
                borderWidth: 2
            },
            edges: {
                width: 2,
                font: {
                    size: 12,
                    align: 'middle'
                },
                color: {
                    color: '#666',
                    highlight: '#c00'
                },
                selectionWidth: 3
            },
            physics: {
                enabled: true,
                solver: 'forceAtlas2Based',
                forceAtlas2Based: {
                    gravitationalConstant: -50,
                    centralGravity: 0.01,
                    springLength: 100,
                    springConstant: 0.08
                }
            }
        };
        
        // Criar o grafo
        network = new vis.Network(networkContainer, data, options);
        graphContainer.style.display = 'block';
        
        // Popular os selects com os nós disponíveis
        populateNodeSelects(numNodes);
    }

    // Função para popular os selects de nós
    function populateNodeSelects(numNodes) {
        // Limpar opções existentes
        startNodeSelect.innerHTML = '<option value="">Selecione...</option>';
        endNodeSelect.innerHTML = '<option value="">Selecione...</option>';
        quantumStartNodeSelect.innerHTML = '<option value="">Selecione...</option>';
        quantumEndNodeSelect.innerHTML = '<option value="">Selecione...</option>';
        
        // Adicionar opções para cada nó
        for (let i = 1; i <= numNodes; i++) {
            const startOption = document.createElement('option');
            startOption.value = i;
            startOption.textContent = `Nó ${i}`;
            startNodeSelect.appendChild(startOption);
            
            const endOption = document.createElement('option');
            endOption.value = i;
            endOption.textContent = `Nó ${i}`;
            endNodeSelect.appendChild(endOption);
            
            const quantumStartOption = document.createElement('option');
            quantumStartOption.value = i;
            quantumStartOption.textContent = `Nó ${i}`;
            quantumStartNodeSelect.appendChild(quantumStartOption);
            
            const quantumEndOption = document.createElement('option');
            quantumEndOption.value = i;
            quantumEndOption.textContent = `Nó ${i}`;
            quantumEndNodeSelect.appendChild(quantumEndOption);
        }
    }

    // Função para encontrar a rota de menor custo entre todos os pares
    function findShortestPath() {
        if (!currentResults || currentResults.length === 0) {
            return null;
        }
        
        // Encontrar o resultado com a menor distância
        let shortestPath = currentResults[0];
        for (const result of currentResults) {
            if (result.distance < shortestPath.distance) {
                shortestPath = result;
            }
        }
        
        return shortestPath;
    }

    // Função para destacar a rota de menor custo
    function highlightShortestPath() {
        const shortestPath = findShortestPath();
        if (!shortestPath) {
            alert('Nenhuma rota encontrada para destacar');
            return;
        }

        // Resetar destaque anterior (incluindo esconder legenda)
        resetHighlight();

        // Converter o caminho em array de nós
        const pathNodes = shortestPath.path.split('-').map(Number);
        
        // Destacar as arestas do caminho
        const edges = network.body.data.edges.get();
        highlightedEdges.clear();

        for (let i = 0; i < pathNodes.length - 1; i++) {
            const from = pathNodes[i];
            const to = pathNodes[i + 1];
            
            // Procurar a aresta correspondente
            for (const edge of edges) {
                if ((edge.from === from && edge.to === to) || 
                    (edge.from === to && edge.to === from)) {
                    
                    // Destacar a aresta
                    network.body.data.edges.update({
                        id: edge.id,
                        color: {
                            color: '#e74c3c',
                            highlight: '#c0392b'
                        },
                        width: 4,
                        shadow: true
                    });
                    
                    highlightedEdges.add(edge.id);
                    break;
                }
            }
        }

        // Destacar os nós do caminho
        for (const nodeId of pathNodes) {
            network.body.data.nodes.update({
                id: nodeId,
                color: '#e74c3c',
                borderWidth: 3,
                borderColor: '#c0392b'
            });
        }

        // Mostrar informação sobre a rota destacada
        alert(`Rota de menor custo destacada:\nOrigem: ${shortestPath.start}\nDestino: ${shortestPath.end}\nCaminho: ${shortestPath.path}\nDistância: ${shortestPath.distance}`);
    }

    // Função para calcular e destacar uma rota específica
    function calculateAndHighlightSpecificPath(startNode, endNode) {
        // Calcular o caminho usando Dijkstra
        const { distances, previous } = dijkstra(currentGraph, startNode, currentNumNodes);
        const path = getPath(previous, startNode, endNode);
        
        if (!path) {
            alert(`Não existe caminho entre o Nó ${startNode} e o Nó ${endNode}`);
            return;
        }
        
        // Resetar destaque anterior (incluindo esconder legenda)
        resetHighlight();
        
        // Converter o caminho em array de nós
        const pathNodes = path.split('-').map(Number);
        
        // Destacar as arestas do caminho
        const edges = network.body.data.edges.get();
        highlightedEdges.clear();
        
        for (let i = 0; i < pathNodes.length - 1; i++) {
            const from = pathNodes[i];
            const to = pathNodes[i + 1];
            
            // Procurar a aresta correspondente
            for (const edge of edges) {
                if ((edge.from === from && edge.to === to) || 
                    (edge.from === to && edge.to === from)) {
                    
                    // Destacar a aresta
                    network.body.data.edges.update({
                        id: edge.id,
                        color: {
                            color: '#27ae60',
                            highlight: '#229954'
                        },
                        width: 4,
                        shadow: true
                    });
                    
                    highlightedEdges.add(edge.id);
                    break;
                }
            }
        }
        
        // Destacar os nós do caminho
        for (const nodeId of pathNodes) {
            network.body.data.nodes.update({
                id: nodeId,
                color: '#27ae60',
                borderWidth: 3,
                borderColor: '#229954'
            });
        }
        
        // Mostrar informação sobre a rota calculada
        alert(`Rota calculada:\nOrigem: Nó ${startNode}\nDestino: Nó ${endNode}\nCaminho: ${path}\nDistância: ${distances[endNode]}`);
    }

    // Função para calcular e destacar caminhos quânticos
    function calculateAndHighlightQuantumPaths(startNode, endNode, quantumCount) {
        // Encontrar múltiplos caminhos usando algoritmo de Yen
        const quantumPaths = findMultiplePaths(currentGraph, startNode, endNode, quantumCount);
        
        if (quantumPaths.length === 0) {
            alert(`Não existe caminho entre o Nó ${startNode} e o Nó ${endNode}`);
            return;
        }
        
        // Resetar destaque anterior (mantendo a legenda se existir)
        resetVisualHighlight();
        
        // Cores para diferentes caminhos quânticos
        const quantumColors = [
            '#27ae60', // Verde (caminho clássico)
            '#e74c3c', // Vermelho
            '#f39c12', // Laranja
            '#9b59b6', // Roxo
            '#3498db', // Azul
            '#e67e22', // Laranja escuro
            '#1abc9c', // Verde água
            '#34495e', // Cinza escuro
            '#f1c40f', // Amarelo
            '#e91e63'  // Rosa
        ];
        
        // Mapear arestas para caminhos para evitar sobreposição
        const edgeToPaths = new Map();
        
        // Primeiro, mapear todas as arestas para os caminhos que as usam
        quantumPaths.forEach((pathData, pathIndex) => {
            const pathNodes = pathData.path.split('-').map(Number);
            
            for (let i = 0; i < pathNodes.length - 1; i++) {
                const from = pathNodes[i];
                const to = pathNodes[i + 1];
                const edgeKey = `${Math.min(from, to)}-${Math.max(from, to)}`;
                
                if (!edgeToPaths.has(edgeKey)) {
                    edgeToPaths.set(edgeKey, []);
                }
                edgeToPaths.get(edgeKey).push(pathIndex);
            }
        });
        
        // Destacar cada caminho com uma cor diferente
        const edges = network.body.data.edges.get();
        let pathInfo = `Caminhos Quânticos encontrados:\n\n`;
        
        // Destacar as arestas baseado no número de caminhos que as usam
        edgeToPaths.forEach((pathIndices, edgeKey) => {
            const [from, to] = edgeKey.split('-').map(Number);
            
            // Procurar a aresta correspondente
            for (const edge of edges) {
                if ((edge.from === from && edge.to === to) || 
                    (edge.from === to && edge.to === from)) {
                    
                    let finalColor, finalWidth;
                    
                    if (pathIndices.length === 1) {
                        // Aresta usada por apenas um caminho
                        const pathIndex = pathIndices[0];
                        finalColor = quantumColors[pathIndex % quantumColors.length];
                        finalWidth = 4 + (pathIndex * 0.8);
                    } else {
                        // Aresta compartilhada por múltiplos caminhos
                        finalColor = '#2c3e50'; // Cinza escuro para arestas compartilhadas
                        finalWidth = 6;
                    }
                    
                    // Destacar a aresta
                    network.body.data.edges.update({
                        id: edge.id,
                        color: {
                            color: finalColor,
                            highlight: finalColor
                        },
                        width: finalWidth,
                        shadow: true
                    });
                    
                    highlightedEdges.add(edge.id);
                    break;
                }
            }
        });
        
        // Destacar os nós com cores baseadas no caminho principal
        quantumPaths.forEach((pathData, index) => {
            const pathNodes = pathData.path.split('-').map(Number);
            const color = quantumColors[index % quantumColors.length];
            
            // Destacar apenas os nós de início e fim com a cor do caminho
            const startNodeId = pathNodes[0];
            const endNodeId = pathNodes[pathNodes.length - 1];
            
            // Destacar nó de início
            network.body.data.nodes.update({
                id: startNodeId,
                color: color,
                borderWidth: 4,
                borderColor: color,
                size: 25
            });
            
            // Destacar nó de fim
            network.body.data.nodes.update({
                id: endNodeId,
                color: color,
                borderWidth: 4,
                borderColor: color,
                size: 25
            });
            
            // Destacar nós intermediários com cor mais suave
            for (let i = 1; i < pathNodes.length - 1; i++) {
                const nodeId = pathNodes[i];
                network.body.data.nodes.update({
                    id: nodeId,
                    color: color + '80', // Adicionar transparência
                    borderWidth: 3,
                    borderColor: color,
                    size: 22
                });
            }
            
            // Adicionar informação do caminho
            pathInfo += `Caminho ${index + 1}${index === 0 ? ' (Clássico)' : ''}:\n`;
            pathInfo += `  Rota: ${pathData.path}\n`;
            pathInfo += `  Distância: ${pathData.distance}\n`;
            pathInfo += `  Cor: ${color}\n\n`;
        });
        
        // Criar legenda visual
        createQuantumLegend(quantumPaths, quantumColors);
        
        // Mostrar informações sobre todos os caminhos
        alert(pathInfo);
    }

    // Algoritmo de Yen para encontrar múltiplos caminhos
    function findMultiplePaths(graph, start, end, k) {
        const paths = [];
        
        // Encontrar o caminho mais curto (Dijkstra)
        const { distances, previous } = dijkstra(graph, start, currentNumNodes);
        const shortestPath = getPath(previous, start, end);
        
        if (!shortestPath) {
            return paths; // Não há caminho
        }
        
        // Adicionar o caminho mais curto
        paths.push({
            path: shortestPath,
            distance: distances[end]
        });
        
        // Encontrar k-1 caminhos adicionais
        for (let i = 1; i < k; i++) {
            const nextPath = findNextShortestPath(graph, start, end, paths);
            if (nextPath) {
                paths.push(nextPath);
            } else {
                break; // Não há mais caminhos
            }
        }
        
        return paths;
    }

    // Função para encontrar o próximo caminho mais curto
    function findNextShortestPath(graph, start, end, existingPaths) {
        let bestPath = null;
        let bestDistance = Infinity;
        
        // Estratégia 1: Remover nós intermediários de caminhos existentes
        for (const existingPath of existingPaths) {
            const pathNodes = existingPath.path.split('-').map(Number);
            
            // Para cada nó no caminho (exceto início e fim), tentar desviar
            for (let i = 1; i < pathNodes.length - 1; i++) {
                const deviationNode = pathNodes[i];
                
                // Criar um grafo temporário removendo o nó de desvio
                const tempGraph = JSON.parse(JSON.stringify(graph));
                
                // Remover todas as conexões do nó de desvio
                tempGraph[deviationNode] = {};
                
                // Remover conexões para o nó de desvio
                for (const source in tempGraph) {
                    if (tempGraph[source][deviationNode]) {
                        delete tempGraph[source][deviationNode];
                    }
                }
                
                // Tentar encontrar um caminho alternativo
                const { distances, previous } = dijkstra(tempGraph, start, currentNumNodes);
                const alternativePath = getPath(previous, start, end);
                
                if (alternativePath && distances[end] < bestDistance) {
                    // Verificar se este caminho é diferente dos existentes
                    let isDifferent = true;
                    for (const existingPath of existingPaths) {
                        if (alternativePath === existingPath.path) {
                            isDifferent = false;
                            break;
                        }
                    }
                    
                    if (isDifferent) {
                        bestPath = {
                            path: alternativePath,
                            distance: distances[end]
                        };
                        bestDistance = distances[end];
                    }
                }
            }
        }
        
        // Estratégia 2: Se não encontrou caminho, tentar remover arestas específicas
        if (!bestPath) {
            for (const existingPath of existingPaths) {
                const pathNodes = existingPath.path.split('-').map(Number);
                
                // Para cada aresta no caminho, tentar removê-la
                for (let i = 0; i < pathNodes.length - 1; i++) {
                    const from = pathNodes[i];
                    const to = pathNodes[i + 1];
                    
                    // Criar um grafo temporário removendo a aresta específica
                    const tempGraph = JSON.parse(JSON.stringify(graph));
                    
                    // Remover a aresta em ambas as direções
                    if (tempGraph[from] && tempGraph[from][to]) {
                        delete tempGraph[from][to];
                    }
                    if (tempGraph[to] && tempGraph[to][from]) {
                        delete tempGraph[to][from];
                    }
                    
                    // Tentar encontrar um caminho alternativo
                    const { distances, previous } = dijkstra(tempGraph, start, currentNumNodes);
                    const alternativePath = getPath(previous, start, end);
                    
                    if (alternativePath && distances[end] < bestDistance) {
                        // Verificar se este caminho é diferente dos existentes
                        let isDifferent = true;
                        for (const existingPath of existingPaths) {
                            if (alternativePath === existingPath.path) {
                                isDifferent = false;
                                break;
                            }
                        }
                        
                        if (isDifferent) {
                            bestPath = {
                                path: alternativePath,
                                distance: distances[end]
                            };
                            bestDistance = distances[end];
                        }
                    }
                }
            }
        }
        
        // Estratégia 3: Se ainda não encontrou, tentar usar nós não utilizados
        if (!bestPath) {
            const usedNodes = new Set();
            
            // Coletar todos os nós usados nos caminhos existentes
            for (const existingPath of existingPaths) {
                const pathNodes = existingPath.path.split('-').map(Number);
                pathNodes.forEach(node => usedNodes.add(node));
            }
            
            // Tentar usar nós não utilizados como intermediários
            for (let node = 1; node <= currentNumNodes; node++) {
                if (!usedNodes.has(node) && node !== start && node !== end) {
                    // Verificar se o nó tem conexões
                    if (Object.keys(graph[node]).length > 0) {
                        // Tentar encontrar caminho passando por este nó
                        const { distances: dist1, previous: prev1 } = dijkstra(graph, start, currentNumNodes);
                        const { distances: dist2, previous: prev2 } = dijkstra(graph, node, currentNumNodes);
                        
                        if (dist1[node] !== Infinity && dist2[end] !== Infinity) {
                            const pathToNode = getPath(prev1, start, node);
                            const pathFromNode = getPath(prev2, node, end);
                            
                            if (pathToNode && pathFromNode) {
                                // Combinar os caminhos (remover nó duplicado)
                                const pathToNodeArray = pathToNode.split('-').map(Number);
                                const pathFromNodeArray = pathFromNode.split('-').map(Number);
                                
                                // Remover o nó intermediário duplicado
                                pathFromNodeArray.shift();
                                
                                const combinedPath = [...pathToNodeArray, ...pathFromNodeArray].join('-');
                                const totalDistance = dist1[node] + dist2[end];
                                
                                // Verificar se este caminho é diferente dos existentes
                                let isDifferent = true;
                                for (const existingPath of existingPaths) {
                                    if (combinedPath === existingPath.path) {
                                        isDifferent = false;
                                        break;
                                    }
                                }
                                
                                if (isDifferent && totalDistance < bestDistance) {
                                    bestPath = {
                                        path: combinedPath,
                                        distance: totalDistance
                                    };
                                    bestDistance = totalDistance;
                                }
                            }
                        }
                    }
                }
            }
        }
        
        // Estratégia 4: Se ainda não encontrou, tentar combinações de nós intermediários
        if (!bestPath) {
            // Tentar encontrar caminhos usando múltiplos nós intermediários
            for (let node1 = 1; node1 <= currentNumNodes; node1++) {
                if (node1 === start || node1 === end) continue;
                
                for (let node2 = 1; node2 <= currentNumNodes; node2++) {
                    if (node2 === start || node2 === end || node2 === node1) continue;
                    
                    // Verificar se existe caminho: start -> node1 -> node2 -> end
                    const { distances: dist1, previous: prev1 } = dijkstra(graph, start, currentNumNodes);
                    const { distances: dist2, previous: prev2 } = dijkstra(graph, node1, currentNumNodes);
                    const { distances: dist3, previous: prev3 } = dijkstra(graph, node2, currentNumNodes);
                    
                    if (dist1[node1] !== Infinity && dist2[node2] !== Infinity && dist3[end] !== Infinity) {
                        const pathToNode1 = getPath(prev1, start, node1);
                        const pathNode1ToNode2 = getPath(prev2, node1, node2);
                        const pathNode2ToEnd = getPath(prev3, node2, end);
                        
                        if (pathToNode1 && pathNode1ToNode2 && pathNode2ToEnd) {
                            // Combinar os caminhos
                            const pathToNode1Array = pathToNode1.split('-').map(Number);
                            const pathNode1ToNode2Array = pathNode1ToNode2.split('-').map(Number);
                            const pathNode2ToEndArray = pathNode2ToEnd.split('-').map(Number);
                            
                            // Remover nós duplicados
                            pathNode1ToNode2Array.shift();
                            pathNode2ToEndArray.shift();
                            
                            const combinedPath = [...pathToNode1Array, ...pathNode1ToNode2Array, ...pathNode2ToEndArray].join('-');
                            const totalDistance = dist1[node1] + dist2[node2] + dist3[end];
                            
                            // Verificar se este caminho é diferente dos existentes
                            let isDifferent = true;
                            for (const existingPath of existingPaths) {
                                if (combinedPath === existingPath.path) {
                                    isDifferent = false;
                                    break;
                                }
                            }
                            
                            if (isDifferent && totalDistance < bestDistance) {
                                bestPath = {
                                    path: combinedPath,
                                    distance: totalDistance
                                };
                                bestDistance = totalDistance;
                            }
                        }
                    }
                }
            }
        }
        
        // Estratégia 5: Se ainda não encontrou, tentar caminhos com desvios forçados
        if (!bestPath) {
            // Tentar forçar caminhos através de nós específicos que não estão nos caminhos existentes
            const allNodes = new Set();
            for (let i = 1; i <= currentNumNodes; i++) {
                allNodes.add(i);
            }
            
            // Remover nós já usados
            for (const existingPath of existingPaths) {
                const pathNodes = existingPath.path.split('-').map(Number);
                pathNodes.forEach(node => allNodes.delete(node));
            }
            
            // Para cada nó não utilizado, tentar criar um caminho forçado
            for (const forcedNode of allNodes) {
                if (forcedNode === start || forcedNode === end) continue;
                
                // Criar um grafo que força o caminho através do nó forçado
                const tempGraph = JSON.parse(JSON.stringify(graph));
                
                // Remover todas as conexões diretas entre start e end (se existirem)
                if (tempGraph[start] && tempGraph[start][end]) {
                    delete tempGraph[start][end];
                }
                if (tempGraph[end] && tempGraph[end][start]) {
                    delete tempGraph[end][start];
                }
                
                // Tentar encontrar caminho passando pelo nó forçado
                const { distances: dist1, previous: prev1 } = dijkstra(tempGraph, start, currentNumNodes);
                const { distances: dist2, previous: prev2 } = dijkstra(tempGraph, forcedNode, currentNumNodes);
                
                if (dist1[forcedNode] !== Infinity && dist2[end] !== Infinity) {
                    const pathToForced = getPath(prev1, start, forcedNode);
                    const pathFromForced = getPath(prev2, forcedNode, end);
                    
                    if (pathToForced && pathFromForced) {
                        const pathToForcedArray = pathToForced.split('-').map(Number);
                        const pathFromForcedArray = pathFromForced.split('-').map(Number);
                        
                        pathFromForcedArray.shift();
                        
                        const forcedPath = [...pathToForcedArray, ...pathFromForcedArray].join('-');
                        const totalDistance = dist1[forcedNode] + dist2[end];
                        
                        // Verificar se este caminho é diferente dos existentes
                        let isDifferent = true;
                        for (const existingPath of existingPaths) {
                            if (forcedPath === existingPath.path) {
                                isDifferent = false;
                                break;
                            }
                        }
                        
                        if (isDifferent && totalDistance < bestDistance) {
                            bestPath = {
                                path: forcedPath,
                                distance: totalDistance
                            };
                            bestDistance = totalDistance;
                        }
                    }
                }
            }
        }
        
        return bestPath;
    }

    // Função para criar a legenda dos caminhos quânticos
    function createQuantumLegend(quantumPaths, quantumColors) {
        // Limpar conteúdo anterior
        legendContent.innerHTML = '';
        
        // Adicionar botão para mostrar todos os caminhos
        const showAllButton = document.createElement('button');
        showAllButton.style.cssText = `
            display: flex;
            align-items: center;
            gap: 8px;
            padding: 8px 12px;
            background-color: #34495e;
            color: white;
            border-radius: 4px;
            border: 2px solid #34495e;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            cursor: pointer;
            transition: all 0.3s ease;
            margin: 4px;
            font-family: inherit;
            font-weight: bold;
        `;
        
        showAllButton.onmouseenter = function() {
            this.style.backgroundColor = '#2c3e50';
            this.style.transform = 'translateY(-2px)';
            this.style.boxShadow = '0 4px 8px rgba(0,0,0,0.2)';
        };
        
        showAllButton.onmouseleave = function() {
            this.style.backgroundColor = '#34495e';
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
        };
        
        const showAllText = document.createElement('span');
        showAllText.textContent = 'Mostrar Todos os Caminhos';
        showAllButton.appendChild(showAllText);
        
        showAllButton.addEventListener('click', function() {
            // Restaurar a visualização completa dos caminhos quânticos
            calculateAndHighlightQuantumPaths(
                parseInt(quantumStartNodeSelect.value),
                parseInt(quantumEndNodeSelect.value),
                quantumPaths.length
            );
        });
        
        legendContent.appendChild(showAllButton);
        
        // Adicionar título do ranking
        const rankingTitle = document.createElement('div');
        rankingTitle.style.cssText = `
            font-size: 16px;
            font-weight: bold;
            color: #2c3e50;
            text-align: center;
            margin: 8px 0;
            padding: 8px;
            background-color: #ecf0f1;
            border-radius: 4px;
            border: 2px solid #bdc3c7;
        `;
        rankingTitle.textContent = '🏆 Ranking dos Caminhos (Menor Distância)';
        legendContent.appendChild(rankingTitle);
        
        // Ordenar caminhos por distância para criar o ranking
        const sortedPaths = quantumPaths.map((pathData, index) => ({
            ...pathData,
            originalIndex: index
        })).sort((a, b) => a.distance - b.distance);
        
        // Criar item de legenda para cada caminho (ordenado por ranking)
        sortedPaths.forEach((pathData, rankIndex) => {
            const originalIndex = pathData.originalIndex;
            const color = quantumColors[originalIndex % quantumColors.length];
            
            const legendItem = document.createElement('button');
            legendItem.style.cssText = `
                display: flex;
                align-items: center;
                gap: 8px;
                padding: 8px 12px;
                background-color: white;
                border-radius: 4px;
                border: 2px solid ${color};
                box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                cursor: pointer;
                transition: all 0.3s ease;
                margin: 4px;
                font-family: inherit;
            `;
            
            // Adicionar hover effect
            legendItem.onmouseenter = function() {
                this.style.backgroundColor = color + '20';
                this.style.transform = 'translateY(-2px)';
                this.style.boxShadow = '0 4px 8px rgba(0,0,0,0.2)';
            };
            
            legendItem.onmouseleave = function() {
                this.style.backgroundColor = 'white';
                this.style.transform = 'translateY(0)';
                this.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
            };
            
            // Badge de ranking com medalhas
            const rankBadge = document.createElement('div');
            const medalEmoji = rankIndex === 0 ? '🥇' : rankIndex === 1 ? '🥈' : rankIndex === 2 ? '🥉' : '';
            const badgeText = medalEmoji || (rankIndex + 1);
            
            rankBadge.style.cssText = `
                display: flex;
                align-items: center;
                justify-content: center;
                width: 28px;
                height: 28px;
                border-radius: 50%;
                background-color: ${rankIndex === 0 ? '#f1c40f' : rankIndex === 1 ? '#bdc3c7' : rankIndex === 2 ? '#e67e22' : '#95a5a6'};
                color: white;
                font-size: ${medalEmoji ? '16px' : '12px'};
                font-weight: bold;
                flex-shrink: 0;
                border: 2px solid ${rankIndex === 0 ? '#f39c12' : rankIndex === 1 ? '#7f8c8d' : rankIndex === 2 ? '#d35400' : '#7f8c8d'};
                box-shadow: 0 2px 4px rgba(0,0,0,0.2);
            `;
            rankBadge.textContent = badgeText;
            
            // Círculo colorido
            const colorCircle = document.createElement('div');
            colorCircle.style.cssText = `
                width: 20px;
                height: 20px;
                border-radius: 50%;
                background-color: ${color};
                border: 2px solid ${color};
                flex-shrink: 0;
            `;
            
            // Texto da legenda
            const legendText = document.createElement('span');
            legendText.style.cssText = `
                font-size: 14px;
                font-weight: 500;
                color: #333;
                text-align: left;
                flex-grow: 1;
            `;
            legendText.textContent = `Caminho ${originalIndex + 1}${originalIndex === 0 ? ' (Clássico)' : ''} - ${pathData.distance}`;
            
            // Adicionar evento de clique
            legendItem.addEventListener('click', function() {
                highlightSingleQuantumPath(pathData, color, originalIndex);
            });
            
            legendItem.appendChild(rankBadge);
            legendItem.appendChild(colorCircle);
            legendItem.appendChild(legendText);
            legendContent.appendChild(legendItem);
        });
        
        // Mostrar a legenda
        quantumLegend.style.display = 'block';
    }

    // Função para destacar um caminho quântico individual
    function highlightSingleQuantumPath(pathData, color, pathIndex) {
        if (!network) return;
        
        // Resetar apenas o destaque visual, mantendo a legenda
        resetVisualHighlight();
        
        // Converter o caminho em array de nós
        const pathNodes = pathData.path.split('-').map(Number);
        
        // Destacar as arestas do caminho
        const edges = network.body.data.edges.get();
        highlightedEdges.clear();
        
        for (let i = 0; i < pathNodes.length - 1; i++) {
            const from = pathNodes[i];
            const to = pathNodes[i + 1];
            
            // Procurar a aresta correspondente
            for (const edge of edges) {
                if ((edge.from === from && edge.to === to) || 
                    (edge.from === to && edge.to === from)) {
                    
                    // Destacar a aresta
                    network.body.data.edges.update({
                        id: edge.id,
                        color: {
                            color: color,
                            highlight: color
                        },
                        width: 6,
                        shadow: true
                    });
                    
                    highlightedEdges.add(edge.id);
                    break;
                }
            }
        }
        
        // Destacar os nós do caminho
        for (let i = 0; i < pathNodes.length; i++) {
            const nodeId = pathNodes[i];
            const isStartOrEnd = (i === 0 || i === pathNodes.length - 1);
            
            network.body.data.nodes.update({
                id: nodeId,
                color: isStartOrEnd ? color : color + '80', // Transparência para nós intermediários
                borderWidth: isStartOrEnd ? 4 : 3,
                borderColor: color,
                size: isStartOrEnd ? 25 : 22
            });
        }
        
        // Mostrar informações do caminho selecionado
        const pathType = pathIndex === 0 ? 'Clássico' : 'Alternativo';
        alert(`Caminho ${pathIndex + 1} (${pathType}) selecionado:\n\nRota: ${pathData.path}\nDistância: ${pathData.distance}\nCor: ${color}`);
    }

    // Função para resetar apenas o destaque visual (mantendo a legenda)
    function resetVisualHighlight() {
        if (!network) return;

        // Resetar arestas destacadas
        for (const edgeId of highlightedEdges) {
            network.body.data.edges.update({
                id: edgeId,
                color: {
                    color: '#666',
                    highlight: '#c00'
                },
                width: 2,
                shadow: false
            });
        }
        highlightedEdges.clear();

        // Resetar todos os nós
        const nodes = network.body.data.nodes.get();
        for (const node of nodes) {
            network.body.data.nodes.update({
                id: node.id,
                color: '#3498db',
                borderWidth: 2,
                borderColor: '#2980b9',
                size: 20
            });
        }
    }

    // Função para resetar o destaque (incluindo esconder a legenda)
    function resetHighlight() {
        if (!network) return;

        // Resetar destaque visual
        resetVisualHighlight();
        
        // Esconder legenda
        quantumLegend.style.display = 'none';
    }

    // Exibir resultados na tabela
    function displayResults(results, graph, numNodes) {
        // Armazenar dados globais
        currentResults = results;
        currentGraph = graph;
        currentNumNodes = numNodes;
        
        resultsBody.innerHTML = '';
        
        // Ordenar resultados por origem e depois por destino
        results.sort((a, b) => a.start - b.start || a.end - b.end);
        
        for (const result of results) {
            const row = document.createElement('tr');
            
            const originDestCell = document.createElement('td');
            originDestCell.textContent = `${result.start}-${result.end}`;
            
            const pathCell = document.createElement('td');
            pathCell.textContent = result.path;
            
            const distanceCell = document.createElement('td');
            distanceCell.textContent = result.distance;
            
            row.appendChild(originDestCell);
            row.appendChild(pathCell);
            row.appendChild(distanceCell);
            
            resultsBody.appendChild(row);
        }
        
        // Criar visualização do grafo
        createGraphVisualization(graph, numNodes);
    }
});