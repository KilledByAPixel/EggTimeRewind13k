/*

Egg Time Rewind
By Frank Force 2020



make pup range bigger
upgrade stack


*/

"use strict";

document.title = 'Egg Time Rewind';

 // strict mode
///////////////////////////////////////////////////////////////////////////////
// debug config

const volume = .1
godMode=0;
let quickLoad =  0;
soundEnable=1;
let spawnEnemies = 1;

let bonusGame = 0;

//debug=1;
//debugCanvas=1;
//debugCollision=1;

let color1 = new Color(255,255,255)
let color2 = new Color(0,0,0)

let highScoreKey = 'EGG_TIME_HIGH';

///////////////////////////////////////////////////////////////////////////////
// init

let specialMessage=
`Time REWINDS when you die...
but your PARALLEL LIVES remain.
Break the SPACE EGG to get powerups.
Control with mouse, wasd, dpad, touch, or gamepad.
There is no ending but it gets increasingly more difficult.
You can press R to restart.
Press 1 to play a secret bonus game, the road ends at 1000.
Thank you for playing my game.
If you like it, check out my other JS13k games Bounce Back and Space Huggers.
I also made the LittleJS Game Engine and ZzFX Sound Generator.
Follow me on Twitter @KilledByAPixel for updates.
`

//`Hi! I'm Frank Force aka Killed By A Pixel. I made ZZFX and LittleJS use by many other JS13k Games. Thanks for playing my game!`

// css text used for elements created by engine
const styleBody = 'margin:0;overflow:hidden;background:#000' +
    ';touch-action:none;user-select:none;-webkit-user-select:none;-moz-user-select:none';
let mainCanvas = document.createElement('canvas');
mainCanvas.width = 84
mainCanvas.height = 48

document.body.style = styleBody;
let transitionCanvas = document.createElement('canvas');

let gameMode = 1;
let level = 0;
let levelNumber = 0;
let levelTimer = new Timer();
let loadNextLevel = 0;
let levelFrame = 0;
let playerScore = 0;
let levelEggHealth = 0;
let egg = 0;
let eggTimer = new Timer();
let newHighScore = 0;
let eggHitTimer = new Timer();
let scoreTimer= new Timer();

let player;
let playerLives = 0;
let playerGhosts = [];
let currentPlayerGhost = [];
let powerupTimer = new Timer();
let powerupText;

let FONT = `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAgAAAAA4AgMAAAD2oKiAAAAACVBMVEUAABH///8AAACybxQLAAAAAXRSTlMAQObYZgAABO9JREFUeNrsV1GK20AMVcDOtwM7hfY0L+D+2zCzNPm2A/VpUvARfNA+PWRvt2XTQAOFZSU0laRZ60lV5MTMnuxALgCSVVbTblFZEAq9hWdPWfmJd3Yw6xQJDr2nJHTwWN6iipBbCvRMmGcTPSl9azv+W9GqX0L0+aNr1CjIlqn1ZAIgF9R2BOQp5M6ceySreQpAxGQFgMRYjcYa5QsAJgiVZZgHVIuJKj2QdnDCGoOOGl/do8TsgZ8C4J5W9aon8goAsyRyYxXzABbk6YnqSC06QC6CU5BUuXMf+LcOCMirDujOVwFpCU61W287LyMkWfYyyfa6A0CGbTPQqH5s1ddRh2bAcsxArdbGDESj1ZEA4L4s3wqgD81cVOQH/X+qbu8B6oUnKCvTHzOQFBOHBs0L6Y89sBH1g6XIKwC39gDAIYXpkaDmVOkeE8kUmYTs0Z0dDfoYbmSV7rZQUsF5AfDGHqDoz9SBYPt9D5j2AC1oDxxRBCBvAFiauhMABN47UKvwm3vAqREAWBQXsnVAQF51QJUdf+2A6/obMG1LoabiNqr+sgeSrbVvJ6OaAVWDbQawWuYntAdgWT7elEAnYagDH/Q+9kCyxm3qL++5hiwK3/bBVq5kD90Dni7prxsJSQD05ouETWgAT9596B6IGslZZxVgWiVbo0qn3kp/5B44rLWT1UXK0waAPokAyEf7sXsgmXhrdKUzqd1JN9UBSXEf+V3tgY89kFNXupRLVzL1nHnWmWSpy4pFPG9EvWx0Yw/s7toD03Kep/m8TPO0UF+GYVr2yzgMdprHwWMSxgbSKJ6WE717fL5+/nFjD+zv2gPjIM4u4uE51/M4D3YZvismzs95IF2G03yaC8GOQwB4ew98ud6zBy4LK2c61nWdriOtPcp16giA6eidLxT3sn56PnXO3+ZndSD1N/bAHvfsAdW+dqDjyQ6M13EeM9MvtDvqQ2G9I6u/UPY45WmpuxqpY7vfJMbuIf+/XWdgsPNMazkTiDfZZ4C+gT6mPc+fOp+LPTgDtL0DSvJv5NMdnwJNvmZcpxNtS7rBeiU51+CNjd7H94HCU0LWz3N0yLSPcT8iYlAe/LvgYA3ERtYz+CRaLTqAfkm8GyGAx4d/H/Dk0FtOXezjddwCSGgpJdK1ij/4+8CrDsA7cLSDKj9SGr2CTQAqAuipNXjo94Ee6wxkWbxvHVzzM3tHUNSfKibt43fBz3bKQGNyIAjCn4CRp4iAlaf8LBj7FCsg5ilPmTS3DmC5c/5qPWa6El1TRv9raOzsDPWgsfKg24p02BiGHVYALMKbI9yMe3c6PHz7ZnjdXDGnXTVfIOlGCRh2FnYaD9ai0gZ9gKgiGDTy3XBF9TRNh28Spwcr5xRwczmVgJ3T1Y0t/UoAkWDjEkLMWyYbGgcqsByYy8orlTSOB1mNgFS63ZyTqU4BjYODjcaCUhg2N55AOdAINrQhmHDmbw6AfDhgHHiRSvc1787J4sEwuXNwkWsu8OmAXkK9gY0wzt/q7rWy3W+gUTccjGn0dOQWkNqVWgnQe0eSIT/47+aADlfVP+aAFuZTnH2/MAcMSCbCLjyRbtcCDdVumuJQS8BX5oAYD3g6jICrBDjsYSwBER8HViLgK3PgwwG18fzdgezFhu7EgYYMgW/NAa03YJ3IqnFHLjUOzDRrZJQDP/jb+AV5k4i7aYzNeAAAAABJRU5ErkJggg==`

