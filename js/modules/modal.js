import createElement from '../../assets/lib/create-element.js';

export default class Modal {
    constructor() {
        this.render();
        this.modalWindow.addEventListener('click', (e) => this.modalClick(e));
    }

    render() {
        this.modalWindow = createElement(`
      <div class="modal">
        <div class="modal__overlay"></div>
        <div class="modal__inner">
          <div class="modal__header">
            <button type="button" class="modal__close">
              <img src="../../assets/images/icons/cross-icon.svg" alt="close-icon" />
            </button>
            <h3 class="modal__title"></h3>
          </div>
          <div class="modal__body"></div>
          </div>
      </div>
    `);
    }

    setTitle(title) {
        this.modalWindow.querySelector('.modal__title').innerHTML = title;
    }

    setBody(body) {
        this.modalWindow.querySelector('.modal__body').append(body);
    }

    kbdEvent(e) {
        if (e.code === 'Escape') {
            e.preventDefault();
            this.close();
        }
    }

    modalClick(e) {
        if (e.target.closest('.modal__close')) {
            e.preventDefault();
            this.close();
        }
    }

    open() {
        document.body.classList.add('is-modal-open');
        document.body.appendChild(this.modalWindow);

        this._kbdEventListener = (e) => this.kbdEvent(e);
        document.addEventListener('keydown', this._kbdEventListener);
    }

    close() {
        this.modalWindow.remove();
        document.removeEventListener('keydown', this.kbdEvent);
        document.body.classList.remove('is-modal-open');
    }
}
