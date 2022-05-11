import Component from "../core/Component.js";

import { directoryClient } from "../client/DirectoryClient.js";

const directoryCache = {};

export default class Nodes extends Component {
  setup() {
    this.state = {
      currentId: null,
      directoryData: [],
      isLoading: false,
    };
    this.getDirectoryData();
  }

  template() {
    const { directoryData, isLoading } = this.state;
    const isRoot = directoryData[0] && directoryData[0].parent === null;

    return `
    ${
      !isLoading
        ? `
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
    `
        : "loading..."
    }
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

  afterUpdate() {
    const { id } = this.props;
    const { currentId } = this.state;
    if (id !== currentId) this.getDirectoryData();
  }

  async getDirectoryData() {
    // 로딩중 상호작용 방지
    const { isLoading } = this.state;
    if (isLoading) return;

    // 캐시된 데이터가 있으면 이용
    const { id } = this.props;
    if (directoryCache[id]) {
      this.setState({
        currentId: id,
        directoryData: directoryCache[id],
      });

      return;
    }

    this.setState({ isLoading: true });

    const directoryData = await (id === null ? directoryClient.getRootDirectory() : directoryClient.getDirectoryById(id));

    // 얻은 데이터 캐싱
    directoryCache[id] = directoryData;

    this.setState({
      currentId: id,
      directoryData,
      isLoading: false,
    });
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

{
  /* <div class="Node">
      <img src="./assets/prev.png">
    </div>
    <div class="Node">
      <img src="./assets/directory.png">
      <div>2021/04</div>
    </div>
    <div class="Node">
      <img src="./assets/file.png">
      <div>하품하는 사진</div>
    </div> */
}