function setAlpha(a=1) {mainCanvasContext.globalAlpha=a;}

function Init()
{
    InitWebGL();
    InitText(FONT, 8, 8, 6, 6);
    EngineInit();
    
    // clear canvas so transition starts on a blank screen
    mainCanvasContext.fillStyle='#fff';
    mainCanvasContext.fillRect(0,0,mainCanvasSize.x, mainCanvasSize.y);

    Reset();
    EngineUpdate();

    console.log('Egg Time Rewind by Frank Force');
    console.log('https://frankforce.com');
    console.log('https://twitter.com/KilledByAPixel');
}

function Reset()
{
    // load local storage
    /*if (localStorage.kbap_coins)
        playerData.coins = parseInt(localStorage.kbap_coins, 10);
    if (localStorage.kbap_warp)
        warpLevel = parseInt(localStorage.kbap_warp, 10);
    if (localStorage.kbap_bestTime)
        speedRunBestTime = parseInt(localStorage.kbap_bestTime, 10);*/
    levelNumber = 0;
    playerLives = 3;
    gameMode = 1;
    playerScore = 0;
    newHighScore = 0;
    levelStartSeed = Date.now();
    playerGhosts = [];
    NextLevel();
}

function NextLevel()
{
    // go to next level
    levelNumber++;
    
    InitLevel();
}

let firstRun = 1;
function InitLevel()
{
    // reset level stuff
    beatCount=0;
    levelTimer.Set();
    cameraScale=2;
    levelFrame = 0;
    egg = 0;
    eggTimer.Set(1);
    
    // clear everything
    if (!firstRun)
        StartTransiton();
    firstRun = 0;
    ClearGameObjects();
    
    RestartLevel();
    
    if (gameMode==0)
    {
        // create the level and player
        let startPos = new Vector2(1.75,2);
        player = new Player(startPos);
        currentPlayerGhost = [];

        for(let ghost of playerGhosts)
            new PlayerGhost(startPos, ghost);

        //new Powerup(new Vector2(4,2));
    }
    else
        player = 0;
    
    // camera is always centered on player
    cameraPos = new Vector2(4,2);
}

///////////////////////////////////////////////////////////////////////////////
// update/render

function UpdateFrame()
{
    UpdateMusic();
    if (bonusGame)
    {
        UpdateBonusGame(bonusGame);
        return;
    }

    
    // restart if dead or won
    if (player && player.deadTimer.IsSet() && player.deadTimer > 3)
        loadNextLevel = 2;
    /*else if (player && player.IsDead() && !playerLives)
    {
        let shootButton = KeyWasPressed(32) || MouseWasPressed() || gamepadButtonWasPressed[0];
        if (shootButton)
            loadNextLevel = 3;
    }*/

    if (KeyWasPressed(49))
    {
        document.title = 'Hue Jumper';
        bonusGame = 1;
        ClearGameObjects();
        return;
    }
        
    let userClicked = KeyWasPressed(32) || MouseWasPressed() || gamepadButtonWasPressed[0];
    // debug key N to load next level
    if (debug && KeyWasPressed(78))
        loadNextLevel = 1;
    
    if (gameMode == 0)
    {
        if (!loadNextLevel && !manualPaused && (gamepadButtonWasPressed[9] || KeyWasPressed(27)))
        {
            if (keyInputData[27])
                keyInputData[27].isDown = 0;
            manualPaused = 1;  
            if (isTouchDevice)
                manualPaused = 0;   
        }
    
        UpdateLevel();
    }
    
    if (gameMode == 2 && (levelTimer > 2 || levelTimer > .5 && userClicked))
    {
        gameMode = 0;
        InitLevel();
    }
    
    if (KeyWasPressed(82))
    {
        PlaySound(3);
        Reset();
        return;
    }
    
    if (gameMode == 3 && levelTimer > 3)
    {
        Reset();
        return;
    }
    
    if (gameMode == 1 && (quickLoad || levelTimer > .5 && userClicked))
    {
        PlaySound(4);
        gameMode = quickLoad ? 0 :2;
        InitLevel();
    }
}

