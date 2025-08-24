const express = require("express");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;
const API_KEY = process.env.COC_API_KEY;

app.get("/player/:tag", async (req, res) => {
  try {
    const tag = encodeURIComponent(`#${req.params.tag}`);
    const response = await fetch(`https://api.clashofclans.com/v1/players/${tag}`, {
      headers: {
        "Authorization": `Bearer ${API_KEY}`,
        "Accept": "application/json"
      }
    });

    if (!response.ok) {
      const errorData = await response.json();
      return res.status(response.status).json(errorData);
    }

    const data = await response.json();

    // ✅ Only return clean, relevant data
    const filteredData = {
      name: data.name || "Unknown",
      tag: data.tag || req.params.tag,
      trophies: data.trophies || 0,
      townHallLevel: data.townHallLevel || "Unknown",
      clan: data.clan ? data.clan.name : "No clan"
    };

    res.json(filteredData);

  } catch (error) {
    res.status(500).json({ error: "Server error", details: error.message });
  }
});

app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));

