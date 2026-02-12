const readline = require('readline-sync');
let contProcess = true;

//Opening Greeting
console.log("Hello, welcome to the Family Budget Tool!");

//Getting income
let incomeInput = readline.question("What is your total income for this month?");

//Conversion
let totalIncome = Number(incomeInput);

//Validation
if (isNaN(totalIncome) || totalIncome <= 0) {
   console.log("Please enter a valid number for your income.");


} else {
   console.log(`Great! Your budget is starting at: $${totalIncome}`);
}

//Tracking balance
let runningBalance = totalIncome;

//Tracking Spending
let expenses = [];

console.log(`Your current starting balance is: $${runningBalance}`);

while (contProcess){
//Prompting for expense
   let expenseName = readline.question("What is the expense? (or type 'done' to finish): ");
   if (expenseName.toLowerCase() === 'done') {
      contProcess = false; 
   } else {
      let expenseAmount = readline.question("How much was it? ");
      
// Update the math correctly
      runningBalance -= Number(expenseAmount);
      
//Categorizing
      let expenseCategory = readline.question("What category is this? (e.g., Food, Bills, Kids): ");

// Check for negative balance
      if (runningBalance < 0) {
         console.log("⚠️ WARNING: You have exceeded your budget!");
      }

//Displaying current balance
      console.log(`Current Balance: $${runningBalance}`);
      let newExpense = {
      name: expenseName,
      amount: Number(expenseAmount),
      category: expenseCategory
      };
    
      expenses.push(newExpense);
   }
}
//Monthly breakdown
console.log("Here is your monthly breakdown ");
console.table(expenses);

