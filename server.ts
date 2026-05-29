import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import { PRESET_QUESTIONS, TOPICS, BADGES_LIST } from "./src/questionsData";
import { Question, UserProfile, LeaderboardEntry } from "./src/types";

// DB Path
const DB_FILE = path.join(process.cwd(), "database.json");

// Save Helper
function getDb() {
  if (!fs.existsSync(DB_FILE)) {
    const initialDb = {
      users: {} as Record<string, UserProfile>,
      customQuestions: [] as Question[]
    };
    fs.writeFileSync(DB_FILE, JSON.stringify(initialDb, null, 2), "utf-8");
    return initialDb;
  }
  try {
    const data = fs.readFileSync(DB_FILE, "utf-8");
    return JSON.parse(data);
  } catch (e) {
    const fallbackDb = {
      users: {} as Record<string, UserProfile>,
      customQuestions: [] as Question[]
    };
    return fallbackDb;
  }
}

function saveDb(db: any) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), "utf-8");
  } catch (e) {
    console.error("Failed to write database.json:", e);
  }
}

// Lazy Gemini Initiation
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY;
  // If the user hasn't set the key or uses placeholder
  if (!apiKey || apiKey === "MY_GEMINI_API_KEY" || apiKey.trim() === "") {
    throw new Error(
      "GEMINI_API_KEY සොයාගත නොහැකි විය. කරුණාකර 'Settings > Secrets' පැනලය හරහා ඔබගේ Gemini API Key එක ඇතුලත් කරන්න."
    );
  }
  if (!aiClient) {
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

// User Profile Factory
function createDefaultProfile(username: string): UserProfile {
  return {
    id: "user_" + Date.now(),
    username: username.trim(),
    xp: 0,
    level: 1,
    streak: 0,
    coins: 100, // Starts with some coins for lifelines!
    badges: ["pioneer"], // Pioneer badge granted!
    last_active_date: new Date().toISOString().split("T")[0],
    stats: {
      total_questions_answered: 0,
      correct: 0,
      accuracy: 0,
      topic_stats: {
        periodic: { answered: 0, correct: 0 },
        "s-block": { answered: 0, correct: 0 },
        "p-block": { answered: 0, correct: 0 },
        "d-block": { answered: 0, correct: 0 },
        coordination: { answered: 0, correct: 0 },
        environmental: { answered: 0, correct: 0 }
      }
    },
    inventory: {
      fiftyFifty: 2,
      doubleTime: 2,
      skip: 1
    }
  };
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Use JSON parsing middleware
  app.use(express.json());

  // Log requests
  app.use((req, res, next) => {
    console.log(`[HTTP] ${req.method} ${req.path}`);
    next();
  });

  // --- API Endpoints ---

  // Topic Metadata
  app.get("/api/topics", (req, res) => {
    const db = getDb();
    const allQuestions = [...PRESET_QUESTIONS, ...(db.customQuestions || [])];
    
    // Map with dynamic question counts
    const topicsWithCounts = TOPICS.map(topic => {
      const qCount = allQuestions.filter(q => q.topic === topic.id).length;
      return {
        ...topic,
        questionCount: qCount
      };
    });
    res.json(topicsWithCounts);
  });

  // Get User Profile (Create if not exists - fallback)
  app.get("/api/user/profile", (req, res) => {
    const username = (req.query.username as string) || "GUEST_USER";
    const db = getDb();
    
    if (!db.users[username]) {
      db.users[username] = createDefaultProfile(username);
      saveDb(db);
    }
    
    res.json(db.users[username]);
  });

  // --- Brand New Email & Password Identity Suite ---

  // Auth: Sign Up with email & password & username
  app.post("/api/portal/register", (req, res) => {
    const { email, username, password } = req.body;
    if (!email || !username || !password) {
      return res.status(400).json({ error: "කරුණාකර විද්‍යුත් තැපෑල, පරිශීලක නාමය සහ මුරපදය ඇතුලත් කරන්න." });
    }

    const cleanEmail = email.trim();
    const cleanUsername = username.trim();
    const cleanPassword = password.trim();

    if (cleanUsername.length < 3) {
      return res.status(400).json({ error: "පරිශීලක නාමය අවම වශයෙන් අකුරු 3ක් විය යුතුය." });
    }
    if (cleanPassword.length < 4) {
      return res.status(400).json({ error: "මුරපදය (Password) අවම වශයෙන් අකුරු 4ක් විය යුතුය." });
    }

    const db = getDb();

    // Check if username already exists in db key
    if (db.users[cleanUsername]) {
      return res.status(400).json({ error: "මෙම පරිශීලක නාමය දැනටමත් පද්ධතිය තුළ පවතී! කරුණාකර වෙනත් එකක් තෝරන්න." });
    }

    // Check if email already registered under another account
    const emailExists = Object.values(db.users).some(
      (u: any) => u.email && u.email.toLowerCase() === cleanEmail.toLowerCase()
    );
    if (emailExists) {
      return res.status(400).json({ error: "මෙම විද්‍යුත් තැපෑල දැනටමත් ලියාපදිංචි කර ඇත! කරුණාකර වෙනත් එකක් ඇතුලත් කරන්න." });
    }

    // Create profile
    const profile = createDefaultProfile(cleanUsername);
    (profile as any).email = cleanEmail;
    (profile as any).password = cleanPassword;

    db.users[cleanUsername] = profile;
    saveDb(db);

    res.json({ success: true, username: cleanUsername, profile });
  });

  // Auth: Sign In with email and password
  app.post("/api/portal/login", (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "කරුණාකර විද්‍යුත් තැපෑල හෝ පරිශීලක නාමය සහ මුරපදය ඇතුලත් කරන්න." });
    }

    const cleanInput = email.trim();
    const cleanPassword = password.trim();

    const db = getDb();
    
    // Check if the user exists by username direct lookup field
    let foundUser: any = db.users[cleanInput];
    
    if (!foundUser) {
      // Check if found by searching the email field of current users
      foundUser = Object.values(db.users).find(
        (u: any) => u.email && u.email.toLowerCase() === cleanInput.toLowerCase()
      );
    }

    if (!foundUser) {
      return res.status(400).json({ error: "මෙම විද්‍යුත් තැපෑල හෝ පරිශීලක නාමය ලියාපදිංචි කර නැත! කරුණාකර ගිණුමක් සාදන්න." });
    }

    if (foundUser.password && foundUser.password !== cleanPassword) {
      return res.status(400).json({ error: "මුරපදය (Password) වැරදියි! කරුණාකර නැවත උත්සාහ කරන්න." });
    }

    res.json({ success: true, username: foundUser.username, profile: foundUser });
  });

  // Reset User Profile
  app.post("/api/user/reset", (req, res) => {
    const { username } = req.body;
    if (!username) {
      return res.status(400).json({ error: "Username is required" });
    }
    const db = getDb();
    db.users[username] = createDefaultProfile(username);
    saveDb(db);
    res.json(db.users[username]);
  });

  // Get Questions for Quiz (Topic-wise or Random Mixed)
  app.get("/api/questions", (req, res) => {
    const { topic, limit } = req.query;
    const db = getDb();
    
    let pool = [...PRESET_QUESTIONS, ...(db.customQuestions || [])];
    
    if (topic && topic !== "mixed") {
      pool = pool.filter(q => q.topic === topic);
    }
    
    // Shuffle helper
    const shuffled = [...pool].sort(() => 0.5 - Math.random());
    const queryLimit = parseInt(limit as string) || 10;
    const selected = shuffled.slice(0, queryLimit);
    
    res.json(selected);
  });

  // Submit Answer & update stats dynamically
  app.post("/api/questions/submit", (req, res) => {
    const { username, questionId, chosenIndex, isCorrect, xpPlus, coinsPlus } = req.body;
    if (!username) {
      return res.status(400).json({ error: "Username is required" });
    }

    const db = getDb();
    let profile = db.users[username];
    if (!profile) {
      profile = createDefaultProfile(username);
      db.users[username] = profile;
    }

    // Find question to register topic-wise stats
    const allQuestions = [...PRESET_QUESTIONS, ...(db.customQuestions || [])];
    const q = allQuestions.find(item => item.id === questionId);

    // Update global counters
    profile.stats.total_questions_answered += 1;
    if (isCorrect) {
      profile.stats.correct += 1;
      profile.streak += 1;
      
      // Calculate multiplier
      // Consecutive correct answers streak multiplier:
      // +10XP base. 3 streak = 2x, 5 streak = 3x, 10 streak = 5x
      let multiplier = 1;
      if (profile.streak >= 10) multiplier = 5;
      else if (profile.streak >= 5) multiplier = 3;
      else if (profile.streak >= 3) multiplier = 2;

      const finalXp = (xpPlus || 10) * multiplier;
      const finalCoins = coinsPlus || 5;

      profile.xp += finalXp;
      profile.coins += finalCoins;

      // Check level up (Level up every 500 XP)
      const currentLevel = Math.floor(profile.xp / 500) + 1;
      if (currentLevel > profile.level) {
        profile.level = currentLevel;
        // Level up bonus!
        profile.coins += 25;
      }
    } else {
      // Wrong answer resets streak
      profile.streak = 0;
    }

    // Update topic specific stats
    if (q) {
      const topicId = q.topic;
      if (!profile.stats.topic_stats[topicId]) {
        profile.stats.topic_stats[topicId] = { answered: 0, correct: 0 };
      }
      profile.stats.topic_stats[topicId].answered += 1;
      if (isCorrect) {
        profile.stats.topic_stats[topicId].correct += 1;
      }
    }

    // Recalculate global accuracy
    profile.stats.accuracy = parseFloat(
      (profile.stats.correct / profile.stats.total_questions_answered).toFixed(3)
    );

    // Dynamic Badges Earning Engine
    const currentBadges = new Set(profile.badges);

    // 1. Streak Master badge
    if (profile.streak >= 5 && !currentBadges.has("streak_master")) {
      currentBadges.add("streak_master");
    }
    // 2. Block Expert Badge (either s or p block > 80% with 10 questions answered)
    const sStats = profile.stats.topic_stats["s-block"];
    const pStats = profile.stats.topic_stats["p-block"];
    const sCorrect = sStats ? sStats.correct : 0;
    const pCorrect = pStats ? pStats.correct : 0;
    const sAnswered = sStats ? sStats.answered : 0;
    const pAnswered = pStats ? pStats.answered : 0;

    if (((sAnswered >= 10 && (sCorrect / sAnswered) >= 0.8) || 
         (pAnswered >= 10 && (pCorrect / pAnswered) >= 0.8)) && 
        !currentBadges.has("block_expert")) {
      currentBadges.add("block_expert");
    }

    // 3. Coordination Guru Badge
    const coordStats = profile.stats.topic_stats["coordination"];
    if (coordStats && coordStats.correct >= 5 && !currentBadges.has("coordination_guru")) {
      currentBadges.add("coordination_guru");
    }

    // 4. Coin Hoarder Badge
    if (profile.coins >= 250 && !currentBadges.has("coin_hoarder")) {
      currentBadges.add("coin_hoarder");
    }

    profile.badges = Array.from(currentBadges);

    // Update last active
    profile.last_active_date = new Date().toISOString().split("T")[0];

    // Save
    db.users[username] = profile;
    saveDb(db);

    res.json(profile);
  });

  // Shop purchase lifeline
  app.post("/api/user/purchase", (req, res) => {
    const { username, powerUpType } = req.body;
    if (!username || !powerUpType) {
      return res.status(400).json({ error: "Username and powerUpType are required" });
    }

    const PRICES: Record<string, number> = {
      fiftyFifty: 30,  // 30 coins
      doubleTime: 20,  // 20 coins
      skip: 40        // 40 coins
    };

    const cost = PRICES[powerUpType];
    if (cost === undefined) {
      return res.status(400).json({ error: "Invalid powerUpType" });
    }

    const db = getDb();
    const profile = db.users[username];
    if (!profile) {
      return res.status(404).json({ error: "User not found" });
    }

    if (profile.coins < cost) {
      return res.status(400).json({ error: "ප්‍රමාණවත් කාසි නොමැත! (Insufficient coins)" });
    }

    profile.coins -= cost;
    if (powerUpType === "fiftyFifty") profile.inventory.fiftyFifty += 1;
    else if (powerUpType === "doubleTime") profile.inventory.doubleTime += 1;
    else if (powerUpType === "skip") profile.inventory.skip += 1;

    db.users[username] = profile;
    saveDb(db);

    res.json(profile);
  });

  // Get Leaderboards
  app.get("/api/leaderboard", (req, res) => {
    const currentUser = (req.query.username as string) || "GUEST";
    const db = getDb();

    // Compile leaderboard from DB
    const allPlayersMap = new Map<string, { xp: number; level: number }>();

    // Overwrite/insert actual players in database
    Object.keys(db.users).forEach(uName => {
      const user = db.users[uName];
      allPlayersMap.set(user.username, { xp: user.xp, level: user.level });
    });

    // Sort descending by XP
    const sortedList = Array.from(allPlayersMap.entries())
      .map(([username, details]) => ({
        username,
        xp: details.xp,
        level: details.level
      }))
      .sort((a, b) => b.xp - a.xp);

    // Add ranks
    const finalLeaderboard = sortedList.map((entry, idx) => ({
      ...entry,
      rank: idx + 1,
      isCurrentUser: entry.username === currentUser
    }));

    res.json(finalLeaderboard);
  });

  // Multi-Engine AI MCQ Generator (supports Gemini & DeepSeek)
  app.post("/api/questions/generate", async (req, res) => {
    try {
      const { topic, subtopic, difficulty, engine } = req.body;
      if (!topic) {
        return res.status(400).json({ error: "කාණ්ඩය අනිවාර්ය වේ. (Topic is required)" });
      }

      // Find topic descriptors to guide AI context
      const topicObj = TOPICS.find(t => t.id === topic);
      const topicSiName = topicObj ? topicObj.name_si : topic;
      const topicEnName = topicObj ? topicObj.name_en : topic;

      const subtopicSnippet = subtopic
        ? `and specifically focused around the sub-theme: "${subtopic}"`
        : "";

      const requestedDifficulty = difficulty || "medium";

      const prompt = `Generate exactly 1 unique, highly challenging multiple choice question (MCQ) for the Sri Lankan A/L Inorganic Chemistry syllabus (G.C.E. Advanced Level).
Topic Area: ${topicSiName} (${topicEnName}) ${subtopicSnippet}.
Difficulty: ${requestedDifficulty}.

The question and response must strictly follow the official terminology of the National Institute of Education (NIE) Inorganic Chemistry Resource Book ("අකාබනික රසායන විද්‍යාව සම්පත් පොත").

Follow these exact formatting guidelines for JSON fields:
- options_si: Must contain precisely 5 distinct option strings in high-quality Sinhala Unicode Academic terminology. Do NOT add prefix numbering/letters like 1, 2, 3, 4, 5, or අ, ආ, ඉ, ඊ, උ in the string. Just write the pure option text.
- correctIndex: A number from 0 to 4 signifying the correct index of options_si.
- question_si: The detailed question text in Sinhala. Ensure accurate representations of chemical symbols/subscripts like H₂O, [Fe(CN)₆]⁴⁻, Fe³⁺, SO₄²⁻.
- explanation_si: A highly detailed, explanatory paragraph (3-6 sentences) in Sinhala explaining why the correct choice behaves this way chemically, detailing the coordination, colors, solubility, electronic configurations, or physical trends, and explaining why other options are incorrect.
- subtopic: A short sub-topic name, in Sinhala, of about 2-4 words.
- resource_ref: A realistic reference of the Sri Lankan NIE Inorganic resource book, formatted in Sinhala (e.g., 'අකාබනික රසායන සම්පත් පොත, 3 වන පරිච්ඡේදය, 40-42 පිටු').

Return the result as a raw JSON object matching the requested schema.`;

      let qObj: any = null;

      if (engine === "deepseek") {
        console.log("[AI] Requesting DeepSeek engine for Inorganic MCQ generation...");
        const apiKey = process.env.DEEPSEEK_API_KEY || "sk-1cba91d6b73e4de7846263e69a0c1409";
        
        try {
          const dsResponse = await fetch("https://api.deepseek.com/chat/completions", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${apiKey}`
            },
            body: JSON.stringify({
              model: "deepseek-chat",
              messages: [
                {
                  role: "system",
                  content: "You are a senior chemistry professor and a member of the Sri Lankan National Examinations panel setting the A/L Inorganic Chemistry MCQ exam. You write questions in pristine educational Sinhala Unicode, and ALWAYS return ONLY valid JSON matching the requested schema."
                },
                {
                  role: "user",
                  content: prompt
                }
              ],
              response_format: {
                type: "json_object"
              },
              temperature: 0.7
            })
          });

          if (!dsResponse.ok) {
            const errorDetails = await dsResponse.text();
            throw new Error(`DeepSeek API server status: ${dsResponse.status} - ${errorDetails}`);
          }

          const dsData: any = await dsResponse.json();
          const content = dsData.choices?.[0]?.message?.content;
          if (!content) {
            throw new Error("DeepSeek response choices or content was empty");
          }

          qObj = JSON.parse(content.trim());
          console.log("[AI] DeepSeek question successfully generated!");
        } catch (dsError: any) {
          console.error("[AI] DeepSeek API failed, throwing to error handler:", dsError);
          throw new Error(`DeepSeek MCQ generation failed: ${dsError.message}`);
        }
      } else {
        // Fallback or Active default: Gemini 3.5 Flash
        console.log("[AI] Requesting Gemini 3.5 Flash engine for Inorganic MCQ generation...");
        const ai = getGeminiClient();
        const response = await ai.models.generateContent({
          model: "gemini-3.5-flash",
          contents: prompt,
          config: {
            systemInstruction:
              "You are a member of the Sri Lankan National Examinations Department panel. You set the A/L Chemistry MCQ paper, which is highly conceptual, tricky, and strictly accurate. You write all explanations and questions in pristine academic Sinhala Unicode, without using placeholder words or loose nomenclature. You always output purely in JSON.",
            responseMimeType: "application/json",
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                subtopic: { type: Type.STRING },
                question_si: { type: Type.STRING },
                options_si: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING }
                },
                correctIndex: { type: Type.INTEGER },
                explanation_si: { type: Type.STRING },
                resource_ref: { type: Type.STRING }
              },
              required: [
                "subtopic",
                "question_si",
                "options_si",
                "correctIndex",
                "explanation_si",
                "resource_ref"
              ]
            }
          }
        });

        const responseText = response.text;
        if (!responseText) {
          throw new Error("Gemini returned empty response text");
        }

        qObj = JSON.parse(responseText.trim());
        console.log("[AI] Gemini question successfully generated!");
      }

      // Assert array size and type safety
      if (!qObj.options_si || !Array.isArray(qObj.options_si) || qObj.options_si.length < 5) {
        throw new Error("Generated question did not contain 5 options.");
      }

      // Post-process response to align with application model
      const finalQuestion: Question = {
        id: "ai_" + Date.now(),
        topic: topic,
        subtopic: qObj.subtopic || "AI විද්‍යුත් ජනිත",
        question_si: qObj.question_si,
        options_si: qObj.options_si.slice(0, 5),
        correctIndex: typeof qObj.correctIndex === "number" ? qObj.correctIndex : 0,
        explanation_si: qObj.explanation_si || "විවරණය සැපයීමට නොහැකි විය.",
        difficulty: requestedDifficulty as "easy" | "medium" | "hard",
        resource_ref: qObj.resource_ref || "අකාබනික රසායන සම්පත් පොත"
      };

      // Save to databases so it gets pooled!
      const db = getDb();
      if (!db.customQuestions) {
        db.customQuestions = [];
      }
      db.customQuestions.push(finalQuestion);
      saveDb(db);

      res.json({ success: true, question: finalQuestion });
    } catch (e: any) {
      console.error("Failed to generate question with AI:", e);
      res.status(500).json({
        success: false,
        error: e.message || "ප්‍රශ්නය නිෂ්පාදනය කිරීමේදී දෝෂයක් හටගත්තේය."
      });
    }
  });

  // --- Vite Dev Server & Static Output Config ---

  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
    console.log("[SERVER] Vite dev middleware loaded");
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
    console.log(`[SERVER] Static production assets serving from ${distPath}`);
  }

  // Listen on PORT 3000 as strictly required in AI Studio sandboxes
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`===============================================`);
    console.log(`[OK] Full-Stack Inorganic Chemistry Quiz server`);
    console.log(`     Listening on http://0.0.0.0:${PORT}`);
    console.log(`===============================================`);
  });
}

startServer().catch(err => {
  console.error("Critical server startup error:", err);
});
