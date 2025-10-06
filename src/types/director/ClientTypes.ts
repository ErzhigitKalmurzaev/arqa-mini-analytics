export interface IUser {
    id: string;
    username: string;
    is_active: boolean;
}

export interface IClient {
    id: string;
    user: IUser;
    created_at: string;
    updated_at: string;
    fullname: string;
}

export interface IClientProps {
    fullname: string;
    username: string;
    password?: string;
}

export interface ClientState {
    clients: IClient[];
    clients_status: 'loading' | 'success' | 'error';
    client: IClient | null;
    client_status: 'loading' | 'success' | 'error';
}