const express = require("express");

const app = express(); //express is class ........so class of the instance is created here

app.use(express.json());

const { open } = require("sqlite");
//both are the packages the express js server communicate with database we use the these two packages
const sqlite3 = require("sqlite3");

const path = require("path"); //path is core module .like inbuild module

const dbpath = path.join(__dirname, "cricketTeam.db"); //for the database path...where the database is present

let db = null;

const intilizerDBandServer = async () => {
  try {
    db = await open({
      //after resolving the promise object. db return connection object to operate on the database
      filename: dbpath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () => {
      console.log("The Server Has Started");
    });
  } catch (e) {
    console.log(`DB Error:${e.message}`);
    process.exit(1);
  }
};
intilizerDBandServer();

//1) first API return the list of all the players of the list

// app.get("/players/", async (request, response) => {
//   const all_players = `
//       SELECT
//         *
//        FROM
//        cricket_team;
//     `;
//   const player_list = await db.all(all_players);
//   response.send(player_list);
// });

app.get("/players/", async (request, response) => {
  const players_list_query = `
         SELECT 
          *
          FROM 
          cricket_team
      ;`;
  const playes_list = await db.all(players_list_query);
  response.send(playes_list);
});

//2) second API to insert the new player list in the database

app.post("/players/", async (request, response) => {
  const new_player = request.body;
  //   console.log(new_player);
  const { playerName, jerseyNumber, role } = new_player;
  const new_player_insert = `
     INSERT INTO cricket_team(
         player_name,jersey_number,role
     )
     VALUES
     ('${playerName}',${jerseyNumber},'${role}');
    `;
  const player_new_data = await db.run(new_player_insert);
  response.send("Player Added to Team");
});

//3. return player list based on the player_id

// app.get("/players/:playerId/", async (request, response) => {
//   const { playerId } = request.params;
//   //   console.log(playerId);
//   const single_player = `
//      SELECT
//        *
//       FROM
//       cricket_team
//       WHERE player_id = ${playerId};
//     `;
//   const single_player_data = await db.get(single_player);
//   response.send(single_player_data);
// });

app.get("/players/:playerId/", async (request, response) => {
  const { playerId } = request.params;
  const single_user = `
       SELECT 
        *
        FROM 
        cricket_team
        WHERE player_id = ${playerId};
    `;
  const single_player = await db.get(single_user);
  response.send(single_player);
});

//4.update the one player list details

app.put("/players/:playerId/", async (request, response) => {
  const { playerId } = request.params;
  const update_list_data = request.body;
  const { playerName, jerseyNumber, role } = update_list_data;

  const updatequery = `
     UPDATE cricket_team 
     SET 
     player_name ='${playerName}',
     jersey_number = ${jerseyNumber},
     role = '${role}'
     WHERE player_id = ${playerId};   
    `;
  await db.run(updatequery);
  response.send("Player Details Updated");
});

//5.  delete the one player based player_id

app.delete("/players/:playerId/", async (request, response) => {
  const { playerId } = request.params;
  const delete_query = `
      DELETE 
      FROM
      cricket_team 
      WHERE player_id = ${playerId};
    `;
  await db.run(delete_query);
  response.send("Player Removed");
});

module.exports = app;
