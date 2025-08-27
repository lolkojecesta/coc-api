    // server.js - Updated Express.js server file on Render
const express = require("express");
const fetch = require("node-fetch"); // If you're using Node <18, keep this. For Node 18+ it's built-in.
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;
const API_KEY = process.env.COC_API_KEY;

// Player endpoint
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

// Clan War Log endpoint (cleaned up)
app.get("/clan/warlog/:tag", async (req, res) => {
  try {
    const tag = encodeURIComponent(`#${req.params.tag}`);
    const response = await fetch(`https://api.clashofclans.com/v1/clans/${tag}/warlog`, {
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

    // Limit results for speed
    const wars = data.items.slice(0, 10).map(war => ({
      result: war.result,
      teamSize: war.teamSize,
      attacksPerMember: war.attacksPerMember,
      clanStars: war.clan.stars,
      opponentStars: war.opponent.stars
    }));

    res.json(wars);

  } catch (error) {
    res.status(500).json({ error: "Server error", details: error.message });
  }
});

    
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));