function PreRender()
{
    if (bonusGame)
        return;

    // camera is always centered on player
    //cameraPos.Copy(player.pos);
    
    // clear canvas
    mainCanvas.width|=0;
    
    // draw waves and terrain
    let x = mainCanvasContext;
    
    if (gameMode == 0 || gameMode == 1)
    {
        x.fillStyle=color2;
        x.fillRect(0,0,2e3,2e3);
        
        x.fillStyle=color1;
        // stars
        for(let i=100;i--;)
        {
            setAlpha((Math.sin(i**3)/2+.5)**3/3);
            x.fillRect(84-((Math.sin(i**3)*999+(i+10)*levelTimer)|0)%199,22+24*Math.sin(i*i)|0,1,1);
        }
        setAlpha(1)

        let speed = Lerp(GetDifficulty(), 1, 4);
        
        // ground
        x.fillStyle='#333'
        for(let i=42*2;i--;)
            x.fillRect(i,41 + Math.sin(i/2+.5*levelTimer*speed) + Math.sin(i/3+.5*levelTimer*speed)|0,1,99);

        x.fillStyle='#666'
        for(let i=42*2;i--;)
            x.fillRect(i,44 + Math.sin(i/3+2*levelTimer*speed) + Math.sin(i/4+1*levelTimer*speed)|0,1,99);

        x.fillStyle='#aaa'
        for(let i=42*2;i--;)
            x.fillRect(i,47 + Math.sin(i/4+2*levelTimer*speed) + Math.sin(i/5+2*levelTimer*speed)|0,1,99);
    }
    else if (gameMode == 2 || gameMode == 3)
    {
        x.fillStyle=color1;
        x.fillRect(0,0,2e3,2e3);
    }
    /*if (1)
    {
        x.font='12px"'
        x.fillStyle='red';
        x.fillText((mousePosWorld.x|0)+' '+(mousePosWorld.y|0),1,10);
        x.fillRect(mousePos.x,mousePos.y,1,1);
        DrawTile(mousePosWorld,new Vector2(.5,.5),0,0);
    }*/
    // draw the level (bottom layer)
    //level.Render();
}
function DrawHud()
{
    if (gameMode == 0)
    {
        if (scoreTimer.IsSet())
        {
            let p = Percent(scoreTimer,0,.5);
            setAlpha(Lerp(p,1,.5))
            DrawText(playerScore,1,1,1,0);
            setAlpha(1)
        }
        if (powerupTimer < 4)
        {
            setAlpha(Lerp(powerupTimer/4,1,0))
            DrawText(powerupText,mainCanvasSize.x-2,1,1,1);
            setAlpha(1)
        }

    }
    if (gameMode == 1)
    {
        {
            let displayMessage = specialMessage;
            displayMessage = '                           '+ displayMessage;
            let messageTime = levelTimer*4
            let displayLength = 16;
            let pos = (messageTime|0) % displayMessage.length;
            let subMessage = displayMessage.slice(pos,pos+displayLength);
            DrawText(subMessage,-(messageTime%1)*6,42,1,0);
        }

        if (localStorage[highScoreKey])
        {
            let highText = 'High:'+localStorage[highScoreKey];
            let X = 42 ;
            DrawText(highText,X,1,1,2);
        }
        
        let t = levelTimer*40|0;
        let X;
        
        let w = levelTimer > 2.25 ? 2 : 0
        X = t-42;
        X=Min(X,42);
        DrawText('-EGG TIME-',X,8, 3,2,w,8,7);        
        X = 42*3-t;
        X=Max(X,42);
        DrawText('-REWIND-',X,16, 3,2,w,8,7);
        
        let Y = 96-levelTimer*20|0;
        Y = Max(Y,36)
        //DrawText('press start',42,Y|0, 2,2,0);
        
        DrawTile(cameraPos.Clone().AddXY(1+Min(levelTimer/2-6,-2.2),.55+Math.sin(levelTimer)/6), new Vector2(.5,.5),0,0);
        
        let angle = (levelTimer*2|0)*Math.PI/2;
        DrawTile(cameraPos.Clone().AddXY(.5+Math.sin(levelTimer)/2,Max(2-levelTimer/6,.55)), new Vector2(1,1),3,1,angle,0,0,16);
    }
    else if (gameMode == 2)
    {
        DrawTile(new Vector2(3.25,1.5),new Vector2(1,1),3,0,0,0,0,16);
        DrawText('  x ' + playerLives,42,14, 5,2);
    }
    else if (gameMode == 3)
    {
        DrawText('game over',42,14, 5,2,0);
    }
    
    if (gameMode == 2 || gameMode == 3)
    {
        if (newHighScore && gameMode == 3)
            DrawText('new high',42,25, 6,2);
        else
            DrawText('score',42,25, 6,2);
        DrawText(playerScore,42,32, 6,2);
    }
    
    UpdateTransiton();
    
    if (paused && gameMode == 0)
        DrawText('-paused-',42,20, 3,2,0,8,8);
    
    if (loadNextLevel)
    {
        // hook to load next level is here so transition effects work!
        if (loadNextLevel==2)
        {
            // player died
            gameMode = playerLives?2:3;
            InitLevel();
        }
        else
            NextLevel();
        loadNextLevel = 0;
    }
}

function PostRender()
{  
    if (!bonusGame)
        DrawHud();
    RenderShader();
}

///////////////////////////////////////////////////////////////////////////////
// game objects

class MyGameObject extends GameObject
{
    constructor(pos,tileX=0,tileY=0,size=.5,collisionSize=0,health=1)
    {
        super(pos,tileX,tileY,size,collisionSize,health);
        this.damping = 1;
    }
    
    HitEffect(scale=1)
    {
        let c1 = color1.Clone();
        let c2 = color2.Clone();
        let s = scale*this.size.x;
        let p = new ParticleEmitter
        (
            this.pos, s*.5, s*.2, // pos, emitter size, particle size
            c1, c2
        );
    }
    
    Kill()
    {
        this.HitEffect();
        super.Kill();
    }
}
    let lastFrame=-1;    
///////////////////////////////////////////////////////////////////////////////

class Player extends MyGameObject
{
    constructor(pos) 
    {
        super(pos,0,0,.5,2/16,1);
        this.inputTimer = new Timer();
        this.playerDamageTimer = new Timer();
        this.shootTimer = new Timer();
        this.shieldTimer = new Timer;
        this.shootTimer.Set(1);
        this.deadTimer = new Timer();
        this.inputTimer.Set();
        this.renderOrder = 1;
        this.charge = 0;
        this.damping = .6;
        this.isPlayer = 1;
        this.hasShot = 0;
        this.multiShot = 0;
        this.engines = 0;
        this.rapid = 0;
    }
    
    Update() 
    {
        // keep player data updated
        if (this.IsDead())
        {
            // stop and do no more
            return;
        }
    
        let shootButton = KeyIsDown(32) || mouseIsDown || gamepadButtonIsDown[0];
        let shot = 0;
        if (shootButton)
        {
            if (this.shootTimer.Elapsed())
            {
                if (!this.hasShot)
                {
                    this.HitEffect(2);
                    this.hasShot = 1;
                    this.shootTimer.Set(.3);
                    PlaySound(6);
                }
                else
                {
                    let big = this.charge==1
                    shot = big? 2: 1;
                    PlaySound(big?9:0);

                    let shots = this.multiShot+1;
                    let spread = (shots/2|0)*.5*(shots-1)
                    let count = big ? 1 : shots;
                    for(let i = count; i--;)
                    {
                        let d = new Vector2(1,0);
                        let p = i/(count-1);
                        let a = p*spread-spread/2;
                        if (shots == 2 )
                            a = i ? -.5 : 0;
                        d.Rotate(a);
                        //let b = big && (i == (count/2|0))
                        new Bullet(this.pos.Clone().AddXY(4/16,1/16), d, big);
                    }
                    this.charge = 0;
                    let shootRate = this.rapid == 0 ? .15 : this.rapid == 1 ? .12 : .08
                    this.shootTimer.Set(big?.3:shootRate);
                }
            }
        }
        else if (this.hasShot)
            this.charge = Clamp(this.charge+.02,0,1)
    
        // move input
        let acceleration = new Vector2();
        let analogControl = 0;
        if (mouseMode)
        {
            let targetPos = mousePosWorld.Clone();
            if (isTouchDevice)
                targetPos.AddXY(.25,0)
            acceleration = targetPos.Clone().Subtract(this.pos).Multiply(2);
            acceleration = acceleration.ClampLength(1);
            //let m = .02;
            //if (acceleration.x>-m && acceleration.x<m)
            //    acceleration.x=0;
            //if (acceleration.y>-m && acceleration.y<m)
            //    acceleration.y=0;
            analogControl = 1;
        }
        else if (isUsingGamepad)
        {
            acceleration = gamepadLeft.ClampLength(1);
            analogControl = 1;
            if (gamepadRight.x || gamepadRight.y)
                this.rotation = gamepadRight.Rotation();
            else if (acceleration.x || acceleration.y)
                this.rotation = acceleration.Rotation();
        }
        else
        {
            if (KeyIsDown(37))
                acceleration.x -= 1,this.rotation=0;
            if (KeyIsDown(39))
                acceleration.x += 1,this.rotation=2;
            if (KeyIsDown(38))
                acceleration.y -= 1,this.rotation=3;
            if (KeyIsDown(40))
                acceleration.y += 1,this.rotation=1;
        } 
        if (acceleration.x || acceleration.y)
        {
            // apply acceleration
            if (!analogControl)
                 acceleration.Normalize();

            let moveSpeed = .02;
            moveSpeed += Min(2,this.engines)*.01;
            acceleration.Multiply(moveSpeed);
            this.velocity.Add(acceleration);
            this.inputTimer.Set();
        }
        
        super.Update();
        
        this.pos.x = Clamp(this.pos.x,1.6,6.4);
        this.pos.y = Clamp(this.pos.y,.75,3.25);
        
        let ghostUpdate = {x:this.pos.x, y:this.pos.y, shot}
        currentPlayerGhost[levelFrame] = ghostUpdate;
    }

