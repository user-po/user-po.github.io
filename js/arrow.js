/**
* 
* @param {Object} ctx    canvas对象
* @param {Object} fromX  起点x
* @param {Object} fromY  起点y
* @param {Object} toX    终点x
* @param {Object} toY    终点y
* @param {Object} theta  箭头夹角
* @param {Object} headlen 斜边长度
* @param {Object} width 箭头宽度
* @param {Object} color 颜色
*/
function drawArrow(ctx, fromX, fromY, toX, toY,headlen,theta,width,color) { 
    theta = typeof(theta) != 'undefined' ? theta : 30; 
    headlen = typeof(theta) != 'undefined' ? headlen : 10; 
    width = typeof(width) != 'undefined' ? width : 1;
    color = typeof(color) != 'color' ? color : '#333'; 
    // 计算各角度和对应的P2,P3坐标 
    var angle = Math.atan2(fromY - toY, fromX - toX) * 180 / Math.PI, 
        angle1 = (angle + theta) * Math.PI / 180, 
        angle2 = (angle - theta) * Math.PI / 180, 
        topX = headlen * Math.cos(angle1), 
        topY = headlen * Math.sin(angle1), 
        botX = headlen * Math.cos(angle2), 
        botY = headlen * Math.sin(angle2); 
    ctx.save(); 
    ctx.beginPath(); 
    var arrowX = fromX - topX, arrowY = fromY - topY;
        ctx.moveTo(arrowX, arrowY); 
        ctx.moveTo(fromX, fromY); 
        ctx.lineTo(toX, toY); 
        arrowX = toX + topX; 
        arrowY = toY + topY; 
        ctx.moveTo(arrowX, arrowY); 
        ctx.lineTo(toX, toY); 
        arrowX = toX + botX; 
        arrowY = toY + botY; 
        ctx.lineTo(arrowX, arrowY); 
        ctx.strokeStyle = color; 
        ctx.lineWidth = width; 
        ctx.stroke(); 
        ctx.restore(); 
    }