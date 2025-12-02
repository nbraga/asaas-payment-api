import { ROLES_KEY, UserRoles } from "@/common/decorators/roles.decorator";
import {
    CanActivate,
    ExecutionContext,
    Injectable,
    UnauthorizedException,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector) {}

    canActivate(context: ExecutionContext): boolean {
        const requiredRoles = this.reflector.getAllAndOverride<UserRoles[]>(
            ROLES_KEY,
            [context.getHandler(), context.getClass()],
        );

        if (!Array.isArray(requiredRoles) || requiredRoles.length === 0) {
            return true;
        }

        const request = context
            .switchToHttp()
            .getRequest<{ user?: { role: UserRoles } }>();
        const user = request?.user;

        if (!user) {
            return false;
        }

        // SUPER_ADMIN has access to everything
        if (user.role === "SUPER_ADMIN") {
            return true;
        }

        const hasRole = requiredRoles.includes(user.role);

        if (!hasRole) {
            throw new UnauthorizedException("Usuário não autorizado");
        }

        return true;
    }
}
