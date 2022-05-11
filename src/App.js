import Component from './core/Component.js';

import Breadcrumb from './components/Breadcrumb.js';
import Nodes from './components/Nodes.js';
import ImageView from './components/ImageView.js';

export default class App extends Component {
	setup() {
		this.state = {
			path: [
				{
					name: 'root',
					id: null,
				},
			],
      isImageViewOpen: false,
      filePath: null,
		};
	}

	template() {
    const { isImageViewOpen } = this.state;

		return `
    <nav class="Breadcrumb" data-component="Breadcrumb"></nav>
    <div class="Nodes" data-component="Nodes"></div>
    ${isImageViewOpen ? `<div class="ImageViewer Modal" data-component="ImageView"></div>` : ""}
    `;
	}

	generateChildComponent(target, name) {
		switch (name) {
			case 'Breadcrumb':
				return new Breadcrumb(target, () => {
          const { goToPreviousDirectoryById } = this;
					const { path } = this.state;
					return {
            goToPreviousDirectoryById: goToPreviousDirectoryById.bind(this),
						path,
					};
				});
			case 'Nodes':
				return new Nodes(target, () => {
					const { goToPreviousDirectory, goToNextDirectory, showImageView } = this;
					const { path } = this.state;
					const { id } = path[path.length - 1];
					return {
						id,
						goToPreviousDirectory: goToPreviousDirectory.bind(this),
						goToNextDirectory: goToNextDirectory.bind(this),
						showImageView: showImageView.bind(this),
					};
				});
      case 'ImageView':
        return new ImageView(target, () => {
          const { closeImageView } = this;
          const { filePath } = this.state;
          return {
            filePath,
            closeImageView: closeImageView.bind(this),
          }
        });
		}
	}

	goToPreviousDirectory() {
		const { path } = this.state;
		const newPath = [ ...path ];
		newPath.pop();

		this.setState({ path: newPath });
	}

	goToNextDirectory({ name, id }) {
		const { path } = this.state;
		const newPath = [ ...path ];
		newPath.push({
			name,
			id: JSON.parse(id),
		});

		this.setState({ path: newPath });
	}

  goToPreviousDirectoryById(id) {
    const { path } = this.state;
		const newPath = [ ...path ];
    
		while (newPath[newPath.length - 1].id !== id) {
      newPath.pop();
    }

		this.setState({ path: newPath });
  }

	showImageView({ filePath }) {
    this.setState({
      filePath,
      isImageViewOpen: true,
    })
  }

  closeImageView() {
    this.setState({
      filePath: null,
      isImageViewOpen: false,
    })
  }
}
