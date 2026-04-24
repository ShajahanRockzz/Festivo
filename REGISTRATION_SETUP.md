# Festivo Registration System - Setup Guide

## Backend Setup

### 1. Install Dependencies
```bash
cd Festivo_Backend
npm install
```

### 2. Database Configuration
Edit `config/db.js` with your MySQL credentials:
```javascript
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',          // Your MySQL user
  password: '',          // Your MySQL password
  database: 'db_festivo' // Your database name
});
```

### 3. Create Upload Directory
Create this folder if it doesn't exist:
```
Festivo_Backend/public/uploads/
```

### 4. Start Backend Server
```bash
npm start
```
Server will run on `http://localhost:3000`

## Frontend Setup

### 1. Install Angular Dependencies
```bash
cd Festivo_Frontend
npm install
```

### 2. Build and Run Frontend
```bash
ng serve
```
Frontend will run on `http://localhost:4200`

## Testing Registration

### Participant Registration Flow
1. Navigate to `http://localhost:4200`
2. Click "Register" button in header or "Register Here" in CTA section
3. Click "Register as Participant"
4. Fill in the form:
   - Full Name: Enter a name
   - Email: Enter a valid email
   - Contact: Enter a phone number
   - Academic Status: Select from dropdown
   - Institution: Enter institution name
   - ID Proof: Upload a JPG/PNG file
   - Username: Create a username (must be unique)
   - Password: Create a password (min 6 characters)
5. Click "Register"
6. Success message will appear and redirect to home

### Institution Registration Flow
1. Navigate to `http://localhost:4200`
2. Click "Register" button or "Register Here"
3. Click "Register as Institution"
4. Fill in the form:
   - Institution Name: Enter institution name
   - Address: Enter full address
   - Email: Enter email
   - Contact: Enter phone number
   - Website: Enter website URL
   - Logo: Upload institution logo (JPG/PNG)
   - Username: Create a username
   - Password: Create a password
5. Click "Register"
6. Success message will appear and redirect to home

## Database Tables Used

### tbl_login
- Records login credentials for all users
- Stores hashed passwords
- Columns: id, username, password, role, status

### tbl_participant
- Records participant profile information
- Columns: participantid, participantname, participantemail, contact_no, academic_status, institution_name, institution_id_proof, loginid

### tbl_institution
- Records institution profile information
- Columns: institution_id, institution_name, institution_address, institution_email, institution_contactno, institution_image, websiteaddress, login_id

## API Response Examples

### Successful Participant Registration
```json
{
  "success": true,
  "message": "Participant registered successfully",
  "participantId": 3,
  "loginId": 10
}
```

### Error Response
```json
{
  "success": false,
  "message": "Username already exists"
}
```

## File Upload Storage
Uploaded files are stored in:
- `Festivo_Backend/public/uploads/`
- Filename format: `{timestamp}-{originalfilename}`

## Troubleshooting

### 1. Database Connection Error
- Ensure MySQL is running
- Verify credentials in `config/db.js`
- Ensure database `db_festivo` exists

### 2. CORS Error
- CORS is enabled in app.js
- Ensure both frontend and backend servers are running
- Check that frontend is calling correct backend URL

### 3. File Upload Issues
- Ensure `public/uploads/` directory exists
- Check file permissions
- Verify multer is configured correctly in app.js

### 4. Password Hashing Error
- Ensure bcryptjs is installed: `npm list bcryptjs`
- Reinstall if needed: `npm install bcryptjs`

## Security Notes

1. **Passwords**: All passwords are hashed with bcryptjs before storage
2. **File Upload**: Only JPG/PNG files accepted from client
3. **Username**: Duplicate usernames are prevented at database level
4. **Input Validation**: Both frontend and backend validation in place
5. **CORS**: Configured to work with Angular frontend

## Next Steps

1. Test the registration forms
2. Verify data appears in MySQL database tables
3. Implement login page
4. Create user dashboards for each role
5. Add more validation and security features

---

For issues or questions, check the backend console for errors and browser console for frontend errors.
