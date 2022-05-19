class Punkt{
    constructor(x, y){
        this.x = x;
        this.y = y;
    }

    skaler(faktor){
        return new Punkt(this.x * faktor, this.y * faktor);
    }

    add(annetPunkt){
        return new Punkt(this.x + annetPunkt.x, this.y + annetPunkt.y);
    }

    sub(annetPunkt){
        return new Punkt(this.x - annetPunkt.x, this.y - annetPunkt.y);
    }

    lengde(){
        return Math.sqrt(this.x ** 2 + this.y ** 2);
    }

    div(faktor){
        return this.skaler(1 / faktor);
    }

    normaliser(){
        return this.div(this.lengde());
    }

    indreProdukt(annetPunkt){
        return this.x * annetPunkt.x + this.y * annetPunkt.y;
    }

    ytreProdukt(annetPunkt){
        return this.x * annetPunkt.y - this.y * annetPunkt.x;
    }
    
    distanse(annet){
        return this.sub(annet).lengde();
    } 
}

// let punkt1 = new Punkt(10, 20);
// let punkt2 = new Punkt(20, 30);
// let sum = punkt1.add(punkt2);
// console.log(sum);

// JSON format
leveler = [
    {
        "namn": "Level1",
        "planeter": [
            {
                "type": "jorda",
                "sentrum": new Punkt(550, 375),
                "radius": 250
            },
            {
                "type": "mane",
                "sentrum": new Punkt(200, 200),
                "radius": 70
            }
        ],
        "flagg": {"planet": 0, "vinkel": 0.0},
        "ball": {"planet": 1, "vinkel": 3.14},
        "par": 3
    },
    {
        "namn": "Level2",
        "planeter": [
            {
                "type": "venus",
                "sentrum": new Punkt(800, 540),
                "radius": 140
            },
            {
                "type": "mars",
                "sentrum": new Punkt(280, 175),
                "radius": 80
            },
            {
                "type": "pluto",
                "sentrum": new Punkt(500, 275),
                "radius": 40
            },
            {
                "type": "merkur",
                "sentrum": new Punkt(700, 250),
                "radius": 70
            },
            {
                "type": "neptun",
                "sentrum": new Punkt(400, 480),
                "radius": 150
            }
        ],
        "flagg": {"planet": 0, "vinkel": 0.0},
        "ball": {"planet": 1, "vinkel": 3.14},
        "par": 4
    },
    {
        "namn": "Level3",
        "planeter": [
            {
                "type": "mane",
                "sentrum": new Punkt(100, 600),
                "radius": 70
            },
            {
                "type": "pluto",
                "sentrum": new Punkt(900, 100),
                "radius": 50
            }
        ],
        "flagg": {"planet": 1, "vinkel": 5.49},
        "ball": {"planet": 0, "vinkel": 2.35},
        "par": 5
    }
];

// definerer konstanter
const BALL_RADIUS = 5;
const SKUDD_STYRKE = 5;
const FRIKSJON_KOEFFISIENT = 0.08;
let width, height;
let brukerDrar = false;
let draStart = null;
let draNoverande = null;

function hentPosisjonPaCanvas(canvas, punktPaClient){
    let rect = canvas.getBoundingClientRect(); // Inneheld informasjon om x og y koordinater for øverste venstre hjørne
    let oversteVenstreHjorne = new Punkt(rect.left, rect.top);
    let posisjonPaCanvas = punktPaClient.sub(oversteVenstreHjorne);
    
    return posisjonPaCanvas;
}

function handleMouseDown(canvas, event){
    brukerDrar = true;
    let klikkPunkt = new Punkt(event.clientX, event.clientY); // Klikk-posisjon relativt til dokument
    draStart = hentPosisjonPaCanvas(canvas, klikkPunkt); // Klikk-posisjon relativt til canvas
}

function handleMove(canvas, event){
    let klikkPunkt = new Punkt(event.clientX, event.clientY); // Dra-posisjon relativt til dokument
    draNoverande = hentPosisjonPaCanvas(canvas, klikkPunkt); // Dra-posisjon relativt til canvas
}

let infoSkudd = "";
let levelNum = 0;
let antallSkudd = 0;
infoSkudd = "Du har " + (leveler[levelNum].par - antallSkudd) + " av " + leveler[levelNum].par + " skudd igjen";

