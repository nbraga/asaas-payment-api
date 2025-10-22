import type {
    AsaasCustomer,
    AsaasPayment,
    AsaasPaymentResponse,
    AsaasSubscription,
    AsaasSubscriptionResponse,
} from "@/common/interfaces/asaas-props";
import { EnvService } from "@/infra/env/env.service";
import { Injectable, Logger } from "@nestjs/common";
import axios, { type AxiosInstance } from "axios";
import { PaymentRepository } from "./interfaces/payment.repository";

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
                access_token: apiKey,
            },
        });

        // Interceptor para log de requisições
        this.httpClient.interceptors.request.use((config) => {
            this.logger.log(
                `Request: ${config.method?.toUpperCase()} ${config.url}`,
            );
            return config;
        });

        // Interceptor para log de respostas
        this.httpClient.interceptors.response.use(
            (response) => {
                this.logger.log(
                    `Response: ${response.status} ${response.config.url}`,
                );
                return response;
            },
            (error) => {
                this.logger.error(
                    `Error: ${error.response?.status} ${error.config?.url}`,
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

    async listPayments(params?: {
        customer?: string;
        status?: string;
        offset?: number;
        limit?: number;
    }): Promise<{
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
        await this.httpClient.delete(`/subscriptions/${subscriptionId}`);
    }
}
