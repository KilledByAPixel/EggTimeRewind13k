/*
    Javascript Game Engine Debug
    By Frank Force 2019
    
    Debug Features
    - debug console
    - debug rendering
    - debug controls
    - save snapshot
*/

///////////////////////////////////////////////////////////////////////////////
// debug

"use strict"; // strict mode

let debugFrame = 0;
let debugConsole = 0;
let debugRects=[];
let debugConsoleTextArea;
let debugConsoleDisplayTextArea;
let debugCanvas = 0;
let downloadLink;

let godMode = 0;
let debug = 0;
let soundEnable = 1;
let debugCollision = 0;

function DebugPrint(string)
{
    let o = '-> '+string + '\n';
    o += debugConsoleDisplayTextArea.value;
    debugConsoleDisplayTextArea.value = o;
}

function ToggleDebugConsole()
{
    debugConsole = !debugConsole;
    if (debugConsole)
    {
        debugConsoleTextArea.style.display='block';
        debugConsoleTextArea.focus();
    }
    else
        mainCanvas.focus();
}

function DebugConsoleKeyDown(e)
{
    if (e.keyCode != 13)
        return;

    e.preventDefault();
    let v = debugConsoleTextArea.value;
    let o = '-> eval('+v + ')\n';

    try { o += eval(v); }
    catch (e) 
    {
        if (e instanceof Error)
            o += e.message? 'Error: ' + e.message : e;
        else
            o += 'Unknown error';
    }

    o += '\n\n' + debugConsoleDisplayTextArea.value;

    debugConsoleTextArea.value = '';
    debugConsoleDisplayTextArea.value = o;
}
    
function InitDebug()
{ 
    debugConsoleTextArea = document.createElement('textarea');
    debugConsoleTextArea.style="height:30px;width:90%;display:none;color:#FFF;background-color:#000;"
    mainCanvas.before(debugConsoleTextArea);
    debugConsoleTextArea.onkeydown=e=>DebugConsoleKeyDown(e)
    
    debugConsoleDisplayTextArea = document.createElement('textarea');
    debugConsoleDisplayTextArea.style="height:100px;width:90%;display:none;color:#FFF;background-color:#000;"
    mainCanvas.before(debugConsoleDisplayTextArea);
    
    downloadLink = document.createElement('a');
    downloadLink.display='none';
    downloadLink.before(debugConsoleTextArea);
    
    if (debugCanvas)
    {
        document.body.style.overflow='visible';
        document.body.style.background='#400'
        mainCanvas.style.border='2px solid #F00';
        mainCanvas.style.width=mainCanvas.width+'px';
        mainCanvas.style.height=mainCanvas.height+'px';

        document.body.appendChild(levelCanvas);   
        levelCanvas.style.border='2px solid #F00';
        levelCanvas.style.width=(levelCanvas.width)+'px';
        levelCanvas.style.height=(levelCanvas.height)+'px';
        levelCanvas.style.display ='block';

        document.body.appendChild(tileMaskCanvas);  
        tileMaskCanvas.style.border='2px solid #F00';
        tileMaskCanvas.style.width=(tileMaskCanvas.width)+'px';
        tileMaskCanvas.style.height=(tileMaskCanvas.height)+'px';
        tileMaskCanvas.style.display ='block';
    }  
    
}

function DebugRect(pos,size,color="#F00")
{
    if (debug) debugRects.push({pos:pos.Clone(),size:size.Clone(),color:color.slice(0)});
}

function DebugPoint(pos,size=.1,color="#F00")
{
    if (debug) DebugRect(pos, new Vector2(size,size), color)
}

function RenderDebugRects()
{
    function RenderDebugRect(pos,size,color)
    {
        mainCanvasContext.lineWidth=1;
        size.Multiply(tileSize);
        let renderPos = pos.Clone();
        renderPos.Subtract(cameraPos);
        renderPos.Multiply(tileSize);
        renderPos.Subtract(size);
        renderPos.Multiply(cameraScale);
        mainCanvasContext.strokeStyle=color;
        mainCanvasContext.save();
        mainCanvasContext.strokeRect(
            renderPos.x + mainCanvas.width/2|0, 
            renderPos.y + mainCanvas.height/2|0, 
            2*cameraScale*size.x|0, 2*cameraScale*size.y|0);
        mainCanvasContext.restore();
    }
    
    for( let d of debugRects )
        RenderDebugRect(d.pos,d.size,d.color);
    debugRects = [];
}

function UpdateDebug()
{
    ++debugFrame;
    UpdateDebugControls();
    
    if (debugCollision)
    {
        let s = tileSize*level.size;
        DebugRect(new Vector2(s/2,s/2), new Vector2(s/2,s/2),'#F00');
    }
        
    debugConsoleTextArea.style.display=debugConsole?'block':'none';
    debugConsoleDisplayTextArea.style.display=debugConsole?'block':'none';
    
    if (!debug)
    {
        debugRects = [];
        return;
    }
    RenderDebugRects();
}

function UpdateDebugPost()
{
}


///////////////////////////////////////////////////////////////////////////////
// debug controls

function UpdateDebugControls()
{
    if (debug)
    {
        if (KeyWasPressed(50))
            SaveSnapshot()
        if (KeyWasPressed(51))
            debugCollision = !debugCollision;
        if (KeyWasPressed(52)) // 4
            debugParticles = !debugParticles;
        if (KeyWasPressed(53)) // 5
            godMode = !godMode;
        if (KeyWasPressed(145)) // scroll lock
            debug = 0;
        if (KeyWasPressed(71)) // g
            godMode=1;
    }
    
    if (KeyIsDown(70)&&KeyIsDown(82)&&KeyIsDown(65)&&KeyIsDown(78)&&KeyIsDown(75))
    {
        // dev mode - press all keys to spell "FRANK"
        if (!debug)
            PlaySound(4);
        debug = 1;
    }
}