    GetPowerup(type)
    {
        powerupTimer.Set();
        if (type == 0)
        {
            PlaySound(10);
            ++this.multiShot;
            powerupText = '+Multi';
        }
        else if (type == 1)
        {   
            PlaySound(10);
            ++this.rapid;
            powerupText = '+Rapid';
        }
        else if (type == 2)
        {
            PlaySound(11);
            this.hasShield = 1;
            powerupText = '+Shield';
        }
        else if (type == 3)
        {
            PlaySound(10);
            ++this.engines;
            powerupText = '+Engine';
        }

        if (this.multiShot && this.rapid && this.hasShield && this.engines)
            localStorage['OS13kTrophy,🐓,Egg Time Rewind,Cock of the Walk'] = 'Got all powerups at the same time.';
    }
    
    Render()
    {
        if (this.IsDead())
            return;
        
        // figure out the tile, rotation and mirror
        this.tileX = (frame/2|0)%2;
        this.tileY = 0;
        
        if (this.charge >.25)
        {
            if ((frame/15|0)%2)
                setAlpha(.5);
            DrawTile(this.pos.Clone().AddXY(3/8,1/16),new Vector2(.5,.5),this.charge<1?0:1,6);
            setAlpha(1);
        }
            
        if (!this.hasShot)
            this.tileX = 2;

            //DrawTile(pos,size,tileX=0,tileY=0,angle=0,mirror=0,height=0,tilePixelSize=tileSize)
            
        if (this.hasShield)
        {
            setAlpha(Math.sin(time*8)*.2+.3);
            DrawTile(this.pos,vec2(1),2,0,0,0,0,16);
            setAlpha(1);
        }
        
        if (this.shieldTimer.IsSet() && !this.shieldTimer.Elapsed())
            setAlpha(Math.sin(time*16)*.2+.3);
        super.Render();
        setAlpha(1);
    }
    
    Damage(damage) 
    {
        // extra long damage timer for player
        if (!this.playerDamageTimer.Elapsed())
            return 0;
    
        // prepvent damage during intro/outro
        if (godMode)
            return 0;
        
        if (this.hasShield)
        {
            this.hasShield = 0;
            PlaySound(5);
            this.playerDamageTimer.Set(2);
            this.shieldTimer.Set(2);
            return 0;
        }
    
        // try to apply damage
        let damageDone = super.Damage(damage);
        if (!damageDone)
            return 0;
        
        PlaySound(3);
            
        this.HitEffect();
        this.playerDamageTimer.Set(1);
        return damageDone;
    }
    
    Kill()                  
    {  
        if (this.deadTimer.IsSet())
            return;
        
        playerLives--;
        
        playerGhosts.push(currentPlayerGhost);
        this.deadTimer.Set();
        this.HitEffect(3);
    }
}

///////////////////////////////////////////////////////////////////////////////
class PlayerGhost extends MyGameObject
{
    constructor(pos, ghostData) 
    {
        super(pos,0,0,.5,0);
        this.ghostData = ghostData;
        this.hasShot = 0;
    }
    
    Update() 
    {
        if (player.IsDead())
        {
            this.Kill();
            return;
        }
        
        let ghostData = this.ghostData[levelFrame];
        if (ghostData)
        {
            this.pos.x = ghostData.x;
            this.pos.y = ghostData.y;
            
            if (ghostData.shot)
            {
                this.hasShot = 1;
                new Bullet(this.pos.Clone().AddXY(4/16,1/16), new Vector2(1,0), ghostData.shot==2, 0, 1);
            }
        }
        else
            this.Kill();
    }
    
    Render()
    {

        // figure out the tile, rotation and mirror
        this.tileX = (frame/2|0)%2;
        this.tileY = 0;
        
        if (!this.hasShot)
            this.tileX = 2; 
        
        setAlpha(.3);
        super.Render();
        setAlpha(1);
    }
    
    Kill()                  
    {  
        this.HitEffect(.5);
        super.Kill();
    }
    
}
///////////////////////////////////////////////////////////////////////////////

class Bullet  extends MyGameObject
{
    constructor(pos, direction, isBig=0, team=0, ghost) 
    {
        super(pos,isBig?1:0,6,.5,isBig?1/16:1/32);
            
        this.ghost = ghost;
        this.team = team;
        this.isBig = isBig;
        this.throwFrames = 8;
        
        let speed = team==0? .2: .03;
        this.velocity = direction.Clone().Normalize(speed);
        //this.velocity.Add(owner.velocity.Clone());
        
        this.hitObjects=[];
        
        if (this.team == 1)
            this.tileX = 2;
        
        this.RenderOrder = this.team? -10 : 10;
    }
    
    CollideLevel(data, pos)
    {
        return super.CollideLevel(data, pos);
    }
    
