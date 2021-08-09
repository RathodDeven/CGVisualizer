var canvas=document.getElementById("canvas");
var context=canvas.getContext("2d");
var cw=canvas.width;
var ch=canvas.height;

const draw = document.getElementById('draw');
const reset = document.getElementById('reset');

const done = document.getElementById('done');
done.disabled=true;
const add = document.getElementById('add');

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

$('#add').click(function(){
    add.disabled = true;
    done.disabled = false;
    isDrawing = true;
    translate.disabled = true;
    scale.disabled =true;
    rotate.disabled = true;
    
});

$('#done').click(function(){
    done.disabled = true;
    add.disabled = false;
    isDrawing = false;
    polygons.push(coordinates);
    coordinates = [];

    translate.disabled = false;
    scale.disabled =false;
    rotate.disabled = false;

});

$("#canvas").mousedown(function(e){handleMouseDown(e);});

function handleMouseDown(e){
  if(!isDrawing || coordinates.length>10){return;}

  // tell the browser we're handling this event
  e.preventDefault();
  e.stopPropagation();

  let mouseX=parseInt(e.clientX-offsetX);
  let mouseY=parseInt(e.clientY-offsetY);
  coordinates.push({x:mouseX,y:mouseY});
  drawPolygon();
}

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
        context.strokeStyle = 'red';
        context.moveTo(coordinates[0].x, coordinates[0].y);
        context.font = "15px Arial";
        context.fillText("(" + (coordinates[0].x-cw/2) + "," + (ch/2 -coordinates[0].y) + ")", coordinates[0].x,coordinates[0].y); 
        for(let index=1; index<coordinates.length;index++) {
            context.lineTo(coordinates[index].x, coordinates[index].y);
            context.font = "15px Arial";
            context.fillText("(" + (coordinates[index].x-cw/2) + "," + (ch/2 -coordinates[index].y) + ")", coordinates[index].x,coordinates[index].y); 
        }
        context.closePath();
        context.stroke();
    }

    for(let co of polygons){
        context.beginPath();
        context.strokeStyle = 'red';
        context.moveTo(co[0].x, co[0].y);
        context.font = "15px Arial";
        context.fillText("(" + (co[0].x - cw/2) + "," + (ch/2 +co[0].y) + ")", co[0].x,co[0].y); 
        for(let index=1; index<co.length;index++) {
            context.lineTo(co[index].x, co[index].y);

            context.font = "15px Arial";
            context.fillText("(" + (co[index].x - cw/2) + "," + (ch/2 - co[index].y) + ")", co[index].x,co[index].y); 
        }
        context.closePath();
        context.stroke();
    }
    
}

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
}

reset.addEventListener('click',clear);
clear();








    
    