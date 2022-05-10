import Component from '../core/Component.js';

import { directoryClient } from '../client/DirectoryClient.js';

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
    ${!isLoading ? `
    ${!isRoot ? `
    <div class="Node">
      <img src="./assets/prev.png">
    </div>
    ` : ''}
    
    ${directoryData.map(node => this.getNodeElement(node)).join('')}
    ` : 'loading...'}
    `;
	}

	setEvents() {
		const { goToPreviousDirectory, goToNextDirectory, showImageView } = this.props;
		this.addEventListener('click', '.Node', ({ target }) => {
			target = target.closest('.Node');
			if (!target) return;

			const { directoryData } = this.state;
			const { id } = target.dataset;
			if (!id) {
				goToPreviousDirectory();
				this.getDirectoryData();
				return;
			}

			const targetNode = directoryData.find(node => node.id === id);
			switch (targetNode.type) {
				case 'DIRECTORY':
					goToNextDirectory(targetNode);
					this.getDirectoryData();
					break;
				case 'FILE':
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
		const { isLoading } = this.state;
		if (isLoading) return;

		this.setState({ isLoading: true });

		const { id } = this.props;
		const directoryData = await (id === null
			? directoryClient.getRootDirectory()
			: directoryClient.getDirectoryById(id));

		this.setState({ currentId: id, directoryData, isLoading: false });
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