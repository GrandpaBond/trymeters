// M E T E R S  -  Dials, Bars and DIGITALs 
enum STYLES {
    //% block="Blob"
    BLOB,
    //% block="Spiral"
    SPIRAL,
    //% block="Bar" 
    BAR,
    //% block="Dial" 
    DIAL,
    //% block="Needle"
    NEEDLE,
    //% block="Tidal"
    TIDAL,
    //% block="Digital" 
    DIGITAL
}
/* all frames are coded column-wise from top-left as 25-bit bit-maps:
*/
const dialMaps = [
    0x0001C00, 0x0009800, 0x0019000, 0x0111000, 0x0211000, 0x0221000,
    0x0421000, 0x0821000, 0x0841000, 0x1041000, 0x00C1000, 0x0083000,
    0x0007000, 0x0003200, 0x0001300, 0x0001110, 0x0001108, 0x0001088,
    0x0001084, 0x0001082, 0x0001042, 0x0001041, 0x0001060, 0x0001820];
const dialBound = 23;

const blobMaps = [
    0x0001000, 0x0023880, 0x00739C0, 0x0477DC4,
    0x06F7DEC, 0x0EFFFEE, 0x1FFFFFF];
const blobBound = 6;

const barMaps = [
    0x0004000, 0x0084200, 0x1084210, 0x1086210, 0x10C6310, 0x18C6318,
    0x18C7318, 0x18E7398, 0x1CE739C, 0x1CE7B9C, 0x1CF7BDC, 0x1EF7BDE,
    0x1EF7FDE, 0x1EFFFFE, 0x1FFFFFF];
const barBound = 14;


const spiralMaps = [
    0x0001000, 0x0021000, 0x0061000, 0x0063000, 0x0063100, 0x00631C0, 0x00631C0, 0x00639C0,
    0x00739C0, 0x02739C0, 0x06739C0, 0x0E739C0, 0x1E739C0, 0x1EF39C0,
    0x1EF79C0, 0x1EF7BC0, 0x1EF7BD0, 0x1EF7BD8, 0x1EF7BDC, 0x1EF7BDC,
    0x1EF7BDE, 0x1EF7BDF, 0x1EF7BFF, 0x1EF7FFF, 0x1EFFFFF, 0x1FFFFFF];
const spiralBound = 25;



const tidalMaps = [
    0x0000010, 0x0000210, 0x0000218, 0x000021C, 0x00031C,
    0x000431C, 0x008431C, 0x008631C, 0x008639C, 0x008639C,
    0x008639E, 0x008639F, 0x00863DF, 0x00873DF, 0x00C73DF,
    0x10C73DF, 0x18C73DF, 0x18E73DF, 0x18E7BDF, 0x18E7BFF,
    0x18E7FFF, 0x18F7FFF, 0x1CF7FFF, 0x1EF7FFF, 0x1EFFFFF,
    0x1FFFFFF];
const tidalBound = 25;
/* DIGITAL - 2-digit readout from 0 to 99

    Each digit uses a 10-bit bitmap (0...1023) encoding pixels vertically 
    from 2 adjacent display columns, either {0,1} or{3,4}:  
        2^0=1   2^5=32 
        2^1=2   2^6=64 
        2^2=4   2^7=128 
        2^4=8   2^8=256 
        2^5=16  2^9=512 
    the full 2-digit map is tensMap + (unitsMap << 15) 
*/
const digitMaps = [
    0x1CE,  // 462,  //"0" 
    0x3E0,  // 992,  //"1" 
    0x2FD,  // 765,  //"2" 
    0x3F5,  // 1013, //"3" 
    0x38F,  // 911,  //"4" 
    0x3B7,  // 951,  //"5" 
    0x39F,  // 927,  //"6" 
    0x3E1,  // 993,  //"7" 
    0x37B,  // 891,  //"8" 
    0x3E7]; // 999   //"9" 
const digitBound = 99;

/*   NEEDLE - 17 positions showing 90-degree sweep from a corner
Each 8-digit value ABCDEFGH encodes coords of four pixels:
pixel1(A,B); pixel2(C,D); pixel3(E,F); pixel4(G,H)
in addition to pixel(0,0), which is always on.

Now re-coded as full 25-bit bit-maps:
*/
const needleMaps = [
    0x0108421,  //  0 ----
    0x0208421,  //  1 -
    0x0210421,  //  2 --
    0x0210841,  //  3 -
    0x0410841,  //  4 ---
    0x0420841,  //  5 -
    0x0820841,  //  6 --
    0x0821041,  //  7 -
    0x0041041,  //  8 ----
    0x0083041,  //  9 -
    0x00820C1,  // 10 --
    0x00060C1,  // 11 -
    0x00041C1,  // 12 ---
    0x0000383,  // 13 -
    0x0000307,  // 14 --
    0x000020F,  // 15 -
    0x000001F]; // 16 ----