    Update() 
    {
        if (this.pos.x>cameraPos.x+3 || this.pos.x<cameraPos.x-3 || this.lifeTimer > 3)
        {
            // kill if offscreen
            this.Destroy();
            return;
        }
        
        gameObjects.forEach(o=>
        {
            let isEnemy = (this.team == 0 && o.isEnemy) || (this.team == 1 && o.isPlayer);
            
            if (isEnemy && o.IsTouching(this) && !this.hitObjects.includes(o))
            {
                this.hitObjects.push(o);
                if (o.Damage(this.isBig?4:1, this))
                {
                    // apply damage
                    if (o.canBeDamaged)
                        o.velocity.Add(this.velocity.Clone(this.isBig?.4:.1));
                    this.damageTimer.Set();
                    if (!this.isBig)
                    {
                        this.Destroy();
                        return;
                    }
                }
            }
        });
        
        super.Update();
    }
    Render()
    {
        setAlpha(!this.team? this.ghost?.3:1:(Math.sin(time*30)*.25+.5))
        super.Render();
        setAlpha(1)
    }
}

///////////////////////////////////////////////////////////////////////////////

class Powerup extends MyGameObject
{
    constructor(pos)
    { 
        super(pos,0,5,.5,.5); 
        this.damping = .9;

        let types = [];
        if (player.multiShot < 2)
            types.push(0);
        else if (player.rapid < 2)
            types.push(1);
        else if (!player.hasShield)
            types.push(2);
        else if (player.engines < 2)
            types.push(3);
        if (types.length)
            this.type = types[RandInt(types.length)];
        else
            this.type = RandInt(4);
    }

    Update()
    {
        if (this.pos.x<cameraPos.x-3 )
        {
            // kill if offscreen
            this.Destroy();
            return;
        }
        
        let speed = GetLevelSpeed()/2
        this.pos.AddXY(-speed,0);

        if (!player.IsDead() &&player.IsTouching(this))
        {
            player.GetPowerup(this.type);
            this.Destroy();
            return;
        }
        
        super.Update();
    }

    Render()
    {
        //SetCanvasTransform(this.pos,new Vector2(1,1));

        if ((frame/20|0)%2)
            setAlpha(.1)

        let pos = this.pos;
        let drawPos = pos.Clone();
        drawPos.Multiply(tileSize*cameraScale).Round();
        drawPos.Subtract(cameraPos.Clone(tileSize*cameraScale));
        drawPos.Add(mainCanvasSize.Clone(.5));

        this.tileX = 5
        this.tileY = 0

        let c;
        
        if (this.type == 0) // multi shot
            c = 'M';
        else if (this.type == 1) // rapid fire
            c = 'R';
        else if (this.type == 2)// shield
            c = 'S';
        else if (this.type == 3) // engines
            c = 'E';
        DrawText(c,drawPos.x-3,drawPos.y-3,3,2,0,7,7);

        setAlpha(1)
    }
}


///////////////////////////////////////////////////////////////////////////////

class Enemy extends MyGameObject
{
    constructor(pos,tileX=0,tileY=0,size=.25,collisionSize=0,health=1)
    { 
        super(pos,tileX,tileY,size,collisionSize,health); 
        this.isEnemy = 1;
        this.damping = .9;
    }
    
    Damage(damage) 
    {
        let damageDone = super.Damage(damage);
        if (damageDone && !this.IsDead())
        {
            this.HitEffect(.5);
        }
        
        return damageDone;
    }
    
    Update()
    {
        if (player.IsTouching(this))
        if (player.Damage(1))
        {
            // push player when damaged
            //let accel = player.pos.Clone();
            //accel.Subtract(this.pos).Normalize(.1);
            //player.velocity.Add(accel);
        }
        
        super.Update();
    }
}

///////////////////////////////////////////////////////////////////////////////

class BigEgg  extends Enemy
{
    constructor(pos) 
    {
        super(pos,3,1,1,.45,levelEggHealth);
        this.damping = .95;
        this.renderOrder = -1;
    }
    
    Update()
    {
        if (levelFrame%(10+50*(this.health/this.healthMax|0))==0)
            this.angle += PI/2;
        
        if (this.pos.x > cameraPos.x + 3) 
            this.velocity.AddXY(-.02,0);

        this.pos.x = Min(this.pos.x, cameraPos.x + 3)

        if (this.pos.y < cameraPos.y - 1.4) 
            this.velocity.AddXY(0,.05);
        if (this.pos.y > cameraPos.y + 1.4) 
            this.velocity.AddXY(0,-.05);
            
        if (this.pos.x<cameraPos.x-4)
        {
            this.Destroy();
            return;
        }
        
        this.velocity.x -= .0013;
        super.Update();
    }
    
    Damage(damage, damageObject) 
    {
        if (damageObject)
        {
            let y = this.pos.y - damageObject.pos.y;
            this.velocity.AddXY(0,y/29);
        }

        eggHitTimer.Set();
        
        PlaySound(2);
        return super.Damage(damage, damageObject);
    }
    
    Render()
    {
        this.tileY = 1;
        if (this.health < this.healthMax *.8)
            this.tileY = 2;
        if (this.health < this.healthMax *.4)
            this.tileY = 3;
        
        DrawTile(this.pos, this.size,this.tileX,this.tileY,this.angle,0,0,16);
    }
    
    Kill()
    {
        PlaySound(7);
        levelEggHealth += 10;
        AddToScore(10);
        
        new Powerup(this.pos.Clone());

        //AddToScore(50);
        this.HitEffect(2);
        eggHitTimer.UnSet();
        super.Kill();
    }
    
    Destroy()
    {
        egg = 0;
        eggTimer.Set(Rand()*3+5);
        super.Destroy();
    }
}

///////////////////////////////////////////////////////////////////////////////

class BasicEnemy extends Enemy
{
    constructor(pos, type=0)
    {
        if (GetDifficulty() > .5 && LevelRandom() < .1*GetDifficulty())
        {
            // extra randomness
            type = LevelRandom()*5|0;
        }
        
        let health = 4;
        if (type == 3)
            health = 1e3;
        super(pos,0,1+type,.5,.2, health); 
        this.type = type;
        this.moveOffset = ++enemyMoveOffset;
        this.shootTimer = new Timer();
        this.shootTimer.Set((enemyMoveOffset%8)/4);
        this.mode = 0;
        
        if (this.type == 3)
            this.canBeDamaged = 0;
    }
    
