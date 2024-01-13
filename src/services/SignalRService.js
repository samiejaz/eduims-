import {
  HubConnectionBuilder,
  HttpTransportType,
  LogLevel,
} from "@microsoft/signalr";

class SignalRConnectionManager {
  constructor() {
    this.connection = null;
  }

  startConnection = async () => {
    if (!this.connection) {
      this.connection = new HubConnectionBuilder()
        .withUrl("http://192.168.9.110:90/Notification", {
          skipNegotiation: true,
          transport: HttpTransportType.WebSockets,
        })
        .configureLogging(LogLevel.Information)
        .build();

      try {
        await this.connection.start();
        console.log("SignalR connection established.");
      } catch (err) {
        console.error("Error while starting SignalR connection:", err);
      }
    }
  };

  stopConnection = async () => {
    if (this.connection) {
      try {
        await this.connection.stop();
        console.log("SignalR connection stopped.");
      } catch (err) {
        console.error("Error while stopping SignalR connection:", err);
      } finally {
        this.connection = null;
      }
    }
  };

  getConnection = () => {
    return this.connection;
  };
}

const signalRConnectionManager = new SignalRConnectionManager();

export default signalRConnectionManager;
