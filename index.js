const express = require('express');
const bcrypt = require('bcrypt');
const mysql = require('mysql');
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');

const app = express();

// Parse request body as JSON
app.use(express.json());

// Connect to MySQL database
const connection = mysql.createConnection({
    host: 'localhost',
    port: 3307,
    user: 'root',
    database: 'test'
});
connection.connect((error) => {
    if (error) {
        console.error('Error connecting to database:', error.stack);
    } else {
        console.log('Connected to database');
    }
});

// Create route for registering a new user
app.post('/register', (req, res) => {
    const { email, password } = req.body;

    // Check if the email already exists in the database
    const sql = 'SELECT * FROM users WHERE email = ?';
    const values = [email];
    connection.query(sql, values, (error, results) => {
        if (error) {
            res.status(500).json({ message: 'Error checking for duplicate email' });
        } else if (results.length > 0) {
            res.status(400).json({ message: 'Email already exists' });
        } else {
            // Hash the password
            const hashedPassword = bcrypt.hashSync(password, 8);

            // Insert the new user into the database
            const sql = 'INSERT INTO users (email, password) VALUES (?, ?)';
            const values = [email, hashedPassword];
            connection.query(sql, values, (error) => {
                if (error) {
                    res.status(500).json({ message: 'Error registering user' });
                } else {
                    // Send email verification email
                    sendVerificationEmail(email);
                    res.json({ message: 'User registered successfully' });
                }
            });
        }
    });
});


// Create route for verifying an email
app.get('/verify', (req, res) => {
    const { email } = req.query;

    // Update the "verified" field in the database
    const sql = 'UPDATE users SET verified = 1 WHERE email = ?';
    const values = [email];
    connection.query(sql, values, (error) => {
        if (error) {
            res.status(500).json({ message: 'Error verifying email' });
        } else {
            res.json({ message: 'Email verified successfully' });
        }
    });
});

app.post('/login', (req, res) => {
    const { email, password } = req.body;

    // Query the database for the user with the given email
    const sql = 'SELECT * FROM users WHERE email = ?';
    const values = [email];
    connection.query(sql, values, (error, results) => {
        if (error) {
            res.status(500).json({ message: 'Error logging in' });
        } else if (results.length === 0) {
            res.status(400).json({ message: 'Invalid email or password' });
        } else {
            // Check if the email has been verified
            const verified = results[0].verified;
            if (!verified) {
                res.status(400).json({ message: 'Email has not been verified' });
            } else {
                // Compare the hashed password with the provided password
                const hashedPassword = results[0].password;
                if (bcrypt.compareSync(password, hashedPassword)) {
                    //res.json({ message: 'Logged in successfully' });
                    const token = jwt.sign({ email: results[0].email }, 'secretkey');
                    res.json({ message: 'Logged in successfully', token: token });

                } else {
                    res.status(400).json({ message: 'Invalid email or password' });
                }
            }
        }
    });
});

// Create route for protected data
app.get('/protected', (req, res) => {
    // Get the JWT from the request header
    const token = req.headers['x-access-token'];

    // Verify the JWT
    jwt.verify(token, 'secretkey', (error, decoded) => {
        if (error) {
            res.status(401).json({ message: 'Not authorized' });
        } else {
            // The JWT is valid, so send the protected data
            res.json({ data: 'protected data' });
        }
    });
});

app.post('/logout', (req, res) => {
    // Clear the JWT from the request header
    req.headers['x-access-token'] = null;
    res.json({ message: 'Logged out successfully' });
});


// Function for sending email verification email
function sendVerificationEmail(email) {
    const transporter = nodemailer.createTransport({
        service: "Gmail",
        auth: {
            user: "ploishare@gmail.com",
            pass: "avvrtrwjsopeaase"
        },
    });

    const mailOptions = {
        from: '"My App" <noreply@example.com>',
        to: email,
        subject: 'Verify your email',
        html: '<p>Click <a href="http://localhost:8080/verify?email=' + email + '">here</a> to verify your email</p>'
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
}

//=======================================================
// Create a new rental
app.post('/rentals', (req, res) => {
    const { carId, startDateTime, endDateTime, rate } = req.body;
    const day = Math.round((new Date(endDateTime) - new Date(startDateTime)) / 8.64e7) + 1;
    const query = 'INSERT INTO rentals (car_id, start_date_time, end_date_time, rate, day) VALUES (?, ?, ?, ?, ?)';
    const values = [carId, startDateTime, endDateTime, rate, day];
    connection.query(query, values, (error, results) => {
        if (error) {
            if (error.code === 'ER_DUP_ENTRY') {
                res.status(400).json({ error: 'Duplicate rental' });
            } else {
                res.status(500).json({ error });
            }
        } else {
            res.status(201).json({ results });
        }
    });
});
// app.post('/rentals', (req, res) => {
//     const { carId, startDateTime, endDateTime, rate } = req.body;
//     const day = Math.round((new Date(endDateTime) - new Date(startDateTime)) / 8.64e7) + 1;
//     const query = 'SELECT * FROM rentals WHERE car_id = ? AND (start_date_time <= ? AND end_date_time >= ?) AND (start_date_time <= ? AND end_date_time >= ?)';
//     //const query = 'SELECT * FROM cars WHERE id NOT IN (SELECT car_id FROM rentals WHERE start_date_time <= ? AND end_date_time >= ?)';
//     const values = [carId, startDateTime, endDateTime, startDateTime, endDateTime];
//     connection.query(query, values, (error, results) => {
//         if (error) {
//             res.status(500).json({ error });
//         } else {
//             if (results.length > 0) {
//                 res.status(400).json({ error: 'Rental overlaps with existing rentals' });
//             } else {
//                 // Insert the rental into the database
//                 const result = 'INSERT INTO rentals (car_id, start_date_time, end_date_time, rate, day) VALUES (?, ?, ?, ?, ?)';
//                 const values2 = [carId, startDateTime, endDateTime, rate, day];
//                 connection.query(result, values2, (error, results) => {
//                     if (error) {
//                         if (error.code === 'ER_DUP_ENTRY') {
//                             res.status(400).json({ error: 'Duplicate rental' });
//                         } else {
//                             res.status(500).json({ error });
//                         }
//                     } else {
//                         res.status(201).json({ results });
//                     }
//                 });
//             }
//         }
//     });
// });


// Set up the routes for the app
app.get('/cars', (req, res) => {
    // Retrieve a list of all cars from the database
    connection.query('SELECT * FROM cars', (error, results) => {
        if (error) {
            // If an error occurred, send a server error response
            res.status(500).json({ error });
        } else {
            // Otherwise, send the results as a JSON array
            res.json(results);
        }
    });
});

app.get('/available-cars', (req, res) => {
    // Retrieve the start and end dates and times from the query string
    const { startDateTime, endDateTime } = req.query;

    // Find cars that are available for rent within the given time period
    connection.query(
        'SELECT * FROM cars WHERE id NOT IN (SELECT car_id FROM rentals WHERE start_date_time <= ? AND end_date_time >= ?)',
        [endDateTime, startDateTime],
        (error, results) => {
            if (error) {
                // If an error occurred, send a server error response
                res.status(500).json({ error });
            } else {
                // Otherwise, send the results as a JSON array
                res.json(results);
            }
        }
    );
});

const port = 8080;
app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
// Start