    Update()
    {
        if (this.pos.x<cameraPos.x-3 || this.pos.x>cameraPos.x+5)
        {
            // kill if offscreen
            this.Destroy();
            return;
        }
        
        let speed = GetLevelSpeed()
        if (this.type != 2 || player.IsDead())
            this.pos.AddXY(-speed,0);
        
        if (this.type == 0) // ufo
        {
            if (this.mode == 0 && this.pos.x < cameraPos.x-2.4)
                this.mode = 1;
            
            if (this.mode == 1)
                this.pos.AddXY(3*speed,0);
                
            this.tileX = ((frame+enemyMoveOffset)/36|0)%3;
        }
        else if (this.type == 1) // squid
        {
            let accel = new Vector2();
            accel.y = Math.sin(this.lifeTimer*2 + this.moveOffset )*.002;
            this.velocity.Add(accel);

            this.tileX = ((frame+enemyMoveOffset)/36|0)%3;
        }
        else if (this.type == 2) // ghost
        {
            if (!player.IsDead())
            {
                let accel = player.pos.Clone().Subtract(this.pos);
                accel.Normalize(.004);
                this.velocity.Add(accel);
            }
            this.tileX = ((frame+enemyMoveOffset)/10|0)%4;
        }
        else if (this.type == 3) // blocker
        {
            //this.velocity.AddXY(-move,0);
            this.collisionSize = .25;
        }
        else if (this.type == 4) // shooter
        {
            if (this.shootTimer.Elapsed())
            {
                let direction = player.pos.Clone().Subtract(this.pos).Normalize();
                
                let b = new Bullet(this.pos, direction, 1, 1);
                PlaySound(8);
            }
                
            if (!this.shootTimer.IsSet() || this.shootTimer.Elapsed())
                this.shootTimer.Set(2);
            
            this.tileX = this.shootTimer.IsSet() && this.shootTimer > -.5? 1:0;
        }
        
        super.Update();
    }
    
    Kill()
    {
        PlaySound(6);
        AddToScore(1);
        super.Kill();
    }
    
    Damage(damage) 
    {
        PlaySound(this.canBeDamaged?1:5);
        return super.Damage(damage);
    }
}


///////////////////////////////////////////////////////////////////////////////
// level builder
    
let levelStartSeed = Date.now();
let levelSeed = 0;
let levelSpawnTimer=new Timer();
let levelEnemyType=0;
let enemyMoveOffset = 0;
let levelSpeed = .02;
const GetLevelSpeed=()=>levelSpeed*Lerp(GetDifficulty(),1,3)

function GetDifficulty()
{
    if (gameMode != 0)
        return 0;
    let p = levelTimer / 120;
    return Clamp(p, 0, 1);
}

// random seeded float
let LevelRandom=_=>
{ 
    levelSeed^=levelSeed<<13;
    levelSeed^=levelSeed>>7;
    levelSeed^=levelSeed<<17;
    return Math.abs(levelSeed)%(1e9-1)/1e9;
}

function RestartLevel()
{
    enemyMoveOffset = 0;
    levelSeed = levelStartSeed;
    levelEnemyType = -1;
    levelSpawnTimer.Set();
    levelEggHealth = 20;
}

function SpawnEnemies()
{
    if (!spawnEnemies)
        return;
   
    // spawn more enemies
    let spawnPos = cameraPos.Clone();
    spawnPos.AddXY(3,0)
    
    let nextSpawnTime = 0;
    let difficulty = GetDifficulty();

    let spawnType = levelEnemyType;
    if (difficulty > .9 && LevelRandom() < .4*difficulty)
        spawnType = LevelRandom()*5|0;

    if (levelEnemyType == 0) // ufo
    {
        spawnPos.AddXY(0,-2);
        spawnPos.AddXY(0,LevelRandom()*.5-.25);
        let count = difficulty > .6 ? 3 : difficulty > .3 ? 2 : 1;
        if (count > 1 && LevelRandom() < .5)
            count--

        for(let i=count;i--;)
        {
            new BasicEnemy(spawnPos.AddXY(0,1), spawnType);
        }
        nextSpawnTime = 1;
    } 
    else if (levelEnemyType == 1) // squid
    {
        spawnPos.AddXY(-1,0);
        let count = difficulty > .5 ? 4 : difficulty > .2 ? 3 : 2;
        count += LevelRandom()*2|0;
        for(let i=count;i--;)
            new BasicEnemy(spawnPos.AddXY(1,0), spawnType);
        nextSpawnTime = count-.5;
    }
    else if (levelEnemyType == 2) // ghost
    {
        spawnPos.AddXY(0,LevelRandom()*2-1);
        let count = 1;
        if (difficulty > .6 && LevelRandom() > .5)
            count++;
        if (difficulty > .3 && LevelRandom() > .5)
            count++;
        for(let i=count;i--;)
            new BasicEnemy(spawnPos.AddXY(1,LevelRandom()-.5), spawnType);
        nextSpawnTime = .5;
    } 
    else if (levelEnemyType == 3) // block
    {
        let subtype = LevelRandom()*3|0;
        if (difficulty > .5 && LevelRandom() < .2)
            subtype= 3;
        if (difficulty > .5 && LevelRandom() < .2)
            subtype= 4;
        spawnPos.AddXY(0,subtype<2?-2:-.5);
        let count = 4;
        if (subtype==1)
            count = 5, spawnPos.AddXY(0,-.25);
        if (subtype==3)
        {
            count = 3; 
            spawnPos.AddXY(0,-.5);
        }
        if (subtype==4)
        {
            count = 3;
            if (LevelRandom() < .2*difficulty)
                ++count;
        }
        for(let i=count;i--;)
        {
            new BasicEnemy(spawnPos.AddXY(0,.5), spawnType);
            if (subtype == 1 && i == 2)
                spawnPos.AddXY(0,1)
            if (subtype == 4)
                spawnPos.AddXY(.5,-.5 + (LevelRandom()*5-3|0)*.5)
        }
        nextSpawnTime = 1;
    }
    else if (levelEnemyType == 4) // shooter
    {
        spawnPos.AddXY(0,LevelRandom()*2-1);
        new BasicEnemy(spawnPos, 4);
        if (difficulty > .5 && LevelRandom() < difficulty*.3)
            new BasicEnemy(spawnPos.AddXY(1,(LevelRandom()*3-1|0)/2), spawnType);

        nextSpawnTime = .5;
    } 
    
    let extraTime = Lerp(GetDifficulty(), 2 - LevelRandom()*.5, 0)
    levelSpawnTimer.Set(nextSpawnTime + extraTime);
}

