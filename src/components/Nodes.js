import Component from "../core/Component.js";

import { directoryClient } from "../client/DirectoryClient.js";

const directoryCache = {};

export default class Nodes extends Component {
  setup() {
    this.state = {
      directoryData: [],
      isRoot: true,
    };
    this.currentId = null;
  }

  template() {
    const { directoryData, isRoot } = this.state;
    
    return `
    ${
      !isRoot
        ? `
    <div class="Node">
      <img src="./assets/prev.png">
    </div>
    `
        : ""
    }
    
    ${directoryData.map((node) => this.getNodeElement(node)).join("")}
    
    
    `;
  }

  setEvents() {
    const { goToPreviousDirectory, goToNextDirectory, showImageView } = this.props;
    this.addEventListener("click", ".Node", ({ target }) => {
      target = target.closest(".Node");
      if (!target) return;

      const { directoryData } = this.state;
      const { id } = target.dataset;
      if (!id) {
        goToPreviousDirectory();
        return;
      }

      const targetNode = directoryData.find((node) => node.id === id);
      switch (targetNode.type) {
        case "DIRECTORY":
          goToNextDirectory(targetNode);
          break;
        case "FILE":
          showImageView(targetNode);
          break;
      }
    });
  }

  afterMount() {
    this.getDirectoryData();
  }

  afterUpdate() {
    const { id } = this.props;
    if (id !== this.currentId) this.getDirectoryData();
  }

  async getDirectoryData() {
    const { id } = this.props;
    this.currentId = id;
    // 캐시된 데이터가 있으면 이용
    
    if (directoryCache[id]) {
      this.setState({
        directoryData: directoryCache[id],
        isRoot: !directoryCache[id][0].parent,
      });

      return;
    }

    const { showLoadingUI, removeLoadingUI, showErrorModal } = this.props;
    showLoadingUI();

    try {
      const directoryData = await (id === null ? directoryClient.getRootDirectory() : directoryClient.getDirectoryById(id));

      // 얻은 데이터 캐싱
      directoryCache[id] = directoryData;
      this.setState({
        directoryData,
        isRoot: !directoryData[0].parent,
      });
      removeLoadingUI();
    } catch {
      removeLoadingUI();
      showErrorModal();
    }
  }

  getNodeElement({ id, type, name }) {
    type = type.toLowerCase();

    return `
    <div class="Node" data-id=${id}>
      <img src="./assets/${type}.png">
      <div>${name}</div>
    </div>
    `;
  }
}
