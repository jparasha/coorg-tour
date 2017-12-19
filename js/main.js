/*localstorage*/
var availableStorage = true;
var url = 'http://10.76.17.153:8000';
//var url = 'https://coorg.herokuapp.com';
var user = "there";
var expenseType;
if (typeof (Storage) !== "undefined") {
	var retrievedObject = localStorage.getItem('users');
	var checkObj = JSON.parse(retrievedObject);
	//if (checkObj === null || checkObj.slug.length === 0) { } else {
	if (checkObj === null) {
		console.log('No data');
		var showModal = document.getElementById('exampleModal');
		//showModal.classList.add('show');
		$(window).load(function () {
			$('#exampleModal').modal('show');
		});

	} else {
		console.log(checkObj);
		user = checkObj.user;
		salutation();

		//var tracker = document.getElementById('tracker');
		//var sMsg = document.getElementById('sMsg');
		//tracker.classList.remove('hidden');
		//sMsg.classList.remove('hidden');
		//getTable();
	}
} else {
	availableStorage = false;
	console.log("not available");
}

/*----modalData----------*/

function modalData() {
	var userName = document.getElementById('modalUserName').value.toLowerCase();
	$("#modalSubmit").prop("disabled", true);
	var err = document.getElementById('modalError');
	//err.classList.add('loader');
	//validate with db
	let uri = `${url}/getUser?name=${userName}`;
	try {
		fetch(uri, {
			method: "get"
		}).then(function (response) {
			return response.json();
		}).then(function (data) {
			console.log(data);
			user = data.name;
			console.log(user);
			validate();
		}).catch(function (err) {
			console.log(err);
			validate();
		});
	}
	catch (error) {
		console.log(error);
	}
	//---
	//validating with sample user
	function validate() {
		if (user != undefined) {
			user = userName;
			console.log(` ${userName} matched`);	
			$('#exampleModal').modal('hide');
			salutation();
			let savedUser = {
				'user': user
			};
			localStorage.setItem('users', JSON.stringify(savedUser));
		}

		else {
			$("#modalSubmit").removeAttr('disabled');
			console.log(userName + ' did not match');
			let errorMsg = "Sorry, We could not find you in our records!";

			err.innerHTML = errorMsg;
		}
	}
}

/* ----Salutation---- */
function salutation() {
	let salutation = document.getElementById('userSalutation');
	user = user.replace(/^./, user[0].toUpperCase());
	salutation.innerHTML = `Hello, ${user}`;  //comment
	$("#actionButtons").removeAttr('hidden');

}

/*----getExpenseButton---*/
function getExpenseButton() {
	$("#successPost").html('');
	getExpense();
	
	
	//$("#actionButtons").removeAttr('hidden');

}



/*-----postExpenseButton------*/
function postExpenseButton() {
	$("#successPost").html('');
	$("#getButton").removeAttr("disabled");
	$(".postExpense").removeAttr('hidden');
	$(".getExpense").prop('hidden', true);
	$("#postButton").prop("disabled", true);
	var goto = document.getElementsByClassName('postExpense');
	$('html, body').animate({ scrollTop: $(goto).offset().top - 50}, 'slow');

	//alert('hi');
}


/* --------getExpense-------- */

