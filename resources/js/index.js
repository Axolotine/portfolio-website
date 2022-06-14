const genBtn = document.getElementById("generate-button");
const mapSq = document.getElementById("map-area");

genBtn.addEventListener("click", () => {
    mapSq.innerHTML = '';
    
    const worldX = 30;
    const worldY = 20;
    
    let world = generateWorld(worldX, worldY);

    for (let i = 0; i < worldY; i++){
        for (let j = 0; j < worldX; j++){
            const currentSq = world[j][i];
            const span = document.createElement('span');
            let eeby = mapSq.appendChild(span);
            eeby.innerHTML = currentSq.glyph;
            eeby.style.color = currentSq.color;
        }
        const br = document.createElement('br');
        mapSq.appendChild(br);
    }
});