const needleBound = 16;

/*   BLOB - disc expanding from centre

const blobData = [
    55555522,
    21123224,
    11311333,
    20024224,
    10410334,
    30014314,
    00400444];
const blobBound = 7;
*/

//% color=#402080 weight=100 icon="\uf118" block="Meters" 
namespace Meter {
    let styleIs: number = STYLES.DIAL;
    let mapSet: number[] = dialMaps;
    let bound: number = dialBound; // number of displayable "frames" for ths style
    let fromValue: number = 0;     // the user's start value
    let uptoValue: number = 0;     // the user's end $value
    let valueNow: number = 0;      // the user's latest value
    let frameNow: number = -1;     // currently displayed frame (-1 says none)
    /* We save bit-maps of the pixels currently lit, and needing to be lit:
      Computing (litMap XOR newMap) then shows which pixels will need to be toggled.
      Bits are allocated column-wise top-to-bottom and left-to-right,
      so pixel[x,y] contributes 2**(x*5 + y) to the 25-bit map.
      (This matches the 2-column encoding used for each digit in STYLE.DIGITAL)
    */
    let litMap: number = 0;
    let newMap: number = 0;
    let rangeError = false; // notify overflow/underflow
// declare some background variables...
    let bgCounting = false; // if true, animate intermediate frames
    let bgTick = 0;         // target animation counting interval
    let bgStart = 0;        // animation start-value
    let bgFinal = 0;        // animation end-value
    let bgRangeError = false; // if true, bgFinal was originally out of range
    let bgWhen = 0;         // animation starting time
    let bgThen = 0;         // animation target end time

    // toggle the state of all pixels indicated in the 25-bit column-map toToggle
    function toggleColumnMap(toToggle: number) {
        let bitmap = toToggle;
        for (let x = 0; x < 5; x++) { // column-wise from top-left
            for (let y = 0; y < 5; y++) {
                if (bitmap & 1) {
                    led.toggle(x, y);
                }
                bitmap >>= 1;
            }
        }
    }

    function mapToFrame(value: number, start: number, end: number, 
                        startFrame: number, endFrame: number): number {
        let result = startFrame;
        let span = end - start; // (can be negative)
        let frames = endFrame - startFrame; // (can be negative)
        if (span != 0) {
            result = startFrame + frames * (value - start) / span;
        }
        return result;
    }

    function fixRange(value:number, oneEnd:number, otherEnd: number): number {
        // NOTE side effect: sets rangeError true if out-of-range
        let bottom =  Math.min(oneEnd, otherEnd);
        let top =  Math.max(oneEnd, otherEnd);
        let result = value;
        rangeError = false;
        if (value < bottom){
            rangeError = true;
            result = bottom;
        }
        if (value > top) {
            rangeError = true;
            result = top;
        }
        return Math.round(result)
    }

    // update display to show new frame
    // (frame will always be in the range [0..bound])
    function showFrame(frame: number) {
        if (styleIs == STYLES.DIGITAL) {
            let tens = ~~(frame / 10);
            let units = frame % 10;
            // shift "units" map by 3 columns (=15 bits) over to right side
            // then OR-in "tens" map to occupy left 2 columns
            newMap = (mapSet[units] << 15) | mapSet[tens];
        } else {
            newMap = mapSet[frame];
        }
        let toToggle = newMap ^ litMap;   // see which pixels differ
        toggleColumnMap(toToggle);
        litMap = newMap;
        frameNow = frame;
    }

    // EXPOSED USER INTERFACES  

    //% block="Use %choice Meter to indicate values from $start to $limit" 
    //% weight=20 
    export function use(style: STYLES, start: number, limit: number) {
        styleIs = style;
        fromValue = start;
        uptoValue = limit;
        // leave these set as default for unimplemented STYLES
        mapSet = dialMaps;
        bound = dialBound;
        switch (style) {
            case STYLES.DIAL:
                break;
            case STYLES.DIGITAL:
                mapSet = digitMaps; // NOTE: only 10 frames!
                bound = digitBound; // ...combine to allow 100 values
                break;
            case STYLES.NEEDLE:
                mapSet = needleMaps;
                bound = needleBound;
                break;
            case STYLES.BAR:
                mapSet = barMaps;
                bound = barBound;
                break;
            case STYLES.BLOB:
                mapSet = blobMaps;
                bound = blobBound;
                break;
            case STYLES.SPIRAL:
                mapSet = spiralMaps;
                bound = spiralBound;
                break;
            case STYLES.TIDAL:
                mapSet = tidalMaps;
                bound = tidalBound;
                break;
        }
        basic.clearScreen();
        rangeError = false;
        bgCounting = false;
        litMap = 0;
        styleIs = style;
        // show(start);
    }

