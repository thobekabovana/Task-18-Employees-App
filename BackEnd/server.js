const express = require('express');
const admin = require('firebase-admin'); 
const cors = require('cors');
const serviceAccount = require('./firebase-key.json');

// Initialize Firebase Admin SDK with credentials
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();
const auth = admin.auth();

// Firestore collection references
const employeesRef = db.collection('employees');
const usersRef = db.collection('users');

// Initialize Express app
const app = express();
app.use(cors());
app.use(express.json());

// Define router
const router = express.Router();

// Middleware to verify user role
const verifyRole = (role) => async (req, res, next) => {
  try {
    const idToken = req.headers.authorization?.split('Bearer ')[1];
    const decodedToken = await auth.verifyIdToken(idToken);
    if (decodedToken.role !== role) {
      return res.status(403).json({ message: 'Forbidden: Insufficient role' });
    }
    next();
  } catch (err) {
    console.error('Authorization error:', err);
    res.status(403).json({ message: 'Forbidden: Invalid token or role' });
  }
};

// Middleware to verify that the user is accessing their own data
const verifyOwnUser = async (req, res, next) => {
  try {
    const idToken = req.headers.authorization?.split('Bearer ')[1];
    const decodedToken = await auth.verifyIdToken(idToken);
    req.userId = decodedToken.uid;
    next();
  } catch (err) {
    console.error('Authorization error:', err);
    res.status(401).json({ message: 'Unauthorized: Invalid token' });
  }
};

// POST /login - Log in a user
app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  try {
    const user = await auth.getUserByEmail(email);
    res.status(200).json({ message: 'Login successful', uid: user.uid });
  } catch (err) {
    console.error('Login error:', err);
    res.status(401).json({ message: 'Invalid email or password' });
  }
});

// POST /register - Register a new user
router.post('/register', async (req, res) => {
  const { name, email, password, companyName, companyNumber, role } = req.body;

  if (!name || !email || !password || !companyName || !companyNumber || !role) {
    return res.status(400).json({ message: 'Please provide all required fields' });
  }

  try {
    const userRecord = await auth.createUser({ email, password, displayName: name });
    await auth.setCustomUserClaims(userRecord.uid, { role });
    await usersRef.doc(userRecord.uid).set({
      name,
      email,
      companyName,
      companyNumber,
      role,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    res.status(201).json({ message: 'User registered successfully', userId: userRecord.uid });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ message: 'Error registering user', error: error.message });
  }
});

// GET /users - Get information of the logged-in user only
router.get('/users', verifyOwnUser, async (req, res) => {
  try {
    const userSnapshot = await usersRef.doc(req.userId).get();
    if (!userSnapshot.exists) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(userSnapshot.data());
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ message: 'Error fetching user information', error: error.message });
  }
});

// GET /users/:id - Only allow super-admin to access other users' data
router.get('/users/:id', verifyRole('super-admin'), async (req, res) => {
  try {
    const userSnapshot = await usersRef.doc(req.params.id).get();
    if (!userSnapshot.exists) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(userSnapshot.data());
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ message: 'Error fetching user information', error: error.message });
  }
});

// POST /employees - Add a new employee
router.post('/employees', verifyOwnUser, async (req, res) => {
  try {
    const employeeData = { ...req.body, userId: req.userId };
    const newEmployeeRef = await employeesRef.add(employeeData);
    res.status(201).json({ id: newEmployeeRef.id, ...employeeData });
  } catch (error) {
    console.error('Error adding employee:', error);
    res.status(500).json({ message: 'Error adding employee', error: error.message });
  }
});

// Get employee data only for the logged-in user
router.get('/employees/:employeeId', verifyOwnUser, async (req, res) => {
  const { userId } = req.params;

  try {
    const snapshot = await employeesRef.where('userId', '==', userId).get();
    
    if (snapshot.empty) {
      return res.status(404).json({ message: 'No employees found for this user' });
    }

    const employees = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    res.json(employees);
  } catch (error) {
    console.error('Error fetching employees:', error);
    res.status(500).json({ message: 'Error fetching employees', error: error.message });
  }
});




// GET /employees - Get all employees (for super-admins)
router.get('/employees', verifyRole('super-admin'), async (req, res) => {
  try {
    const snapshot = await employeesRef.get();
    const employees = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    res.status(200).json(employees);
  } catch (error) {
    console.error('Error fetching employees:', error);
    res.status(500).json({ message: 'Error fetching employees', error: error.message });
  }
});

// Use the router for /api routes
app.use('/api', router);

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
