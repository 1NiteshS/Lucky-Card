import Game from "../models/gameModel.js";
import { Server } from "socket.io";
import {
  calculateAmounts as calcAmounts,
  getCurrentGame,
  placeAutomatedBet,
} from "../controllers/cardController.js";
let mainTime = 90;
let timer = {
  remainingTime: mainTime,
  isRunning: false,
};
// Increased the calculation start time to ensure results arrive before last 5 seconds
const CALCULATION_START_TIME = 10; // Increased from 9 to 15 seconds
const RESULT_DEADLINE = 5; // Results must be ready by this many seconds before end
let timerInterval;
let calculationPromise = null; // To store ongoing calculation
// Start and manage the timer
const startTimer = (socket) => {
  if (!timer.isRunning) {
    timer.isRunning = true;
    timer.remainingTime = mainTime;
    let calculatedAmounts = null;
    let gameID = null;
    let previousGameID = null;
    let calculationStarted = false;
    broadcastTimerUpdate(socket);
    timerInterval = setInterval(async () => {
      try {
        if (timer.remainingTime > 0) {
          timer.remainingTime -= 1;
          console.log(timer.remainingTime);
          // Start calculation earlier and store the promise
          if (
            timer.remainingTime === CALCULATION_START_TIME &&
            !calculationStarted
          ) {
            console.log("Starting calculations early...");
            calculationStarted = true;
            calculationPromise = calcAmounts(timer.remainingTime).catch(
              (error) => {
                console.error("Calculation error:", error);
                return null;
              }
            );
          }
          // Call placeAutomatedBet API only in the last 12 seconds
          // if (timer.remainingTime == 30) {
          //   await placeAutomatedBet();
          // }
          // Check if calculation is complete by RESULT_DEADLINE
          if (timer.remainingTime === RESULT_DEADLINE && calculationPromise) {
            console.log("Ensuring calculation completion...");
            calculatedAmounts = await Promise.race([
              calculationPromise,
              new Promise((_, reject) =>
                setTimeout(() => reject(new Error("Calculation timeout")), 2000)
              ),
            ]).catch((error) => {
              console.error("Failed to get results by deadline:", error);
              return null;
            });
          }
          if (timer.remainingTime === mainTime - 2) {
            const result = await getCurrentGame();
            if (result.success) {
              gameID = result.data.gameId;
              if (gameID === previousGameID) {
                console.log("GameID unchanged, retrieving data again...");
                const refreshedResult = await getCurrentGame();
                if (refreshedResult.success) {
                  gameID = refreshedResult.data.gameId;
                } else {
                  console.error(
                    "Failed to refresh game data:",
                    refreshedResult.message
                  );
                }
              }
              previousGameID = gameID;
            } else {
              console.error("Failed to get current game:", result.message);
            }
          }
          // Broadcast calculated amounts if available
          if (
            timer.remainingTime <= CALCULATION_START_TIME &&
            calculatedAmounts
          ) {
            broadcastTimerUpdate(socket, gameID, calculatedAmounts);
          } else {
            broadcastTimerUpdate(socket, gameID);
          }
        } else {
          // Timer hit zero
          clearInterval(timerInterval);
          timer.isRunning = false;
          calculationPromise = null;
          calculatedAmounts = null;
          const newGameId = await createNewGame();
          broadcastTimerUpdate(socket, newGameId);
          setTimeout(() => {
            resetAndRestartTimer(socket);
          }, 1000);
        }
      } catch (error) {
        console.error("Error during timer tick:", error);
        clearInterval(timerInterval);
        timer.isRunning = false;
        calculationPromise = null;
      }
    }, 1000);
  }
};
// Helper to reset and restart the timer
const resetAndRestartTimer = (socket) => {
  timer.remainingTime = mainTime;
  timer.isRunning = false;
  broadcastTimerUpdate(socket);
  startTimer(socket);
};
const broadcastTimerUpdate = (
  socket,
  newGameId = null,
  calculatedAmounts = null
) => {
  const updateData = {
    remainingTime: timer.remainingTime,
    isRunning: timer.isRunning,
  };
  if (newGameId !== null) {
    updateData.newGameId = newGameId;
  }
  if (calculatedAmounts !== null) {
    updateData.calculatedAmounts = calculatedAmounts;
  }
  socket.emit("timerUpdate", updateData);
  socket.broadcast.emit("timerUpdate", updateData);
};
const createNewGame = async () => {
  const newGame = new Game({
    Bets: [],
  });
  await newGame.save();
  return newGame._id.toString();
};
const startSocket = (httpServer) => {
  const io = new Server(httpServer, {
    cors: {
      origin: "*",
    },
  });
  io.on("connection", (socket) => {
    console.log("A user connected");
    socket.emit("timerUpdate", {
      remainingTime: timer.remainingTime,
      isRunning: timer.isRunning,
    });
    socket.on("startTimer", () => {
      startTimer(socket);
    });
    socket.on("disconnect", () => {
      console.log("User disconnected");
    });
  });
};
export { startSocket };
