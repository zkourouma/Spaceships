function curriedSum(n){
  var arr = []
  var running = function(x){
    arr.push(x);

    if (arr.length === n){
      var sum = 0;
      for (var i = 0; i < arr.length; i++){
        sum += arr[i];
      };
      return sum;
    }
    else {
      return running;
    }
  }
  return running;
}

// var tot = curriedSum(4)
// console.log(tot(5)(30)(20)(1));

function curry(n, funct){
  var arr = []
  var running = function(x){
    arr.push(x);

    if (arr.length === n){
      return funct.apply(null, arr)
    }
    else{
      return running;
    }
  }
  return running;
}

var tot2 = curry(4, function(){
  var sum = 0;
  for (var i = 0; i < arguments.length; i++){
    sum += arguments[i];
  };
  return sum;
});

// console.log(tot2(5)(30)(20)(1));