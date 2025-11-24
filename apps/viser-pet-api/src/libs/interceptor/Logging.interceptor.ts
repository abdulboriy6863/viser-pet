import { Injectable, NestInterceptor, ExecutionContext, CallHandler, Logger } from '@nestjs/common';
import { GqlContextType, GqlExecutionContext } from '@nestjs/graphql';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
	private readonly logger: Logger = new Logger();
	// Observable === PROMISE 똑같대
	intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
		const recordTime = Date.now();
		const requestType = context.getType<GqlContextType>(); // getType orqali kirib kelayotkan requestni qanday "type" da ekanligini aniqlashtirib olishimiz mumkun
		//bu yerda kirib kelayotkan requestni 'type' ni taqdim etyapti

		if (requestType === 'http') {
			/* 			Develop if need REST API login
			 */
			return next.handle().pipe();
		} else if (requestType === 'graphql') {
			/* (1) Print Request */
			const gqContext = GqlExecutionContext.create(context);
			this.logger.log(`${this.strigify(gqContext.getContext().req.body)}`, 'REQUEST');

			/* (2) Errors handling via GraphQL => => => */

			/* (3) No Errors, giving Response below */
			return next.handle().pipe(
				tap((context) => {
					const responseTime = Date.now() - recordTime; // bu yerda response qilishdan oldin biz vaqtini o'lchayapmiz
					this.logger.log(`${this.strigify(context)} - ${responseTime}ms \n\n`, 'REQUEST');
				}),
			);
		}
	}

	private strigify(context: ExecutionContext): string {
		console.log(typeof context);
		return JSON.stringify(context).slice(0, 75);
		// nima uchun aynan 75 harf kirib kelishi bizga nimani beradi?
	}
}
