        const express = require("express");
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

// Clan War Log endpoint
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

    // Format only useful data
    const wars = data.items.slice(0, 10).map(war => ({
      result: war.result,
      teamSize: war.teamSize,
      attacks: war.clan.attacks ?? 0,
      opponentAttacks: war.opponent.attacks ?? 0,
      clanStars: war.clan.stars,
      opponentStars: war.opponent.stars
    }));

    res.json(wars);

  } catch (error) {
    res.status(500).json({ error: "Server error", details: error.message });
  }
});

app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));

    // Current War Info endpoint
app.get("/clan/currentwar/:tag", async (req, res) => {
  try {
    const tag = encodeURIComponent(`#${req.params.tag}`);
    const url = `https://api.clashofclans.com/v1/clans/${tag}/currentwar`;

    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        Accept: "application/json",
      },
    });

    // If API returns an error
    if (!response.ok) {
      const errorData = await response.json();
      return res.status(response.status).json(errorData);
    }

    const data = await response.json();

    // Some wars may be "notInWar"
    if (!data.clan || !data.clan.members) {
      return res.json({ state: data.state || "notInWar" });
    }

    // Build clean response
    const result = {
      state: data.state,
      teamSize: data.teamSize,
      startTime: data.startTime,
      endTime: data.endTime,
      clanName: data.clan.name,
      members: data.clan.members.map((m) => ({
        name: m.name,
        tag: m.tag,
        townhall: m.townhallLevel,
        mapPosition: m.mapPosition,
        attacks: m.attacks ? m.attacks.length : 0,
        stars: m.attacks?.reduce((sum, atk) => sum + atk.stars, 0) || 0,
        destruction:
          m.attacks?.reduce(
            (sum, atk) => sum + atk.destructionPercentage,
            0
          ) || 0,
      })),
    };

    res.json(result);
  } catch (error) {
    res.status(500).json({
      error: "Server error",
      details: error.message,
    });
  }
});



    catch (error) {
    res.status(500).json({ error: "Server error", details: error.message });
  }
});

