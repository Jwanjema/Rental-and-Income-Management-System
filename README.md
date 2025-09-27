# Rental and Income Management System (RIMS)

## Live video Demonstartion
https://drive.google.com/file/d/1A99ucjU11GtXyh6ZVCnNa_rE5wFX1YZK/view?usp=sharing

A full-stack web application designed to help property managers and landlords efficiently track properties, units, tenants, leases, rent payments, and expenses.

## 🚀 Key Features

* **Dashboard Summary:** Real-time overview of key metrics (occupied/vacant units, total rent, pending balances).
* **CRUD Management:** Full management for Properties, Units, Tenants, Leases, Payments, and Expenses.
* **Financial Reporting:** Detailed monthly performance charts, income/expense breakdown, and net profit analysis.
* **Cross-Site Communication:** Secure handling of cross-origin requests between the decoupled frontend (Vercel) and backend (Render).

---

## 🛠️ Tech Stack

### Frontend (Client)
| Technology | Description | Deployment |
| :--- | :--- | :--- |
| **React** | Core JavaScript library for building the user interface. | Vercel |
| **Vite** | Fast build tool and development server. | |
| **Recharts** | Library for rendering dynamic, responsive charts and graphs. | |

### Backend (Server)
| Technology | Description | Deployment |
| :--- | :--- | :--- |
| **Python** | Primary language for the server-side logic. | Render |
| **Flask** | Lightweight web framework. | |
| **Flask-SQLAlchemy** | ORM for database interactions using SQLite. | |
| **Flask-CORS** | Manages Cross-Origin Resource Sharing for secure communication. | |

---

## ⚙️ Setup and Installation

### Prerequisites

* Python (3.8+)
* Node.js (18+)

### 1. Backend Setup (`server` directory)

1.  **Clone the repository:**
    ```bash
    git clone [YOUR_REPO_URL]
    cd rental-and-income-management-system/server
    ```

2.  **Create and activate a virtual environment:**
    ```bash
    python -m venv venv
    source venv/bin/activate  # On Windows: venv\Scripts\activate
    ```

3.  **Install dependencies:**
    ```bash
    pip install -r requirements.txt
    ```

4.  **Database Setup (SQLite):**
    ```bash
    # Initialize/Update the database schema
    flask db upgrade
    # If you have seed data, run:
    python seed.py
    ```

5.  **Run the Flask server locally:**
    ```bash
    python app.py
    # The API will run at [http://127.0.0.1:5000](http://127.0.0.1:5000) by default.
    ```

### 2. Frontend Setup (`client` directory)

1.  **Navigate to the client directory:**
    ```bash
    cd ../client
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Run the React development server locally:**
    ```bash
    npm run dev
    # The application will run at http://localhost:5173 (or similar).
    ```


# 👤 Project Group 7
Joan Rotich
Wanjiku Mwaura
Leon Kanari
Joe Wanjema

## 📜 License

Distributed under the MIT License.
