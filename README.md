# Bajaj Finserv Health Qualifier 1 (BFHL) Full-Stack Solution

A high-fidelity, complete full-stack implementation for the Bajaj Finserv Health Qualifier 1 challenge. This engine processes data arrays containing numbers and alphabets, performs prime number detection, extracts the highest lowercase alphabet, and parses Base64 file attachments for MIME-type and size attributes.

---

## Technical Architecture

- **Backend**: Node.js & Express API
- **Frontend**: React.js, Vite, and Premium Vanilla CSS
- **Features**:
  - GET `/bfhl` and POST `/bfhl` endpoints.
  - Prime number detection within the numbers sub-array.
  - Identification of the highest alphabetical lowercase character.
  - Full Base64 file validator with automatic MIME-type and file size extraction in KB.
  - Dynamic JSON validation editor in the browser interface.
  - Custom fluid multiselect chip filter to toggle response rendering in real time.
  - Interactive file uploader that automatically encodes any selected file into Base64 and injects it into the active request payload.

---

## Project Structure

```
d:\OneDriveOfDdrive\APIroundFolder/
├── backend/
│   ├── index.js          # Express app entry point, handles routes and CORS
│   ├── helpers.js        # Logic for isPrime, highest lowercase, & Base64 parsing
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── main.jsx
│   │   ├── App.jsx       # Coordinates API request/response states and layouts
│   │   ├── index.css     # Premium dark theme and responsive glassmorphism CSS
│   │   └── components/
│   │       ├── JsonInput.jsx        # JSON Editor & dynamic File-to-Base64 encoder
│   │       ├── MultiSelector.jsx    # Custom interactive multi-select chips
│   │       └── ResponseDisplay.jsx  # Processed data arrays and metrics cards
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
├── .gitignore
└── README.md
```

---

## Local Setup & Run Instructions

### 1. Run the Express Backend
From the root folder, navigate to `backend/` and run:
```bash
cd backend
npm install
npm start
```
The server will boot up and start listening on port **`5000`** by default.
- Verification URL (GET): `http://localhost:5000/bfhl`
- Processing Endpoint (POST): `http://localhost:5000/bfhl`

### 2. Run the React Frontend
From the root folder, navigate to `frontend/` and run:
```bash
cd frontend
npm install
npm run dev
```
Open `http://localhost:5173` in your browser. The frontend includes a live **API Endpoint Settings** panel at the top, letting you swap between `http://localhost:5000/bfhl` and your live deployed backend URL with a single click.

---

## API Documentation

### 1. GET `/bfhl`
Returns the status operation code.
- **Request Headers**: `Content-Type: application/json`
- **Response Status**: `200 OK`
- **Response Body**:
```json
{
  "operation_code": 1
}
```

### 2. POST `/bfhl`
Analyzes mixed input data arrays and checks optional file attachments.
- **Request Headers**: `Content-Type: application/json`
- **Response Status**: `200 OK`
- **Response Body Parameters**:
  - `is_success` (Boolean): Request completion status.
  - `user_id` (String): Format `first_name_last_name_ddmmyyyy` (`kashish_jhala_24052026`).
  - `email` (String): Student registration email (`kashish.jhala.bce21@itbhu.ac.in`).
  - `roll_number` (String): Student roll number (`21BCE10000`).
  - `numbers` (Array): Filtered numerical strings.
  - `alphabets` (Array): Filtered single alphabetical characters.
  - `highest_lowercase_alphabet` (Array): Contains the alphabetically last lowercase character found.
  - `is_prime_found` (Boolean): Set to `true` if any number in the numbers array is prime.
  - `file_valid` (Boolean): If `file_b64` parameter represents a valid Base64 file string.
  - `file_mime_type` (String/Null): Extracted MIME-type of the file (e.g. `image/png`, `application/pdf`).
  - `file_size_kb` (Number/Null): Extracted size of the file in Kilobytes.

---

## Postman Test Payloads

### Payload A: No Attachment (Only Data)
- **Method**: `POST`
- **URL**: `http://localhost:5000/bfhl`
- **Body** (JSON):
```json
{
  "data": ["A", "1", "334", "4", "R", "g"]
}
```
- **Response (Expected)**:
```json
{
  "is_success": true,
  "user_id": "kashish_jhala_24052026",
  "email": "kashish.jhala.bce21@itbhu.ac.in",
  "roll_number": "21BCE10000",
  "numbers": ["1", "334", "4"],
  "alphabets": ["A", "R", "g"],
  "highest_lowercase_alphabet": ["g"],
  "is_prime_found": false,
  "file_valid": false,
  "file_mime_type": null,
  "file_size_kb": null
}
```

### Payload B: With Prime Number & Lowercase Alphabets
- **Method**: `POST`
- **URL**: `http://localhost:5000/bfhl`
- **Body** (JSON):
```json
{
  "data": ["M", "7", "x", "23", "a"]
}
```
- **Response (Expected)**:
```json
{
  "is_success": true,
  "user_id": "kashish_jhala_24052026",
  "email": "kashish.jhala.bce21@itbhu.ac.in",
  "roll_number": "21BCE10000",
  "numbers": ["7", "23"],
  "alphabets": ["M", "x", "a"],
  "highest_lowercase_alphabet": ["x"],
  "is_prime_found": true,
  "file_valid": false,
  "file_mime_type": null,
  "file_size_kb": null
}
```

### Payload C: Valid PNG File Attachment (Data URL base64)
- **Method**: `POST`
- **URL**: `http://localhost:5000/bfhl`
- **Body** (JSON):
```json
{
  "data": ["B", "8", "y"],
  "file_b64": "data:image/png;base64,iVBORw0KGgoAAAANSKeyAAAADElEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=="
}
```
- **Response (Expected)**:
```json
{
  "is_success": true,
  "user_id": "kashish_jhala_24052026",
  "email": "kashish.jhala.bce21@itbhu.ac.in",
  "roll_number": "21BCE10000",
  "numbers": ["8"],
  "alphabets": ["B", "y"],
  "highest_lowercase_alphabet": ["y"],
  "is_prime_found": false,
  "file_valid": true,
  "file_mime_type": "image/png",
  "file_size_kb": 0.06
}
```

---

## Deployment Playbook

### 1. Deploy the Backend on Render (Free Web Service)
1. Register/Login on [Render](https://render.com).
2. Connect your GitHub account and click **New > Web Service**.
3. Select this repository.
4. Set the following configuration parameters:
   - **Name**: `bajaj-health-bfhl-backend`
   - **Environment**: `Node`
   - **Root Directory**: `backend`
   - **Build Command**: `npm install`
   - **Start Command**: `node index.js` (or `npm start`)
5. Click **Deploy Web Service**.
6. Once deployed, copy your live Web Service URL (e.g., `https://bajaj-health-bfhl-backend.onrender.com/bfhl`).

### 2. Deploy the Frontend on Netlify (Free Web Host)
1. Register/Login on [Netlify](https://netlify.com).
2. Click **Add new site > Import from Git**.
3. Authorize GitHub and select this repository.
4. Set the following configuration parameters:
   - **Base directory**: `frontend`
   - **Build command**: `npm run build`
   - **Publish directory**: `frontend/dist`
5. Click **Deploy Site**.
6. Once online, open your live Netlify app, paste your live Render API URL into the **API Endpoint Settings** text field, and start testing!
