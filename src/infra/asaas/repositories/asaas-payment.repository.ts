import type {
    AsaasCustomer,
    AsaasPayment,
    AsaasPaymentResponse,
    AsaasSubscription,
    AsaasSubscriptionResponse,
    CreateCreditCardPaymentRepositoryParams,
} from "@/common/interfaces/asaas-props";
import { EnvService } from "@/infra/env/env.service";
import { Injectable, Logger } from "@nestjs/common";
import axios, { type AxiosInstance } from "axios";
import { BillingType } from "../../../../generated/prisma";
import {
    ParamsUpdateCreditCardSubscriptionRepository,
    ParamsUpdateSubscriptionRepository,
    PaymentRepository,
    PaymentRepositoryParams,
    PaymentRepositoryResponse,
} from "./interfaces/payment.repository";

@Injectable()
export class AsaasPaymentRepository extends PaymentRepository {
    private readonly httpClient: AxiosInstance;
    private readonly logger = new Logger(AsaasPaymentRepository.name);

    constructor(private readonly envService: EnvService) {
        super();

        const apiKey = this.envService.get("ASAAS_API_KEY");
        const baseURL = this.envService.get("ASAAS_BASE_URL");

        this.httpClient = axios.create({
            baseURL,
            headers: {
                "Content-Type": "application/json",
                "User-Agent": "Clics/1.0.0 (Node.js; development)",
                access_token: apiKey,
            },
        });

        this.httpClient.interceptors.request.use((config) => {
            this.logger.log(
                `Request: ${config.method?.toUpperCase()} ${config.url}`,
            );
            return config;
        });

        this.httpClient.interceptors.response.use(
            (response) => {
                this.logger.log(
                    `Response: ${response.status} ${response.config.url}`,
                );
                return response;
            },
            (error) => {
                this.logger.error(
                    // `Error: ${error.response?.status} ${error.config?.url}`,
                    error.response?.data,
                );
                throw error;
            },
        );
    }

    async createCustomer(customer: AsaasCustomer): Promise<AsaasCustomer> {
        const { data } = await this.httpClient.post<AsaasCustomer>(
            "/customers",
            customer,
        );
        return data;
    }

    async getCustomer(customerId: string): Promise<AsaasCustomer | null> {
        try {
            const { data } = await this.httpClient.get<AsaasCustomer>(
                `/customers/${customerId}`,
            );
            return data;
        } catch (error) {
            if (axios.isAxiosError(error) && error.response?.status === 404) {
                return null;
            }
            throw error;
        }
    }

    async listCustomers(params?: {
        name?: string;
        email?: string;
        cpfCnpj?: string;
        offset?: number;
        limit?: number;
    }): Promise<{
        data: AsaasCustomer[];
        totalCount: number;
    }> {
        const { data } = await this.httpClient.get("/customers", { params });
        return data;
    }

    async createPayment(payment: AsaasPayment): Promise<AsaasPaymentResponse> {
        const { data } = await this.httpClient.post<AsaasPaymentResponse>(
            "/payments",
            payment,
        );
        return data;
    }

    async getPayment(paymentId: string): Promise<AsaasPaymentResponse> {
        const { data } = await this.httpClient.get<AsaasPaymentResponse>(
            `/payments/${paymentId}`,
        );
        return data;
    }

    async listPayments(params?: PaymentRepositoryParams): Promise<{
        data: AsaasPaymentResponse[];
        totalCount: number;
    }> {
        const { data } = await this.httpClient.get("/payments", { params });
        return data;
    }

    async deletePayment(paymentId: string): Promise<void> {
        await this.httpClient.delete(`/payments/${paymentId}`);
    }

    async getPixQrCode(paymentId: string): Promise<{
        encodedImage: string;
        payload: string;
        expirationDate: string;
    }> {
        const { data } = await this.httpClient.get(
            `/payments/${paymentId}/pixQrCode`,
        );
        return data;
    }

    async createSubscription(
        subscription: AsaasSubscription,
    ): Promise<AsaasSubscriptionResponse> {
        const { data } = await this.httpClient.post<AsaasSubscriptionResponse>(
            "/subscriptions",
            subscription,
        );
        return data;
    }

