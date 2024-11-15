
type ProductCategory = 'другое' | 'софт-скил' | 'дополнительное' | 'кнопка' | 'хард-скил'
type FormErrors = Partial<Record<keyof IOrderData, string>>

// Интерфейс главной страницы магазина
interface IMainPage {
    сounter: number
    catalog: HTMLElement[];
    locked: boolean;
    }

// Интерфейс карточки товара
interface IProductItem {
    id: string
    description?: string
    image: string
    title: string
    category: string
    price: number | null
}

// Интерфейс, описывающий корзину
interface IBasketModel {
    selectedList: HTMLElement[]
    total: number
    }


// Интерфейс, описывающий данные заказа и покупателя
interface IOrderData {
    items: string[] 
    paymentMethod: string
    address: string
    email: string
    phone: string
  }

// Интерфейс, описывающий Форму (модальное окно) с адресом покупателя и методом оплаты
interface IAddressForm {
    paymentMethod: string
    address: string
  }

// Интерфейс, описывающий Форму (модальное окно) с контактами покупателя
interface IContactsForm {
    phone: string
    email: string
  }

  // Интерфейс, описывающий Форму (модальное окно) успешного оформления заказа
interface IOrderSuccess {
    paymentConfirmation: number
  }

  // Интерфейс, описывающий текущее состояние приложения
interface IAppState {
    catalog: IProductItem[]
    basket: IProductItem[]
    orderData: IOrderData 
    formErrors: FormErrors
    addToBasket(item: HTMLElement): void   // добавить в корзину товар
    deleteFromBasket(id: string): void  // удалить из корзины товар
    cleanBasket(): void            // полностью очистить корзину
    getBasketCounter(): number    // калькулятор количества товаров в корзине
    getBasketTotal(): number      // калькулятор общей стоимости товаров в корзине
    setOrderField(field: keyof IOrderData, value: string): void    // метод для заполнения полей Форм с адресом и контактами
    validateAddressForm(): boolean  // валидация Формы с адресом покупателя и методом оплаты
    validateContactsForm(): boolean // валидация Формы с контактами покупателя
}
