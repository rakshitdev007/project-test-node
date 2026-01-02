import fs from "fs";
import XLSX from "xlsx";

// 1️⃣ Read JSON file
const jsonData = JSON.parse(fs.readFileSync("backend-products.json", "utf8"));

// 2️⃣ Transform JSON (flatten arrays like uploaded_images)
const formattedData = jsonData.map(item => ({
  id: item.id,
  name: item.name,
  blockchain: item.blockchain,
  token: item.token,
  price: item.price,
  tags: item.tags,
  demo_url: item.demo_url,
  video_preview: item.video_preview,
  thumbnail: item.thumbnail,
  ownerAddress: item.ownerAddress,
  uploaded_images: item.uploaded_images.map(img => img.image).join(", "),
  content: item.content.replace(/<[^>]*>?/gm, ""), // remove HTML tags
}));

// 3️⃣ Convert to worksheet
const worksheet = XLSX.utils.json_to_sheet(formattedData);

// 4️⃣ Create a new workbook
const workbook = XLSX.utils.book_new();
XLSX.utils.book_append_sheet(workbook, worksheet, "Projects");

// 5️⃣ Write Excel file
XLSX.writeFile(workbook, "projects.xlsx");

console.log("✅ JSON converted successfully to projects.xlsx");
