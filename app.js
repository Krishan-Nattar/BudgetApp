var budgetController = (function(){
	//Each item has a description and value

	var Expense = function(id, description, value){
		this.id = id;
		this.description = description;
		this.value = value;
		this.percentage = -1;
	};

	Expense.prototype.calcPercentage = function(totalIncome){

		if(totalIncome>0){
			this.percentage = Math.round((this.value / totalIncome)*100);

		} else {
			this.percentage = -1;
		}

	Expense.prototype.getPercentage = function(){
		return this.percentage;
	};
		



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

		deleteItem: function(type, id){
			var ids, index;
			// console.log('emow');

			// id = 6
			//cannot do data.allItems[type][id], because id could be different than index
			//ids = [1, 2, 4, 6, 8]
			//we want to find index=3

			//loop over all elements int he type-array

			//map creates a new array

			//Can't this just work directly with the allitems array? Why make ids?

			ids = data.allItems[type].map(function(current, ind, arr){
				console.log(current.id);
				return current.id;
			});
			console.log('ids is' + ids);
			console.log('looking for ' + id);

			index = ids.indexOf(id);
			console.log('index is ' + index);

			if(index !== -1){
				data.allItems[type].splice(index, 1);

			};


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
		};

			
		},

		calculatePercentages: function(){

			data.allItems.expense.forEach(function(cur){


				cur.calcPercentage(data.totals.income);


			});

		},

		getPercentages: function(){

			var allPerc = data.allItems.expense.map(function(cur){
				return cur.getPercentage();

			});
			return allPerc;



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
		expensesContainer: '.expenses__list',
		budgetLabel: ".budget__value",
		incomeLabel: ".budget__income--value",
		expenseLabel: ".budget__expenses--value",
		percentageLabel: ".budget__expenses--percentage",
		container: ".container",
		expensesPercLabel: ".item__percentage",
		dateLabel: ".budget__title--month",
	};

	var formatNumber = function(num, type){
// console.log(type);
			var num, int, dec, sign;


			num = Math.abs(num);

			num = num.toFixed(2);
			// console.log(num);

			//21234

			numSplit = num.split('.');

			int = numSplit[0];
			dec = numSplit[1];

			if(int.length > 3){
				// console.log(int.substr(0, int.length -3));
				int = int.substr(0, int.length - 3) + ',' + int.substr(int.length - 3, 3);
console.log(int);
			}

			// type === 'expense' ? sign = '-' : sign = '+';
// console.log(sign + ' ' + int + dec);
			// return sign + ' ' + int + '.' + dec;
return (type === 'expense' ? '-' : '+') + ' ' + int + '.' + dec;
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
			newHTML = newHTML.replace('%value%', formatNumber(obj.value, type));

			//Insert HTML into DOM
			// someClass = '#' + type + '__list';

			document.querySelector(d1).insertAdjacentHTML('beforeend', newHTML);
		},

		deleteListItem: function(selectorID){
			var el = document.getElementById(selectorID);

			el.parentNode.removeChild(el);


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

		displayBudget: function(obj){
			var type;

			obj.budget >= 0 ? type = 'income' : type = 'expense';

			document.querySelector(DOMstrings.budgetLabel).textContent = formatNumber(obj.budget, type);
			document.querySelector(DOMstrings.incomeLabel).textContent = formatNumber(obj.totalIncome, 'income');
			document.querySelector(DOMstrings.expenseLabel).textContent = formatNumber(obj.totalExpense, 'expense');

			if(obj.percentage > 0){
			document.querySelector(DOMstrings.percentageLabel).textContent = obj.percentage + "%";	
		} else{
			document.querySelector(DOMstrings.percentageLabel).textContent = "---";	
		}
		},

		displayPercentages: function(percentages){
			var fields = document.querySelectorAll(DOMstrings.expensesPercLabel);


			var nodeListForEach = function(list, callback){
				for (var i = 0; i < list.length; i++) {
					callback(list[i], i);
				}

			};


			nodeListForEach(fields, function(current, index){

				//do stuff here
				if (percentages[index]>0) {
				current.textContent = percentages[index] + "%";	
			} else {
				current.textContent = "--";	
			}

			
			});
			
		},

		displayMonth: function(){
			var now, months, year, month;

			now = new Date();
			// console.log(now);
			year = now.getFullYear();
			months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
			month = months[now.getMonth()];

			document.querySelector(DOMstrings.dateLabel).textContent = month + " " + year;

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

		document.querySelector(DOMstrings.container).addEventListener('click', ctrlDeleteItem);

	};

	var updateBudget = function(){

		// 1. Calculate the budget
		budgetCtrl.calculateBudget();

		// 2. Return the budget
		var budget = budgetCtrl.getBudget();

		// 5. Display the budget on the UI

		UICtrl.displayBudget(budget);

		// console.log(budget);

	};

	var updatePercentages = function(){

		//calculate percentages

		budgetCtrl.calculatePercentages();

		//read percentages from budget controller

		var percentages = budgetCtrl.getPercentages();

		//update UI with new %

		UICtrl.displayPercentages(percentages);



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

		//6. calculate and update percentages
		updatePercentages();

		}

	};

	var ctrlDeleteItem = function(event){
		var itemID, splitID, type;
		// console.log(event.target);

		itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;


		if(itemID){
			//income-0
			//expense-0

			splitID = itemID.split('-');
			type = splitID[0];
			ID = parseInt(splitID[1]);

			//Delete item from data structure

			budgetCtrl.deleteItem(type, ID);

			//delete item from UI

			UICtrl.deleteListItem(itemID);

			//update and show the new budget

			updateBudget();

			//calculate and update percentages
			updatePercentages();
		}
		
	};

	return {
		init: function(){
			setupEventListeners();
			UICtrl.displayMonth();
			UICtrl.displayBudget({
				budget: 0, 
				totalIncome: 0, 
				totalExpense: 0, 
				percentage: -1});
			console.log('application has started');

		}
	}

})(budgetController, UIController);

controller.init();
;