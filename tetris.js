var canvas = document.getElementById('tetris');
var context = canvas.getContext('2d');
context.scale(20, 20);
function arenaSweep() {
    var rowCount = 1;
    outer: for (var y = arena.length - 1; y > 0; --y) {
        for (var x = 0; x < arena[y].length; ++x) {
            if (arena[y][x] === 0) {
                continue outer;
            }
        }
        var row = arena.splice(y, 1)[0].fill(0);
        arena.unshift(row);
        ++y;
        player.score += rowCount * 10;
        rowCount *= 2;
    }
}
function collide(arena, player) {
    var m = player.matrix;
    var o = player.pos;
    for (var y = 0; y < m.length; ++y) {
        for (var x = 0; x < m[y].length; ++x) {
            if (m[y][x] !== 0 &&
                (arena[y + o.y] &&
                    arena[y + o.y][x + o.x]) !== 0) {
                return true;
            }
        }
    }
    return false;
}
function createMatrix(w, h) {
    var matrix = [];
    while (h--) {
        matrix.push(new Array(w).fill(0));
    }
    return matrix;
}
function createPiece(type) {
    if (type === 'I') {
        return [
            [0, 1, 0, 0],
            [0, 1, 0, 0],
            [0, 1, 0, 0],
            [0, 1, 0, 0],
        ];
    }
    else if (type === 'L') {
        return [
            [0, 2, 0],
            [0, 2, 0],
            [0, 2, 2],
        ];
    }
    else if (type === 'J') {
        return [
            [0, 3, 0],
            [0, 3, 0],
            [3, 3, 0],
        ];
    }
    else if (type === 'O') {
        return [
            [4, 4],
            [4, 4],
        ];
    }
    else if (type === 'Z') {
        return [
            [5, 5, 0],
            [0, 5, 5],
            [0, 0, 0],
        ];
    }
    else if (type === 'S') {
        return [
            [0, 6, 6],
            [6, 6, 0],
            [0, 0, 0],
        ];
    }
    else if (type === 'T') {
        return [
            [0, 7, 0],
            [7, 7, 7],
            [0, 0, 0],
        ];
    }
}
function drawMatrix(matrix, offset) {
    matrix.forEach(function (row, y) {
        row.forEach(function (value, x) {
            if (value !== 0) {
                context.fillStyle = colors[value];
                context.fillRect(x + offset.x, y + offset.y, 1, 1);
            }
        });
    });
}
function draw() {
    context.fillStyle = '#000';
    context.fillRect(0, 0, canvas.width, canvas.height);
    drawMatrix(arena, { x: 0, y: 0 });
    drawMatrix(player.matrix, player.pos);
}
function merge(arena, player) {
    player.matrix.forEach(function (row, y) {
        row.forEach(function (value, x) {
            if (value !== 0) {
                arena[y + player.pos.y][x + player.pos.x] = value;
            }
        });
    });
}
function rotate(matrix, dir) {
    for (var y = 0; y < matrix.length; ++y) {
        for (var x = 0; x < y; ++x) {
            _a = [
                matrix[y][x],
                matrix[x][y],
            ], matrix[x][y] = _a[0], matrix[y][x] = _a[1];
        }
    }
    if (dir > 0) {
        matrix.forEach(function (row) { return row.reverse(); });
    }
    else {
        matrix.reverse();
    }
    var _a;
}
function playerDrop() {
    player.pos.y++;
    if (collide(arena, player)) {
        player.pos.y--;
        merge(arena, player);
        playerReset();
        arenaSweep();
        updateScore();
    }
    dropCounter = 0;
}
function playerMove(offset) {
    player.pos.x += offset;
    if (collide(arena, player)) {
        player.pos.x -= offset;
    }
}
function playerReset() {
    var pieces = 'TJLOSZI';
    player.matrix = createPiece(pieces[pieces.length * Math.random() | 0]);
    player.pos.y = 0;
    player.pos.x = (arena[0].length / 2 | 0) -
        (player.matrix[0].length / 2 | 0);
    if (collide(arena, player)) {
        arena.forEach(function (row) { return row.fill(0); });
        player.score = 0;
        updateScore();
    }
}
function playerRotate(dir) {
    var pos = player.pos.x;
    var offset = 1;
    rotate(player.matrix, dir);
    while (collide(arena, player)) {
        player.pos.x += offset;
        offset = -(offset + (offset > 0 ? 1 : -1));
        if (offset > player.matrix[0].length) {
            rotate(player.matrix, -dir);
            player.pos.x = pos;
            return;
        }
    }
}
var dropCounter = 0;
var dropInterval = 1000;
var lastTime = 0;
function update(time) {
    if (time === void 0) { time = 0; }
    var deltaTime = time - lastTime;
    dropCounter += deltaTime;
    if (dropCounter > dropInterval) {
        playerDrop();
    }
    lastTime = time;
    draw();
    requestAnimationFrame(update);
}
function updateScore() {
    document.getElementById('score').innerText = player.score;
}
document.addEventListener('keydown', function (event) {
    if (event.keyCode === 37) {
        playerMove(-1);
    }
    else if (event.keyCode === 39) {
        playerMove(1);
    }
    else if (event.keyCode === 40) {
        playerDrop();
    }
    else if (event.keyCode === 81) {
        playerRotate(-1);
    }
    else if (event.keyCode === 87) {
        playerRotate(1);
    }
});
var colors = [
    null,
    '#FF0D72',
    '#0DC2FF',
    '#0DFF72',
    '#F538FF',
    '#FF8E0D',
    '#FFE138',
    '#3877FF',
];
var arena = createMatrix(12, 20);
var player = {
    pos: { x: 0, y: 0 },
    matrix: null,
    score: 0
};
playerReset();
updateScore();
update();
