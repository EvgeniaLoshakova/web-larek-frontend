import { IEvents } from './base/events';
import { IContactsForm } from '../types';
import { Form } from './common/Form';

// Класс, отвечающий за работу формы заказа, в которой пользователь указывает конткактные данные (email и телефон).
export class ContactsForm extends Form<IContactsForm> {
	private _phoneInput: HTMLInputElement | null = null;
	private _emailInput: HTMLInputElement | null = null;
	private _submitbutton: HTMLButtonElement | null = null;

	constructor(container: HTMLFormElement, events: IEvents) {
		super(container, events);

		this._phoneInput = container.elements.namedItem(
			'phone'
		) as HTMLInputElement;
		this._emailInput = container.elements.namedItem(
			'email'
		) as HTMLInputElement;
		this._submitbutton = container.elements.namedItem(
			'submit_button'
		) as HTMLButtonElement;

		this.addEventListeners();
		this.checkButtonState(); // Проверка состояния кнопки при инициализации
	}

	// Добавляем обработчик события изменения для обоих инпутов
	private addEventListeners() {
		this._phoneInput?.addEventListener('input', () => this.checkButtonState());
		this._emailInput?.addEventListener('input', () => this.checkButtonState());
	}

	// Сеттер для телефона
	set phone(value: string) {
		if (this._phoneInput) {
			this._phoneInput.value = value;
			this.onInputChange('phone', value);
		}
	}

	// Сеттер для электронной почты
	set email(value: string) {
		if (this._emailInput) {
			this._emailInput.value = value;
			this.onInputChange('email', value);
		}
	}

	// Метод для проверки состояния кнопки
	private checkButtonState() {
		const isPhoneValid = this._phoneInput?.value.trim() !== '' || false; //Обработка null
		const isEmailValid = this._emailInput?.value.trim() !== '' || false; //Обработка null
		this._submitbutton.disabled = !(isPhoneValid && isEmailValid); //Обработка null
	}
}
