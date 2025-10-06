export interface IOrderDetail {
    color: string
    size: string
    amount: number
  }
  
  export interface IOrderProduct {
    product_title: string
    details: IOrderDetail[]
  }
  
  export interface IClientInfo {
    id: string
    fullname: string
  }
  
  export interface IOrder {
    id: string
    order_products: IOrderProduct[]
    client_info: IClientInfo
    created_at: string   // ISO-строка даты
    updated_at: string   // ISO-строка даты
    status: number
    client: string
  }

  export interface IOrderProps {
    order_id: string
    title: string
    color: string
    size: string
    internal_code: string
    file: string
  }

  export interface IOrderReceiver {
    order_id: string
    title: string
    color: string
    size: string
    internal_code: string
    file: any
  }

export interface ReceiverOrderState {
    orders: IOrder[],
    orders_status: 'loading' | 'success' | 'error',
    order: IOrder | null,
    order_status: 'loading' | 'success' | 'error'
}