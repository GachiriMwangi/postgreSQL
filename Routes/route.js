const Router = require("express");
const router = Router();

router.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Page working perfectly" 
  });
});

router.get("/api/test", async(req, res) => {
  try{
 const result = await req.pool.query('SELECT NOW()')
 res.status(200).json({
  success: true, 
      message: "Current Time", 
      data: result.rows
 })
  }
  catch(error){
    res.status(500).json({
      success: false, 
      message: "Error", 
      error: error
    })
    console.log("Error: ", error)
  }
})

router.get("/api/users", async (req, res) => {
  try {
    const result = await req.pool.query("SELECT * FROM users");
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error", err });
  }
});

// GET route to fetch a single item by ID
router.get("/api/users/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await req.pool.query("SELECT * FROM users WHERE id = $1", [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// POST route to create a new item
router.post("/api/users", async (req, res) => {
  try {
    const { id, firstname, lastname, email, password } = req.body;
    const result = await req.pool.query(
      "INSERT INTO users (id, firstname, lastname, email, password) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [id, firstname, lastname, email, password]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
