import { HubConnectionBuilder, HttpTransportType, LogLevel } from "@microsoft/signalr";

// Make sure connection is a global variable
let connection;

const reconnectSignalR = async () => {
    console.log("Attempting to reconnect to SignalR Hub...");
    setTimeout(async () => {
        if (!connection) {
            connection = new HubConnectionBuilder()
                .withUrl("https://localhost:7055/gamehub", {
                    skipNegotiation: true,
                    transport: HttpTransportType.WebSockets
                })
                .configureLogging(LogLevel.Debug)
                .build();
            try {
                await connection.start();
                console.log("Reconnected to SignalR Hub.");
            } catch (err) {
                console.error("Reconnection to SignalR Hub failed:", err);
                await reconnectSignalR(); // Retry reconnection
            }
        }
    }, 5000); // Retry after 5 seconds
};

export const getSignalRConnection = async () => {
    if (!connection) {
        connection = new HubConnectionBuilder()
            .withUrl("https://localhost:7055/gamehub", {
                skipNegotiation: true,
                transport: HttpTransportType.WebSockets
            })
            .configureLogging(LogLevel.Debug)
            .build();

        connection.onclose(async (error) => {
            console.error('SignalR connection closed', error);
            await reconnectSignalR();
        });

        try {
            await connection.start();
            console.log("Connected to SignalR Hub.");
        } catch (err) {
            console.error("Error connecting to SignalR Hub:", err);
            connection = null;
        }
    }
    return connection;
};
