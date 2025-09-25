# Rental & Income Management System

This is a full-stack web application designed to help landlords and property managers manage their rental properties efficiently. It provides a clean dashboard to track properties, tenants, leases, and financials, all protected by a secure login system.

The application is built with a **React** frontend and a **Flask (Python)** backend API.

## Core Features

- **Dashboard Overview:** At-a-glance summary of total income, expenses, net profit, and occupancy rate.
- **Property & Unit Management:** Add and manage your rental properties and their individual units.
- **Tenant & Lease Tracking:** Keep records of tenants and their lease agreements, including start/end dates and rent amounts.
- **Financial Tracking:** Log all incoming rent payments and outgoing expenses (like repairs or taxes) to get a clear picture of your finances.
- **Interactive Reports:** A powerful reporting page to analyze your income vs. expenses, filterable by property and year.
- **Secure User Authentication:** The entire application is protected by a username and password.

## How to Run The Application

Follow these steps to get the project running on your local machine.

### Prerequisites

You will need the following software installed:

- **Python 3.8+**
- **Node.js 16+**
- **pipenv** (if not installed, run: `pip install pipenv`)

### Step 1: Set Up and Run the Backend

First, get the backend server running.

````bash
# 1. Navigate into the backend directory
cd backend

# 2. Install Python packages and activate the environment
pipenv install
pipenv shell

# 3. Create and migrate the database
# (If you get an error, you may need to run `flask db init` first)
flask db migrate -m "Create database"
flask db upgrade

# 4. Add sample data to the database
python seed.py

# 5. Run the backend server
# (Keep this terminal running)
flask run

# Step 2: Set Up and Run the Frontend
Now, open a new, separate terminal for the frontend.
code
Bash
# 1. Navigate into the client directory
cd client

# 2. Install Node packages
npm install

# 3. Run the frontend server
# (Keep this terminal running)
npm run dev```

### Step 3: Access and Use the App

-   Open your web browser and navigate to: **`http://localhost:5173`**
-   You will be redirected to the login page.

### Default Login Credentials

A default user is created by the `seed.py` script. Use these credentials to log in for the first time:

-   **Username:** `admin`
-   **Password:** `admin`

You can change your password and username from the "Settings" page after logging in.
````
