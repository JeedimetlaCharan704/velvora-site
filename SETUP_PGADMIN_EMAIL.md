# PostgreSQL & Email Setup Guide for Velvora

## Part 1: PostgreSQL Setup with PgAdmin

### Step 1: Install PostgreSQL
1. Download from: https://www.postgresql.org/download/
2. Install with pgAdmin 4 checked
3. Set password for postgres user during installation

### Step 2: Open PgAdmin
1. Launch PgAdmin 4 from Start Menu
2. Enter your postgres password when prompted

### Step 3: Create Database
1. Right-click on "Servers" → "Create" → "Server..."
2. In General tab:
   - Name: `velvora-local`
3. In Connection tab:
   - Host name/address: `localhost`
   - Port: `5432`
   - Maintenance database: `postgres`
   - Username: `postgres`
   - Password: `(your postgres password)`
4. Click "Save"
5. Right-click on your new server → "Create" → "Database..."
6. Database name: `velvora`
7. Click "Save"

### Step 4: Run Schema
1. Expand `velvora-local` → Databases → velvora
2. Right-click on `velvora` → "Query Tool"
3. Copy contents of `database-pgadmin.sql`
4. Paste and press F5 or click Execute button
5. You should see "Query executed successfully"

### Step 5: Verify Tables
1. Expand `velvora` → Schemas → public → Tables
2. You should see: `users`, `products`, `orders`, `addresses`

---

## Part 2: Gmail Email Setup

### Step 1: Enable 2-Factor Authentication
1. Go to: https://myaccount.google.com/security
2. Click "2-Step Verification" → Turn it on

### Step 2: Create App Password
1. Go to: https://myaccount.google.com/security
2. Click "App passwords" (under 2-Step Verification)
3. Select app: "Mail"
4. Select device: "Other (Custom name)" → Type "Velvora"
5. Click "Generate"
6. Copy the 16-character password shown

### Step 3: Update .env File
Create a `.env` file in the project root:
```
PGHOST=localhost
PGPORT=5432
PGDATABASE=velvora
PGUSER=postgres
PGPASSWORD=your_postgres_password
EMAIL_USER=your-gmail@gmail.com
EMAIL_PASS=your-16-char-app-password
PAYU_KEY=gtKFFx
PAYU_SALT=eCwWELxi
PAYU_TEST=true
PORT=3001
```

---

## Part 3: Run the Server

### Option 1: With Environment Variables
```bash
# Set environment variables first (Windows)
set PGHOST=localhost
set PGPORT=5432
set PGDATABASE=velvora
set PGUSER=postgres
set PGPASSWORD=your_password
set EMAIL_USER=your-email@gmail.com
set EMAIL_PASS=your-app-password

# Install dependencies
npm install pg nodemailer express cors dotenv

# Run server
node server-pg.js
```

### Option 2: With .env file
```bash
npm install dotenv
node server-pg.js
```

---

## Part 4: Test Email Notification

1. Open admin panel: http://localhost:3001/admin.html
2. Place a test order
3. Go to Orders section
4. Change order status to "Processing" or "Shipped"
5. Check console for: `✓ Email sent to customer@example.com`

---

## Troubleshooting

### PostgreSQL Connection Issues
```
Error: Connection refused
```
- Check PostgreSQL service is running (Services → postgresql-x64)
- Verify port 5432 is not blocked

### Email Not Sending
```
Error: Invalid login
```
- Double-check your Gmail app password
- Make sure 2FA is enabled
- Try regenerating app password

### Database Tables Not Found
```
Error: relation "users" does not exist
```
- Make sure you ran the SQL schema
- Check you're connected to the `velvora` database

---

## Features Included

### Email Notifications Sent For:
- Order Placed (Processing)
- Order Shipped
- Order Delivered
- Order Cancelled

### Live Dashboard Stats:
- Total Customers with order count
- Total Revenue
- Average Order Value
- Customer Lifetime Value

### Database Views:
- `customer_stats` - All customers with purchase history
- `order_summary` - Daily sales breakdown
