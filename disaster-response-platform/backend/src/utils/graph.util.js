class PriorityQueue {
    constructor() {
        this.values = [];
    }
    
    enqueue(val, priority) {
        this.values.push({ val, priority });
        this.sort();
    }
    
    dequeue() {
        return this.values.shift();
    }
    
    sort() {
        this.values.sort((a, b) => a.priority - b.priority);
    }
    
    isEmpty() {
        return this.values.length === 0;
    }
}

class Graph {
    constructor() {
        this.adjacencyList = {};
    }

    addVertex(vertex) {
        if (!this.adjacencyList[vertex]) {
            this.adjacencyList[vertex] = [];
        }
    }

    addEdge(vertex1, vertex2, weight, isBlocked = false) {
        this.adjacencyList[vertex1].push({ node: vertex2, weight, isBlocked });
        this.adjacencyList[vertex2].push({ node: vertex1, weight, isBlocked }); // Undirected
    }

    blockEdge(vertex1, vertex2) {
        const edge1 = this.adjacencyList[vertex1].find(e => e.node === vertex2);
        const edge2 = this.adjacencyList[vertex2].find(e => e.node === vertex1);
        if (edge1) edge1.isBlocked = true;
        if (edge2) edge2.isBlocked = true;
    }

    dijkstra(start, finish) {
        const nodes = new PriorityQueue();
        const distances = {};
        const previous = {};
        let path = [];
        let smallest;

        // Build initial state
        for (let vertex in this.adjacencyList) {
            if (vertex === start) {
                distances[vertex] = 0;
                nodes.enqueue(vertex, 0);
            } else {
                distances[vertex] = Infinity;
                nodes.enqueue(vertex, Infinity);
            }
            previous[vertex] = null;
        }

        while (!nodes.isEmpty()) {
            smallest = nodes.dequeue().val;

            if (smallest === finish) {
                // We are done, build path to return
                while (previous[smallest]) {
                    path.push(smallest);
                    smallest = previous[smallest];
                }
                break;
            }

            if (smallest || distances[smallest] !== Infinity) {
                for (let neighbor of this.adjacencyList[smallest]) {
                    if (neighbor.isBlocked) continue; // Skip blocked roads

                    let candidate = distances[smallest] + neighbor.weight;
                    let nextNeighbor = neighbor.node;

                    if (candidate < distances[nextNeighbor]) {
                        distances[nextNeighbor] = candidate;
                        previous[nextNeighbor] = smallest;
                        nodes.enqueue(nextNeighbor, candidate);
                    }
                }
            }
        }
        
        return path.concat(start).reverse();
    }
    
    bfs(start, finish) {
        const queue = [start];
        const visited = { [start]: true };
        const previous = {};
        
        while(queue.length) {
            let current = queue.shift();
            
            if (current === finish) {
                let path = [];
                let curr = finish;
                while(curr) {
                    path.push(curr);
                    curr = previous[curr];
                }
                return path.reverse();
            }
            
            for(let neighbor of this.adjacencyList[current]) {
                if(!visited[neighbor.node] && !neighbor.isBlocked) {
                    visited[neighbor.node] = true;
                    previous[neighbor.node] = current;
                    queue.push(neighbor.node);
                }
            }
        }
        return [];
    }
}

// Generate mock graph
const mockGraph = new Graph();
['A', 'B', 'C', 'D', 'E', 'F'].forEach(v => mockGraph.addVertex(v));
mockGraph.addEdge('A', 'B', 4);
mockGraph.addEdge('A', 'C', 2);
mockGraph.addEdge('B', 'E', 3);
mockGraph.addEdge('C', 'D', 2);
mockGraph.addEdge('C', 'F', 4);
mockGraph.addEdge('D', 'E', 3);
mockGraph.addEdge('D', 'F', 1);
mockGraph.addEdge('E', 'F', 1);

module.exports = { Graph, mockGraph };