function UpdateLevel()
{
    ++levelFrame;
    
    if (levelSpawnTimer.Elapsed())
    {
        SpawnEnemies(levelEnemyType);
        levelEnemyType = LevelRandom()*5|0;
    }
    
    if (!egg && eggTimer.Elapsed())
        egg = new BigEgg(cameraPos.Clone().AddXY(3,Rand()*2-1));
}

function AddToScore(score)
{
    /*if ((playerScore/50|0) != ((playerScore+score)/50|0))
    {
        // extra life 
        playerLives++;
    }*/
    playerScore += score;
    scoreTimer.Set();
    
    if (playerScore > 100)
    {
        localStorage['OS13kTrophy,🥚,Egg Time Rewind,Soft Boiled'] = 'Got 100 Points';
        if (playerScore > 500)
           localStorage['OS13kTrophy,🐣,Egg Time Rewind,Hard Boiled'] = 'Got 500 Points';
    }

    if (!localStorage[highScoreKey] || playerScore > localStorage[highScoreKey])
    {
        localStorage[highScoreKey] = playerScore;
        newHighScore = 1;
    }
}

///////////////////////////////////////////////////////////////////////////////
// level transition system

let transitionTimer = new Timer();
let transitionCanvasContext = transitionCanvas.getContext('2d');

function StartTransiton()
{
    // copy main canvas to transition canvas
    transitionTimer.Set();
    transitionCanvas.width = mainCanvasSize.x;
    transitionCanvas.height = mainCanvasSize.y;
    transitionCanvasContext.drawImage(mainCanvas,0,0);
}

function UpdateTransiton()
{
    let transitionTime = transitionTimer.Get();
    if (transitionTime > .5 || transitionTime < 0)
        return;
        
    let p = transitionTime/.5;
    let w = mainCanvas.width;
    let h = mainCanvas.height;
    
    //mainCanvasContext.drawImage(transitionCanvas,0,p*99);
    
    for(let j=8;j--;)
    {
        let dWidth = w;
        let dHeight = 8*(1-p)|0;
        let sx = 0;
        let sy = j*8+(8-dHeight);
        let x = 0;
        let y = sy;
        
        if (sy > 0 && dHeight > 0)
            mainCanvasContext.drawImage(transitionCanvas,0,sy,w,dHeight,0,sy,w,dHeight);
    }
}

///////////////////////////////////////////////////////////////////////////////
// ZzFXmicro - Zuper Zmall Zound Zynth - MIT License - Copyright 2019 Frank Force
let zzfx_v=volume;
let zzfx_x=0;
let zzfx=(e,f,a,b=1,d=.1,g=0,h=0,k=0,l=0)=>{if(!zzfx_x)return;let S=44100;a*=2*PI/S;a*=1+RandBetween(-f,f);g*=1E3*PI/(S**2);b=S*b|0;d=d*b|0;k*=2*PI/S;l*=PI;f=[];for(let m=0,n=0,c=0;c<b;++c)f[c]=e*zzfx_v*Math.cos(m*a*Math.cos(n*k+l))*(c<d?c/d:1-(c-d)/(b-d)),m+=1+RandBetween(-h,h),n+=1+RandBetween(-h,h),a+=g;e=zzfx_x.createBuffer(1,b,S);a=zzfx_x.createBufferSource();e.getChannelData(0).set(f);a.buffer=e;a.connect(zzfx_x.destination);a.start()}


let beatTimer = new Timer(0);
let beatCount = 0;
if (typeof AudioContext === 'undefined') { AudioContext = webkitAudioContext }
function UpdateMusic()
{
    InitZZFX();
    if (!soundEnable || !zzfx_x)
        return
    if (!zzfx_x || zzfx_x.state != 'running')
    {
        zzfx_x.resume();
        return;
    }

    if (bonusGame)
    {
        gameMode = 0;
        if (mouseWasPressed)
            return;
    }

    if (gameMode == 3)
    {
        beatCount = 0;
        return;
    }

    // update music
    if (beatTimer.Elapsed())
    {
        ++beatCount;
        let dif = GetDifficulty();
        let musicMode = gameMode
        let measureLength = musicMode == 1? 3 : 4;

        if (bonusGame)
            beatTimer.Set(.1);
        else if (musicMode == 2)
            beatTimer.Set(.1);
        else if (musicMode == 0)
            beatTimer.Set(Lerp(dif,.25, .1));
        else
            beatTimer.Set(.2);

        // bass
        if (beatCount>(bonusGame?4:8) && ((beatCount%(beatCount+2)<1) || !RandInt(4)))
        {
            let scale1 = [-5,0,2,7]; // major pentatonic scale
            let scale2 = [-5,-2,0,2,4,7]; // major pentatonic scale
            let scale3 = [0,3,5,7,11,12]; // minor pentatonic scale
            let scale = bonusGame? scale3 : musicMode == 0 ? scale2 : scale1;
            let noteIndex = RandInt(scale.length)

            // play the note
            let volume = .6;
            let note = scale[noteIndex]-12;
            let length = .2;(RandInt(2)+1)/2;
            let attack = .01
            let noise = .5;

            zzfx(volume, 0, 220*2**(note/12), length, attack, 0, noise);
        }

        // chords
        if (!bonusGame)
        if (beatCount>(musicMode==0?0:24) && ((beatCount%(measureLength)==0) || !RandInt(musicMode==1? 4 : 9)))
        {
            let scale1 = [0,4,5,10,12]; // major pentatonic scale
            let scale2 = [0,4,7,12]; // major pentatonic scale
            let scale = musicMode == 0 ? scale2 : scale1;
            let noteIndex = RandInt(scale.length)

            // play the note
            let volume = .4;
            let note = scale[noteIndex];
            let length = (RandInt(2)+1)/4;
            let attack = .03
            let noise = .1;

            if (musicMode == 1 || eggHitTimer.IsSet() && eggHitTimer < 1)
                zzfx(volume, 0, 220*2**(note/12), length, attack, 0, noise);

            if (musicMode == 1 && Rand() < .3)
            {
                let noteIndex2 = RandInt(scale.length)
                if (noteIndex2 != noteIndex)
                {
                    let note = scale[noteIndex2];
                    zzfx(volume, 0, 220*2**(note/12), length, attack, 0, noise);
                }
            }
        }
        
        // precussion
        if (1)
        {
            if (beatCount%measureLength==0||!RandInt(9))
                zzfx(.4,.2,1e3,.01,.05,.8,21,51); // ZzFX  highhat
            if (beatCount%(bonusGame?3:2)==0||!RandInt(9))
                zzfx(.5,.2,150,.02,.002,.1,1,.5,.15); // ZzFX 17553 kick
        }
    }
}

