import { Component } from './base/Component';
import { ensureElement, handleTotal } from '../utils/utils';
import { CDN_URL } from '../utils/constants';
import { ProductCategory, IProductItem } from '../types';

interface IProductActions {
	onClick: (event: MouseEvent) => void;
}

type CategoryType = {
	[Key in ProductCategory]: string;
};

const categoryList: CategoryType = {
	другое: 'card__category_other',
	'софт-скил': 'card__category_soft',
	дополнительное: 'card__category_additional',
	кнопка: 'card__category_button',
	'хард-скил': 'card__category_hard',
};

// Класс, отвечающий за отображение карточки товара
export class ProductItem extends Component<IProductItem> {
	protected _title: HTMLElement;
	protected _image: HTMLImageElement;
	protected _price: HTMLElement;
	protected _category: HTMLElement;
	protected _button: HTMLButtonElement;

	constructor(
		protected blockName: string,
		container: HTMLElement,
		actions?: IProductActions
	) {
		super(container);

		this._title = ensureElement<HTMLElement>(`.${blockName}__title`, container);
		this._image = ensureElement<HTMLImageElement>(
			`.${blockName}__image`,
			container
		);
		this._price = container.querySelector(`.${blockName}__price`);
		this._category = container.querySelector(`.${blockName}__category`);
		this._button = container.querySelector(`.${blockName}__button`);

		if (actions?.onClick) {
			if (this._button) {
				this._button.addEventListener('click', actions.onClick);
			} else {
				container.addEventListener('click', actions.onClick);
			}
		}
	}

	// Cеттер, устанавливает ID товара
	set id(value: string) {
		this.container.dataset.id = value;
	}

	// Геттер, получает ID товара
	get id(): string {
		return this.container.dataset.id || '';
	}

	// Сеттер, устанавливает название товара
	set title(value: string) {
		this.setText(this._title, value);
	}
	// Геттер, получает название товара
	get title(): string {
		return this._title.textContent || '';
	}

	// Cеттер, устанавливает изображение товара
	set image(value: string) {
		this._image.src = CDN_URL + value;
	}

	// Cеттер, устанавливает цену на товар
	set price(value: number | null) {
		this.setText(
			this._price,
			value ? handleTotal(value) + ' синапсов' : 'Бесценно'
		);

		if (this._button && !value) {
			this.setDisabled(this._button, true);
		}
	}

	// Cеттер, устанавливает категорию товара
	set category(value: ProductCategory) {
		this.setText(this._category, value);
		this.toggleClass(this._category, categoryList[value], true);
	}

	// Сеттер для определения товаров, добавленных в козину
	set selected(value: boolean) {
		if (this._button && !this._button.disabled) {
			this.setDisabled(this._button, value);
		}
	}
}

export class CatalogItem extends ProductItem {
	constructor(container: HTMLElement, actions?: IProductActions) {
		super('card', container, actions);
	}
}

// Класс для отображения просмотра карточки товара (добавляется описание)
export class ProductItemPreview extends ProductItem {
	protected _description: HTMLElement;

	constructor(container: HTMLElement, actions?: IProductActions) {
		super('card', container, actions);

		this._description = container.querySelector(`.${this.blockName}__text`);
	}

	// Cеттер, устанавливает описание товара  при просмотре карточки товара
	set description(value: string) {
		this.setText(this._description, value);
	}
}
