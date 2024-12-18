import { Component } from './base/Component';
import { IEvents } from './base/events';
import { ensureElement } from '../utils/utils';
import { IMainPage } from '../types/index';

export class MainPage extends Component<IMainPage> {
	protected _counter: HTMLElement;
	protected _catalog: HTMLElement;
	protected _wrapper: HTMLElement;
	protected _basket: HTMLElement;

	constructor(container: HTMLElement, protected events: IEvents) {
		super(container);

		this._counter = ensureElement<HTMLElement>('.header__basket-counter');
		this._catalog = ensureElement<HTMLElement>('.gallery');
		this._wrapper = ensureElement<HTMLElement>('.page__wrapper');
		this._basket = ensureElement<HTMLElement>('.header__basket');

		this._basket.addEventListener('click', () => {
			this.events.emit('basket:open');
		});
	}

	// Cеттер для счетчика товаров в корзине, отображает кол-во товаров
	set counter(value: number) {
		this.setText(this._counter, String(value));
	}

	// Cеттер для отображения карточек товара на главной странице магазина
	set catalog(items: HTMLElement[]) {
		this._catalog.replaceChildren(...items);
	}

	// Cеттер для блокировки прокрутки страницы
	set locked(value: boolean) {
		if (value) {
			this._wrapper.classList.add('page__wrapper_locked');
		} else {
			this._wrapper.classList.remove('page__wrapper_locked');
		}
	}
}
