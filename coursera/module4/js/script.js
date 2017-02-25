/**
 * Created by yuri on 12/02/17.
 */
// Closures
function makeMultiplier (multiplier) {
    // var multiplier = 2;
    function b() {
        console.log("Multiplier is: " + multiplier);
    }
    b();


    return (
        function (x) {
            return multiplier * x;
        }

    );
}

var doubleAll = makeMultiplier(2);
var tripleAll = makeMultiplier(3);
console.log(doubleAll(10),tripleAll(5)); // its own exec env