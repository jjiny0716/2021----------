import Component from "../core/Component.js";

export default class Breadcrumb extends Component {
  template() {
    const { path } = this.props;

    return `
    ${path.map(({ name, id }) => `<div class="path" data-id=${id}>${name}</div>`).join('')}
    `;
  }

  setEvents() {
    const { goToPreviousDirectoryById } = this.props;

    this.addEventListener("click", ".path", (e) => {
      const { id } = e.target.dataset;
      if (!id) return;

      goToPreviousDirectoryById(JSON.parse(id));
    })
  }
}

