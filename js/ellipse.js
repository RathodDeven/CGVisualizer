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


async function drawPixel (x, y) {
    ctx.rect(canvasWidth/2 + x,canvasHeight/2 - y, 1, 1);
    ctx.fillStyle = "red";
    ctx.fill();
    await new Promise(r => setTimeout(r, 1));
}
async function drawEllipse (xc, yc, rx,ry) {
    var dx,dy,d1,d2,x,y;
    x = 0;
    y = ry;
    dx = 2 * ry * ry * x;
    dy = 2 * rx * rx * y;

    d1 = (ry * ry) - (rx * rx * ry) +(0.25 * rx * rx);

    while(dx<dy){
        await drawPixel(xc + x, y + yc);
        await drawPixel(xc - x, y + yc);
        await drawPixel(xc + x, -y + yc);
        await drawPixel(xc - x, -y + yc);

        if(d1<0){
            x++;
            dx = dx + (2 * ry * ry);
            d1 = d1 + dx + (ry * ry);
        }
        else
        {
            x++;
            y--;
            dx = dx + (2 * ry * ry);
            dy = dy - (2 * rx * rx);
            d1 = d1 + dx - dy + (ry * ry);
        }
    }

    d2 = ((ry * ry) * ((x + 0.5) * (x + 0.5))) + ((rx * rx) * ((y - 1) * (y - 1))) -(rx * rx * ry * ry);
    while(y >=0){
        await drawPixel(xc + x, y + yc);
        await drawPixel(xc - x, y + yc);
        await drawPixel(xc + x, -y + yc);
        await drawPixel(xc - x, -y + yc);

        if(d2 > 0){
            y--;
            dy = dy - (2 * rx * rx);
            d2 = d2 + (rx * rx) - dy;
        }
        else{
            x++;
            y--;
            dy = dy - (2 * rx * rx);
            dx = dx + (2 * ry * ry);
            d2 = d2 + dx + (rx * rx) - dy;
        }
    }
}

draw.addEventListener('click',async function(){
    var x = parseInt(document.getElementById('x').value);
    var y = parseInt(document.getElementById('y').value);
    var rx = parseInt(document.getElementById('rx').value);
    var ry = parseInt(document.getElementById('ry').value);
    await drawEllipse(x,y,rx,ry);
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