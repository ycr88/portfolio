/**
 * Created by yuri on 12/02/17.
 */
// DOM manipulation
document.addEventListener("DOMContentLoaded",
function (event) {
    var myCoord={};
    a="z";
    console.log(a*1+2);
    function sumCoord(x,y) {
        prevX= myCoord.sumx || 0;
        prevY= myCoord.sumy || 0;
        myCoord.sumx=isNaN(prevX + x) ? 0 : prevX + x;
        myCoord.sumy=isNaN(prevY + x) ? 0 : prevY + y;
      //window.myCoord=myCoord;
        return myCoord;

    }
    document.querySelector("html").addEventListener("mousemove",function (event) {
        var x=event.clientX;
        var y=event.clientY;
        document.querySelector("#x").textContent = x;
        document.querySelector("#y").textContent = y;
        sumCoord(x,y);
        document.querySelector("#sumx").textContent = myCoord.sumx;
        document.querySelector("#sumy").textContent = myCoord.sumy;

    });
}
);