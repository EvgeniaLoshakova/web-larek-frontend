import { Model } from './base/Model';
import {
	IAppState,
	FormErrors,
	IProductItem,
	IOrderData,
	IOrderForm,
} from '../types';

// Главная модель данных, обеспечивает работу всего приложения и связь всех компонтентов, управляет корзиной, сбором и проверкой данных для оформления заказа
export class AppState extends Model<IAppState> {
	formErrors: FormErrors = {};

	// массив карточек товара на главной странице магазине
	catalog: IProductItem[];

	// массив товаров в корзине
	basket: IProductItem[] = [];

	// заказанный товар
	orderData: IOrderData = {
		payment: '',
		address: '',
		email: '',
		phone: '',
		total: null,
		items: [],
	};

	// Метод добавления товара в корзину
	addToBasket(value: IProductItem) {
		this.basket.push(value);
	}

	// Метод удаления товара из корзины
	deleteFromBasket(id: string) {
		this.basket = this.basket.filter((item) => item.id !== id);
	}

	// Метод полной очистки корзины
	cleanBasket() {
		this.basket.length = 0;
	}

	// Калькулятор количества товаров в корзине
	getBasketCounter() {
		return this.basket.length;
	}

	// Калькулятор общей стоимости товаров в корзине
	getBasketTotal() {
		return this.basket.reduce((sum, next) => sum + next.price, 0);
	}

	// метод для заполнения полей Форм с адресом и контактами
	setOrderField(field: keyof IOrderForm, value: string) {
		this.orderData[field] = value;

		if (this.validateContactsForm()) {
			this.events.emit('contacts:ready', this.orderData);
		}
		if (this.validateAddressForm()) {
			this.events.emit('order:ready', this.orderData);
		}
	}

	// валидация Формы с адресом покупателя и методом оплаты
	validateAddressForm() {
		const errors: typeof this.formErrors = {};
		if (!this.orderData.address) {
			errors.address = 'Необходимо заполнить адрес';
		}
		if (!this.orderData.payment) {
			errors.payment = 'Необходимо выбрать способ оплаты';
		}
		this.formErrors = errors;
		this.events.emit('addressformErrors:change', this.formErrors);
		return Object.keys(errors).length === 0;
	}

	// валидация Формы с контактами покупателя
	validateContactsForm() {
		const errors: typeof this.formErrors = {};
		if (!this.orderData.email) {
			errors.email = 'Необходимо заполнить email';
		}
		if (!this.orderData.phone) {
			errors.phone = 'Необходимо заполнить телефон';
		}
		this.formErrors = errors;
		this.events.emit('contactsformErrors:change', this.formErrors);
		return Object.keys(errors).length === 0;
	}

	setCatalog(items: IProductItem[]) {
		this.catalog = items;
		this.emitChanges('items:show', { catalog: this.catalog });
		items.forEach((item) => this.events.emit('itemAdded', item));
	}

	// Добавление ID товаров в поле items
	setItemsID() {
		this.orderData.items = this.basket.map((item) => item.id);
	}

	// Очистка данных после оформления заказа
	refreshOrderData() {
		this.orderData = {
			address: '',
			email: '',
			phone: '',
			payment: '',
			items: [],
			total: null,
		};
	}

	// Очистка данных о выбранных товарах
	refreshSelected() {
		this.catalog.forEach((item) => (item.selected = false));
	}
}
