const $form = document.querySelector("#chat-form");
const $input = document.querySelector("#data");
const $chatList = document.querySelector("#chat-list");

// openAI API
let url = `https://estsoft-openai-api.jejucodingcamp.workers.dev/`;

// checkbox 데이터를 담을 객체
let checkboxData = {};

// 질문과 답변 저장
let data = [
  {
    role: "system",
    content: "assistant는 친절한 답변가이다.",
  },
];

// input에 입력된 질문 받아오는 함수
$input.addEventListener("input", (e) => {
  questionData = e.target.value;
});

// checkbox 데이터를 객체로 변환하는 함수
const getCheckboxData = () => {
  const $genderCheckboxes = document.querySelectorAll(".gender input[type='checkbox']");
  const $ageCheckboxes = document.querySelectorAll(".age input[type='checkbox']");
  const $placeCheckboxes = document.querySelectorAll(".place input[type='checkbox']");

  checkboxData = {};

  $genderCheckboxes.forEach((checkbox) => {
    if (checkbox.checked) {
      checkboxData["성별"] = checkbox.id;
    }
  });

  $ageCheckboxes.forEach((checkbox) => {
    if (checkbox.checked) {
      checkboxData["나이"] = checkbox.id;
    }
  });

  $placeCheckboxes.forEach((checkbox) => {
    if (checkbox.checked) {
      checkboxData["장소"] = checkbox.id;
    }
  });
};

// 사용자의 질문을 객체를 만들어서 push
const sendQuestion = (question) => {
  if (question) {
    getCheckboxData();

    const questionObject = {
      role: "user",
      content: question,
      ...checkboxData,
    };

    data.push(questionObject);
  }
};

// 화면에 질문 그려주는 함수
const printQuestion = () => {
  if (data.length > 0) {
    let li = document.createElement("li");
    li.classList.add("question");
    li.innerText = data[data.length - 1].content;
    $chatList.appendChild(li);
  }
};

// 화면에 답변 그려주는 함수
const printAnswer = (answer) => {
  let li = document.createElement("li");
  li.classList.add("answer");
  li.innerText = answer;
  $chatList.appendChild(li);
};

// api 요청보내는 함수
const apiPost = async () => {
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error("API 요청에 실패하였습니다.");
    }

    const result = await response.json();

    const answer = result.choices[0].message;
    printAnswer(answer);

    data.push({
      role: "system",
      content: answer,
    });
  } catch (error) {
    console.log(error);
  }
};

// submit
$form.addEventListener("submit", (e) => {
  e.preventDefault();
  const question = $input.value;
  $input.value = "";

  sendQuestion(question);
  printQuestion();
  apiPost();
});
