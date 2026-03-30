# 🐾 Animal Merge Game

A fun, interactive game where you combine two animals to discover an entirely new one! Merge a **cat + dog** and get a **wolf** — the possibilities are wild (literally).

---

## ✨ What is this?

Animal Merge Game is a creative web-based game powered by AI. Players select two animals, submit their combination, and the backend figures out what creature would logically (or imaginatively!) result from merging them. It's part logic puzzle, part trivia, and completely addictive.

---

## 🎮 How to Play

1. Open the game in your browser.
2. Choose **Animal 1** from the input or dropdown.
3. Choose **Animal 2**.
4. Hit **Merge!**
5. Discover the resulting animal. 🐺

> **Example:**  
> `Cat` + `Dog` = `Wolf`  
> `Lion` + `Eagle` = `Griffin`

---

## 🛠️ Tech Stack

| Layer    | Technology                        |
|----------|-----------------------------------|
| Backend  | Java · Spring Boot                |
| Frontend | HTML · CSS · JavaScript           |
| AI Logic | LLM-powered merge resolution      |

---

## 📁 Project Structure

```
ANIMAL-MERGE-GAME/
├── backend/          # Spring Boot application
│   └── src/
│       └── main/
│           ├── java/        # Controllers, services, models
│           └── resources/   # application.properties
├── frontend/         # Static web UI
│   ├── index.html
│   ├── style.css
│   └── script.js
└── .gitattributes
```

---

## 🚀 Getting Started

### Prerequisites

- Java 17+
- Maven
- A modern web browser

### 1. Clone the Repository

```bash
git clone https://github.com/NamanRai64/ANIMAL-MERGE-GAME.git
cd ANIMAL-MERGE-GAME
```

### 2. Run the Backend

```bash
cd backend
./mvnw spring-boot:run
```

The server will start at `http://localhost:8080`.

### 3. Open the Frontend

Open `frontend/index.html` directly in your browser, or serve it with any static file server:

```bash
# Using Python
cd frontend
python3 -m http.server 3000
```

Then visit `http://localhost:3000`.

---

## 🔌 API Reference

### `POST /merge`

Merges two animals and returns the result.

**Request Body:**
```json
{
  "animal1": "cat",
  "animal2": "dog"
}
```

**Response:**
```json
{
  "result": "wolf"
}
```

---

## 🤝 Contributing

Contributions are welcome! Feel free to open an issue or submit a pull request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/new-merge-logic`)
3. Commit your changes (`git commit -m 'Add new merge combinations'`)
4. Push to the branch (`git push origin feature/new-merge-logic`)
5. Open a Pull Request

---

## 📄 License

This project is open source. See the repository for details.

---

## 👤 Author

**Naman Rai** — [@NamanRai64](https://github.com/NamanRai64)

---

> *What will you merge next?* 🦁🐍 = 🐉