    async getSubscription(
        subscriptionId: string,
    ): Promise<AsaasSubscriptionResponse> {
        const { data } = await this.httpClient.get<AsaasSubscriptionResponse>(
            `/subscriptions/${subscriptionId}`,
        );
        return data;
    }

    async listSubscriptions(params?: {
        customer?: string;
        status?: string;
        offset?: number;
        limit?: number;
    }): Promise<{
        data: AsaasSubscriptionResponse[];
        totalCount: number;
    }> {
        const { data } = await this.httpClient.get("/subscriptions", {
            params,
        });
        return data;
    }

    async deleteSubscription(subscriptionId: string): Promise<void> {
        try {
            await this.httpClient.delete(`/subscriptions/${subscriptionId}`);
        } catch (error) {
            this.logger.error(
                `Failed to delete subscription ${subscriptionId}: ${error}`,
            );
            throw error;
        }
    }

    async createCreditCardPayment(
        params: CreateCreditCardPaymentRepositoryParams,
    ): Promise<AsaasPaymentResponse> {
        const { data } = await this.httpClient.post("/subscriptions", {
            customer: params.customer,
            billingType: "CREDIT_CARD",
            value: params.value,
            nextDueDate: params.nextDueDate,
            cycle: params.cycle,
            description: params.description,
            creditCard: params.creditCard,
            creditCardHolderInfo: params.creditCardHolderInfo,
            remoteIp: params.remoteIp,
            externalReference: params.externalReference,
        });

        return data;
    }

    async payWithCreditCard(
        paymentId: string,
        creditCardData: {
            creditCard: {
                holderName: string;
                number: string;
                expiryMonth: string;
                expiryYear: string;
                ccv: string;
            };
            creditCardHolderInfo: {
                name: string;
                email: string;
                cpfCnpj: string;
                postalCode: string;
                addressNumber: string;
                addressComplement?: string;
                phone: string;
            };
            remoteIp?: string;
        },
    ): Promise<AsaasPaymentResponse> {
        const { data } = await this.httpClient.post<AsaasPaymentResponse>(
            `/payments/${paymentId}/payWithCreditCard`,
            creditCardData,
        );
        return data;
    }

    async getInfoPayment(
        paymentId: string,
    ): Promise<PaymentRepositoryResponse> {
        const { data } = await this.httpClient.get(
            `/payments/${paymentId}/billingInfo`,
        );

        return data;
    }

    async updateSubscription(
        data: ParamsUpdateSubscriptionRepository,
    ): Promise<void> {
        try {
            await this.httpClient.put<AsaasPaymentResponse>(
                `/subscriptions/${data.id}`,
                data,
            );
        } catch (error) {
            const errorMessage =
                error?.response?.data?.errors?.[0]?.description ||
                "Erro ao processar pagamento";

            throw new Error(errorMessage);
        }
    }

    async updateCreditCardSubscription(
        params: ParamsUpdateCreditCardSubscriptionRepository,
    ): Promise<AsaasPaymentResponse> {
        try {
            const { data } = await this.httpClient.put<AsaasPaymentResponse>(
                `/subscriptions/${params.id}/creditCard`,
                params,
            );
            return data;
        } catch (error) {
            const errorMessage =
                error?.response?.data?.errors?.[0]?.description ||
                "Erro ao processar pagamento";

            throw new Error(errorMessage);
        }
    }

    async updateBillingTypeSubscription({
        subscriptionId,
        billingType,
    }: {
        subscriptionId: string;
        billingType: BillingType;
    }): Promise<AsaasPaymentResponse> {
        try {
            const { data } = await this.httpClient.put<AsaasPaymentResponse>(
                `/subscriptions/${subscriptionId}`,
                { billingType },
            );
            return data;
        } catch (error) {
            const errorMessage =
                error?.response?.data?.errors?.[0]?.description ||
                "Erro ao processar pagamento";

            throw new Error(errorMessage);
        }
    }
}
