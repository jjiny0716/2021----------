import Component from '../core/Component.js';

export default class ErrorModal extends Component {
  template() {
    return `
    <div class="window">
      <h3>오류!</h3>
      <p>오류가 발생했습니다. 다시 시도해 주세요.</p>
    </div>
    `;
  }

  setEvents() {
    const { closeErrorModal } = this.props;
    // 모달 바깥쪽 클릭
    this.addEventListener("click", ".ErrorModal", (e) => {
      if (e.target.classList.contains("Modal")) closeErrorModal();
    })

    // ESC
    this.onESC = (e) => {
      if (e.key !== "Escape") return;
      closeErrorModal();
    }
    addEventListener("keydown", this.onESC);
  }

  beforeUnmount() {
    removeEventListener("keydown", this.onESC);
  }
}