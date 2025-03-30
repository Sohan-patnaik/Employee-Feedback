import express from "express";
import cors from "cors";
import pg from "pg";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { authenticateUser, authorizeRole } from "./middleware/authMiddle.js";

dotenv.config();

const db = new pg.Pool({
   user: process.env.USER,
   password: process.env.PASSWORD,
   host : process.env.HOST,
   database: process.env.DATABASE,
   port: process.env.PORT
});

const app = express();
app.use(cors());
app.use(express.json());



db.connect()
    .then(() => console.log("Connected to PostgreSQL"))
    .catch((err) => console.error("Connection error", err));

app.get("/dashboard", authenticateUser, authorizeRole(["admin"]), (req, res) => {
    res.json({ message: "Welcome Admin" });
});

app.post("/register", async (req, res) => {
    try {
        const { name, email, password, role } = req.body;


        const user = await db.query(`SELECT * FROM users WHERE email = $1`, [email]);

        if (user.rows.length > 0) {
            return res.status(400).json({ message: "User already exists" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = await db.query(
            "INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4) RETURNING *",
            [name, email, hashedPassword, role]
        );

        res.status(201).json({ message: "User registered successfully", role: newUser.rows[0].role });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
});

app.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await db.query("SELECT * FROM users WHERE email = $1", [email]);

        if (user.rows.length === 0) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const isMatch = await bcrypt.compare(password, user.rows[0].password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const token = jwt.sign(
            { id: user.rows[0].id, role: user.rows[0].role },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        res.json({
            token,
            user: {
                id: user.rows[0].id,
                name: user.rows[0].name,
                email: user.rows[0].email,
                role: user.rows[0].role
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
});

app.get("/employees", async (req, res) => {
    try {
        const result = await db.query("SELECT * FROM employee");
        res.json(result.rows);
    } catch (error) {
        console.error("Error fetching employees:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});


app.post("/rating", async (req, res) => {
    try {
        const { id, feedback, rating } = req.body;
        const resFeed = await db.query(
            "INSERT INTO feedback (emp_id,feedbacks, rating) VALUES ($1, $2,$3) RETURNING *",
            [id, feedback, rating]
        );
        console.log(resFeed.rows[0]);

        res.json(resFeed.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

app.get("/dashboard/recent-emp", async (req, res) => {
    try {
        const recentEmp = await db.query("SELECT * FROM employee WHERE created_at >= NOW() - INTERVAL '30 days'");
        res.json(recentEmp.rows);
    } catch (error) {
        console.error("Error fetching recent employees:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

app.get("/dashboard/top-performers", async (req, res) => {
    try {
        const top = await db.query("SELECT * FROM feedback ORDER BY rating DESC LIMIT 5");
        res.json(top.rows);
    } catch (error) {
        console.error("Error fetching top performers:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

app.post("/employees", async (req, res) => {
    try {
        const { name, email, role, department } = req.body;

        const result = await db.query(
            "INSERT INTO employee (name, email, role, department) VALUES ($1, $2, $3, $4) RETURNING *",
            [name, email, role, department]
        );

        res.json(result.rows[0]);
    } catch (error) {
        console.error("Error inserting data:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

app.delete("/employees/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const result = await db.query("DELETE FROM employee WHERE id = $1 RETURNING *", [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Employee not found" });
        }

        res.json({ message: "Employee deleted successfully", deletedEmployee: result.rows[0] });
    } catch (error) {
        console.error("Error deleting employee:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

app.get("/dashboard/employee-count", async (req, res) => {
    try {
        const ress = await db.query(`
        SELECT department, COUNT(*) as count 
        FROM employee 
        GROUP BY department
      `);
        console.log(ress.rows);
        res.json(ress.rows)

    }
    catch (error) {
        console.log(error);

    }
})

app.get("/employee-result", async (req, res) => {
    try {
        const { name } = req.query;

        const result = await db.query(
            "SELECT * FROM employee WHERE LOWER(name) LIKE LOWER($1)",
            [`%${name}%`]
        );

        res.json(result.rows);
    } catch (error) {
        console.error("Error fetching employees:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

app.get("/employee-result/:id", async (req, res) => {
    const { id } = req.params;
  
    try {
      const result = await db.query(
        "SELECT id, name, role, department, total FROM employeescore WHERE id = $1",
        [id]
      );
  
      if (result.rows.length === 0) {
        return res.status(404).json({ error: "Employee not found" });
      }
  
      res.json(result.rows[0]); 
    } catch (error) {
      console.error("Error fetching employee:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });

app.get("/dashboard/performance", async (req, res) => {
    try {
        const perform = await db.query(`
            SELECT EXTRACT(MONTH FROM given_at) AS month, AVG(rating) as score 
            FROM feedback 
            GROUP BY month 
            ORDER BY month ASC
        `);
        res.json(perform.rows);
        console.log(perform.rows);
    }
    catch (error) {
        console.log(error);

    }

})

app.post("/employee-result", async (req, res) => {
    try {
        const { id,name,role,department, basicFormScore, plusFormScore, mustFormScore, total } = req.body;
        const result = await db.query("INSERT INTO employeescore (id,basic,plus,must,total,name,role,department) VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *", [id, basicFormScore, plusFormScore, mustFormScore, total,name,role,department]);
        console.log(result.rows[0]);
        res.json(result.rows[0]);

    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Internal Server Error" });
    }

})

app.post("/save-feedback", async (req, res) => {
    const { employeeId, feedbacks } = req.body;
  
    try {
      for (const feedback of feedbacks) {
      await db.query(
          "INSERT INTO improve (employee_id, mention, description) VALUES ($1, $2, $3)",

            [employeeId, feedback.mention, feedback.describe]
        );
        ;
        
      }
  
      res.status(200).json({ message: "Feedback saved successfully" });
    } catch (error) {
      console.error("Error saving feedback:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });
  app.get("/get-feedback/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const result = await db.query(
         "SELECT feedback_id, mention, description FROM improve WHERE employee_id = $1",

            [id]
        );
        res.json(result.rows);
    } catch (error) {
        console.log(error);
        
        console.error("Error fetching feedback:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

app.get("/employee-trend/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const result = await db.query(
            `
            SELECT 
                EXTRACT(MONTH FROM given_at) AS month, 
                AVG(total) as score 
            FROM employeescore 
            WHERE id = $1  
            GROUP BY month 
            ORDER BY month ASC
            `,
            [id] 
        );
        res.json(result.rows);
    } catch (error) {
        console.error("Error fetching feedback:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});


const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
