import { Component } from './base/Component';
import { handleTotal } from './Basket';
import { IOrderSuccess } from '../types/index';

interface IOrderSuccessActions {
	onClick: (event: MouseEvent) => void;
}

// Класс, отвечающий за отображение экрана успеха, отображает общую стоимость купленных товаров (total)
export class OrderSuccess extends Component<IOrderSuccess> {
	protected _paymentConfirmation: HTMLElement;
	protected _button: HTMLButtonElement;

	constructor(
		protected blockName: string,
		container: HTMLElement,
		actions?: IOrderSuccessActions
	) {
		super(container);

		this._button = container.querySelector(`.${blockName}__close`);
		this._paymentConfirmation = container.querySelector(
			`.${blockName}__description`
		);

		if (actions?.onClick) {
			if (this._button) {
				this._button.addEventListener('click', actions.onClick);
			}
		}
	}

	set paymentConfirmation(value: number) {
		this.setText(
			this._paymentConfirmation,
			'Списано ' + handleTotal(value) + ' синапсов'
		);
	}
}
