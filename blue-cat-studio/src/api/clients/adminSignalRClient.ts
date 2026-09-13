// api/clients/adminSignalRClient.ts
import { HubConnection, HubConnectionBuilder, LogLevel } from '@microsoft/signalr';
import { AUTH_KEYS } from '../../constants/auth.constants';

class AdminSignalRClient {
    private connection: HubConnection | null = null;
    private hubUrl: string;
    private connectionPromise: Promise<void> | null = null;

    constructor() {
        const base = import.meta.env.VITE_API_BASE_URL || '';
        const rootBase = base.endsWith('/api') ? base.slice(0, -4) : base;
        this.hubUrl = `${rootBase}/hubs/admin`;
    }

    public getConnection(): HubConnection {
        if (!this.connection) {
            this.connection = new HubConnectionBuilder()
                .withUrl(this.hubUrl, {
                    accessTokenFactory: () => localStorage.getItem(AUTH_KEYS.TOKEN) || '',
                    withCredentials: true,
                })
                .withAutomaticReconnect()
                .configureLogging(LogLevel.Information)
                .build();
        }

        return this.connection;
    }

    public async start(): Promise<void> {
        const conn = this.getConnection();

        if (conn.state === 'Connected') {
            return;
        }

        if (this.connectionPromise) {
            return this.connectionPromise;
        }

        this.connectionPromise = (async () => {
            try {
                await conn.start();
            } finally {
                this.connectionPromise = null;
            }
        })();

        return this.connectionPromise;
    }
}

export const adminSignalRClient = new AdminSignalRClient();