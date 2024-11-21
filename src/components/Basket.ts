import { Component } from './base/Component';
import { IEvents } from './base/events';
import { IProductItem, IBasketModel } from '../types/index';
import { ensureAllElements} from '../utils/utils';

// Функция, вычисляющая общую стоимость тоаров в корзине
export function handleTotal(total: number): string {
	const totalStr = total.toString();
	return totalStr.length < 5
		? totalStr
		: totalStr
				.split('')
				.reverse()
				.map((s, i) => ((i + 1) % 3 === 0 ? ' ' + s : s))
				.reverse()
				.join('');
}

// Класс, отвечающий за работу корзины, обеспечивает отображение выбранных товаров в заказе и их общей стоимостю
export class Basket extends Component<IBasketModel> {
	protected _selectedList: HTMLElement;
	protected _total: HTMLElement;
	protected _button: HTMLButtonElement;
	protected _index: HTMLSpanElement[];

	constructor(
		protected blockName: string,
		container: HTMLElement,
		protected events: IEvents
	) {
		super(container);

		this._button = container.querySelector(
			`.${blockName}__button`
		) as HTMLButtonElement;
		this._selectedList = container.querySelector(
			`.${blockName}__list`
		) as HTMLElement;
		this._total = container.querySelector(
			`.${blockName}__price`
		) as HTMLElement;

		if (this._button) {
			this._button.addEventListener('click', () =>
				this.events.emit('basket:order')
			);
		}
	}

	// Cеттер для списка выбранных товаров в корзине
	set selectedList(items: HTMLElement[]) {
		this._selectedList.replaceChildren(...items);
		this.setDisabled(this._button, items.length === 0);
	}

	// Cеттер для счетчика общей стоимости товаров
	set total(value: number) {
		this.setText(this._total, handleTotal(value) + ' синапсов');
	}

	// Метод, делающий кнопку "Оформить" неактивной
	disableButton() {
		this.setDisabled(this._button, true);

// // Метод для обновления индексов таблички при удалении товара из корзины
// refreshIndex(data?: Partial<IBasketModel>): HTMLElement {
//     this._index = ensureAllElements<HTMLSpanElement>('.basket__item-index', this.container);

//     this._index.forEach( (item, index) => {
//       this.setText(item, String(index+1))
//     })

//     return super.render(data);



	}
}

export interface ISelectedProductItem extends IProductItem {
	id: string;
	index: number;
	setIndex: (number: number) => void;
}

interface ISelectedProductItemActions {
	onClick: (event: MouseEvent) => void;
}

// Класс, показывающий элементы выбранных товаров в корзине
export class SelectedProductItem extends Component<ISelectedProductItem> {
	protected _index: HTMLElement;
	protected _title: HTMLElement;
	protected _price: HTMLElement;
	protected _button: HTMLButtonElement;

	constructor(
		protected blockName: string,
		container: HTMLElement,
		actions?: ISelectedProductItemActions
	) {
		super(container);

		this._index = container.querySelector(`.basket__item-index`) as HTMLElement;
		this._title = container.querySelector(
			`.${blockName}__title`
		) as HTMLElement;
		this._price = container.querySelector(
			`.${blockName}__price`
		) as HTMLElement;
		this._button = container.querySelector(
			`.${blockName}__button`
		) as HTMLButtonElement;

		if (this._button) {
			this._button.addEventListener('click', (e) => {
				this.container.remove();
				actions?.onClick(e);
			});
		}
	}

	// Сеттер, устанавливает название товара
	set title(value: string) {
		this.setText(this._title, value);
	}

	// Сеттер, устанавливает индекс товара
	set index(value: number) {
		this.setText(this._index, value.toString());
	}

	// Cеттер, устанавливает цену на товар
	set price(value: number) {
		this.setText(this._price, handleTotal(value) + ' синапсов');
	}
}
