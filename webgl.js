
////////////////////////////////////////////////////////////////////////////////
// WEBGL STUFF
////////////////////////////////////////////////////////////////////////////////

document.body.appendChild(canvas_webgl)
const styleCanvas = 'position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);image-rendering:-moz-crisp-edges;image-rendering:pixelated;'
canvas_webgl.style = styleCanvas;

let shaderTime = 0;
let shaderProgram;
let canvasContext_webgl = canvas_webgl.getContext('webgl2');

function InitWebGL()
{
    const x = canvasContext_webgl;
        
    // pass through vertex shader
    const vertexShader = x.createShader(x.VERTEX_SHADER);
    x.shaderSource(vertexShader, "#version 300 es\nin vec4 p;void main(){gl_Position=p;}");
    x.compileShader(vertexShader);

    // flip y axis
    x.pixelStorei(x.UNPACK_FLIP_Y_WEBGL, true);
    
    // create textures
    x.activeTexture(x.TEXTURE0);
    const texturePassThrough = x.createTexture();
    x.bindTexture(x.TEXTURE_2D, texturePassThrough);
    x.texParameteri(x.TEXTURE_2D, x.TEXTURE_MIN_FILTER, x.NEAREST);
    x.texParameteri(x.TEXTURE_2D, x.TEXTURE_MAG_FILTER, x.NEAREST);
    
    // create vertex buffer that is just 1 giant triangle with corner at 1,1
    const vertexBuffer = x.ARRAY_BUFFER;
    x.bindBuffer(vertexBuffer, x.createBuffer());
    x.bufferData(vertexBuffer, new Int8Array([-3,1,1,-3,1,1]), x.STATIC_DRAW);
    x.enableVertexAttribArray(0);
    x.vertexAttribPointer(0, 2, x.BYTE, 0, 0, 0); // 2D vertex
    
    {
        // init shader program
        shaderProgram = x.createProgram();
        x.attachShader(shaderProgram, vertexShader);

        const pixelShader = x.createShader(x.FRAGMENT_SHADER);
        x.shaderSource(pixelShader,
            "#version 300 es\n" +
            "#define HW_PERFORMANCE 0\n" +
            "precision mediump float;"+
            "uniform vec3 iResolution;"+
            "uniform float iTime;"+
            "uniform float iTimeDelta;"+
            "uniform int iFrame;"+
            "uniform int iFrameRate;"+
            "uniform vec4 iMouse;"+
            "uniform sampler2D iChannel0;"+
            "out vec4 outColor;\n"+
            staticShaderCode+
            "\nvoid main(){mainImage(outColor,gl_FragCoord.xy);outColor.a=1.;}"
            //"\nvoid main(){outColor=vec4(1.,0.,0.,1.);}"//test red
        );
        x.compileShader(pixelShader);
        
        if (!x.getShaderParameter(pixelShader, x.COMPILE_STATUS))
            throw new Error('SHADER ERROR!\n' + x.getShaderInfoLog(pixelShader));

        x.attachShader(shaderProgram, pixelShader);
        x.linkProgram(shaderProgram);
        if (!x.getProgramParameter(shaderProgram, x.LINK_STATUS))
            throw new Error('LINK ERROR!\n' + x.getProgramInfoLog(shaderProgram));
    }
}

function RenderShader()
{
        shaderTime += 1/60;
    let mouseX = 1, mouseY = 1;

    const x = canvasContext_webgl;
    let w = 1920;mainCanvas.width*16;
    let h = 1080;mainCanvas.height*16;

    

    canvas_webgl.width = w;
    canvas_webgl.height = h;
    
    let aspect = innerWidth/innerHeight;
    
    if (aspect > w/h)
    {
        canvas_webgl.style.width = ''
        canvas_webgl.style.height = '100%'
    }
    else
    {
        canvas_webgl.style.width = '100%'
        canvas_webgl.style.height = ''
    }
    
    // set testures
    x.activeTexture(x.TEXTURE0);
    //x.texImage2D(x.TEXTURE_2D, 0, x.RGBA, x.RGBA, x.UNSIGNED_BYTE, canvas_webgl);
    x.texImage2D(x.TEXTURE_2D, 0, x.RGBA, x.RGBA, x.UNSIGNED_BYTE, mainCanvas);
    x.viewport(0, 0, w, h);
    
    {
        let mouseX=0, mouseY=0, mouseZ=0, mouseW=0;

        x.useProgram(shaderProgram);
        x.uniform3f(x.getUniformLocation(shaderProgram,"iResolution"),w,h,1);
        x.uniform1f(x.getUniformLocation(shaderProgram,"iTime"),shaderTime);
        x.uniform1f(x.getUniformLocation(shaderProgram,"iTimeDelta"),1/60);
        x.uniform1f(x.getUniformLocation(shaderProgram,"iFrame"),frame);
        x.uniform1f(x.getUniformLocation(shaderProgram,"iFrameRate"),60);
        x.uniform1i(x.getUniformLocation(shaderProgram,"iChannel0"),0);
        x.uniform4f(x.getUniformLocation(shaderProgram,"iMouse"),mouseX, mouseY,mouseZ,mouseW);
        x.drawArrays(x.TRIANGLE_FAN, 0, 3);
        
        // feedback
        //x.activeTexture(x.TEXTURE0);
        //x.texImage2D(x.TEXTURE_2D, 0, x.RGBA, x.RGBA, x.UNSIGNED_BYTE, canvas_webgl);
    }
}

