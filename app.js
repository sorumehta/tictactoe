const X = "X"
const O = "Y"

const Player = (s) => {
    const sign = s
    let wins = 0
    const makeMove = (idx) => {
        Gameboard.play(idx, sign)
    }

    const getsign = () => { 
        return sign
    }
    const getWins = () => { 
        return wins
    }
    const incrementWins = () => {
        wins++;
    }

    return { makeMove, getsign, incrementWins, getWins}
}

const Gameboard = (() => {
    let board = new Array(9).fill("")
    const play = (idx, sign) => {
        board[idx] = sign
        console.log(`index ${idx} marked as ${sign}`)
    }

    const getAllIndexes = (val) => {
        let indexes = [], i;
        for(i = 0; i < board.length; i++)
            if (board[i] === val)
                indexes.push(i);
        return indexes;
    }
    
    const checkWin = (sign) => {
        const sign_indices = getAllIndexes(sign)
        console.log(`sign_indices for ${sign} returned: ${sign_indices}`)
        const winConditions = [
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8],
            [0, 4, 8],
            [2, 4, 6],
          ];
        
        for(let i = 0; i < winConditions.length; i++){
            let success = winConditions[i].every((val) => sign_indices.includes(val))
            if (success){
                console.log(`Congrats, player ${sign}, you won with pattern ${winConditions[i]}`)
                return true;
            }
        }
        console.log("calm your tits, no one won yet")
        return false;
        
    }

    const reset = () => {
        for (let i = 0; i < board.length; i++) {
          board[i] = "";
        }
    }

    const printBoard = () => {
        console.log(`Board: ${board}`)
    }

    const getField =(idx) => {
        return board[idx]
    }

    return {play, checkWin, printBoard, reset, getField}
})()

const gameController = (() => {
    const playerOne = Player(X)
    const playerTwo = Player(O)
    let gameEnded = false
    let turn = 1
    let winningPlayer = null
    const startGame = () => {
        Gameboard.reset()
        turn = 1
        gameEnded = false
        console.log(`Started new game`)
    }
    const markSign = (idx) => {
        let player = getCurrentPlayer()
        player.makeMove(idx)
        Gameboard.printBoard()
        isWon = Gameboard.checkWin(player.getsign())
        if(isWon){
            endGame()
            winningPlayer = player.getsign()
        }
        else{
            turn++
            console.log("turn = ",turn)
        }
        
    }

    const getWinningPlayerName = () => {
        return winningPlayer
    }

    const getCurrentPlayer = () => {
        if (turn%2 === 0){
            return playerTwo
        } else {
            return playerOne
        }
    }

    const endGame =() => {
        console.log("The game is complete, thank you for playing")
        gameEnded = true
    }

    const getGameEnded = () => {
        return gameEnded
    }

    return {startGame, markSign, getGameEnded, getCurrentPlayer, getWinningPlayerName}
})();





const displayController = (() => {
    const fieldElements = document.querySelectorAll(".field");
    const messageElement = document.getElementById("message");
    const restartButton = document.getElementById("restart-button");
  
    fieldElements.forEach((field) =>
      field.addEventListener("click", (e) => {
        console.log(`recieved click event on ${e.target.dataset.index}`)
        if (gameController.getGameEnded() || e.target.textContent != "" ) return;
        gameController.markSign(parseInt(e.target.dataset.index));
        setMessageElement(`Player ${gameController.getCurrentPlayer().getsign()}'s turn`)
        updateGameboard()
      })
    )

    restartButton.addEventListener("click", (e) => {
        gameController.startGame()
        updateGameboard()
        setMessageElement(`Player ${gameController.getCurrentPlayer().getsign()}'s turn`)
    })

    const setMessageElement = (message) => {
        messageElement.textContent = message;
    };

    const updateGameboard = () => {
        for (let i = 0; i < fieldElements.length; i++) {
          fieldElements[i].textContent = Gameboard.getField(i);
        }
        if(gameController.getGameEnded()){
            messageElement.textContent = `Bow down, player ${gameController.getWinningPlayerName()} has won the game. `
        }
      };

    })()
