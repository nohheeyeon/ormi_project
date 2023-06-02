const $form = document.querySelector("#chat-form");
const $input = document.querySelector("#data");
const $chatList = document.querySelector("#chat-list");

// openAI API
let url = `https://estsoft-openai-api.jejucodingcamp.workers.dev/`;

// 사용자의 질문
let question;

// 사용자의 추가 정보
let user_content = '';

// 사용자의 선택 정보
let gender = '';
let age = '';
let place = '';

// 질문과 답변 저장
let data = [
  {
    role: "system",
    content: "assistant는 운동을 추천해주는 친절한 답변가이다.",
  },
];

// 화면에 뿌려줄 데이터, 질문들
let questionData = [];

// input에 입력된 질문 받아오는 함수
$input.addEventListener("input", (e) => {
  question = e.target.value;
  user_content = question; // 사용자가 입력한 내용을 user_content 변수에 할당
});

// 체크박스 변경 시 선택 정보 업데이트
document.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
  checkbox.addEventListener("change", (e) => {
    const target = e.target;
    const id = target.id;
    const checked = target.checked;

    if (id === '여자' || id === '남자') {
      gender = checked ? id : '';
    } else if (id.includes('대')) {
      age = checked ? id : '';
    } else if (id === '실내' || id === '실외') {
      place = checked ? id : '';
    }
  });
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

// API 요청 보내는 함수
const apiPost = async () => {
  const content = `나는 ${age} ${gender}이야. ${place}에서 운동을 하고 싶고, ${user_content}`;

  const dataToSend = data.map((item) => ({
    role: item.role,
    content: item.role === "user" ? content : item.content,
  }));

  console.log("전송할 데이터:", dataToSend); // 데이터 전송 전에 데이터 확인

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(dataToSend),
      redirect: "follow",
    });

    if (!response.ok) {
      throw new Error("에러가 발생하였습니다.");
    }

    const result = await response.json();
    console.log("응답 받은 데이터:", result); // 응답 받은 후에 데이터 확인
    printAnswer(result.choices[0].message);
  } catch (error) {
    console.log(error);
  }
};

// Submit 이벤트 핸들러
$form.addEventListener("submit", async (e) => {
  e.preventDefault();
  $input.value = null;
  sendQuestion(question);
  await printQuestion();
  await apiPost();
});
