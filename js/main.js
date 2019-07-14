
$(document).ready(function () {
    var board = null
    var game = new Chess()
    var whiteSquareGrey = '#a9a9a9'
    var blackSquareGrey = '#696969'


    //game visualization & handling
    //highlight legal moves only
    function removeGreySquares() {
        $('#myBoard .square-55d63').css('background', '')
    }

    function greySquare(square) {
        var $square = $('#myBoard .square-' + square)

        var background = whiteSquareGrey
        if ($square.hasClass('black-3c85d')) {
            background = blackSquareGrey
        }

        $square.css('background', background)
    }

    function onMouseoverSquare(square, piece) {
        // get list of possible moves for this square
        var moves = game.moves({
            square: square,
            verbose: true,
        })

        // exit if there are no moves available for this square
        if (moves.length === 0) {
            return
        }

        // highlight the square they moused over
        greySquare(square)

        // highlight the possible squares for this piece
        for (var i = 0; i < moves.length; i++) {
            greySquare(moves[i].to)
        }
    }

    function onMouseoutSquare(square, piece) {
        removeGreySquares()
    }


    function onDragStart(source, piece, position, orientation) {
        // do not pick up pieces if the game is over
        // if (game.game_over()) {
        //     alert('alert');
        //       return false
        // }

        /* board visualization and games state handling */


        if (game.in_checkmate() === true || game.in_draw() === true ||
            piece.search(/^b/) !== -1) {
            return false;
        }

        // only pick up pieces for White
        if (piece.search(/^b/) !== -1) return false
    }



    //make random moves
    function makeRandomMove() {
        var possibleMoves = game.moves()

        // game over
        if (possibleMoves.length === 0) return

        var randomIdx = Math.floor(Math.random() * possibleMoves.length)
        game.move(possibleMoves[randomIdx])
        board.position(game.fen())

    }

    function onDrop(source, target) {
        removeGreySquares()
        // see if the move is legal
        var move = game.move({
            from: source,
            to: target,
            promotion: 'q' // NOTE: always promote to a queen for example simplicity
        })

        // illegal move
        if (move === null) return 'snapback'
        //updateStatus()

        // make random legal move for black
        window.setTimeout(makeRandomMove, 250)

        

    }

    // update the board position after the piece snap
    // for castling, en passant, pawn promotion
    function onSnapEnd() {
        board.position(game.fen())
    }

    function onMoveEnd(oldPos, newPos) {
        console.log('Move animation complete:')
        console.log('Old position: ' + Chessboard.objToFen(oldPos))
        console.log('New position: ' + Chessboard.objToFen(newPos))
        console.log('~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~')
        console.log(game.ascii())
        $('#status').html('Old position: ' + Chessboard.objToFen(oldPos))
        $('#fen').html(Chessboard.objToFen(newPos))
        /*if (game.game_over()) {
            alert('end')
            ('#status').html('<strong>game over</strong>')
            
        }*/

    }

    //configure board
    var config = {
        position: '',
        draggable: true,
        dropOffBoard: 'snapback',
        sparePieces: true,
        showNotation: true,
        orientation: 'white',
        onDragStart: onDragStart,
        onDrop: onDrop,
        onMoveEnd: onMoveEnd,
        onMouseoutSquare: '',
        onMouseoverSquare: '',
        onSnapEnd: onSnapEnd

    }
    board = Chessboard('myBoard', config),

        //strat btn function
        $('#startBtn').click(function () {
            board.start(),
                board.position(game.reset()),
                config.onMouseoutSquare = onMouseoutSquare,
                config.onMouseoverSquare = onMouseoverSquare
        });

    $('#clearBtn').click(function () {
        board.clear(),
            board.position(game.reset()),
            config.onMouseoutSquare = '',
            config.onMouseoverSquare = ''
    });
    $('#toggleBtn').on('click', board.flip)

}); //do not erase end of document ready func