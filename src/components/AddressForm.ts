import { IEvents } from './base/events';
import { IAddressForm } from '../types/index';
import { Form } from './common/Form';

// Класс, отвечающий за работу формы заказа, в которой пользователь выбирает способ оплаты и указывает адрес
export class AddressForm extends Form<IAddressForm> {
	protected _online: HTMLButtonElement;
	protected _whenReceived: HTMLButtonElement;
	protected _addressInput: HTMLInputElement;
	protected _orderButton: HTMLButtonElement;

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
		this._addressInput = container.elements.namedItem(
			'address'
		) as HTMLInputElement;
		this._orderButton = container.elements.namedItem(
			'order_button'
		) as HTMLButtonElement;

		this.initEventListeners();
		this.addEventListeners();
		this.checkButtonState(); // Проверить состояние кнопки при инициализации
	}

	private initEventListeners() {
		this._online?.addEventListener('click', () =>
			this.handlePaymentMethodChange('card')
		);
		this._whenReceived?.addEventListener('click', () =>
			this.handlePaymentMethodChange('cash')
		);
	}

	private handlePaymentMethodChange(method: 'cash' | 'card') {
		this.toggleClass(
			this._whenReceived,
			'button_alt-active',
			method === 'cash'
		);
		this.toggleClass(this._online, 'button_alt-active', method === 'card');
		this.onInputChange('payment', method);
		this.checkButtonState();
	}

	// Cеттер, устанавливает адрес
	set address(value: string) {
		if (this._addressInput) {
			this._addressInput.value = value;
			this.checkButtonState();
		}
	}
	// Добавляем обработчик события изменения для инпута
	private addEventListeners() {
		this._addressInput?.addEventListener('input', () =>
			this.checkButtonState()
		);
	}

	private checkButtonState() {
		if (this._orderButton && this._addressInput) {
			const paymentMethodSelected =
				this._online?.classList.contains('button_alt-active') ||
				this._whenReceived?.classList.contains('button_alt-active');
			const addressFilled = this._addressInput.value.trim().length > 0;
			this._orderButton.disabled = !(paymentMethodSelected && addressFilled);
		}
	}

	disableButtons() {
		this.toggleClass(this._online, 'button_alt-active', false);
		this.toggleClass(this._whenReceived, 'button_alt-active', false);
	}
}