    //% block="show meter value= $value" // eventually add: || animated? $animate, over $ms ms" 
    //% weight=30 
    export function show(value: number) {
        rangeError = false;
        bgCounting = false;
        // map value onto displayable range
        let frame = mapToFrame(value, fromValue, uptoValue, 0, bound);
        frame = fixRange(frame, 0, bound); // may set rangeError!
        showFrame(frame);
        if (rangeError) {
        // initiate background flashing...
            control.inBackground(function () {
                while (rangeError) {
                    showFrame(frameNow); // toggle whole image
                    basic.pause(250);    // flash twice per second
                }
            });
        }
        valueNow = value;
    }

    //% block="Wait for animation" 
    //% weight=50 
    export function wait() {
        while(bgCounting){
            pause(10);
        }
    }

   
    //% block="Stop animation or error flashing" 
    //% weight=40 
    export function reset() {
        bgCounting = false;
        rangeError = false;
        pause(10);
    }

    //% block="change meter to $value over $ms ms" 
    //% weight=35
    export function changeTo(value: number, ms: number) {
        bgStart = frameNow; 
        // calc target frame
        bgFinal = mapToFrame(value, fromValue, uptoValue, 0, bound);
        bgFinal = fixRange(bgFinal, 0, bound); // may set rangeError!
        bgRangeError = rangeError; // if so, remember the fact
        if ((bgFinal != bgStart) && (ms > 50)) { // sanity checks
            bgCounting = true;
            let bgFrame = bgStart;
            bgWhen = input.runningTime();
            bgThen = bgWhen + ms;
            bgTick = ms / Math.abs(bgStart - bgFinal);
            // initiate animation 
            control.inBackground(function () {
                while (bgCounting) {
                    let now = input.runningTime();
                    // can't predict interrupts, so where should we have got to by now?
                    bgFrame = mapToFrame(now, bgWhen, bgThen, bgStart, bgFinal);
                    bgFrame = fixRange(bgFrame, 0, bound); // won'tab set rangeError!
                    showFrame(bgFrame);
                    if (bgFrame == bgFinal) {
                        bgCounting = false;
                    }
                    pause(bgTick);
                }
            });
        } else {
            showFrame(bgFinal); // jump straight there
        }
    }
}
/****
Meter.use(STYLES.BLOB, 0, 99);
for (let i = 0; i < 100; i++) {
    Meter.show(i);
    basic.pause(100);
}
basic.pause(1000);

Meter.use(STYLES.SPIRAL, 0, 99);
for (let i = 0; i < 100; i++) {
    Meter.show(i);
    basic.pause(100);
}
basic.pause(1000);

Meter.use(STYLES.BAR, 0, 99);
for (let i = 0; i < 100; i++) {
    Meter.show(i);
    basic.pause(100);
}
basic.pause(1000); 

Meter.use(STYLES.DIAL, 0, 99);
for (let i = 0; i < 100; i++) {
    Meter.show(i);
    basic.pause(100);
}
basic.pause(1000); 

Meter.use(STYLES.NEEDLE, 0, 99);
for (let i = 0; i < 100; i++) {
    Meter.show(i);
    basic.pause(100);
}
basic.pause(1000); 

Meter.use(STYLES.TIDAL, 0, 99);
for (let i = 0; i < 100; i++) {
    Meter.show(i);
    basic.pause(200);
}
basic.pause(1000);

Meter.use(STYLES.DIGITAL, 0, 99);
for (let i = 0; i < 100; i++) {
    Meter.show(i);
    basic.pause(200);
}
basic.pause(1000);
***/

Meter.use(STYLES.DIAL, 0, 99);
basic.pause(1000);
basic.clearScreen();
Meter.changeTo(75, 500);
Meter.wait();
basic.pause(1000);
Meter.changeTo(50, 500);
Meter.wait();
basic.pause(1000);
Meter.changeTo(100, 500);
Meter.wait();
basic.pause(1000);
Meter.changeTo(0, 500);
Meter.wait();
basic.pause(1000);
// Meter.show(-1);
// basic.pause(1000);
// Meter.show(100);
// Meter.stop();