function InitZZFX()
{
    if (!zzfx_x)
    {
        // fix compatibility issues with old web audio
        const audioContext = new (window.AudioContext || webkitAudioContext);
        audioContext.Z = audioContext.createBufferSource;
        audioContext.createBufferSource =
        (s = audioContext.Z())=>
        (
            s.start = s.start || (t => audioContext.noteOn (t)),
            s.stop  = s.stop  || (t => audioContext.noteOff(t)),
            s
        );
    
        zzfx_x = audioContext;
    }      
}

function PlaySound(sound, p=0)
{
    InitZZFX();
    if (!soundEnable || !zzfx_x || zzfx_x.state != 'running')
    {
        zzfx_x.resume();
        return;
    }

    switch(sound)
    {
        case 0: // shoot
            zzfx(.7,.05,899,.2,.02,-8,1,0,0); // ZzFX 10453
            //zzfx(1,.1,5504,.1,.1,-30,.5,.5,.33); // ZzFX 36695
            break;
            
        case 1: // enemy hit
            zzfx(.7,.05,1821,.05,.05,.1,3,13,.64); // ZzFX 10119
            break;
            
        case 2: // egg hit
            zzfx(1,.05,110,.2,.99,.5,3.9,.7,.43); // ZzFX 65151
            break;
            
        case 3: // player die
            zzfx(1.5,.05,111,2,.1,-1,5,0,0); // ZzFX 73670
            break;
            
        case 4: // start
            zzfx(1,.05,5,1,.1,0,.4,44.1,.88); // ZzFX 31713
            break;
            
        case 5: // cant damage hit
            zzfx(1,.05,1671,.05,.22,0,0,0,0); // ZzFX 18784
            break;
            
        case 6: // enemy die
            zzfx(1,.05,1381,.25,.05,4,3.1,1,0); // ZzFX 82807
            break;
            
        case 7: // egg die
            zzfx(1.2,.05,55,2,.05,-0.3,3,8,0); // ZzFX 62469
            //zzfx(1.2,.05,105,1,.1,.3,2.8,40.3,0); // ZzFX 45049
            break;
            
        case 8: // enemy shoot
            zzfx(1,.05,5504,.1,.1,-30,.5,.5,.33); // ZzFX 36695
            break;
            
        case 9: // powerup shoot
            zzfx(1.2,.05,499,.5,.02,-2,1,1,0); // ZzFX 10453
            break;
            
        case 10: // powerup
            zzfx(1,.05,1364,.4,.34,2.9,1,2.4,.83);
            break;

        case 11: // life
            zzfx(1,0,805,1.1,.71,.5,1.5,.5);  // ZzFX 16886
            break;
    }
}

///////////////////////////////////////////////////////////////////////////////
// font

let fontImage = 0; 
let fontCellWidth = 0;
let fontCellHeight = 0;
let fontGlyphWidth = 0;
let fontGlyphHeight = 0;

function InitText(filename, cellWidth, cellHeight, glyphWidth, glyphHeight)
{
    fontImage = new Image();
    fontImage.src = filename;
    fontCellWidth = cellWidth;
    fontCellHeight = cellHeight;
    fontGlyphWidth = glyphWidth? glyphWidth:cellWidth;
    fontGlyphHeight = glyphHeight? glyphHeight:cellHeight;
}

function DrawText(text, posX, posY, font, align, waveHeight, glyphWidth=fontGlyphWidth, glyphHeight=fontGlyphHeight)
{
    if (!fontImage)
        return;
        
    let printText = (""+text).toUpperCase();
    let sy = font? font*fontCellHeight:0;
    let x = posX;
    if (align)
    {
        let gap = fontCellWidth - glyphWidth;
        let textWidth = printText.length*glyphWidth-gap;
        if (align==1)
            x -= textWidth;  // right align
        else if (align==2)
            x -= textWidth/2;// center align
    }
    x = x|0;
    for(let i=0;i<printText.length;i++)
    {
        let y = posY;
        if (waveHeight)
            y += Math.sin(x/6+time*4)*waveHeight|0;
        let charCode = printText.charCodeAt(i);
        charCode = Clamp(charCode-32,0,127);
        let sx = charCode*fontCellWidth;
        mainCanvasContext.drawImage(fontImage,sx,sy,glyphWidth,glyphHeight,x,y,glyphWidth,glyphHeight);
        x += glyphWidth;
    }
}

///////////////////////////////////////////////////////////////////////////////

// load texture and kick off init
let tileImage = new Image();
tileImage.onload=_=>Init();
tileImage.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABAAgMAAADXB5lNAAAACVBMVEUAADb///8AAAC4dRMZAAAAAXRSTlMAQObYZgAAAX1JREFUeNp9kb+u2jAUxo+rJhJMQYLFO0ufIgzt7KFBJBNDiGo/RR8hC6jxxGBHsp+yPrET6+jq3u9j8Y/zP8AEE4WArNKUhhsAOP1OoC/7BdQsgl8hQjkAFhD8eAM0QQi+A1Rg/wD8bIoFVMj0P1i6cBPBfgoAVYgIdlrjA51AcwXgBp3AM4BmUaphFcDj1YZfbJvmQKXBAHINEGxtic7LfVRRo9MDi/ERHd/M+xqUQUdQej/C0KMzIBHcewMngYYMDhU6AuW9A1ZV1QEyCANGb0C56A0MU/TnIKekthmkSR9Wyq69PrflhDgei+JyWdenh0IQ6+d7INxUKrzH9AXg2vckhQ/e5Ii8PgXLl8vAtsu3zcBZkEErkNrhPR7tFtF5AnAOQ1LK2Y2kKJt9TdpuY3/7S8D+vbuv99B1+Pd8O9/W9fUIu/v59nqtQFHAJ9+TFD44Q4rKeXakrXQdgqzB2ZaA6zxZAqSeaIrqtCSA68EQUFo3EoD3IADX/w8gRcFYoF/qXwAAAABJRU5ErkJggg==';