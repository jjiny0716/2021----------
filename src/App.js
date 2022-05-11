import Component from "./core/Component.js";

import Loading from "./components/Loading.js";
import ErrorModal from './components/ErrorModal.js';
import Breadcrumb from "./components/Breadcrumb.js";
import Nodes from "./components/Nodes.js";
import ImageView from "./components/ImageView.js";

export default class App extends Component {
  setup() {
    this.state = {
      path: [
        {
          name: "root",
          id: null,
        },
      ],
			isErrorModalOpen: false,
      isImageViewOpen: false,
      filePath: null,
      isLoading: false,
    };
  }

  template() {
    const { isErrorModalOpen, isImageViewOpen, isLoading } = this.state;

    return `
    <nav class="Breadcrumb" data-component="Breadcrumb"></nav>
		<div class="Nodes" data-component="Nodes"></div>
		${isLoading ? `<div class="Modal Loading" data-component="Loading"></div>` : ""}
		${isErrorModalOpen ? `<div class="ErrorModal Modal" data-component="ErrorModal"></div>` : ""}
    ${isImageViewOpen ? `<div class="ImageViewer Modal" data-component="ImageView"></div>` : ""}
    `;
  }

  generateChildComponent(target, name) {
    switch (name) {
      case "Loading":
        return new Loading(target);
			case "ErrorModal":
				return new ErrorModal(target, () => {
					const { closeErrorModal } = this;
					return {
						closeErrorModal: closeErrorModal.bind(this),
					}
				});
      case "Breadcrumb":
        return new Breadcrumb(target, () => {
          const { goToPreviousDirectoryById } = this;
          const { path } = this.state;
          return {
            goToPreviousDirectoryById: goToPreviousDirectoryById.bind(this),
            path,
          };
        });
      case "Nodes":
        return new Nodes(target, () => {
          const { goToPreviousDirectory, goToNextDirectory, showImageView, showLoadingUI, removeLoadingUI, showErrorModal } = this;
          const { path } = this.state;
          const { id } = path[path.length - 1];
          return {
            id,
            goToPreviousDirectory: goToPreviousDirectory.bind(this),
            goToNextDirectory: goToNextDirectory.bind(this),
            showImageView: showImageView.bind(this),
						showLoadingUI: showLoadingUI.bind(this),
						removeLoadingUI: removeLoadingUI.bind(this),
						showErrorModal: showErrorModal.bind(this),
          };
        });
      case "ImageView":
        return new ImageView(target, () => {
          const { closeImageView } = this;
          const { filePath } = this.state;
          return {
            filePath,
            closeImageView: closeImageView.bind(this),
          };
        });
    }
  }

  showLoadingUI() {
    this.setState({ isLoading: true });
  }

  removeLoadingUI() {
    this.setState({ isLoading: false });
  }

	showErrorModal() {
		this.goToPreviousDirectory();
    this.setState({ isErrorModalOpen: true });
  }

  closeErrorModal() {
    this.setState({ isErrorModalOpen: false });
  }

  goToPreviousDirectory() {
    const { path } = this.state;
    const newPath = [...path];
    newPath.pop();

    this.setState({ path: newPath });
  }

  goToNextDirectory({ name, id }) {
    const { path } = this.state;
    const newPath = [...path];
    newPath.push({
      name,
      id: JSON.parse(id),
    });

    this.setState({ path: newPath });
  }

  goToPreviousDirectoryById(id) {
    const { path } = this.state;
    const newPath = [...path];

    while (newPath[newPath.length - 1].id !== id) {
      newPath.pop();
    }

    this.setState({ path: newPath });
  }

  showImageView({ filePath }) {
    this.setState({
      filePath,
      isImageViewOpen: true,
    });
  }

  closeImageView() {
    this.setState({
      filePath: null,
      isImageViewOpen: false,
    });
  }
}
