import Component from '../core/Component.js';

const API_ENDPOINT = "https://fe-dev-matching-2021-03-serverlessdeploymentbuck-t3kpj3way537.s3.ap-northeast-2.amazonaws.com/public";

export default class ImageView extends Component {
	template() {
		const { filePath } = this.props;

		return `
    <div class="content">
      <img src="${API_ENDPOINT}${filePath}">
    </div>
    `;
	}

  setEvents() {
    const { closeImageView } = this.props;
    // 모달 바깥쪽 클릭
    this.addEventListener("click", ".ImageViewer", (e) => {
      if (e.target.classList.contains("Modal")) closeImageView();
    })

    // ESC
    this.onESC = (e) => {
      if (e.key !== "Escape") return;
      closeImageView();
    }
    addEventListener("keydown", this.onESC);
  }

  beforeUnmount() {
    removeEventListener("keydown", this.onESC);
  }
}
