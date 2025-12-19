// 1. Initialize Supabase
const SUPABASE_URL = 'https://btkswghqyxlrdchpxrhg.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ0a3N3Z2hxeXhscmRjaHB4cmhnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU5NTkzOTYsImV4cCI6MjA4MTUzNTM5Nn0.7aovWSWW5c4b5Vfi7mQsacMNdh5Fx39ss6qOLf_QTVA';
const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// Global state
let transactions = [];

const formatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  signDisplay: "always",
});

const list = document.getElementById("transactionList");
const form = document.getElementById("transactionForm");
const balance = document.getElementById("balance");
const income = document.getElementById("income");
const expense = document.getElementById("expense"); 
const dateInput = document.querySelector('input[name="date"]'); 

dateInput.defaultValue = new Date().toISOString().split("T")[0];

form.addEventListener("submit", addTransaction);

// --- HELPER FUNCTIONS ---

function formatCurrency(value) {
  if (value === 0) {
    return formatter.format(0).replace(/^[+-]/, "");
  }
  return formatter.format(value);
}

function createItem({ id, name, amount, date, type }) {
  const sign = "income" === type ? 1 : -1;
  const li = document.createElement("li");

  li.innerHTML = `
      <div class="name">
        <h4>${name}</h4>
        <p>${new Date(date).toLocaleDateString()}</p>
      </div>

      <div class="amount ${type}">
        <span>${formatCurrency(amount * sign)}</span>
      </div>
    
      <div class="action">
         <button class="delete-btn">&times;</button>
      </div>
    `;

  // Find the button we just added inside the 'li'
  const deleteBtn = li.querySelector(".delete-btn");

  // Add the click event ONLY to the button
  deleteBtn.addEventListener("click", (e) => {
    e.stopPropagation(); // Prevents clicking the row from doing anything else
    if (confirm("Delete transaction?")) {
      deleteTransaction(id);
    }
  });

  return li;
}

function updateTotal() {
  const incomeTotal = transactions
    .filter((trx) => trx.type === "income")
    .reduce((total, trx) => total + trx.amount, 0);

  const expenseTotal = transactions
    .filter((trx) => trx.type === "expense")
    .reduce((total, trx) => total + trx.amount, 0);

  const balanceTotal = incomeTotal - expenseTotal;

  balance.textContent = formatCurrency(balanceTotal).replace(/^\+/, "");
  income.textContent = formatCurrency(incomeTotal);
  expense.textContent = formatCurrency(expenseTotal * -1);
}

function renderList() {
  list.innerHTML = "";
  // Sort by date (newest first)
  transactions.sort((a, b) => new Date(b.date) - new Date(a.date));
  
  transactions.forEach((transaction) => {
    const li = createItem(transaction);
    list.appendChild(li);
  });
  updateTotal();
}

//SUPABASE FUNCTIONS (Async)

// Fetch Data from Supabase
async function fetchTransactions() {
  const { data, error } = await supabaseClient
    .from('transactions')
    .select('*');

  if (error) {
    console.error("Error fetching transactions:", error);
  } else {
    transactions = data;
    renderList();
  }
}

// Add Data to Supabase
async function addTransaction(e) {
  e.preventDefault();

  const formData = new FormData(form);
  
  const newTransaction = {
    name: formData.get("name"),
    amount: parseFloat(formData.get("amount")),
    date: formData.get("date"),
    type: "on" === formData.get("type") ? "expense" : "income",
  };

  // Insert into DB
  const { data, error } = await supabaseClient
    .from('transactions')
    .insert([newTransaction])
    .select(); // .select() returns the inserted row with the new ID

  if (error) {
    alert("Error adding transaction");
    console.error(error);
  } else {
    // Add the returned data (which has the real ID) to our local array
    transactions.push(data[0]); 
    renderList();
    form.reset();
    // Reset date to today
    dateInput.value = new Date().toISOString().split("T")[0];
  }
}

// Delete Data from Supabase
async function deleteTransaction(id) {
  const { error } = await supabaseClient
    .from('transactions')
    .delete()
    .eq('id', id);

  if (error) {
    console.error("Error deleting:", error);
    alert("Could not delete");
  } else {
    // Filter out the deleted item from local state
    transactions = transactions.filter((trx) => trx.id !== id);
    renderList();
  }
}

// Initial Load
fetchTransactions();