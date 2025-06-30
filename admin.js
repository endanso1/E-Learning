import { initializeApp } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  query
} from "https://www.gstatic.com/firebasejs/11.9.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyCd6BwNWOJ5T61t90Q5n-r66ljlNgoLhSs",
  authDomain: "lms-platform-944d6.firebaseapp.com",
  projectId: "lms-platform-944d6",
  storageBucket: "lms-platform-944d6.appspot.com",
  messagingSenderId: "273204688964",
  appId: "1:273204688964:web:3373974c9c61fac3872411"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const form = document.getElementById("questionForm");
const questionList = document.getElementById("questionList");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const courseId = document.getElementById("courseId").value.trim();
  const question = document.getElementById("questionText").value.trim();
  const options = document.getElementById("options").value.trim().split(",").map(o => o.trim());
  const answer = document.getElementById("answer").value.trim();
  const explanation = document.getElementById("explanation").value.trim();

  await addDoc(collection(db, "questions"), {
    courseId,
    question,
    options,
    answer,
    explanation
  });

  form.reset();
  loadQuestions();
});

async function loadQuestions() {
  questionList.innerHTML = "";
  const snapshot = await getDocs(collection(db, "questions"));

  const grouped = {};
  snapshot.forEach(docSnap => {
    const data = docSnap.data();
    if (!grouped[data.courseId]) grouped[data.courseId] = [];
    grouped[data.courseId].push({ ...data, id: docSnap.id });
  });

  for (let courseId in grouped) {
    const block = document.createElement("div");
    block.innerHTML = `<h5 class="text-info">Course ${courseId}</h5>`;
    grouped[courseId].forEach((q, i) => {
      block.innerHTML += `
        <div class='mb-2'>
          <p><strong>Q${i + 1}:</strong> ${q.question}<br>
          <small class='text-muted'>Answer: ${q.answer}</small></p>
          <button class='btn btn-sm btn-danger' onclick='deleteQuestion("${q.id}")'>Delete</button>
        </div>`;
    });
    questionList.appendChild(block);
  }
}

window.deleteQuestion = async (id) => {
  await deleteDoc(doc(db, "questions", id));
  loadQuestions();
};

loadQuestions();