function getExpense() {
	let uri = `${url}/getExpense`;
	let body = { "test": "test" };
	var table = `<table class="table table-responsive" id="expenseTable">
	<thead>
		<tr class ="grads">
			<td class ="grads">Name</td>
			<td class ="grads">Amount</td>
			<td class ="grads">Spent on</td>
			<td class ="grads">Date</td>
		</tr>
	</thead>
	<tbody id="expenseTableTbody">`;
	var tableFoot = `</tbody>
	</table>`;
	var personalTable = `<table class ="table table-responsive table-bordered " id= "personalTable">
							<thead>
								<tr class = "grads">
									<td class ="grads">Total Expenses</td>
									<td class ="grads">Your Expenses</td>
								</tr>
							</thead>
							<tbody id= "personalTableBody">	`;
	var rows = [];
	var personalExpenses = {
		"totalAmount": [],
		"PersonalAmount": []

	};
	var finalTable;
	var finExpenseTable;
	try {
		fetch(uri, {
			method: "post",
			json: true,
			headers: {
				"content-type": "application/json",
			},
			body: JSON.stringify(body)
		}).then(function (response) {
			return response.json();
		}).then(function (data) {
			//console.log(data);
			//console.log(data[0]);
			data.forEach(function (element) {
				//console.log(element.amount);
				var amt = element.amount;
				var nam = element.user;
				var type = element.expenseType;
				var date = element.date;
				personalExpenses.totalAmount.push(amt);
				//console.log(nam);
				var tData = `
					<tr onclick ="deleteRow ()" id="deleteRow">
						<td id = "mainTable">${nam}</td>
						<td id = "mainTable">${amt}</td>
						<td id = "mainTable">${type}</td>
						<td id = "mainTable">${date}</td>
					</tr>`;//async write to table
				rows.push(tData);
				if (nam === user) {
					personalExpenses.PersonalAmount.push(amt);
				}

			}, this);

		}).then(function () {
			finalTable = table;//assigning table head values to finaltable
			finExpenseTable = personalTable;
			rows.forEach(function (element) {
				finalTable = finalTable + element;
			}, this);
			//adding up all amount spent
			let totalExpense = sum(personalExpenses.totalAmount);
			let personalExpense = sum(personalExpenses.PersonalAmount);
			console.log(totalExpense);
			console.log(personalExpense);
			let tData=`
				<tr>	
					<td id = "mainTable">${totalExpense}</td>
					<td id = "mainTable">${personalExpense}</td>
				</tr>`;
			finExpenseTable = finExpenseTable +tData+tableFoot;
			function sum(amount) {
				console.log(amount);
				var sum = 0;
				amount.forEach(function (element) {
					sum += element;
				}, this)
				return sum;
			}


		}).then(function () {
			let waiting = `<h2>Expenses: </h2>	`;
			let personalWaiting = `<h2>${user}'s Expenses: </h2>`;
			finalTable = waiting + finalTable + tableFoot;
			finExpenseTable =personalWaiting+finExpenseTable;
			$("#getButton").prop("disabled", true);
			$(".postExpense").prop('hidden', true);
			$(".getExpense").removeAttr("hidden");
			$("#postButton").removeAttr("disabled");

			//$('#expenseTable').html(finalTable);
			let personalHtml = document.getElementById('currentExpense');
			personalHtml.innerHTML = finExpenseTable;
			let htm = document.getElementById('expenseTable');
			htm.innerHTML = finalTable;
			var goto = document.getElementsByClassName('currentExpense');
			$('html, body').animate({ scrollTop: $(goto).offset().top - 50}, 'slow');
			//console.log(htm);
			//console.log(finalTable);
			//			
		}).catch(function (err) {
			console.log(err);
			//validate();
		});
	}
	catch (error) {
		console.log(error);
	}

}

/* ----------postExpenseType--------- */
/* function postExpenseType() {
	
	$(".expenses").removeAttr('hidden');
} */

/* -------postExpense-------- */

function postExpense() {
	expenseType = document.getElementById('expenseSelection').value;
	let amount = document.getElementById('amount').value;
	let date = document.getElementById('datetime').value;
	amount = amount*1;	
	//console.log(`user: ${user}.. amount: ${amount} .. date: ${date} .. expensType: ${expenseType}`);
	let body = {
		'user': user,
		'date': date,
		'expenseType': expenseType,
		'amount': amount
	};
	localStorage.setItem('expenses', JSON.stringify(body));
	let uri = `${url}/postExpense`;
	$("#postForm")[0].reset();
	try {
		fetch(uri, {
			method: "post",
			json: true,
			headers: {
				"content-type": "application/json",
			},
			body: JSON.stringify(body)
		}).then(function (response) {
			return response.json();
		}).then(function (data) {
			
			$(".postExpense").prop('hidden', true);			
			$("#postButton").removeAttr("disabled");
			let succs = document.getElementById('successPost');
			succs.innerHTML = data.msg;
			//validate();
		}).catch(function (err) {
			console.log(err);
			//validate();
		});
	}
	catch (error) {
		console.log(error);
	}
}

/* -----delete Row and data  */

function deleteRow(){
	alert(`this will delete ${user}'s entry  `);
}