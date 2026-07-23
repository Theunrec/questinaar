const questions = [
  {
    id: 1,
    text: "Do you currently use a laptop or a desktop as your primary work device?",
    type: "single choice",
    option: ["Laptop", "Desktop", "Other"],
  },
  {
    id: 2,
    text: "Which of the two do you personally prefer using for daily office tasks?",
    type: "single choice",
    option: ["Laptop", "Desktop", "No preference"],
  },
  {
    id: 3,
    text: "In your opinion, what is the single greatest advantage of using a laptop in the workplace?",
    type: "text",
  },
  {
    id: 4,
    text: "What is the biggest drawback or limitation of using a laptop for your daily work?",
    type: "text",
  },
  {
    id: 5,
    text: "What do you think a desktop computer does better than a laptop?",
    type: "text",
  },
  {
    id: 6,
    text: "How important is physical desk mobility (e.g., moving to meeting rooms, working from home) to your job role?",
    type: "text",
  },
  {
    id: 7,
    text: "When it comes to screen size, keyboard comfort, and ergonomics, which device do you feel supports longer working hours better?",
    type: "text",
  },
  {
    id: 8,
    text: "If you experienced a hardware issue, which system do you think is easier and faster for an IT department to repair or upgrade?",
    type: "text",
  },
  {
    id: 9,
    text: "From a cost-to-performance perspective, which device do you believe offers better value for a business?",
    type: "text",
  },
  {
    id: 10,
    text: "If you could only have one device provided by your employer, which would you choose to ensure maximum productivity?",
    type: "text",
  },
];

// App State
let currentQuestionIndex = 0;
let userProfile = { name: "", position: "" };
let userAnswers = {};

// DOM Elements
const greetingScreen = document.getElementById("greeting-screen");
const personalScreen = document.getElementById("personal-screen");
const questionScreen = document.getElementById("question-screen");
const finishedScreen = document.getElementById("finished-screen");

const startBtn = document.getElementById("start-btn");
const personalForm = document.getElementById("personal-form");
const backBtn = document.getElementById("back-btn");
const nextBtn = document.getElementById("next-btn");
const showBtn = document.getElementById("show-btn");
const sendBtn = document.getElementById("send-btn");

const qNumber = document.getElementById("q-number");
const qText = document.getElementById("q-text");
const qInputContainer = document.getElementById("q-input-container");
const summaryDisplay = document.getElementById("summary-display");

// 1. Start Button -> Go to Personal Info
startBtn.addEventListener("click", () => {
  greetingScreen.classList.add("hidden");
  personalScreen.classList.remove("hidden");
});

// 2. Personal Info Form Submit -> Go to Questions
personalForm.addEventListener("submit", (e) => {
  e.preventDefault();
  userProfile.name = document.getElementById("userName").value.trim();
  userProfile.position =
    document.getElementById("userPosition").value.trim() || "Not specified";

  personalScreen.classList.add("hidden");
  questionScreen.classList.remove("hidden");
  renderQuestion();
});

// 3. Render Current Question
function renderQuestion() {
  const currentQ = questions[currentQuestionIndex];
  qNumber.textContent = `Question ${currentQ.id} of ${questions.length}`;
  qText.textContent = currentQ.text;

  // Clear previous inputs
  qInputContainer.innerHTML = "";

  // Handle Back Button visibility
  if (currentQuestionIndex === 0) {
    backBtn.classList.add("hidden");
  } else {
    backBtn.classList.remove("hidden");
  }

  // Render options based on question type
  if (currentQ.type === "single choice") {
    currentQ.option.forEach((opt) => {
      const label = document.createElement("label");
      label.className = "radio-option";

      const isChecked = userAnswers[currentQ.id] === opt ? "checked" : "";

      label.innerHTML = `
        <input type="radio" name="q${currentQ.id}" value="${opt}" ${isChecked}>
        <span>${opt}</span>
      `;
      qInputContainer.appendChild(label);
    });
  } else {
    const textarea = document.createElement("textarea");
    textarea.placeholder = "Type your answer here...";
    textarea.value = userAnswers[currentQ.id] || "";
    textarea.id = `q-textarea-${currentQ.id}`;
    qInputContainer.appendChild(textarea);
  }
}

// Save Current Answer
function saveCurrentAnswer() {
  const currentQ = questions[currentQuestionIndex];

  if (currentQ.type === "single choice") {
    const selected = document.querySelector(
      `input[name="q${currentQ.id}"]:checked`,
    );
    if (selected) {
      userAnswers[currentQ.id] = selected.value;
      return true;
    }
  } else {
    const textarea = document.getElementById(`q-textarea-${currentQ.id}`);
    if (textarea && textarea.value.trim() !== "") {
      userAnswers[currentQ.id] = textarea.value.trim();
      return true;
    }
  }
  return false;
}

// 4. Next Button Click
nextBtn.addEventListener("click", () => {
  const hasAnswered = saveCurrentAnswer();

  if (!hasAnswered) {
    alert("Please provide an answer before moving to the next question.");
    return;
  }

  if (currentQuestionIndex < questions.length - 1) {
    currentQuestionIndex++;
    renderQuestion();
  } else {
    // Reached the end
    questionScreen.classList.add("hidden");
    finishedScreen.classList.remove("hidden");
  }
});

// 5. Back Button Click
backBtn.addEventListener("click", () => {
  saveCurrentAnswer(); // Save progress if typed
  if (currentQuestionIndex > 0) {
    currentQuestionIndex--;
    renderQuestion();
  }
});

// 6. Show Results Summary
showBtn.addEventListener("click", () => {
  let summaryText = `Participant: ${userProfile.name} (${userProfile.position})\n\n`;

  questions.forEach((q) => {
    summaryText += `Q${q.id}: ${q.text}\nAnswer: ${userAnswers[q.id] || "N/A"}\n\n`;
  });

  summaryDisplay.textContent = summaryText;
  summaryDisplay.classList.toggle("hidden");
});

// 7. Send via Email (Mailto trigger)
const printBtn = document.getElementById("send-btn"); // or your print button ID

printBtn.addEventListener("click", () => {
  // 1. Build the answers summary text
  let summaryText = `PARTICIPANT SUMMARY\n`;
  summaryText += `Name: ${userProfile.name}\n`;
  summaryText += `Position: ${userProfile.position}\n\n`;
  summaryText += `----------------------------------------\n\n`;

  questions.forEach((q) => {
    summaryText += `Q${q.id}: ${q.text}\n`;
    summaryText += `Answer: ${userAnswers[q.id] || "N/A"}\n\n`;
  });

  // 2. Insert summary into the container and reveal it
  summaryDisplay.textContent = summaryText;
  summaryDisplay.classList.remove("hidden");

  // 3. Trigger the browser print dialog
  window.print();
});

