import { IEvents } from './base/events';
import { IContactsForm } from '../types';
import { Form } from './common/Form';

// Класс, отвечающий за работу формы заказа, в которой пользователь указывает конткактные данные (email и телефон).
export class ContactsForm extends Form<IContactsForm> {
	constructor(container: HTMLFormElement, events: IEvents) {
		super(container, events);
	}

	set phone(value: string) {
		(this.container.elements.namedItem('phone') as HTMLInputElement).value =
			value;
	}

	set email(value: string) {
		(this.container.elements.namedItem('email') as HTMLInputElement).value =
			value;
	}
}
