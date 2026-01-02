import express from "express";

const app = express();
const PORT = 3000;

app.use(express.json());

let items = [
  { id: 1, name: "Item 1", category: "A" },
  { id: 2, name: "Item 2", category: "B" },
  { id: 3, name: "Item 3", category: "A" },
  { id: 4, name: "Item 4", category: "C" },
];

// Router setup
const router = express.Router();

router.get("/items", (req, res) => {
  const { page, limit, ...filters } = req.query;

  // Filter items dynamically based on query params
  let filteredItems = items.filter(item => {
    for (let key in filters) {
      if (!item[key] || !item[key].toString().toLowerCase().includes(filters[key].toString().toLowerCase())) {
        return false;
      }
    }
    return true;
  });

  // If page or limit is missing, return all data
  if (!page || !limit) {
    return res.json({
      total: filteredItems.length,
      data: filteredItems
    });
  }

  // Pagination
  const startIndex = (parseInt(page) - 1) * parseInt(limit);
  const endIndex = startIndex + parseInt(limit);
  const paginatedItems = filteredItems.slice(startIndex, endIndex);

  res.json({
    page: parseInt(page),
    limit: parseInt(limit),
    total: filteredItems.length,
    data: paginatedItems
  });
});

router.post("/items", (req, res) => {
  const { name, category } = req.body;
  if (!name || !category) return res.status(400).json({ error: "Name and category are required" });

  const newItem = { id: items.length + 1, name, category };
  items.push(newItem);
  res.status(201).json(newItem);
});

router.put("/items/:id", (req, res) => {
  const { id } = req.params;
  const { name, category } = req.body;

  const itemIndex = items.findIndex(i => i.id === parseInt(id));
  if (itemIndex === -1) return res.status(404).json({ error: "Item not found" });

  if (!name || !category) return res.status(400).json({ error: "Name and category are required for PUT" });

  items[itemIndex] = { id: parseInt(id), name, category };
  res.json(items[itemIndex]);
});

router.patch("/items/:id", (req, res) => {
  const { id } = req.params;
  const { name, category } = req.body;

  const item = items.find(i => i.id === parseInt(id));
  if (!item) return res.status(404).json({ error: "Item not found" });

  if (name) item.name = name;
  if (category) item.category = category;

  res.json(item);
});

router.delete("/items/:id", (req, res) => {
  const { id } = req.params;
  const index = items.findIndex(i => i.id === parseInt(id));
  if (index === -1) return res.status(404).json({ error: "Item not found" });

  const deleted = items.splice(index, 1);
  res.json({ message: "Item deleted", item: deleted[0] });
});

app.use("/api", router);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
