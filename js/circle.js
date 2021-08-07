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
async function drawCircle (x_center, y_center, r) {
    var x = r;
    var y = 0;
    await drawPixel(x_center, y_center);
    if(r>0){
        await drawPixel(x + x_center, -y + y_center);
        await drawPixel(y + x_center, x + y_center);
        await drawPixel(-y + x_center, x + y_center);
    }

    var p = 1 -r;
    while(x>y){
        y++;
        if(p <= 0){
            p += 2 * y + 1;
        }else{
            x--;
            p += 2 * (y - x) + 1;
        }
        if(x<y)break;

        await drawPixel(x + x_center, y + y_center);
        await drawPixel(-x + x_center, y + y_center);
        await drawPixel(x + x_center, -y + y_center);
        await drawPixel(-x + x_center, -y + y_center);

        if(x!=y){
            await drawPixel(y + x_center, x + y_center);
            await drawPixel(-y + x_center, x + y_center);
            await drawPixel(y + x_center, -x + y_center);
            await drawPixel(-y + x_center, -x + y_center);
        }

    }
}

draw.addEventListener('click',async function(){
    var x = parseInt(document.getElementById('x').value);
    var y = parseInt(document.getElementById('y').value);
    var r = parseInt(document.getElementById('radius').value);
    await drawCircle(x,y,r);
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








    
    