import { EnvService } from "@/infra/env/env.service";
import { InvitationConfirmEmailUserService } from "@/infra/mail/services/invitation-confirm-email-user.service";
import { UserRepository } from "@/infra/prisma/repositories/interfaces/user.repository";
import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { BcryptServiceProps } from "../../../common/interfaces/bcrypt-service-props";
import {
    CreateUserErrors,
    CreateUserParams,
    CreateUserResponse,
    CreateUserUseCase,
} from "../use-cases/create-user.use-case";

@Injectable()
export class CreateUserService implements CreateUserUseCase {
    constructor(
        private readonly userRepository: UserRepository,
        private readonly bcryptService: BcryptServiceProps,
        private readonly jwtService: JwtService,
        private readonly invitationConfirmEmailUserService: InvitationConfirmEmailUserService,
        private readonly envService: EnvService,
    ) {}

    async execute(
        body: CreateUserParams,
    ): Promise<
        | { status: "success"; data: CreateUserResponse }
        | { status: "error"; error: CreateUserErrors }
    > {
        const isEmailAlreadyExists = await this.userRepository.findByEmail(
            body.email,
        );

        if (isEmailAlreadyExists) {
            return {
                status: "error",
                error: "Email já está em uso",
            };
        }

        const hashedPassword = await this.bcryptService.hash(body.password);

        const userData = {
            ...body,
            password: hashedPassword,
        };

        body = userData;

        const user = await this.userRepository.create({
            user: body,
        });

        const confirmationEmailToken = await this.jwtService.signAsync(
            {
                id: user!.id,
                email: user!.email,
            },
            {
                expiresIn: "1d",
            },
        );

        const accessToken = await this.jwtService.signAsync({
            id: user!.id,
            email: user!.email,
        });

        return {
            status: "success",
            data: {
                token: accessToken,
            },
        };
    }
}
