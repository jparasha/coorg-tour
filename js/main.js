/*localstorage*/
var availableStorage = true;
var url = 'http://10.76.17.153:8000';
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
				'user' : user
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
function getExpenseButton(){
	$("#getButton").prop("disabled", true);
	//$("#actionButtons").removeAttr('hidden');

}



/*-----postExpenseButton------*/
function postExpenseButton(){
	$("#postButton").prop("disabled", true);
	$(".postExpense").removeAttr('hidden');
	//alert('hi');
}


/* --------getExpense-------- */

function getExpense(){

}

/* ----------postExpenseType--------- */
function postExpenseType(){
	expenseType = document.getElementById('expenseSelection').value;
	$(".expenses").removeAttr('hidden');
}

/* -------postExpense-------- */

function postExpense(){
	let amount = document.getElementById('amount').value;
	let date = document.getElementById('datetime').value;
	console.log(`user: ${user}.. amount: ${amount} .. date: ${date} .. expensType: ${expenseType}`);
	let body = {
		'user' : user,
		'date' : date,
		'expenseType' : expenseType,
		'amount': amount		
	};
	localStorage.setItem('expenses', JSON.stringify(body));
	let uri = `${url}/postExpense`;
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
			console.log(data);
			//user = data.name;////////
			console.log(user);
			let succs = document.getElementById('successPost');
			succs.innerHTML =data.msg;
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