const testShaderCode = 
`
void mainImage(out vec4 c, in vec2 p)
{
    vec2 uv = p/iResolution.xy;
    c = vec4(.5+.5*cos(iTime+uv.xyx+vec3(0,2,4)),1);
    c += iMouse/iResolution.xyxy; // mouse input
    //c = texture(iChannel0,uv); // custom image
}
`;

const staticShaderCode = 
`
const float scanlines = .4;
const float fuzz = .002;
const float fuzzDensity = 999.;
const float chromatic = .003;
const float staticNoise = .2;
const float vignette = 1.3;
const float pi = 3.14159265359;
const float startTime = 2.;

float hash(vec2 p)
{
    p  = 50.0*fract( p*0.3183099 + vec2(0.71,0.113));
    return -1.0+2.0*fract( p.x*p.y*(p.x+p.y) );
}

float noise( in vec2 p )
{
    vec2 i = floor( p );
    vec2 f = fract( p );
	vec2 u = f*f*(3.0-2.0*f);
    return mix( mix( hash( i + vec2(0.0,0.0) ), 
                     hash( i + vec2(1.0,0.0) ), u.x),
                mix( hash( i + vec2(0.0,1.0) ), 
                     hash( i + vec2(1.0,1.0) ), u.x), u.y);
}

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    vec2 uv = fragCoord/iResolution.xy;
    
    float startp = pow(iTime/startTime,2.0);
    vec2 scale = min(vec2(1.),max(vec2(0.),.003+pow(vec2(.05)+min(vec2(1.),startp*vec2(3,1.)),vec2(4.))));
    
    uv -= .5;
    //uv *= min(1.,(startTime)/(iTime));
    uv /= scale;
    
    // fuzz on edges
    uv.x += fuzz*noise(vec2(uv.y*fuzzDensity, iTime*9.));
    
    vec2 uv2 = uv + .5;

    // noise
    vec4 c = vec4(0);
    c += staticNoise * ((sin(iTime)+2.)*.3)*sin(.8-uv2.y+sin(iTime*3.)*.1) *
        noise(vec2(uv.y*999. + iTime*999., (uv2.x+999.)/(uv2.y+.1)*19.));
    
    float startPercent = min(1.,max(0.,iTime/startTime));

    // chromatic aberration
    float chromatic2 = chromatic + (1.-startPercent)*.1;
    c += vec4
    (
        texture(iChannel0, min(uv2 + vec2(chromatic2*2., 0), .99)).r,
        texture(iChannel0, min(uv2 + vec2(chromatic2*1., 0), .99)).g,
        texture(iChannel0, min(uv2 + vec2(chromatic2*0., 0), .99)).b,
        1.
    );
    
    // scanlines
    c *= 1.3 + scanlines*sin(uv.y*iResolution.y*pi/2.);
  
    // vignette
    uv += .5;
	float dx = vignette * abs(uv.x - .5);
	float dy = vignette * abs(uv.y - .5);
    c *= (1.0 - dx * dx - dy * dy);
    
    //c += 1./min(startTime+.01,iTime+.01);
    
    //c+= max(0.,1.-iTime)*length(uv);
    //uv2.x = max(0.,min(1.,uv.x + .5));
   // uv2.y = max(0.,min(1.,uv.y + .5));
    
    //c += vec4(min(0.,1./length(uv)));
    

    float aveC = (c.x + c.y + c.z) / 2.0;

    c += pow(1. - min(1., iTime/startTime),.5);

    fragColor = c;

    if(floor(uv.x)!=0. || floor(uv.y)!=0.)
    {
    	fragColor*= 0.;
    }
}
`;
