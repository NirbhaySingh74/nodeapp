require("dotenv").config();
const express = require("express");
const { createClient } = require("@supabase/supabase-js");
const app = express();

// Middleware
app.use(express.json());

// Supabase Client Setup
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

// CREATE - Add new item
app.post("/items", async (req, res) => {
  try {
    const { name, description } = req.body;
    const { data, error } = await supabase
      .from("items")
      .insert({ name, description })
      .select();

    if (error) throw error;
    res.status(201).json(data[0]);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// READ - Get all items
app.get("/items", async (req, res) => {
  try {
    const { data, error } = await supabase.from("items").select("*");

    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// READ - Get single item
app.get("/items/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { data, error } = await supabase
      .from("items")
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw error;
    if (!data) return res.status(404).json({ error: "Item not found" });
    res.json(data);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// UPDATE - Update item
app.put("/items/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;
    const { data, error } = await supabase
      .from("items")
      .update({ name, description })
      .eq("id", id)
      .select();

    if (error) throw error;
    if (!data.length) return res.status(404).json({ error: "Item not found" });
    res.json(data[0]);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// DELETE - Delete item
app.delete("/items/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { data, error } = await supabase
      .from("items")
      .delete()
      .eq("id", id)
      .select();

    if (error) throw error;
    if (!data.length) return res.status(404).json({ error: "Item not found" });
    res.json({ message: "Item deleted successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
