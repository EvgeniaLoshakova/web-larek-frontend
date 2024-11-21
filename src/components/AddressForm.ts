import { IEvents } from './base/events';
import { IAddressForm } from '../types/index';
import { Form } from './common/Form';

// Класс, отвечающий за работу формы заказа, в которой пользователь выбирает способ оплаты и указывает адрес
export class AddressForm extends Form<IAddressForm> {
	protected _online: HTMLButtonElement;
	protected _whenReceived: HTMLButtonElement;

	constructor(
		protected blockName: string,
		container: HTMLFormElement,
		events: IEvents
	) {
		super(container, events);

		this._online = container.elements.namedItem('card') as HTMLButtonElement;
		this._whenReceived = container.elements.namedItem(
			'cash'
		) as HTMLButtonElement;

		if (this._whenReceived) {
			this._whenReceived.addEventListener('click', () => {
				this.toggleClass(this._whenReceived, 'button_alt-active', true);
				this.toggleClass(this._online, 'button_alt-active', false);
				this.onInputChange('paymentMethod', 'cash');
			});
		}
		if (this._online) {
			this._online.addEventListener('click', () => {
				this.toggleClass(this._online, 'button_alt-active', true);
				this.toggleClass(this._whenReceived, 'button_alt-active', false);
				this.onInputChange('paymentMethod', 'card');
			});
		}
	}

	disableButtons() {
		this.toggleClass(this._online, 'button_alt-active', false);
		this.toggleClass(this._whenReceived, 'button_alt-active', false);
	}

	// Cеттер, устанавливает адрес
	set address(value: string) {
		(this.container.elements.namedItem('address') as HTMLInputElement).value =
			value;
	}
}
