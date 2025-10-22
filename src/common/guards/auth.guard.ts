import { IS_PUBLIC_KEY } from "@/common/decorators/public.decorator";
import { UserPayloadProps } from "@/common/interfaces/user-payload-props";
import { UserRepository } from "@/infra/prisma/repositories/interfaces/user.repository";
import {
    CanActivate,
    ExecutionContext,
    Injectable,
    UnauthorizedException,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { JwtService } from "@nestjs/jwt";
import { Request } from "express";

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(
        private jwtService: JwtService,
        private reflector: Reflector,
        private userRepository: UserRepository,
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request: Request = context.switchToHttp().getRequest();
        const isPublic = this.reflector.getAllAndOverride<boolean>(
            IS_PUBLIC_KEY,
            [context.getHandler(), context.getClass()],
        );

        if (isPublic) {
            return true;
        }

        const token = request.headers.authorization?.split(" ")[1];

        if (!token) {
            throw new UnauthorizedException("Token not found");
        }

        try {
            const payload: UserPayloadProps =
                await this.jwtService.verifyAsync(token);

            const user = await this.userRepository.findById(payload.id);

            if (!user) {
                throw new UnauthorizedException("User not found");
            }

            request["user"] = {
                id: user.id,
                email: user.email,
            };
        } catch (err) {
            throw new UnauthorizedException(
                err instanceof Error ? err.message : "Authentication failed",
            );
        }

        return true;
    }
}
