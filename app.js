var budgetController = (function(){
	var x = 23;

	var add = function(a){
		return x + a;
	}
	return {
		publicTest: function(b){
			return add(b); 
		}
	}

})();

var UIController = (function() {

//code

})();

var controller = (function(budgetCtrl, UICtrl) {

	var z = budgetCtrl.publicTest(322);

	return {
		anotherPublic: function(){
			console.log(z);
		}
	}

})(budgetController, UIController);






