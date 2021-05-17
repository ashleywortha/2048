
 /* GAME INFO
 Constructor: takes in single integer representing height/width of board 
 board should also be initialized with 2 random tiles added
 
 Adding tiles: when a new tile is added to the game 90% of being a 2 10% being a 4
 on a random free space on the board new tiles are added when
 1. When the game is first initalized or reset, 2 tiles on the board
 2. a legal move occurs, one tile added 
 
 Moving:
 -legal move that causes pieces to slide or collapse on the baord
 -player tries to make a move that does not change the state on the board 
 - one move causes a 2048 tile to be created, state should reflect that a game is won
 - no legal moves avalible, should reflect a game over
 
 Events: game objects are observable supporting move, win, lose*/
 
 export default class Game{
    constructor(num){
        this.num = num;
        let board = boardMaker(this.num);
        this.board = board;
        this.score = 0;
        this.won = false;
        this.over = false;

        this.gameState = this.getGameState();

        this.flipped = false;
        this.rotated = false;

        this.moves=[];
        this.winner=[];
        this.loser=[];
       
    }

    getBoard(){return this.board;}
    getNum(){return this.num;}

   onMove(callback){
       let idx = this.moves.findIndex((l) => l === callback);
       if(idx === -1){
           this.moves.push(callback);
       }
       
   }
   onLose(callback){
       //this.moves.push(callback);
       let idx = this.loser.findIndex((l) => l === callback);
       if(idx === -1){
           this.loser.push(callback);
       }
   }
   onWin(callback){
       let idx = this.winner.findIndex((l) => l === callback);
       if(idx === -1){
           this.winner.push(callback);
       }
   }
   setupNewGame(){
       this.board = boardMaker(this.num);
       this.score = 0;
       this.won = false;
       this.over = false;
   };
   loadGame(gameState){
       this.board = doubleArray(gameState.board, Math.sqrt(gameState.board.length));
       this.score = gameState.score;
       this.won = gameState.won;
       this.over = gameState.over;
   };
   getGameState(){
       let gameState ={
           board: singleArray(this.board),
           score: this.score,
           won: this.won,
           over:this.over
       }
       return gameState;
   }
   toString(){
       return (this.board).toString();
   }
   move(direction){
       if (direction === 'right'){
          combMove(this.board, this); 

       } else if (direction === 'left'){
           flip(this.board);
           this.flipped = true;
           combMove(this.board, this);

       } else if (direction === 'down'){
           rotate(this.board);
           this.rotated = true;
           combMove(this.board, this);

       } else if (direction === 'up'){
           rotate(this.board);
           this.rotated = true;
           flip(this.board);
           this.flipped = true;
           combMove(this.board, this);
       } 
       this.moves.forEach((l)=> l(this));
   };

}

//main functions
function boardMaker(num){
   let board = [];
   for(let i=0; i<num; i++){
       board[i] = [];
       for(let j=0; j<num; j++){
           board[i][j] = 0;
       }
   }
   newSquare(board, num);
   newSquare(board, num) ;
   return board;

}

function combMove(board, game){
   let past = copyGrid(board);
   for(let i=0; i<board.length; i++){
       board[i] = operate(board[i], game);
   }
   let changed = compare(past, board);
   if(game.flipped){
       flip(board);
       game.flipped = false;
   }
   if(game.rotated){
       rotate(board);
       game.rotated = false;
   }
   
   if(changed){
       newSquare(board, board.length);
      
   }
   overCheck(game);

}

//helper functions
function newSquare(board, num){
   let options = [];
   for(let i=0; i< num; i++){
       for(let j =0; j<num; j++){
           if(board[i][j] ===0){
               options.push({
                   x:i,
                   y:j
               });
           }
       }
   }
   if(options.length > 0);
   let spot = options[Math.floor(Math.random()*options.length)];
   let r = Math.random();
   board[spot.x][spot.y] = r > 0.9 ? 4 : 2;
}

function singleArray(board){
   let single = [];
   for(let i=0; i< board.length; i++){
       for(let j =0; j<board.length; j++){
           single.push(board[i][j]);
       }
   }
   return single;
}

function doubleArray(board,num){
   let double = [];
   for(let i=num-1; i>=0; i--){
       double[i] = [];
       for(let j=num-1; j>=0; j--){
           double[i][j] = board.pop();
       }
   }
   return double;
}


//making new array
function slide(row){
   let arr = row.filter(val => val);
   let missing = 4 - arr.length;
   let zeros = Array(missing).fill(0);
   arr = zeros.concat(arr);
   return arr;
}
//operating on array itself
function combine(row, game){
   for(let i=row.length-1; i>=1; i--){
       let a =row[i];
       let b = row[i-1];
       if(a===b){
           row[i] = a + b;
           row[i-1] = 0;
           game.score = game.score + a +b;
           if(a+b === 2048){
               game.won = true;
               game.winner.forEach((l)=> l(game));
           }
       }
   }
   return row;
}

function operate(row, game){
   row = slide(row);
   row = combine(row, game);
   row = slide(row);
   return row;
}
function copyGrid(grid){
   let extra = boardMaker(grid.length);
   for(let i=0; i<4; i++){
       for(let j=0; j<4;j++){
           extra[i][j] = grid[i][j];
       }
   }
   return extra;
}
function compare(a, b){
   for(let i=0; i<b.length; i++){
       for(let j=0; j<b.length;j++){
           if(a[i][j] !== b[i][j]){
               return true;
           }
       }
   }
   return false;
}

function flip(board){
   for(let i=0; i < board.length; i++){
       board[i].reverse();
   }
   return board;
}
function rotate(board){
   let rBoard = copyGrid(board);
   for(let i=0; i<board.length; i++){
       for(let j=0; j<board.length; j++){
           board[i][j] = rBoard[j][i];
       }
   }
   return board;
}

function overCheck(game){
   let test = copyGrid(game.board);
   let left = flip(test);
   let up = rotate(test);
   let down = flip(up);
   
   for(let i=0; i< game.num; i++){
       for(let j =0; j<game.num; j++){
           if(game.board[i][j] === 0){return;}
           if(game.board[i][j] === game.board[i][j+1]){return;}
           if(left[i][j] === left[i][j+1]){return;}
           if(up[i][j] === up[i][j+1]){return;}
           if(down[i][j] === down[i][j+1]){return;}
       }
   }
   game.over = true;
   game.loser.forEach((l)=> l(game));

   
}






