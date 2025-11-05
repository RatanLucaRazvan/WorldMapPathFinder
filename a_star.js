// A* search algorithm implementation

function findPath(start, end){
    let searchGrid = [];
    for(let x = 0; x < gridCols; x++){
        searchGrid[x] = [];
        for(let y = 0; y < gridRows; y++){  
            searchGrid[x][y] = {
                x: x,
                y: y,
                gCost: Infinity,
                hCost: 0,
                fCost: Infinity,
                parent: null,
                terrain: worldMap[x][y]
            };
        }
    }

    let unvisited = new PriorityQueue();
    let visited = new Set();

    let startCell = searchGrid[start.x][start.y];
    startCell.gCost = 0;
    startCell.hCost = abs(start.x - end.x) + abs(start.y - end.y)
    startCell.fCost = startCell.gCost + startCell.hCost;

    unvisited.enqueue(startCell);
    while(!unvisited.isEmpty()){
        let current = unvisited.dequeue();

        if(visited.has(current)){
            continue;
        }

        if (current.x === end.x && current.y === end.y){
            currentPath = [];
            let temp = current;
            while(temp.parent !== null){
                currentPath.push(temp);
                temp = temp.parent;
            }
            currentPath.push(startCell);
            currentPath.reverse();
            return;
        }

        visited.add(current);

        let neighbors = getNeighbors(searchGrid, current);
        for(let neighbor of neighbors){
            if(visited.has(neighbor) || neighbor.terrain.cost === Infinity){
                continue;
            }

            let newGCost = current.gCost + neighbor.terrain.cost;

            if(newGCost < neighbor.gCost){
                neighbor.gCost = newGCost;
                neighbor.hCost = abs(neighbor.x - end.x) + abs(neighbor.y - end.y);
                neighbor.fCost = neighbor.gCost + neighbor.hCost;
                neighbor.parent = current;

                unvisited.enqueue(neighbor);
            }
        }
    }
    alert("There is no possible path between the selected points.");
    currentPath = [];
}

function getNeighbors(grid, node){
    let neighbors = [];
    for(let dx = -1; dx <= 1; dx++){
        for(let dy = -1; dy <= 1; dy++){
            if(dx === 0 && dy === 0){
                continue;
            }
            let x = node.x + dx;
            let y = node.y + dy;

            if(x >= 0 && x < gridCols && y >= 0 && y < gridRows){
                neighbors.push(grid[x][y]);
            }
        }
    }
    console.log("Neighbors: ", neighbors);
    return neighbors;
}