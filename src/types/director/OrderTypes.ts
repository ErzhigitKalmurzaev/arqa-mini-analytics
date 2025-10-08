export interface OrderProductDetail {
    color: string;
    size: string;
    amount: number;
  }
  
  export interface OrderProduct {
    id?: string;
    product_title: string;
    details: OrderProductDetail[];
  }
  
  export interface OrderProps {
    order_products: OrderProduct[];
    status: number;
    client: string; // UUID клиента
  }
  
  export interface ClientInfo {
    id: string;
    fullname: string;
  }
  
  export interface IOrder {
    id: string;
    order_products: OrderProduct[];
    client_info: ClientInfo;
    created_at: string;  // ISO-дата
    updated_at: string;  // ISO-дата
    status: number;
    client: string;      // UUID клиента
  }

  export interface OrderState {
    orders: IOrder[];
    orders_status: 'loading' | 'success' | 'error';
    statements: any[];
    statements_status: 'loading' | 'success' | 'error';
    order: IOrder | null;
    order_status: 'loading' | 'success' | 'error';
  }
  