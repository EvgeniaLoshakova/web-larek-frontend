import './scss/styles.scss';

import { Api, ApiListResponse } from './components/base/api';
import { EventEmitter } from './components/base/events';

import { API_URL } from './utils/constants';
import { ensureElement, cloneTemplate } from './utils/utils';
import { ApiResponse, IOrderData, IProductItem, IOrderForm } from './types';
import { Modal } from './components/common/Modal';

import { AddressForm } from './components/AddressForm';
import { AppState } from './components/AppState';
import { Basket, SelectedProductItem } from './components/Basket';
import { ContactsForm } from './components/ContactsForm';
import { MainPage } from './components/MainPage';
import { OrderSuccess } from './components/OrderSuccess';
import { CatalogItem, ProductItemPreview } from './components/ProductItem';

const events = new EventEmitter();

// Все шаблоны
const successTemplate = ensureElement<HTMLTemplateElement>('#success');
const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const cardBasketTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const orderTemplate = ensureElement<HTMLTemplateElement>('#order');
const contactsTemplate = ensureElement<HTMLTemplateElement>('#contacts');

// Глобальные контейнеры
const page = new MainPage(document.body, events);
const modal = new Modal(ensureElement<HTMLElement>('#modal-container'), events);

// Переиспользуемые части интерфейса
const basket = new Basket('basket', cloneTemplate(basketTemplate), events);
const order = new AddressForm('order', cloneTemplate(orderTemplate), events);
const contacts = new ContactsForm(cloneTemplate(contactsTemplate), events);
const ordersuccess = new OrderSuccess(
	'order-success',
	cloneTemplate(successTemplate),
	{
		onClick: () => {
			events.emit('modal:close');
			modal.close();
		},
	}
);

// Модель данных приложения
const appData = new AppState({}, events);

// Получение данных с сервера
const api = new Api(API_URL);
api
	.get('/product')
	.then((res: ApiResponse) => {
		appData.setCatalog(res.items as IProductItem[]);
	})
	.catch((err) => {
		console.log(err);
	});

// Отображение элементов каталога
events.on('items:show', () => {
	page.catalog = appData.catalog.map((item) => {
		const product = new CatalogItem(cloneTemplate(cardCatalogTemplate), {
			onClick: () => events.emit('card:select', item),
		});
		return product.render({
			id: item.id,
			title: item.title,
			image: item.image,
			category: item.category,
			price: item.price,
		});
	});
});

// Открытие карточки товара
events.on('card:select', (item: IProductItem) => {
	const productPreview = new ProductItemPreview(
		cloneTemplate(cardPreviewTemplate),
		{
			onClick: () => {
				events.emit('card:toBasket', item);
			},
		}
	);
	modal.render({
		content: productPreview.render({
			id: item.id,
			title: item.title,
			image: item.image,
			category: item.category,
			description: item.description,
			price: item.price,
			selected: item.selected,
		}),
	});
});

// Выбор и добавление товаров в корзину
events.on('card:toBasket', (item: IProductItem) => {
	item.selected = true;
	appData.addToBasket(item);
	page.counter = appData.getBasketCounter();
	modal.close();
});

// Открываем корзину со списком выбранных товаров
events.on('basket:open', () => {
	const basketList = appData.basket.map((item, index) => {
		const selectedItem = new SelectedProductItem(
			'card',
			cloneTemplate(cardBasketTemplate),
			{
				onClick: () => events.emit('basket:delete', item),
			}
		);
		return selectedItem.render({
			title: item.title,
			price: item.price,
			index: index + 1,
		});
	});
	modal.render({
		content: basket.render({
			selectedList: basketList,
			total: appData.getBasketTotal(),
		}),
	});
});

// Редактирование (удаление) товаров в корзине
events.on('basket:delete', (item: IProductItem) => {
	appData.deleteFromBasket(item.id);
	item.selected = false;
	page.counter = appData.getBasketCounter();
	basket.total = appData.getBasketTotal();
	if (!appData.basket.length) {
		basket.disableButton();
	}
});

//  Форма заполнения адреса
events.on('basket:order', () => {
	modal.render({
		content: order.render({
			address: '',
			valid: false,
			errors: [],
		}),
	});
});

// Изменилось состояние валидации формы с адресом и способом оплаты
events.on('addressFormErrors:change', (errors: Partial<IOrderForm>) => {
	const { payment, address } = errors;
	order.valid = !payment && !address;
	order.errors = Object.values({ payment, address })
		.filter((i) => !!i)
		.join('; ');
});

// Изменилось состояние валидации формы с телефоном и email
events.on('contactsFormErrors:change', (errors: Partial<IOrderForm>) => {
	const { email, phone } = errors;
	contacts.valid = !email && !phone;
	contacts.errors = Object.values({ phone, email })
		.filter((i) => !!i)
		.join('; ');
});

// Изменилось одно из полей
events.on(
	/^(order|contacts)\..*:change/,
	(data: { field: keyof IOrderForm; value: string }) => {
		appData.setOrderField(data.field, data.value);
	}
);

// Форма заказа
events.on('order:submit', () => {
	appData.orderData.total = appData.getBasketTotal();
	appData.setItemsID();
	modal.render({
		content: contacts.render({
			valid: false,
			errors: [],
		}),
	});
});

// Финальное оформление заказа ("Оплатить")
events.on('contacts:submit', () => {
	api
		.post('/order', appData.orderData)
		.then((res) => {
			events.emit('order:success', res);
			appData.cleanBasket();
			appData.refreshOrderData();
			order.disableButtons();
			page.counter = 0;
		})
		.catch((err) => {
			console.log(err);
		});
});

// Экран успеха
events.on('order:success', (res: ApiListResponse<string>) => {
	modal.render({
		content: ordersuccess.render({
			paymentConfirmation: res.total,
		}),
	});
});

// Закрытие модального окна, очистка всех форм и выделений
events.on('modal:close', () => {
	page.locked = false;
	appData.refreshSelected();
});
