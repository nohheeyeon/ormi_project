const $form = document.querySelector("#chat-form");
const $input = document.querySelector("#data");
const $chatList = document.querySelector("#chat-list");

// openAI API
let url = `https://estsoft-openai-api.jejucodingcamp.workers.dev/`;

// 사용자의 질문
let question;

// 질문과 답변 저장
let data = [
  {
    role: "system",
    content: "assistant는 친절한 답변가이다.",
  },
];

// 화면에 뿌려줄 데이터, 질문들
let questionData = [];

// input에 입력된 질문 받아오는 함수
$input.addEventListener("input", (e) => {
  question = e.target.value;
});

// 사용자의 질문을 객체를 만들어서 push
const sendQuestion = (question) => {
  if (question) {
    data.push({
      role: "user",
      content: question,
    });
    questionData.push({
      role: "user",
      content: question,
    });
  }
};

// 화면에 질문 그려주는 함수
const printQuestion = async () => {
  if (question) {
    let li = document.createElement("li");
    li.classList.add("question");
    questionData.forEach((el) => {
      li.innerText = el.content;
    });
    $chatList.appendChild(li);
    questionData = [];
    question = false;
  }
};

// 화면에 답변 그려주는 함수
const printAnswer = (answer) => {
  let li = document.createElement("li");
  li.classList.add("answer");
  li.innerText = answer.content;
  $chatList.appendChild(li);
};

// api 요청보내는 함수
const apiPost = async () => {
  const result = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
    redirect: "follow",
  })
    .then((res) => res.json())
    .then((res) => {
      printAnswer(res.choices[0].message);
    })
    .catch((err) => {
      console.log(err);
    });
};

// 스크롤 내려가는 기능 추가
window.addEventListener("DOMContentLoaded", function () {
  const boxes = document.querySelectorAll(".box");

  function handleScroll() {
    const currentScrollPos = window.pageYOffset || document.documentElement.scrollTop;

    for (let i = 0; i < boxes.length; i++) {
      const box = boxes[i];
      const nextBox = boxes[i + 1];

      const boxTop = box.offsetTop;
      const nextBoxTop = nextBox ? nextBox.offsetTop : Number.POSITIVE_INFINITY;

      if (currentScrollPos >= boxTop && currentScrollPos < nextBoxTop) {
        box.style.position = "fixed";
        box.style.top = "50px"; // 헤더의 높이에 맞게 이 값을 조정해주세요
      } else {
        box.style.position = "relative";
        box.style.top = "auto";
      }
    }
  }

  window.addEventListener("scroll", handleScroll);
});

// submit
$form.addEventListener("submit", (e) => {
  e.preventDefault();
  $input.value = null;
  sendQuestion(question);
  apiPost();
  printQuestion();
});
