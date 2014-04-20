var mouseCollidable = [];


function MouseCollideable(x, y, w, h) {
    this.x = x || 0;
    this.y = y || 0;
    this.w = w || 0;
    this.h = h || 0;
    mouseCollidable.push(this);

}

MouseCollideable.onDrag = function(e) { };
MouseCollideable.onClick = function(e) {  };
MouseCollideable.onRelease = function(e) { };

function collides(x, y) {
    var isCollision = false;

    for (var i = 0; i < mouseCollidable.length; i++) {
        if (collidedWith(mouseCollidable[i], x, y)) {
            isCollision = mouseCollidable[i];
        }
    }
    return isCollision;
}

function collidedWith(value, x, y) {
    return (x <= value.x + value.w &&
                x >= value.x && 
                y <= value.y + value.h  && 
                y >= value.y );
}