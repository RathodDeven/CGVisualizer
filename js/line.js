const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const canvasWidth = canvas.width;
const canvasHeight = canvas.height;

const draw = document.getElementById('draw');
const reset = document.getElementById('reset');
function line(x1,y1,x2,y2){
    ctx.moveTo(canvasWidth/2 + x1, canvasHeight/2 - y1);
    ctx.lineTo(canvasWidth/2 + x2, canvasHeight/2 - y2);
    ctx.stroke();
}


function drawPixel (x, y) {
    ctx.rect(canvasWidth/2 + x,canvasHeight/2 - y, 1, 1);
    ctx.fillStyle = "red";
    ctx.fill();
}
async function drawLine (x1, y1, x2, y2) {
    var len;
    if(Math.abs(x2-x1)>Math.abs(y2-y1)){
        len=Math.abs(x2-x1);
    }else{
        len=Math.abs(y2-y1);
    }
    var incx = (x2-x1)/len;
    var incy = (y2-y1)/len;
    var x = x1;
    var y = y1;
    for(var i=0;i<len;i++){
        drawPixel(Math.floor(x+0.5),Math.floor(y+0.5));
        x = x+incx;
        y = y + incy;
        await new Promise(r => setTimeout(r, 1));
    }
}

draw.addEventListener('click',async function(){
    var x1 = parseInt(document.getElementById('x1').value);
    var y1 = parseInt(document.getElementById('y1').value);
    var x2 = parseInt(document.getElementById('x2').value);
    var y2 = parseInt(document.getElementById('y2').value);
    
    await drawLine(x1,y1,x2,y2);
    console.log("draw clicked");
});

function clear(){
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    ctx.beginPath();
    line(-canvasWidth,0,canvasWidth,0)
    line(0,-canvasHeight,0,canvasHeight)
    ctx.stroke();
}

reset.addEventListener('click',clear);
clear();








    
    