var canvas=document.getElementById("canvas");
var context=canvas.getContext("2d");
var cw=canvas.width;
var ch=canvas.height;

// const draw = document.getElementById('draw');
const reset = document.getElementById('reset');

const done = document.getElementById('done');
done.disabled=true;
const add = document.getElementById('add');


//fill elements
const fill = document.getElementById('fill');
fill.disabled = true;

//translation elements
const tx = document.getElementById('tx');
const ty = document.getElementById('ty');
const translate = document.getElementById('translate');

//scaling elements
const fsx = document.getElementById('fsx');
const fsy = document.getElementById('fsy');
const sx = document.getElementById('sx');
const sy = document.getElementById('sy');
const scale = document.getElementById('scale');

//rotation elements
const rx = document.getElementById('frx');
const ry = document.getElementById('fry');
const angle = document.getElementById('angle');
const rotate = document.getElementById('rotate');


//reflection elements
const refo = document.getElementById('refo');
const refx = document.getElementById('refx');
const refy = document.getElementById('refy');
const refxy = document.getElementById('refxy');
const refxmy = document.getElementById('refxmy');

//shearing elements
const fshx = document.getElementById('fshx');
const fshy = document.getElementById('fshy');
const shx = document.getElementById('shx');
const shy = document.getElementById('shy');
const shear = document.getElementById('shear');


function reOffset(){
  var BB=canvas.getBoundingClientRect();
  offsetX=BB.left;
  offsetY=BB.top;        
}
var offsetX,offsetY;
reOffset();
window.onscroll=function(e){ reOffset(); }

context.lineWidth=2;
context.strokeStyle='blue';

var coordinates = [];
var polygons = [];
var isDrawing=false;


//adding new polygon
$('#add').click(function(){
    add.disabled = true;
    done.disabled = false;
    isDrawing = true;
    translate.disabled = true;
    scale.disabled =true;
    rotate.disabled = true;
    refo.disabled = true;
    refx.disabled = true;
    refy.disabled = true;
    refxy.disabled = true;
    refxmy.disabled = true;
    shear.disabled = true;
    fill.disabled = true;
});

//saving polygon
$('#done').click(function(){
    done.disabled = true;
    add.disabled = false;
    isDrawing = false;
    polygons.push(coordinates);
    coordinates = [];

    translate.disabled = false;
    scale.disabled =false;
    rotate.disabled = false;
    refo.disabled = false;
    refx.disabled = false;
    refy.disabled = false;
    refxy.disabled = false;
    refxmy.disabled = false;
    shear.disabled = false;
    fill.disabled = false;
});


//handling mouse events for drawing polygon
$("#canvas").mousedown(function(e){handleMouseDown(e);});

var cur = 0;
var letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";

function handleMouseDown(e){
  if(!isDrawing || coordinates.length>10){return;}

  // tell the browser we're handling this event
  e.preventDefault();
  e.stopPropagation();

  let mouseX=parseInt(e.clientX-offsetX);
  let mouseY=parseInt(e.clientY-offsetY);
  coordinates.push({x:mouseX,y:mouseY,letter:letters[(cur)]});
  cur = (cur+1)%letters.length;
  drawPolygon();
}


//drawing polygon
function drawPolygon(){
    context.clearRect(0,0,cw,ch);
    context.beginPath();
    context.strokeStyle='black';
    line(-cw,0,cw,0)
    line(0,-ch,0,ch)
    context.closePath();
    context.stroke();
    context.beginPath();

    // draw the current polygon
    if(coordinates.length>0){
        context.strokeStyle = "#ff0000";
        context.moveTo(coordinates[0].x, coordinates[0].y);
        context.font = "15px Arial";
        context.fillStyle = 'black';
        context.fillText(coordinates[0].letter + " (" + (coordinates[0].x-cw/2) + "," + (ch/2 -coordinates[0].y) + ")", coordinates[0].x,coordinates[0].y); 
        for(let index=1; index<coordinates.length;index++) {
            context.lineTo(coordinates[index].x, coordinates[index].y);
            context.font = "15px Arial";
            context.fillText(coordinates[index].letter + " (" + (coordinates[index].x-cw/2) + "," + (ch/2 -coordinates[index].y) + ")", coordinates[index].x,coordinates[index].y); 
        }
        context.closePath();
        context.stroke();
    }

    for(let co of polygons){
        context.beginPath();
        context.strokeStyle = "#ff0000";
        context.moveTo(co[0].x, co[0].y);
        context.font = "15px Arial";
        context.fillStyle = 'black';
        context.fillText(co[0].letter + " (" + (co[0].x - cw/2) + "," + (ch/2 -co[0].y) + ")", co[0].x,co[0].y); 
        for(let index=1; index<co.length;index++) {
            context.lineTo(co[index].x, co[index].y);

            context.font = "15px Arial";
            context.fillText(co[index].letter + " (" + (co[index].x - cw/2) + "," + (ch/2 - co[index].y) + ")", co[index].x,co[index].y); 
        }
        context.closePath();
        context.stroke();
    }
    
}

//for filling the polygon


function getElementPosition(obj) {
    var curleft = 0, curtop = 0;
    if (obj.offsetParent) {
        do {
            curleft += obj.offsetLeft;
            curtop += obj.offsetTop;
        } while (obj = obj.offsetParent);
        return { x: curleft, y: curtop };
    }
    return undefined;
}
function getEventLocation(element,event){
    // Relies on the getElementPosition function.
    var pos = getElementPosition(element);
    
    return {
    	x: (event.pageX - pos.x),
      	y: (event.pageY - pos.y)
    };
}

