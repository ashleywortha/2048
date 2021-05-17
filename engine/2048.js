import Game from "../engine/game.js";

let model = new Game(4);

    

    function createBoard(model){
        const gridDisplay = document.getElementById('grid')
        const width = model.num;
        let squares =[];
        for (let i=0; i<width*width; i++){
            let square = document.createElement('div')
            square.innerHTML = model.getGameState().board[i];
            gridDisplay.appendChild(square)
        }
    }


model.onLose( model => {
    document.getElementById("result").innerHTML = "you lose :("
})

model.onWin( model => {
    document.getElementById("result").innerHTML = "winner winner chicken dinner >:)"
})

model.onMove(model =>{
    document.getElementById("root").innerHTML = renderGame(model);
    document.getElementById("grid").innerHTML = " "
    createBoard(model);
})

export const renderGame = function(model){
    return`
    <div class="scores"><p> score: ${model.score}<p>
    <button class="newGame"> New Game </button></div>`
}

export const handleKeyInput = function(event){
    event.preventDefault();
    switch (event.keyCode) {
        case 39:
            model.move('right');
            break;
        case 37:
            model.move('left');

            break;
        case 40:
            model.move('down');

            break;
        case 38:
            model.move('up');
            break;
    }

}

export const handleClearButtonPress = function(event){
    event.preventDefault();
    let newGame = new Game(4);
    document.getElementById('root').innerHTML = renderGame(newGame);
    document.getElementById('result').innerHTML = " ";
    document.getElementById("grid").innerHTML = " "
    createBoard(newGame);
    return false;
}

export const gameIntoDOM = function(model){
    const $root = $('#root');
    $root.append(renderGame(model));
    $('#grid').append(createBoard(model));
    $root.on("click", $('.newGame'), handleClearButtonPress);
    $(document).on("keydown", handleKeyInput);
}

$(function(){
    gameIntoDOM(model)
});


