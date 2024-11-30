//function a() {
//    console.log('A')
//}


var a = function () { //자바스크립트에서는 함수가 값이다
    console.log('a')

}

function slowfunc(callback){
    callback();

}

slowfunc(a);