async function drawPixel (x, y) {
    // context.rect(x,y, 1, 1);
    context.fillStyle = "#ff0000";
    context.fillRect(x,y,1,1);
    await new Promise(r => setTimeout(r, 10));
}

function rgbToHex(r, g, b) {
    if (r > 255 || g > 255 || b > 255)
        throw "Invalid color component";
    return ((r << 16) | (g << 8) | b).toString(16);
}
async function fillPolygon(x,y){
    var p = context.getImageData(x,y,1,1).data;
    if(rgbToHex(p[0],p[1],p[2])!="ff0000"){
        await drawPixel(x,y);
        fillPolygon(x-1,y);
        fillPolygon(x+1,y);
        fillPolygon(x,y-1);
        fillPolygon(x,y+1);

        // fillPolygon(x-1,y-1);
        // fillPolygon(x+1,y-1);
        // fillPolygon(x-1,y+1);
        // fillPolygon(x+1,y+1);
    }else{
        return;
    }
}
function handleClickOnCanvas(e){
    fill.disabled= false;
    canvas.removeEventListener('click',handleClickOnCanvas);
    var eventLocation = getEventLocation(canvas,e);
    fillPolygon(eventLocation.x,eventLocation.y);
}

fill.addEventListener('click',()=>{
    fill.disabled = true;
    canvas.addEventListener('click',handleClickOnCanvas);
});


//for reflection about origin
$('#refo').click(function(){
    for(let pol of polygons){
        for(let co of pol){
            co.x = -(co.x - cw/2) + cw/2;
            co.y = (ch/2 - co.y) + ch/2;
        }
    }
    drawPolygon();
});

//for reflection about x-axis
$('#refx').click(function(){
    for(let pol of polygons){
        for(let co of pol){
            co.y = (ch/2 - co.y) + ch/2;
        }     
    }
    drawPolygon();
});

//for reflection about y-axis
$('#refy').click(function(){
    for(let pol of polygons){
        for(let co of pol){
            co.x = -(co.x - cw/2) + cw/2;
        }
    }
    drawPolygon();
});

//for reflection about X=Y line
$('#refxy').click(function(){
    for(let pol of polygons){
        for(let co of pol){
            let x= co.x - cw/2;
            let y = ch/2 - co.y;
            co.x = y + cw/2;
            co.y = -x + ch/2;
        }
    }
    drawPolygon();
});

//for reflection about x=-y line
$('#refxmy').click(function(){
    for(let pol of polygons){
        for(let co of pol){
            let x = co.x - cw/2;
            let y = ch/2 - co.y;
            co.x = -y + cw/2;
            co.y = x + ch/2;
        }
    }
    drawPolygon();
});




//for translation
function translation(x,y,draw){
    for(let pol of polygons){
        for(let co of pol){
            co.x+= x;
            co.y-= y;
        }
    }
    if(draw){drawPolygon();}
}

translate.addEventListener('click',() => {
    translation(parseInt(tx.value),parseInt(ty.value),true);
});


//for scaling
function scaling(){
    translation(-parseInt(fsx.value),-parseInt(fsy.value),false);
    for(let pol of polygons){
        for(let co of pol){
            co.x = Math.round((co.x-cw/2)*parseFloat(sx.value) + cw/2);
            co.y = Math.round(-(ch/2 -co.y)*parseFloat(sy.value) + ch/2);
        }
    }
    translation(parseInt(fsx.value),parseInt(fsy.value),false);
    drawPolygon();
}

scale.addEventListener('click',scaling);


//for shearing
function shearing(){
    for(let pol of polygons){
        for(let co of pol){
            let x = co.x - cw/2;
            let y = ch/2 - co.y;
            co.x = Math.round(x + parseFloat(shx.value)*(y-parseInt(fshy.value)) + cw/2);
            co.y = Math.round(-(y +  parseFloat(shy.value)*(x-parseInt(fshx.value))) + ch/2);
        }
    }
    drawPolygon();
}

shear.addEventListener('click',shearing);


shear.addEventListener('click',shearing);


//for rotation
function rotation(){
    translation(-parseInt(rx.value),-parseInt(ry.value),false);
    let angleRad = parseFloat(angle.value) * Math.PI / 180;
    for(let pol of polygons){
        for(let co of pol){
            let x = co.x;
            let y = co.y;
            co.x = Math.round((x-cw/2)*Math.cos(angleRad) - ((ch/2 - y)*Math.sin(angleRad)) + cw/2);
            co.y = Math.round(-((x - cw/2)*Math.sin(angleRad) + (ch/2 -y)*Math.cos(angleRad)) + ch/2);
        }
    }
    translation(parseInt(rx.value),parseInt(ry.value),false);
    drawPolygon();
}

rotate.addEventListener('click',rotation);

//for line drawing
function line(x1,y1,x2,y2){
    context.moveTo(cw/2 + x1, ch/2 - y1);
    context.lineTo(cw/2 + x2, ch/2 - y2);
    context.stroke();
}


function clear(){
    context.clearRect(0, 0, cw, ch);
    context.beginPath();
    context.strokeStyle='black';
    line(-cw,0,cw,0)
    line(0,-ch,0,ch)
    context.closePath();
    context.stroke();
    coordinates = [];
    polygons = [];
    done.disabled = true;
    add.disabled = false;
    fill.disabled = true;
    cur = 0;
}

reset.addEventListener('click',clear);
clear();








    
    