export default class StepSlider {
    constructor({ steps, value = 0 }) {
        this.steps = steps;
        this.value = value;
        this.render();
        this.slider.addEventListener('click', e => this.sliderClick(e));
        this.slider.querySelector('.slider__thumb').addEventListener('pointerdown', e => this.pointerEvent(e));
        this.toTargetStep(value);
    }

    render() {
        this.slider = document.createElement('DIV');
        this.slider.classList.add('slider');
        this.slider.innerHTML = `
        <div class="slider__thumb"><span class="slider__value">${this.value}</span></div>
        <div class="slider__progress"></div>
        <div class="slider__steps"></div>
        `;

        const stepsHolder = this.slider.querySelector('.slider__steps');

        for (let i = 0; i < this.steps; i++) {
            const elem = document.createElement('SPAN');
            stepsHolder.appendChild(elem);
        }
    }


    toTargetStep(targetPoint) {
        this.value = targetPoint;

        let sliderValue = this.slider.querySelector('.slider__value');
        let elems = this.slider.querySelectorAll('.slider__steps span');

        elems.forEach(el => el.classList.remove('slider__step-active'));
        elems[targetPoint].classList.add('slider__step-active');

        sliderValue.innerHTML = targetPoint.toString();
        this.slider.querySelector('.slider__thumb').style.left = `${targetPoint / (this.steps - 1) * 100}%`;
        this.slider.querySelector('.slider__progress').style.width = `${targetPoint / (this.steps - 1) * 100}%`;
    }

    sliderClick = e => {
        let clickPos = (e.clientX - this.slider.getBoundingClientRect().left) / this.slider.offsetWidth;
        this.toTargetStep(Math.round(clickPos * (this.steps - 1)));

        this.slider.dispatchEvent(new CustomEvent("slider-change", {
            detail: this.value,
            bubbles: true
        }));
    }

    pointerEvent = e => {
        e.preventDefault();
        let thumb = this.slider.querySelector('.slider__thumb');
        thumb.ondragstart = () => false;

        this.slider.classList.add('slider_dragging');

        document.addEventListener('pointermove', this.pointerMove);
        document.addEventListener('pointerup', this.pointerUp);


    }

    pointerMove = e => {
        e.preventDefault();

        let clickPos = (e.clientX - this.slider.getBoundingClientRect().left) / this.slider.offsetWidth;
        if (clickPos < 0) { clickPos = 0; }
        else if (clickPos > 1) { clickPos = 1; }

        this.slider.querySelector('.slider__thumb').style.left = `${clickPos * 100}%`;
        this.slider.querySelector('.slider__progress').style.width = `${clickPos * 100}%`;

        this.value = Math.round(clickPos * (this.steps - 1));

        let sliderValue = this.slider.querySelector('.slider__value');
        let elems = this.slider.querySelectorAll('.slider__steps span');

        elems.forEach(el => el.classList.remove('slider__step-active'));
        elems[this.value].classList.add('slider__step-active');

        sliderValue.innerHTML = this.value.toString();
    }

    pointerUp = () => {
        document.removeEventListener('pointermove', this.pointerMove);
        document.removeEventListener('pointerup', this.pointerUp);

        this.slider.classList.remove('slider_dragging');

        this.toTargetStep(this.value);

        this.slider.dispatchEvent(new CustomEvent("slider-change", {
            detail: this.value,
            bubbles: true
        }));
    }


    get elem() {
        return this.slider;
    }
}
