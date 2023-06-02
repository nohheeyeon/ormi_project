  // 페이지 로드 시 회전 및 전환 기능 호출
  window.addEventListener("load", rotateAndRedirect);

  // 이미지 회전 후 페이지 전환
  function rotateAndRedirect() {
      const img = document.querySelector("img");

      // 이미지 회전 애니메이션 추가
      img.classList.add("rotate");

      // 2초 후 페이지 전환
      setTimeout(() => {
          // 페이지 전환 코드
          window.location.href = "main.html";
      }, 2000); // 2초 (2000밀리초) 후에 페이지 전환 실행
  }