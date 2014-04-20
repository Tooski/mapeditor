
var buttonSize = 75;

this.terrainList = [];

var button;
var buttonList = [];

// Button dimensions, if user is clicking in this area it will check to see
// if a button has been clicked.
var buttonListStart = new vec2(0,0), buttonListEnd = new vec2(0,0);
function MapEditorButton(name, x, y, w, h) {
    this.name = name;
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.isSelected = false;
    
    var that = this;
    new MouseCollideable(this.x,this.y,this.w,this.h).onClick = function(e) {
        that.isSelected = button ? !(button.isSelected = false) : true;
        button = that;
    };
    if(buttonListStart.x > this.x) buttonListStart.x = this.x;
    if(buttonListEnd.x < this.x + this.w) buttonListEnd.x = this.x + this.w;
    if(buttonListStart.y > this.y) buttonListStart.x = this.x;
    if(buttonListEnd.y < this.y + this.h) buttonListEnd.y = this.y + this.h;
    buttonList.push(this);
}

MapEditorButton.onClick = function(e){};
MapEditorButton.onDrag = function(e){};
MapEditorButton.onRelease = function(e){};

function MapEditor(canvas) {
  
    var line = new MapEditorButton("Lines", 0, 0, buttonSize, buttonSize);
    line.onClick = function(e) {
        if(!this.line) {
            this.line = new TerrainLine(new vec2(e.offsetX,e.offsetY), new vec2(e.offsetX,e.offsetY));
            pushTerrain(this.line);
            button.isSelected = false;
        } else {
            snapTo(this.line);
            this.normal = this.line;
            button = this.line = null;
        }
    };
    line.onDrag = function(e) {
        if(this.line) {
           var mousePos = getMousePos(canvas, e);
           this.line.p1edit.x = (this.line.p1.x = mousePos.x) - this.line.p1edit.w/2;
           this.line.p1edit.y = (this.line.p1.y = mousePos.y) - this.line.p1edit.h/2;
        }
        if(this.normal) {
           var mousePos = getMousePos(canvas, e);
           this.normal.p1edit.x = (this.normal.p1.x = mousePos.x) - this.normal.p1edit.w/2;
           this.normal.p1edit.y = (this.normal.p1.y = mousePos.y) - this.normal.p1edit.h/2;
        }
    };
    line.onRelease = function(e) {
        if(this.line && this.line.p1.x !== this.line.p0.x && this.line.p1.y !== this.line.p0.y) {
             button = this.line = null;
        }
    };

 
 
    
    var t1 = new TerrainLine(new vec2(200,200+50), new vec2(200+250,200+150));
    var t2 = new TerrainLine(new vec2(200,200+50), new vec2(200+250,200-150));
    
    pushTerrain(t1);
    pushTerrain(t2);

    canvas.addEventListener('mousedown', function(e) {
        if(buttonListStart.x < e.offsetX && buttonListEnd.x > e.offsetX &&
           buttonListStart.y < e.offsetY && buttonListEnd.y > e.offsetY) {
       var foundButton = false;
        for(var i = 0; i < buttonList.length; i++) {
            if(collidedWith(buttonList[i],e.offsetX,e.offsetY)) {
                foundButton = true;
                break;
                }
            }
        }
        if(!foundButton && button && button.onClick) button.onClick(e);
    }, false);
    canvas.addEventListener("mousemove", function(e){
        if(button && !button.isSelected && button.onDrag) button.onDrag(e);
    }, false);

    canvas.addEventListener("mouseup", function(e){
        if(button && button.onRelease) button.onRelease(e);
    }, false);
    
}

function getMousePos(canvas, evt) {
        var rect = canvas.getBoundingClientRect();
        return { x: evt.clientX - rect.left, y: evt.clientY - rect.top };
      }

MapEditor.prototype = new Entity();


MapEditor.prototype.update = function() {
}

MapEditor.prototype.draw = function(ctx) {
    
    for(var i = 0; i < terrainList.length; i++) {
        terrainList[i].draw(ctx);
    }
    
    for(var i = 0; i < buttonList.length; i++) {
        ctx.fillStyle = buttonList[i].isSelected ? "#00FF00" : "#FF0000";
        ctx.fillRect(buttonList[i].x,buttonList[i].y, buttonList[i].w, buttonList[i].h);
    }
 
}



var graceSize = 20;

function pushTerrain (terrain) {
        
    snapTo(terrain);
    this.terrainList.push(terrain);
    
}

function snapTo(terrain) {
       for(var i = 0; i < terrainList.length; i++) {
           if (terrain !== terrainList[i]){
        if(!terrainList[i].adjacent0 && checkBounds (terrain.p0, terrainList[i].p0)){
            terrain.p0.x = terrainList[i].p0.x = (terrain.p0.x + terrainList[i].p0.x)/2;
            terrain.p0.y = terrainList[i].p0.y = (terrain.p0.y + terrainList[i].p0.y)/2;
            terrainList[i].adjacent0 = terrain;
            terrain.adjacent0 = terrainList[i];
            break;
        } else if (!terrainList[i].adjacent1 && checkBounds (terrain.p0, terrainList[i].p1)) {
            terrain.p0.x = terrainList[i].p1.x = (terrain.p0.x + terrainList[i].p1.x)/2;
            terrain.p0.y = terrainList[i].p1.y = (terrain.p0.y + terrainList[i].p1.y)/2;
            terrainList[i].adjacent1 = terrain;
            terrain.adjacent0 = terrainList[i];
            break;
        } else if(!terrainList[i].adjacent0 && checkBounds (terrain.p1, terrainList[i].p0)){
            terrain.p1.x = terrainList[i].p0.x = (terrain.p1.x + terrainList[i].p0.x)/2;
            terrain.p1.y = terrainList[i].p0.y = (terrain.p1.y + terrainList[i].p0.y)/2;
            terrainList[i].adjacent0 = terrain;
            terrain.adjacent1 = terrainList[i];
            break;
        } else if (!terrainList[i].adjacent1 && checkBounds (terrain.p1, terrainList[i].p1)) {
            terrain.p1.x = terrainList[i].p1.x = (terrain.p1.x + terrainList[i].p1.x)/2;
            terrain.p1.y = terrainList[i].p1.y = (terrain.p1.y + terrainList[i].p1.y)/2;
            terrainList[i].adjacent1 = terrain;
            terrain.adjacent1 = terrainList[i];
            break;
        }
    }
    }

}

function checkBounds (p1, p2) {
    return (p1.x <= p2.x + graceSize && 
           p1.x >= p2.x - graceSize && 
           p1.y <= p2.y + graceSize &&
           p1.y >= p2.y - graceSize);
}

    