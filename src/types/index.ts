export type ProductCategory =
	| 'другое'
	| 'софт-скил'
	| 'дополнительное'
	| 'кнопка'
	| 'хард-скил';

export type FormErrors = Partial<Record<keyof IOrderData, string>>;

// Интерфейс главной страницы магазина
export interface IMainPage {
	сounter: number;
	catalog: HTMLElement[];
	locked: boolean;
}

// Интерфейс карточки товара
export interface IProductItem {
	id: string;
	description?: string;
	image: string;
	title: string;
	category: string;
	price: number | null;
	selected: boolean;
}

// Интерфейс, описывающий корзину
export interface IBasketModel {
	selectedList: HTMLElement[];
	total: number;
}

// Интерфейс, описывающий полные данные заказа и покупателя
export interface IOrderData {
	payment: string;
	address: string;
	email: string;
	phone: string;
	total: number;
	items: string[];
}

// Интерфейс, описывающий только данные для заполнения при оформлении заказа
export interface IOrderForm {
	payment: string;
	address: string;
	email: string;
	phone: string;
}

// Интерфейс, описывающий Форму (модальное окно) с адресом покупателя и методом оплаты
export interface IAddressForm {
	payment: string;
	address: string;
}

// Интерфейс, описывающий Форму (модальное окно) с контактами покупателя
export interface IContactsForm {
	phone: string;
	email: string;
}

// Интерфейс, описывающий Форму (модальное окно) успешного оформления заказа
export interface IOrderSuccess {
	paymentConfirmation: number;
}

// Интерфейс, описывающий текущее состояние приложения
export interface IAppState {
	catalog: IProductItem[];
	basket: IProductItem[];
	orderData: IOrderData;
	formErrors: FormErrors;
	addToBasket(item: HTMLElement): void; // добавить в корзину товар
	deleteFromBasket(id: string): void; // удалить из корзины товар
	cleanBasket(): void; // полностью очистить корзину
	getBasketCounter(): number; // калькулятор количества товаров в корзине
	getBasketTotal(): number; // калькулятор общей стоимости товаров в корзине
	setOrderField(field: keyof IOrderForm, value: string): void; // метод для заполнения полей Форм с адресом и контактами
	validateAddressForm(): boolean; // валидация Формы с адресом покупателя и методом оплаты
	validateContactsForm(): boolean; // валидация Формы с контактами покупателя
	setItemsID(): void; // добавить ID товаров в поле items
}

export interface ApiResponse {
	items: IProductItem[];
}