function handleMouseUp(){
    brukerDrar = false;
    antallSkudd++;
    infoSkudd = "Du har " + (leveler[levelNum].par - antallSkudd) + " av " + leveler[levelNum].par + " skudd igjen";
    if (antallSkudd <= leveler[levelNum].par){
        skytBall();
    } else {
        lastInnLevel();
    }
}

function skytBall(){
    if(draStart === null){
        return;
    }
    let delta = draNoverande.sub(draStart);
    let deltaLengde = delta.lengde();
    if (deltaLengde === 0){
        return;
    }
    let deltaNormert = delta.normaliser(); // retningsvektor, normert - delt på sin eigen lengde slik at lengden blir lik 1
    let maksLengde = Math.min(deltaLengde, 100);
    delta = deltaNormert.skaler(maksLengde);

    ball.vel = delta.skaler(- SKUDD_STYRKE / 1000); // fart motsett veg av retningen den dras i

    sfx.golfHit.currentTime = 0;
    sfx.golfHit.play();
}

let ctx; // udefinert
let ball = {"pos": new Punkt(0, 0), "vel": new Punkt(0, 0)};

function imgFraUrl(url){
    let img = new Image();
    img.src = url;
    return img;
}

// url til alle planetbildene
imgPlaneter = {
    "mane": imgFraUrl("/spacegolf/planetbilder/mane.png"),
    "jorda": imgFraUrl("/spacegolf/planetbilder/jorda.png"),
    "venus": imgFraUrl("/spacegolf/planetbilder/venus.png"),
    "mars": imgFraUrl("/spacegolf/planetbilder/mars.png"),
    "pluto": imgFraUrl("/spacegolf/planetbilder/pluto.png"),
    "merkur": imgFraUrl("/spacegolf/planetbilder/merkur.png"),
    "neptun": imgFraUrl("/spacegolf/planetbilder/neptun.png")
}

// url til bakgrunnsbilde
bakgrunnImg = imgFraUrl("/spacegolf/planetbilder/space.jpeg");

// lyder, https://mixkit.co/free-sound-effects/golf/, https://pixabay.com/music/meditationspiritual-starlight-meditation-10986/
function lastSfx(url){
    let audio = new Audio(url);
    return audio;
}

sfx = {
    "golfHit": lastSfx('/spacegolf/lyd/hit.wav'),
    // "thud": lastSfx("/spacegolf/lyd/thud.wav"),
}

musikk = new Audio("/spacegolf/lyd/bakgrunnsmusikk.mp3");
musikk.loop = true;

function settMusikkStatus(){
    let localStoreStatus = window.localStorage.getItem("pauseMusic") === "true";
    if(localStoreStatus !== musikk.paused){
        toggleMute();
    }
}

function toggleMute(){
    if(musikk.paused){
        musikk.play();
        window.localStorage.setItem("pauseMusic", "false");
    } else {
        musikk.pause();
        window.localStorage.setItem("pauseMusic", "true");
    }
}

// tegning
function tegnPlanet(planet){
    ctx.beginPath();
    let planetHjorne = planet.sentrum.sub(new Punkt(planet.radius, planet.radius)); // venstre hjørne
    ctx.drawImage(imgPlaneter[planet.type], planetHjorne.x, planetHjorne.y, 2 * planet.radius, 2 * planet.radius); // drawImage(image, dx, dy, dWidth, dHeight) https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/drawImage
}

function tegnBall(){
    ctx.beginPath();
    ctx.arc(ball.pos.x, ball.pos.y, BALL_RADIUS, 0, 2 * Math.PI); // arc(x, y, radius, startAngle, endAngle) https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/arc
    ctx.fillStyle = "#ffffff";
    ctx.fill();
}

function flaggLinje(){
    let flaggPlanet = level.planeter[level.flagg.planet];
    let flaggVinkel = level.flagg.vinkel;
    let start = new Punkt(flaggPlanet.sentrum.x + flaggPlanet.radius * Math.cos(flaggVinkel), flaggPlanet.sentrum.y + flaggPlanet.radius * Math.sin(flaggVinkel));
    let end = new Punkt(flaggPlanet.sentrum.x + (flaggPlanet.radius + 30) * Math.cos(flaggVinkel), flaggPlanet.sentrum.y + (flaggPlanet.radius + 30) * Math.sin(flaggVinkel));
    return [start, end];
}

