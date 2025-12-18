💰 Expense Tracker with Supabase
================================

A simple, modern Expense Tracker web application that persists data to the cloud using [Supabase](https://supabase.com/). This project replaces standard local storage with a real backend database, allowing for scalable data management.

🚀 Features
-----------

*   **Track Finances:** Add income and expenses with ease.
    
*   **Real-time Calculations:** Automatically calculates Total Balance, Total Income, and Total Expenses.
    
*   **Cloud Persistence:** Transactions are stored in a Supabase PostgreSQL database, not in the browser cache.
    
*   **Transaction History:** View a list of past transactions sorted by date.
    
*   **Delete Capability:** Remove incorrect entries directly from the database.
    
*   **Responsive Design:** Works on desktop and mobile devices.
    

🛠️ Tech Stack
--------------

*   **Frontend:** HTML5, CSS3, JavaScript (ES6+)
    
*   **Backend:** Supabase (PostgreSQL)
    
*   **Libraries:** @supabase/supabase-js (via CDN)
    

⚙️ Setup & Installation
-----------------------

### 1\. Clone the Repository

``` bash
   git clone https://github.com/abhayy11/expense-tracker.git  cd expense-tracker    
```

### 2\. Set up Supabase

1.  Create a free account at [Supabase.com](https://supabase.com).
    
2.  Create a new project.
    
3.  Go to the **SQL Editor** and run the following query to create the table:
    
```SQL
   CREATE TABLE public.transactions (    
    id uuid NOT NULL DEFAULT gen_random_uuid(),    
    name text NOT NULL,    
    amount numeric NOT NULL,    
    date date NOT NULL,   
    type text NOT NULL CHECK (type IN ('income', 'expense')),    
    created_at timestamp with time zone DEFAULT now(),    
    PRIMARY KEY (id)  
   );   
   ```

1.  **Disable Row Level Security (RLS)** (since we haven't implemented Auth yet):
    
    *   Go to **Table Editor** > transactions > **RLS** > **Disable RLS**.
        

### 3\. Connect the Frontend

1.  Open script.js.
    
2.  Replace the placeholder credentials at the top of the file with your own:
    
```JavaScript
   const SUPABASE_URL = 'YOUR_SUPABASE_PROJECT_URL';  
   const SUPABASE_KEY = 'YOUR_SUPABASE_ANON_KEY';    
```

_(You can find these in Supabase Settings > API)_.

### 4\. Run the Project

Simply open index.html in your browser.

📂 Project Structure
--------------------

```  
    ├── index.html       # Main UI structure  
    ├── style.css        # Styling and layout  
    ├── script.js        # Logic and Supabase connection  
    └── README.md        # Project documentation  
```

🔮 Future Improvements
----------------------

*   **User Authentication:** Add Sign Up/Login so multiple users can have private wallets.
    
*   **Data Visualization:** Add charts to visualize spending habits.
    
*   **Categories:** Group expenses by tags (Food, Travel, etc.).
    

🤝 Contributing
---------------

Contributions are welcome! Feel free to fork this repository and submit a pull request.
