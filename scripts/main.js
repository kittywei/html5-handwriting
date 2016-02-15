var canvas1;
var ctx;
var canWidth = Math.min(600,($(window).width()-20));
var canHeight = canWidth;

var isMouseDown = false;

var lastLoc = {x:0,y:0};
var lastTimeStamp = 0;
var lastLineWidth = -1;
var pickColor = 'black';

var maxLineWidth;
var minLinWidth = 1;
var maxSpeed = 10;
var minSpeed = 0.1;

window.onload = game;

function game(){
    init();
    
    $(window).width() > 600 ? maxLineWidth = 30 : maxLineWidth = 20;
    
    canvas1.onmousedown = function(e){
        e.preventDefault();
        beginDraw({x:e.clientX,y:e.clientY});
    }

    canvas1.onmouseup = function(e){
        e.preventDefault();
        endDraw({x:e.clientX,y:e.clientY});
    }

    canvas1.onmouseout = function(e){
        e.preventDefault();
        endDraw();
    }

    canvas1.onmousemove = function(e){
        e.preventDefault();
        if( isMouseDown ){
            Drawing({x:e.clientX,y:e.clientY});
        }
    }
    
    canvas1.addEventListener('touchstart',function(e){
        e.preventDefault();
        var touch = e.touches[0];
        beginDraw({x:touch.pageX,y:touch.pageY});
    })
    
    canvas1.addEventListener('touchmove',function(e){
        e.preventDefault();
        var touch = e.touches[0];
        Drawing({x:touch.pageX,y:touch.pageY});
    })
    
    canvas1.addEventListener('touchend',function(e){
        e.preventDefault();
        endDraw();
    })
    
    $('#btn-remove').click(function(){
        ctx.clearRect(0, 0, canWidth, canHeight);
        drawGrid();
    });
    
    $('#color-panel').change(function(){
        pickColor = $(this).val();
    });
}

function beginDraw(point){
    isMouseDown = true;
    lastLoc = windowToCanvas(point.x,point.y);
    lastTimeStamp = Date.now();
}

function endDraw(){
    isMouseDown = false;
}

function Drawing(point){
    var curLoc = windowToCanvas(point.x,point.y);
    var curTimeStamp = Date.now();
    var s = calcDistance( curLoc, lastLoc );
    var t = curTimeStamp - lastTimeStamp;
    var lineWidth = resultLineWidth(s,t);

    //draw
    ctx.strokeStyle = pickColor;
    ctx.beginPath();
    ctx.moveTo(lastLoc.x, lastLoc.y);
    ctx.lineTo(curLoc.x, curLoc.y);

    ctx.lineWidth = lineWidth;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.stroke();

    lastLoc = curLoc;
    lastTimeStamp = curTimeStamp;
    lastLineWidth = lineWidth;
}

function resultLineWidth(s,t){
    var v = s/t;
    var resultLineWidth;
    if( v <= minSpeed ){
        resultLineWidth = maxLineWidth;
    }else if( v >= maxSpeed ){
        resultLineWidth = minLinWidth;
    }else{
        resultLineWidth = maxLineWidth - (v-minSpeed)/(maxSpeed-minSpeed)*(maxLineWidth-minLinWidth); //count line width
    }
    if(lastLineWidth == -1){
        return resultLineWidth;
    }
    
    return lastLineWidth*1/3 + resultLineWidth*2/3;
    
}

function calcDistance(loc1,loc2){
    return Math.sqrt( (loc1.x - loc2.x)*(loc1.x - loc2.x) + (loc1.y - loc2.y)*(loc1.y - loc2.y) );
}

function windowToCanvas(x,y){
    var canBox = canvas1.getBoundingClientRect();
    return {x: Math.round(x-canBox.left), y: Math.round(y-canBox.top)};
}

function init(){
    canvas1 = document.getElementById('canvas1');
    ctx = canvas1.getContext('2d');
    canvas1.width = canWidth;
    canvas1.height = canHeight;
    
    /*draw grid*/
    drawGrid();
}

function drawGrid(){
    
    ctx.save();
    ctx.strokeStyle = 'red';
    
    ctx.beginPath();
    ctx.moveTo(3,3);
    ctx.lineTo(canWidth-3,3);
    ctx.lineTo(canHeight-3,canWidth-3);
    ctx.lineTo(3,canHeight-3);
    ctx.lineTo(3,3);
    ctx.closePath();
    
    ctx.lineWidth = 6;
    ctx.stroke();
    
    ctx.beginPath();
    ctx.moveTo(canWidth/2,0);
    ctx.lineTo(canWidth/2,canHeight);
    
    ctx.moveTo(0,canHeight/2);
    ctx.lineTo(canWidth,canHeight/2);
    
    ctx.lineWidth = 1;
    ctx.stroke();
    
    ctx.setLineDash([9, 15]); //draw dash
    ctx.beginPath();
    ctx.moveTo(0,0);
    ctx.lineTo(canWidth,canHeight);
    
    ctx.moveTo(0,canHeight);
    ctx.lineTo(canWidth,0);
    
    ctx.lineWidth = 1;
    ctx.stroke();
    ctx.restore();
}