function tegnFlagg(){
    let [start, end] = flaggLinje();

    // Teikn linje i flagg retning
    ctx.beginPath();
    ctx.moveTo(start.x, start.y);
    ctx.lineTo(end.x, end.y);
    ctx.strokeStyle = "#ffffff";
    ctx.stroke();
}

// https://stackoverflow.com/questions/808826/draw-arrow-on-canvas-tag
function canvas_arrow(context, fromx, fromy, tox, toy) {
    var headlen = 10; // length of head in pixels
    var dx = tox - fromx;
    var dy = toy - fromy;
    var vinkel = Math.atan2(dy, dx);
    context.beginPath();
    context.moveTo(fromx, fromy);
    context.lineTo(tox, toy);
    context.lineTo(tox - headlen * Math.cos(vinkel - Math.PI / 6), toy - headlen * Math.sin(vinkel - Math.PI / 6));
    context.moveTo(tox, toy);
    context.lineTo(tox - headlen * Math.cos(vinkel + Math.PI / 6), toy - headlen * Math.sin(vinkel + Math.PI / 6));
    context.stroke();
  }

function tegnIndikator(){
    if(!brukerDrar) return;

    let delta = new Punkt(draNoverande.x - draStart.x, draNoverande.y - draStart.y);
    let deltaLengde = delta.lengde();
    let deltaNormert = new Punkt(delta.x / deltaLengde, delta.y / deltaLengde);
    let maksLengde = Math.min(deltaLengde, 100);
    delta = new Punkt(deltaNormert.x * maksLengde, deltaNormert.y * maksLengde);

    canvas_arrow(ctx, ball.pos.x, ball.pos.y, ball.pos.x - delta.x, ball.pos.y - delta.y);
}

function tegnBakgrunn(){
    ctx.fillStyle = "#000000";
    ctx.fillRect(0, 0, width, height);
    ctx.drawImage(bakgrunnImg, 0, 0, width, height);
}

function tegnInfoSkudd(){
    ctx.font = '30px serif';
    ctx.fillStyle = "#FFFFFF";
    ctx.fillText(infoSkudd, 10, 50);
}

function tegn(){
    tegnBakgrunn();
    for (let planet of leveler[levelNum].planeter){
        tegnPlanet(planet);
    }
    tegnBall();
    tegnFlagg();
    tegnIndikator();
    tegnInfoSkudd();
}

// eventlisteners
function oppsett(){
    let c = document.getElementById("canvas");
    height = c.height;
    width = c.width;

    c.addEventListener("click", function(e) {
        settMusikkStatus();
    });

    c.addEventListener("mousedown", function(e) {
        handleMouseDown(c, e)
    });
    c.addEventListener("mouseup", function(e) {
        handleMouseUp()
    });
    c.addEventListener("mousemove", function(e) {
        handleMove(c, e)
    });
    // c.height = window.innerHeight;
    // c.width = window.innerWidth;
  
    ctx = c.getContext("2d");

    levelNum = 0;
    lastInnLevel();
}

function winGame(){
    alert("Gratulerer du vant!");
}

function nextLevel(){
    if(levelNum < leveler.length - 1){
        levelNum++;
    }else{
        winGame();
    }
    lastInnLevel();
}

function oppdaterInfoSkudd(){
    infoSkudd = "Du har " + (leveler[levelNum].par - antallSkudd) + " av " + leveler[levelNum].par + " skudd igjen";
}

function lastInnLevel(){
    antallSkudd = 0;
    level = leveler[levelNum];

    let ballPlanet = level.planeter[level.ball.planet];
    let ballPosRadius = ballPlanet.radius + 50;
    let initialBallPos = new Punkt(ballPlanet.sentrum.x + ballPosRadius * Math.cos(level.ball.vinkel), ballPlanet.sentrum.y + ballPosRadius * Math.sin(level.ball.vinkel));

    ball = {"pos": initialBallPos, "vel": new Punkt(0, 0)};
    oppdaterInfoSkudd();
}

