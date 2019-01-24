var budgetController = (function(){
	//Each item has a description and value

	var Expense = function(id, description, value){
		this.id = id;
		this.description = description;
		this.value = value;
	};

	var Income = function(id, description, value){
		this.id = id;
		this.description = description;
		this.value = value;
	};

	var data = {
		allItems: {
			expense: [],
			income: [],
		},
		totals: {
			expense: 0,
			income: 0
		},
		budget: 0,
		percentage: -1,
	};

	var calculateTotal = function(type){
		var sum = 0;

		data.allItems[type].forEach(function(current){
			sum = sum + current.value;
		});

		data.totals[type] = sum;



	};
	return {
		addItem: function(type, des, val){
			var newItem, ID;
			
			//ID = 0;
			//ID should equal last ID + 1
			//array[array.length -1] = last

			//create new id	
			if(data.allItems[type].length > 0){
				ID = data.allItems[type][data.allItems[type].length - 1].id + 1;	
			} else {
				ID = 0;
			}
			


			//create new item based on exp or inc	
			if (type === 'expense') {
				newItem = new Expense(ID, des, val);	
			} else if (type ==='income'){
				newItem = new Income(ID, des, val);			
			}
			//push to data structure
			data.allItems[type].push(newItem);
			//return new element
			return newItem;
		},

		calculateBudget: function(){

			//calculate total income & expenses

			calculateTotal('expense');
			calculateTotal('income');

			//calculate budget = income - expense
			data.budget = data.totals.income - data.totals.expense;

			//calculate percentage of expenses to total income

			if (data.totals.income > 0) {
			data.percentage = Math.round((data.totals.expense / data.totals.income) * 100);	
		} else{
			data.percentage = -1;
		}

			
		},

		getBudget: function(){
			return {
				budget: data.budget,
				totalIncome: data.totals.income,
				totalExpense: data.totals.expense,
				percentage: data.percentage
			}

		},

		testing: function(){
			console.log(data);
		},
	}
})();

var UIController = (function() {
	var DOMstrings = {
		inputType: '.add__type',
		inputDescription: '.add__description',
		inputValue: '.add__value',
		addButton: '.add__btn',
		incomeContainer: '.income__list',
		expensesContainer: '.expenses__list'
	};

	return {
		getInput: function(){
			return { 
				type: document.querySelector(DOMstrings.inputType).value, //returns 'income' or 'expense'
				description: document.querySelector(DOMstrings.inputDescription).value,
				value: parseFloat(document.querySelector(DOMstrings.inputValue).value)
			};
		},

		addListItem: function(obj, type) {
			var html, newHTML, d1, fields, fieldsArr;

			//Create HTML string with placeholder text

			if(type === 'income'){

			html = '<div class="item clearfix" id="income-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
			d1 = DOMstrings.incomeContainer;
			console.log(d1);
		} else if (type === 'expense'){
			console.log(type);
			d1 = DOMstrings.expensesContainer;
			console.log(d1);




			html = '<div class="item clearfix" id="expense-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'

		}

			//Replace placeholder text with some actual data

			newHTML = html.replace('%id%', obj.id);
			newHTML = newHTML.replace('%description%', obj.description);
			newHTML = newHTML.replace('%value%', obj.value);


			//Insert HTML into DOM
			// someClass = '#' + type + '__list';

			
			// console.log(d1);
			
			// console.log('.' + type + '__list');
			document.querySelector(d1).insertAdjacentHTML('beforeend', newHTML);



		},

		clearFields: function(){
			fields = document.querySelectorAll(DOMstrings.inputDescription + ', ' + DOMstrings.inputValue);

			fieldsArr = Array.prototype.slice.call(fields);

			fieldsArr.forEach(function(current, index, array){
				current.value = "";


			});

			// document.querySelector(DOMstrings.inputDescription).focus();
			fieldsArr[0].focus()

		},


		getDOMstrings: function(){
			return DOMstrings;
		}
	}

})();


// Global App Controller
//The controller is the place where we tell the other modules what to do
var controller = (function(budgetCtrl, UICtrl) {

	var setupEventListeners = function() {
		var DOMstrings = UIController.getDOMstrings();
		document.querySelector(DOMstrings.addButton).addEventListener('click', ctrlAddItem);
		document.addEventListener('keypress', function(event) {
			if (event.keyCode == 13 || event.which == 13) {
				ctrlAddItem();
			}
		});

	};

	var updateBudget = function(){

		// 1. Calculate the budget
		budgetCtrl.calculateBudget();

		// 2. Return the budget
		var budget = budgetCtrl.getBudget();

		// 5. Display the budget on the UI

		console.log(budget);



	};

	var ctrlAddItem = function() {
		var input, newItem;

		// 1. Get field input data
		input = UICtrl.getInput();

		if(input.description !== "" && !isNaN(input.value) && input.value !== 0) {

		// 2. Add item to budget controller
		newItem = budgetCtrl.addItem(input.type, input.description, input.value);	

		// 3. Add item to UI 
		UICtrl.addListItem(newItem, input.type);

		// 4. Clear the fields
		UICtrl.clearFields();

		//5. Calculate and update budget
		
		updateBudget();



		}

		



	};

	return {
		init: function(){
			setupEventListeners();
			console.log('application has started');

		}
	}

})(budgetController, UIController);

controller.init();
