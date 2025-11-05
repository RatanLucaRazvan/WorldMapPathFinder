const gridRows = 150;
const gridCols = 230;
const cellSize = 5;
const noiseScale = 0.1;

let worldMap = [];
let startNode = null;
let endNode = null;
let currentPath = [];
let findPathButton;

let waterColor, beachColor, forestColor, grassColor, mountainColor, snowyTopColor;

function setup(){
    let canvas = createCanvas(gridCols * cellSize, gridRows * cellSize);
    canvas.parent('canvas_container');

    waterColor = color(0, 0, 200);
    beachColor = color(240, 230, 140);
    grassColor = color(0, 150, 0);
    forestColor = color(34, 100, 34);
    mountainColor = color(114, 114, 114);
    peakColor = color(58, 58, 58);
    snowColor = color(255, 255, 255);

    findPathButton = document.getElementById('btn_path');
    let newMapButton = document.getElementById('btn_map');
    let clearButton = document.getElementById('btn_clear');
    clearButton.addEventListener('click', () => {
        startNode = null;
        endNode = null;
        currentPath = [];
        findPathButton.disabled = true;
    });
    newMapButton.addEventListener('click', () => location.reload());
    findPathButton.addEventListener('click', () => {
        if(startNode && endNode){
            findPath(startNode, endNode);
        }
    });
    generateMap();
}


function mousePressed(){
    if(mouseX < 0 || mouseX > width || mouseY < 0 || mouseY > height){
        return;
    }

    let gridX = floor(mouseX / cellSize);
    let gridY = floor(mouseY / cellSize);

    if(worldMap[gridX][gridY].cost === Infinity){
        alert("Cannot select a water location! Have a deathwish or what?");
        return;
    }

    if(startNode === null){
        startNode = { x: gridX, y: gridY};
        endNode = null;
        currentPath = [];
        findPathButton.disabled = true;
    } else if(endNode === null){
        endNode = { x: gridX, y: gridY};
        findPathButton.disabled = false;
    } else if(startNode !== null && endNode !== null){
        startNode = { x: gridX, y: gridY};
        endNode = null;
        currentPath = [];
        findPathButton.disabled = true;
    }
}

function generateMap(){
    worldMap = [];
    let noiseValues = []
    let minNoise = Infinity;
    let maxNoise = -Infinity;

    for (let x = 0; x < gridCols; x++) {
        noiseValues[x] = [];
        for (let y = 0; y < gridRows; y++) {
            let noiseVal = noise(x * noiseScale, y * noiseScale);
            
            noiseValues[x][y] = noiseVal;
            
            if (noiseVal < minNoise) minNoise = noiseVal;
            if (noiseVal > maxNoise) maxNoise = noiseVal;
        }
    }

    for (let x = 0; x < gridCols; x++) {
        worldMap[x] = [];
        for (let y = 0; y < gridRows; y++) {
            
            let noiseVal = noiseValues[x][y];
            
            let normalizedNoise = map(noiseVal, minNoise, maxNoise, 0, 1);
            
            let terrain;
            if (normalizedNoise < 0.2) {
                terrain = {
                    type: 'water',
                    color: waterColor,
                    cost: Infinity
                };
            } else if (normalizedNoise < 0.3) {
                terrain = {
                    type: 'beach',
                    color: beachColor,
                    cost: 2
                };
            } else if (normalizedNoise < 0.5) {
                terrain = {
                    type: 'grassland',
                    color: grassColor,
                    cost: 1
                };
            } else if (normalizedNoise < 0.6) {
                terrain = {
                    type: 'forest',
                    color: forestColor,
                    cost: 3
                };
            } else if (normalizedNoise < 0.75) {
                terrain = {
                    type: 'mountain',
                    color: mountainColor,
                    cost: 5
                };
            } else if (normalizedNoise < 0.85) {
                terrain = {
                    type: 'peak',
                    color: peakColor,
                    cost: 8
                };
            } else {
                terrain = {
                    type: 'snowy top',
                    color: snowColor,
                    cost: 10
                };
            }
            worldMap[x][y] = terrain;
        }
    }
}

function draw(){
    for(let x = 0; x < gridCols; x++){
        for(let y = 0; y < gridRows; y++){
            let terrain = worldMap[x][y];
            fill(terrain.color);
            // stroke(0); // can be uncommented to see grid lines
            // strokeWeight(1); // can be uncommented to see grid lines
            noStroke(); // comment this line to see grid lines
            rect(x * cellSize, y * cellSize, cellSize, cellSize);
        }
    }

    if(startNode !== null){
        fill(255, 0, 0);
        circle(startNode.x * cellSize + cellSize / 2, startNode.y * cellSize + cellSize / 2, cellSize); 
    }

    if(endNode !== null){
        fill(0, 0, 255);
        circle(endNode.x * cellSize + cellSize / 2, endNode.y * cellSize + cellSize / 2, cellSize);
    }

    if (currentPath.length > 0) {
        stroke(255, 0, 0);
        strokeWeight(3);
        noFill();
        
        beginShape();
        for (let node of currentPath) {
        vertex(node.x * cellSize + cellSize / 2, node.y * cellSize + cellSize / 2);
        }
        endShape();
    }
}