function hentNermestePlanet(){
    let nermestePlanet = null;
    let closestDist = 99999999999;
    let closestIdx = -1;
    for(const [idx, planet] of level.planeter.entries()){
        if(nermestePlanet === null || (planet.sentrum.sub(ball.pos).lengde() - planet.radius < closestDist)){
            nermestePlanet = planet;
            closestDist = planet.sentrum.sub(ball.pos).lengde() - planet.radius;
            closestIdx = idx;
        }
    }
    return [nermestePlanet, closestDist, closestIdx];
}

// https://www.baeldung.com/cs/circle-line-segment-collision-detection
function triangleArea(A, B, C){
    let AB = B.sub(A);
    let AC = C.sub(A);
    let crossProduct = AB.ytreProdukt(AC);
    return Math.abs(crossProduct) / 2;
}

// https://www.baeldung.com/cs/circle-line-segment-collision-detection
function lineCollidesCircle(line, circle){
    let [P, Q] = line;
    let O = circle.center;
    let min_dist = 99999999;
    let max_dist = Math.max(O.distanse(P), O.distanse(Q));
    let [OP, OQ, PQ, QP] = [P.sub(O), Q.sub(O), Q.sub(P), P.sub(Q)];
    if(OP.indreProdukt(QP) > 0 && OQ.indreProdukt(PQ) > 0){
        min_dist = 2 * triangleArea(O, P, Q) / P.distanse(Q);
    } else {
        min_dist = Math.min(O.distanse(P), O.distanse(Q));
    }
    
    if (min_dist <= circle.radius && max_dist >= circle.radius){
        return true;
    } else {
        return false;
    }
}

let lastPhysicsTime = null;
function physics(){
    let time = Date.now();
    if (lastPhysicsTime === null){
        dt = 1000 / 60;
    } else {
        dt = time - lastPhysicsTime;
    }
    lastPhysicsTime = time;
    
    // Oppdater ball posisjon
    // delta_s = v * delta_t

    // let sumF = new Punkt(0, 0);
    let [nermestePlanet, closestDist, closestIdx] = hentNermestePlanet();

    let force = nermestePlanet.sentrum.sub(ball.pos).normaliser().div(50);
    ball.vel = ball.vel.add(force.skaler(dt / 50));
    ball.pos = ball.pos.add(ball.vel.skaler(dt));

    for (planet of level.planeter){
        let planetDist = ball.pos.sub(planet.sentrum).lengde();

        // Also check collision
        if (planetDist < planet.radius + BALL_RADIUS){
            let ballDir = ball.pos.sub(planet.sentrum);

            let normalizedBallDir = ballDir.normaliser();
            let radialVelocity = ball.vel.indreProdukt(normalizedBallDir);
            // Subtract the radial velocity from the ball's velocity

            let currentBallRadialVel = normalizedBallDir.normaliser().skaler(radialVelocity);

            ball.vel = ball.vel.sub(currentBallRadialVel.skaler(1.6));

            // Friction force for the tangential velocity
            let tangentialVelocity = ball.vel.sub(currentBallRadialVel);
            ball.vel = ball.vel.sub(tangentialVelocity.skaler(FRIKSJON_KOEFFISIENT));

            // Move the ball to the surface of the planet
            ball.pos = planet.sentrum.add(normalizedBallDir.skaler(planet.radius + BALL_RADIUS));
        }
    }
    
    let [flagStart, flagEnd] = flaggLinje();

    if (lineCollidesCircle([flagStart, flagEnd], {center: ball.pos, radius: BALL_RADIUS})){
        nextLevel();
    }
    
    // delta_v = a * delta_t
}

oppsett();

setInterval(tegn, 1000 / 60);
setInterval(physics, 1000 / 60);

document.addEventListener("keypress", function(e) { // e => {}
    if(e.key === "r"){
        lastInnLevel();
        oppdaterInfoSkudd();
    }
    else if(e.key === "m"){
        toggleMute();
    }
    else if("1" <= e.key.charAt(0) && e.key.charAt(0) <= "9"){
        let newLevelNum = e.key.charAt(0) - '1';
        console.log(newLevelNum);
        if(newLevelNum < leveler.length){
            levelNum = newLevelNum;
            lastInnLevel();
            oppdaterInfoSkudd();
        }
    }
});