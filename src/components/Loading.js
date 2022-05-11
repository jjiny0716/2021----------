import Component from '../core/Component.js';

export default class  Loading extends Component {
  template() {
    return `
    <div class="content">
      <img src="./assets/nyan-cat.gif">
    </div>
    `;
  }
}