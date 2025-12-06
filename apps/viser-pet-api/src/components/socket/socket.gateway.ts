import { Logger } from '@nestjs/common';
import { OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'ws';
import * as WebSocket from 'ws';
import * as url from 'url';
import { Member } from '../../libs/dto/member/member';
import { AuthService } from '../auth/auth.service';

interface MessagePayload {
	event: string;
	text: string;
	memberData: Member;
}

interface InfoPayload {
	event: string;
	totalClients: number;
	memberData: Member;
	action: string;
}

@WebSocketGateway({ transports: ['websocket'], secure: false })
export class SocketGateway implements OnGatewayInit {
	private logger: Logger = new Logger('SocketEventsGateway');
	private summaryClient: number = 0;
	private clientAuthMap = new Map<WebSocket, Member>();
	private messageList: MessagePayload[] = [];

	constructor(private authService: AuthService) {}

	@WebSocketServer()
	server: Server;

	public afterInit(server: Server) {
		//qachonki SocketGateway serverda initialazie bolganda yani tayyor bolganda ishga tushadi
		this.logger.verbose(`WibSocket Server Initialized total: [${this.summaryClient}]`);
	}

	private async retrieveAuth(req: any): Promise<Member> {
		try {
			const parseUrl = url.parse(req.url, true);
			const { token } = parseUrl.query;
			return await this.authService.verifyToken(token as string);
		} catch (err) {
			return null;
		}
	}

	public async handleConnection(client: WebSocket, req: any) {
		const authMember = await this.retrieveAuth(req);
		this.summaryClient++;
		this.clientAuthMap.set(client, authMember);
		//client => authmember

		const clientNick: string = authMember?.memberNick ?? 'Guest';
		this.logger.verbose(`== Client connected [${clientNick}] & total [${this.summaryClient}]`);

		const infoMsg: InfoPayload = {
			event: 'info',
			totalClients: this.summaryClient,
			memberData: authMember,
			action: 'joined',
		};
		this.emitMessage(infoMsg);
		//client message
		//ulangan clientga message yuborish
		client.send(JSON.stringify({ event: 'getMessages', list: this.messageList }));
	}

	public async handleDisconnect(client: WebSocket) {
		const authMember = this.clientAuthMap.get(client);
		this.summaryClient--;
		this.clientAuthMap.delete(client);
		const clientNick: string = authMember?.memberNick ?? 'Guest';
		this.logger.verbose(`== Client disconnected [${clientNick}] & total [${this.summaryClient}]`);

		const infoMsg: InfoPayload = {
			event: 'info',
			totalClients: this.summaryClient,
			memberData: authMember,
			action: 'left',
		};
		this.broadcastMessage(client, infoMsg);
	}

	@SubscribeMessage('message')
	public async handleMessage(client: WebSocket, payload: any): Promise<void> {
		const authMember = this.clientAuthMap.get(client);
		const newMessage: MessagePayload = { event: 'message', text: payload, memberData: authMember };

		const clientNick: string = authMember?.memberNick ?? 'Guest';
		this.logger.verbose(`NEW MESSAGE [${clientNick}]: ${payload}`);

		this.messageList.push(newMessage);
		if (this.messageList.length > 5) this.messageList.splice(0, this.messageList.length - 5);

		this.emitMessage(newMessage);
	}

	private broadcastMessage(sender: WebSocket, message: InfoPayload | MessagePayload) {
		this.server.clients.forEach((client) => {
			if (client !== sender && client.readyState === WebSocket.OPEN) {
				client.send(JSON.stringify(message));
			}
		});
	}

	private emitMessage(message: InfoPayload | MessagePayload) {
		this.server.clients.forEach((client) => {
			if (client.readyState === WebSocket.OPEN) {
				client.send(JSON.stringify(message));
			}
		});
	}
}

/*
 1.Client (only client)
 2.Broadcast (except client)
 3.Emit (all clients)
 */
