/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

export interface RegisterDto {
  /**
   * Email use to register
   * @example "truongnt267@gmail.com"
   */
  email: string;
  /**
   * Password use to register
   * @example "12345678Aa@"
   */
  password: string;
}

export interface RegisterResponseDto {
  token: string;
}

export interface VerifyRegisterDto {
  /**
   * OTP use to verify register account
   * @example "123456"
   */
  OTP: string;
}

export interface SaveEntityResponseDto {
  id: number;
}

export interface LoginDto {
  /**
   * Email use to login
   * @example "ntt26072003@gmail.com"
   */
  email: string;
  /**
   * Password use to login
   * @example "12345678Aa@"
   */
  password: string;
}

export interface LoginResponseDto {
  accessToken: string;
  refreshToken: string;
}

export interface SuccessResponseDto {
  success: boolean;
}

export interface UserResponseDto {
  id: string;
  email: string;
  name: string;
  phoneNumber: string;
  avatar: string;
  gender: "male" | "female" | "other";
  roles: string[];
  /** @format date-time */
  createdAt: string;
}

export interface RefreshTokenResponseDto {
  accessToken: string;
}

export interface ForgotPasswordDto {
  email: string;
}

export interface ForgotPasswordResponseDto {
  /** UUID token hooked with forgot password request */
  token: string;
}

export interface VerifyForgotPasswordDto {
  OTP: string;
}

export interface ChangePasswordDto {
  password: string;
  newPassword: string;
}

export interface ChangePasswordResponseDto {
  accessToken: string;
  refreshToken: string;
}

export interface UploadDto {
  fileName: string;
  contentType: string;
}

export interface UploadResponseDto {
  presignUrl: string;
  fileUrl: string;
}

export interface UpdateProfileDto {
  name: string;
  phoneNumber: string;
  avatar?: string;
  gender: "male" | "female" | "other";
}

export interface NotificationResponseDto {
  id: string;
  title: string;
  content: string;
  triggerBy: string;
  type: "voucher" | "product" | "order" | "message";
  duration: "one_off" | "forever";
  navigateTo: string;
  isRead: boolean;
  meta: object;
  /** @format date-time */
  createdAt: string;
  /** @format date-time */
  updatedAt: string;
}

export interface PaginateMetaDto {
  page: number;
  pageSize: number;
  totalItem: number;
  totalPage: number;
}

export interface ListNotificationResponseDto {
  data: NotificationResponseDto[];
  paginate: PaginateMetaDto;
}

export interface TotalUnreadNotificationResponseDto {
  totalUnread: number;
}

export interface UserListResponseDto {
  data: UserResponseDto[];
  paginate: PaginateMetaDto;
}

export interface AdminCreateUserDto {
  email: string;
  name: string;
  gender: "male" | "female" | "other";
  phoneNumber: string;
  roles: ("Product Manager" | "Order Manager" | "Technician")[];
  locationId: string;
}

export interface SaveCategoryDto {
  /** @example "Áo thu đông" */
  title: string;
  /** @example "Áo dành cho mùa thu đông, cảm giác vừa đủ ấm." */
  description: string;
  /** @example "https://exmaple.jpg" */
  image: string;
}

export interface CategoryResponseDto {
  /** @example 1 */
  id: number;
  /** @example "Áo thu đông" */
  title: string;
  /** @example "Áo dành cho mùa thu đông, cảm giác vừa đủ ấm." */
  description: string;
  /** @example "https://exmaple.jpg" */
  image: string;
  /** @format date-time */
  createdAt: string;
  /** @format date-time */
  updatedAt: string;
}

export interface ListCategoryResponseDto {
  data: CategoryResponseDto[];
  paginate: PaginateMetaDto;
}

export interface CreateProductVariantDto {
  /** @example 1000 */
  price: number;
  /** @example "AO-THUN-001" */
  sku: string;
  /** @example 50 */
  stock: number;
  /** @example [1] */
  variantValueIds: number[];
}

export interface CreateProductDto {
  /** @example "unpublished" */
  status: "unpublished" | "published";
  /** @example "Áo thun nam" */
  name: string;
  /** @example "Chất liệu cao cấp" */
  description: string;
  /** @example true */
  hasVariant: boolean;
  /** @example 1000 */
  price?: number;
  discount?: number;
  /** @example 50 */
  stock?: number;
  /** @example "AOTHUN-001" */
  sku?: string;
  /** @example ["https://example.com"] */
  imageUrls?: string[];
  /** @example [1] */
  categoryIds: number[];
  productVariants?: CreateProductVariantDto[];
}

export interface SaveUuidResponseDto {
  /** @example "377a5d99-ee6d-4e6f-9197-713e0699ac93" */
  id: string;
}

export interface VariantValuesResponseDto {
  /** @example "Size" */
  variant: string;
  /** @example "M" */
  value: string;
}

export interface AdminProductVariantResponseDto {
  id: string;
  /** @example 1000 */
  price: number;
  /** @example "AO-THUN-001" */
  sku: string;
  /** @example 50 */
  stock: number;
  variantValues: VariantValuesResponseDto[];
}

export interface AdminProductResponseDto {
  id: string;
  /** @example "Áo thun nam" */
  name: string;
  /** @example "Chất liệu cao cấp" */
  description: string;
  status: "unpublished" | "published";
  discount?: number;
  hasVariant: boolean;
  productVariants: AdminProductVariantResponseDto[];
  /** @example ["https://example.com"] */
  productImages: string[];
  /** @example ["Áo thu đông"] */
  categories: string[];
  /** @format date-time */
  createdAt: string;
  /** @format date-time */
  updatedAt: string;
}

export interface ListProductResponseDto {
  data: AdminProductResponseDto[];
  paginate: PaginateMetaDto;
}

export interface ProductImageDetailResponseDto {
  id: number;
  url: string;
}

export interface VariantResponseDto {
  /**
   * Variant Id
   * @example 1
   */
  id: number;
  /**
   * Variant name
   * @example "Size"
   */
  name: string;
}

export interface ProductDetailVariantValueResponseDto {
  /** @example "ca07d01b-cbe6-4c4f-aa4c-d55e937eefd7" */
  id: number;
  /** @example "M" */
  value: string;
  variant: VariantResponseDto;
}

export interface ProductDetailVariantResponseDto {
  /** @example "ca07d01b-cbe6-4c4f-aa4c-d55e937eefd7" */
  id: string;
  /** @example 1000 */
  price: number;
  /** @example "AO-THUN-001" */
  sku: string;
  /** @example 50 */
  stock: number;
  variantValues: ProductDetailVariantValueResponseDto[];
}

export interface AdminProductDetailResponseDto {
  /** @example "377a5d99-ee6d-4e6f-9197-713e0699ac93" */
  id: string;
  /** @example "Áo thun nam" */
  name: string;
  /** @example "Chất liệu cao cấp" */
  description: string;
  hasVariant: boolean;
  discount?: number;
  status: "unpublished" | "published";
  categories: CategoryResponseDto[];
  productImages: ProductImageDetailResponseDto[];
  productVariants: ProductDetailVariantResponseDto[];
}

export interface UpdateProductImageDto {
  id: number;
  url: string;
}

export interface UpdateProductVariantDto {
  /** @example 1000 */
  price: number;
  /** @example "AO-THUN-001" */
  sku: string;
  /** @example 50 */
  stock: number;
  /** @example [1] */
  variantValueIds: number[];
  /** @example "ca07d01b-cbe6-4c4f-aa4c-d55e937eefd7" */
  id?: string;
}

export interface UpdateProductDto {
  /** @example "unpublished" */
  status: "unpublished" | "published";
  /** @example "Áo thun nam" */
  name: string;
  /** @example "Chất liệu cao cấp" */
  description: string;
  /** @example true */
  hasVariant: boolean;
  /** @example 1000 */
  price?: number;
  /** @example 50 */
  stock?: number;
  discount?: number;
  /** @example "AOTHUN-001" */
  sku?: string;
  /** @example ["https://example.com"] */
  imageUrls?: UpdateProductImageDto[];
  /** @example [1] */
  categoryIds: number[];
  productVariants?: UpdateProductVariantDto[];
}

export interface UpdateProductStatusDto {
  /** @example "published" */
  status: "unpublished" | "published";
}

export interface CreateVariantDto {
  /** @example "Size" */
  name: string;
}

export interface ListVariantResponseDto {
  data: VariantResponseDto[];
  paginate: PaginateMetaDto;
}

export interface CreateVariantValueDto {
  /** @example "M" */
  value: string;
  /** @example 1 */
  variantId: number;
}

export interface VariantValueResponseDto {
  /**
   * Variant Value Id
   * @example 1
   */
  id: number;
  /**
   * Variant Value
   * @example "M"
   */
  value: string;
}

export interface ListVariantValueResponseDto {
  data: VariantValueResponseDto[];
  paginate: PaginateMetaDto;
}

export interface AdminConversationUserResponseDto {
  id: string;
  name: string;
  avatar: string;
}

export interface AdminConversationResponseDto {
  id: string;
  user: AdminConversationUserResponseDto;
  latestMessage: string;
}

export interface AdminListConversationResponseDto {
  data: AdminConversationResponseDto[];
  paginate: PaginateMetaDto;
}

export interface MessageResponseDto {
  id: number;
  conversationId: string;
  content: string;
  senderId: string;
  /** @format date-time */
  createdAt: string;
}

export interface ListMessageResponseDto {
  data: MessageResponseDto[];
  paginate: PaginateMetaDto;
}

export interface CreateMessageDto {
  conversationId: string;
  content: string;
}

export interface ConversationUserResponseDto {
  id: string;
  firstName: string;
  lastName: string;
  avatar: string;
}

export interface ConversationResponseDto {
  id: string;
  users: ConversationUserResponseDto[];
}

export interface AdminVoucherResponseDto {
  id: string;
  code: string;
  type: "fixed" | "percent";
  discountValue: number;
  maxDiscountValue: number;
  minOrderValue: number;
  stock: number;
  totalUsed: number;
  campaignName: string;
  description: string;
  /** @format date-time */
  expiryAt: string;
  isPublic: boolean;
  /** @format date-time */
  createdAt: string;
  /** @format date-time */
  updatedAt: string;
}

export interface AdminOrderResponseDto {
  id: string;
  userEmail: string;
  status: "pending" | "confirmed" | "shipping" | "completed" | "cancel";
  amount: number;
  paymentMethod: "qr" | "cod";
  paymentStatus: "not_yet" | "failed" | "success" | "pending" | "cancel";
  voucher: AdminVoucherResponseDto;
  /** @format date-time */
  createdAt: string;
  /** @format date-time */
  updatedAt: string;
}

export interface AdminListOrderResponseDto {
  data: AdminOrderResponseDto[];
  paginate: PaginateMetaDto;
}

export interface AdminOrderStaticResponseDto {
  pending: number;
  confirmed: number;
  shipping: number;
  completed: number;
}

export interface AdminOrderDetailUserResponseDto {
  id: string;
  email: string;
  avatar: string;
  gender: string;
}

export interface AdminOrderDetailAddressResponseDto {
  id: string;
  name: string;
  phoneNumber: string;
  detail: string;
}

export interface OrderItemProductResponseDto {
  id: string;
  name: string;
  discount?: number;
  description: string;
  productImages: ProductImageDetailResponseDto[];
}

export interface OrderItemProductVariantResponseDto {
  id: string;
  /** @example 1000 */
  price: number;
  /** @example "AO-THUN-001" */
  sku: string;
  /** @example 50 */
  stock: number;
  variantValues: VariantValuesResponseDto[];
}

export interface OrderItemResponseDto {
  id: string;
  product: OrderItemProductResponseDto;
  productVariant: OrderItemProductVariantResponseDto;
  currentPrice: number;
  currentDiscount: number;
  quantity: number;
  isReviewed: boolean;
}

export interface AdminOrderDetailResponseDto {
  id: string;
  status: "pending" | "confirmed" | "shipping" | "completed" | "cancel";
  amount: number;
  paymentMethod: "qr" | "cod";
  paymentStatus: "not_yet" | "failed" | "success" | "pending" | "cancel";
  voucher: AdminVoucherResponseDto;
  user: AdminOrderDetailUserResponseDto;
  address: AdminOrderDetailAddressResponseDto;
  orderItems: OrderItemResponseDto[];
  /** @format date-time */
  createdAt: string;
}

export interface AdminUpdateOrderStatusDto {
  status: "pending" | "confirmed" | "shipping" | "completed" | "cancel";
}

export interface AdminUpdateOrderPaymentStatusDto {
  paymentStatus: "not_yet" | "failed" | "success" | "pending" | "cancel";
}

export interface CreateFaqDto {
  question: string;
  answer: string;
  type:
    | "Chính sách đổi trả"
    | "Vận chuyển"
    | "Thanh toán"
    | "Sản phẩm"
    | "Tài khoản"
    | "Khuyến mãi"
    | "Chăm sóc khách hàng"
    | "Đặt hàng"
    | "Bảo mật"
    | "Thành viên"
    | "Nước hoa";
}

export interface AdminFaqResponseDto {
  id: number;
  question: string;
  answer: string;
  type:
    | "Chính sách đổi trả"
    | "Vận chuyển"
    | "Thanh toán"
    | "Sản phẩm"
    | "Tài khoản"
    | "Khuyến mãi"
    | "Chăm sóc khách hàng"
    | "Đặt hàng"
    | "Bảo mật"
    | "Thành viên"
    | "Nước hoa";
  /** @format date-time */
  createdAt: string;
  /** @format date-time */
  updatedAt: string;
}

export interface AdminListFaqResponseDto {
  data: AdminFaqResponseDto[];
  paginate: PaginateMetaDto;
}

export interface AdminFaqSummaryLatestTrainingResponseDto {
  id: number;
  status: "success" | "fail";
  /** @format date-time */
  createdAt: string;
  /** @format date-time */
  updatedAt: string;
}

export interface AdminFaqSummaryResponseDto {
  totalFaqs: number;
  totalFaqCategories: number;
  latestTraining: AdminFaqSummaryLatestTrainingResponseDto;
}

export interface AdminDashboardStatisticResponseDto {
  newOrderCount: number;
  newUserCount: number;
  revenue: number;
}

export interface AdminRevenueResponseDto {
  revenue: number;
  /** @format date-time */
  date: string;
}

export interface AdminDashboardPendingOrderResponseDto {
  id: string;
  userName: string;
  userEmail: string;
  amount: number;
  totalItem: number;
  /** @format date-time */
  createdAt: string;
  /** @format date-time */
  updatedAt: string;
}

export interface AdminCreateVoucherDto {
  code: string;
  type: "fixed" | "percent";
  discountValue: number;
  maxDiscountValue?: number;
  minOrderValue?: number;
  stock: number;
  /** @format date-time */
  expiryAt: string;
  isPublic: boolean;
  campaignName: string;
  description: string;
}

export interface AdminListVoucherResponseDto {
  data: AdminVoucherResponseDto[];
  paginate: PaginateMetaDto;
}

export interface AdminRolePermissionRoleResponseDto {
  id: string;
  name: string;
}

export interface AdminRolePermissionResponseDto {
  id: string;
  role: AdminRolePermissionRoleResponseDto;
  module: string;
  isCreate: boolean;
  isRead: boolean;
  isUpdate: boolean;
  isDelete: boolean;
  /** @format date-time */
  createdAt: string;
  /** @format date-time */
  updatedAt: string;
  /** @format date-time */
  deletedAt: string;
}

export interface AdminListRolePermissionResponseDto {
  data: AdminRolePermissionResponseDto[];
  paginate: PaginateMetaDto;
}

export interface UpdateRolePermissionDto {
  id: string;
  isCreate: boolean;
  isRead: boolean;
  isUpdate: boolean;
  isDelete: boolean;
}

export interface AdminCreateLocationDto {
  address: string;
  hotline: string;
  openTime: string;
  closeTime: string;
  openDate: string;
}

export interface AdminLocationResponseDto {
  id: string;
  address: string;
  hotline: string;
  openTime: string;
  closeTime: string;
  openDate: string;
  /** @format date-time */
  createdAt: string;
  /** @format date-time */
  updatedAt: string;
  /** @format date-time */
  deletedAt: string;
}

export interface AdminListLocationResponseDto {
  data: AdminLocationResponseDto[];
  paginate: PaginateMetaDto;
}

export interface AdminUpdateLocationDto {
  address?: string;
  hotline?: string;
  openTime?: string;
  closeTime?: string;
  openDate?: string;
}

export interface AddItemToCartDto {
  productVariantId: string;
  quantity: number;
}

export interface ProductResponseDto {
  id: string;
  name: string;
  description: string;
  price: number;
  discount: number;
  productImages: ProductImageDetailResponseDto[];
}

export interface ProductVariantResponseDto {
  id: string;
  product: ProductResponseDto;
  /** @example 1000 */
  price: number;
  /** @example "AO-THUN-001" */
  sku: string;
  /** @example 50 */
  stock: number;
  variantValues: VariantValuesResponseDto[];
}

export interface CartItemResponseDto {
  id: string;
  product: ProductResponseDto;
  discount?: number;
  productVariant: ProductVariantResponseDto;
  quantity: number;
}

export interface CartSummaryResponseDto {
  id: string;
  cartItems: CartItemResponseDto[];
  totalItems: number;
}

export interface ListCartItemResponseDto {
  data: CartItemResponseDto[];
  paginate: PaginateMetaDto;
}

export interface UpdateQuantityCartItemDto {
  quantity: number;
}

export interface UpdateProductVariantCartItemDto {
  productVariantId: string;
}

export interface ListUserProductResponseDto {
  data: ProductResponseDto[];
  paginate: PaginateMetaDto;
}

export interface ProductDetailResponseDto {
  id: string;
  name: string;
  description: string;
  price: number;
  discount: number;
  totalRating: number;
  averageRating: number;
  totalStock: number;
  productImages: ProductImageDetailResponseDto[];
  productVariants: ProductVariantResponseDto[];
}

export interface ProductVariantValueResponseDto {
  variant: string;
  value: string[];
}

export interface CreateOrderFromCartDto {
  cartItemIds: string[];
  addressId: string;
  paymentType: "qr" | "cod";
  voucherId?: string;
}

export interface AddressResponseDto {
  id: string;
  detail: string;
  name: string;
  phoneNumber: string;
  isDefault: boolean;
}

export interface VoucherResponseDto {
  id: string;
  code: string;
  type: "fixed" | "percent";
  discountValue: number;
  maxDiscountValue: number;
  minOrderValue: number;
  stock: number;
  totalUsed: number;
  campaignName: string;
  description: string;
  /** @format date-time */
  expiryAt: string;
  isClaim: boolean;
  /** @format date-time */
  createdAt: string;
  /** @format date-time */
  updatedAt: string;
}

export interface OrderResponseDto {
  id: string;
  address: AddressResponseDto;
  status: "pending" | "confirmed" | "shipping" | "completed" | "cancel";
  orderItems: OrderItemResponseDto[];
  amount: number;
  voucher: VoucherResponseDto;
  qrUrl?: string;
  qrStatus?: "not_yet" | "failed" | "success" | "pending" | "cancel";
  /** @format date-time */
  createdAt: string;
}

export interface ListOrderResponseDto {
  data: OrderResponseDto[];
  paginate: PaginateMetaDto;
}

export interface CreateAddressDto {
  detail: string;
  phoneNumber: string;
  name: string;
  isDefault: boolean;
}

export interface ListAddressResponseDto {
  data: AddressResponseDto[];
  paginate: PaginateMetaDto;
}

export interface UpdateAddressDto {
  detail: string;
  phoneNumber: string;
  name: string;
  isDefault: boolean;
}

export interface CreatePaymentDto {
  orderId: string;
}

export interface CreatePaymentResponseDto {
  id: string;
  amount: number;
  currency: string;
  qrImageUrl: string;
  /** @format date-time */
  createdAr: string;
}

export interface CheckPaymentStatusResponseDto {
  status: "not_yet" | "failed" | "success" | "pending" | "cancel";
}

export interface AskDto {
  question: string;
}

export interface AskResponseDto {
  answer: string;
}

export interface CreateReviewForOrderItemDto {
  rating: number;
  comment: string;
  images?: string[];
}

export interface UserReviewResponseDto {
  id: string;
  name: string;
  avatar: string;
}

export interface ReviewResponseDto {
  id: string;
  comment: string;
  rating: number;
  images: string[];
  user: UserReviewResponseDto;
  /** @format date-time */
  createdAt: string;
}

export interface ListReviewResponseDto {
  data: ReviewResponseDto[];
  paginate: PaginateMetaDto;
}

export interface ListVoucherResponseDto {
  data: VoucherResponseDto[];
  paginate: PaginateMetaDto;
}

export interface TakeVoucherDto {
  voucherId: string;
}

import type {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  HeadersDefaults,
  ResponseType,
} from "axios";
import axios from "axios";

export type QueryParamsType = Record<string | number, any>;

export interface FullRequestParams
  extends Omit<AxiosRequestConfig, "data" | "params" | "url" | "responseType"> {
  /** set parameter to `true` for call `securityWorker` for this request */
  secure?: boolean;
  /** request path */
  path: string;
  /** content type of request body */
  type?: ContentType;
  /** query params */
  query?: QueryParamsType;
  /** format of response (i.e. response.json() -> format: "json") */
  format?: ResponseType;
  /** request body */
  body?: unknown;
}

export type RequestParams = Omit<
  FullRequestParams,
  "body" | "method" | "query" | "path"
>;

export interface ApiConfig<SecurityDataType = unknown>
  extends Omit<AxiosRequestConfig, "data" | "cancelToken"> {
  securityWorker?: (
    securityData: SecurityDataType | null,
  ) => Promise<AxiosRequestConfig | void> | AxiosRequestConfig | void;
  secure?: boolean;
  format?: ResponseType;
}

export enum ContentType {
  Json = "application/json",
  JsonApi = "application/vnd.api+json",
  FormData = "multipart/form-data",
  UrlEncoded = "application/x-www-form-urlencoded",
  Text = "text/plain",
}

export class HttpClient<SecurityDataType = unknown> {
  public instance: AxiosInstance;
  private securityData: SecurityDataType | null = null;
  private securityWorker?: ApiConfig<SecurityDataType>["securityWorker"];
  private secure?: boolean;
  private format?: ResponseType;

  constructor({
    securityWorker,
    secure,
    format,
    ...axiosConfig
  }: ApiConfig<SecurityDataType> = {}) {
    this.instance = axios.create({
      ...axiosConfig,
      baseURL: axiosConfig.baseURL || "",
    });
    this.secure = secure;
    this.format = format;
    this.securityWorker = securityWorker;
  }

  public setSecurityData = (data: SecurityDataType | null) => {
    this.securityData = data;
  };

  protected mergeRequestParams(
    params1: AxiosRequestConfig,
    params2?: AxiosRequestConfig,
  ): AxiosRequestConfig {
    const method = params1.method || (params2 && params2.method);

    return {
      ...this.instance.defaults,
      ...params1,
      ...(params2 || {}),
      headers: {
        ...((method &&
          this.instance.defaults.headers[
            method.toLowerCase() as keyof HeadersDefaults
          ]) ||
          {}),
        ...(params1.headers || {}),
        ...((params2 && params2.headers) || {}),
      },
    };
  }

  protected stringifyFormItem(formItem: unknown) {
    if (typeof formItem === "object" && formItem !== null) {
      return JSON.stringify(formItem);
    } else {
      return `${formItem}`;
    }
  }

  protected createFormData(input: Record<string, unknown>): FormData {
    if (input instanceof FormData) {
      return input;
    }
    return Object.keys(input || {}).reduce((formData, key) => {
      const property = input[key];
      const propertyContent: any[] =
        property instanceof Array ? property : [property];

      for (const formItem of propertyContent) {
        const isFileType = formItem instanceof Blob || formItem instanceof File;
        formData.append(
          key,
          isFileType ? formItem : this.stringifyFormItem(formItem),
        );
      }

      return formData;
    }, new FormData());
  }

  public request = async <T = any, _E = any>({
    secure,
    path,
    type,
    query,
    format,
    body,
    ...params
  }: FullRequestParams): Promise<AxiosResponse<T>> => {
    const secureParams =
      ((typeof secure === "boolean" ? secure : this.secure) &&
        this.securityWorker &&
        (await this.securityWorker(this.securityData))) ||
      {};
    const requestParams = this.mergeRequestParams(params, secureParams);
    const responseFormat = format || this.format || undefined;

    if (
      type === ContentType.FormData &&
      body &&
      body !== null &&
      typeof body === "object"
    ) {
      body = this.createFormData(body as Record<string, unknown>);
    }

    if (
      type === ContentType.Text &&
      body &&
      body !== null &&
      typeof body !== "string"
    ) {
      body = JSON.stringify(body);
    }

    return this.instance.request({
      ...requestParams,
      headers: {
        ...(requestParams.headers || {}),
        ...(type ? { "Content-Type": type } : {}),
      },
      params: query,
      responseType: responseFormat,
      data: body,
      url: path,
    });
  };
}

/**
 * @title My Shop Documentation Swagger
 * @version 1.0
 * @contact
 *
 * My Shop API description
 */
export class Api<
  SecurityDataType extends unknown,
> extends HttpClient<SecurityDataType> {
  api = {
    /**
     * No description
     *
     * @tags Auth
     * @name AuthControllerRegister
     * @summary REGISTER ACCOUNT
     * @request POST:/api/v1/auth/register
     */
    authControllerRegister: (data: RegisterDto, params: RequestParams = {}) =>
      this.request<RegisterResponseDto, any>({
        path: `/api/v1/auth/register`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Auth
     * @name AuthControllerGoogleAuth
     * @summary LOGIN WITH GOOGLE
     * @request GET:/api/v1/auth/google
     */
    authControllerGoogleAuth: (params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/api/v1/auth/google`,
        method: "GET",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Auth
     * @name AuthControllerGoogleAuthCallback
     * @summary GOOGLE OAUTH CALLBACK
     * @request GET:/api/v1/auth/google/callback
     */
    authControllerGoogleAuthCallback: (params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/api/v1/auth/google/callback`,
        method: "GET",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Auth
     * @name AuthControllerVerifyRegister
     * @summary VERIFY REGISTER REQUEST
     * @request POST:/api/v1/auth/register/verify/{id}
     */
    authControllerVerifyRegister: (
      id: string,
      data: VerifyRegisterDto,
      params: RequestParams = {},
    ) =>
      this.request<SaveEntityResponseDto, any>({
        path: `/api/v1/auth/register/verify/${id}`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Auth
     * @name AuthControllerLogin
     * @summary LOGIN ACCOUNT
     * @request POST:/api/v1/auth/login
     */
    authControllerLogin: (data: LoginDto, params: RequestParams = {}) =>
      this.request<LoginResponseDto, any>({
        path: `/api/v1/auth/login`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Auth
     * @name AuthControllerLogout
     * @summary LOGOUT ACCOUNT
     * @request GET:/api/v1/auth/logout
     * @secure
     */
    authControllerLogout: (params: RequestParams = {}) =>
      this.request<SuccessResponseDto, any>({
        path: `/api/v1/auth/logout`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Auth
     * @name AuthControllerGetProfile
     * @summary GET MY PROFILE
     * @request GET:/api/v1/auth/profile
     * @secure
     */
    authControllerGetProfile: (params: RequestParams = {}) =>
      this.request<UserResponseDto, any>({
        path: `/api/v1/auth/profile`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Auth
     * @name AuthControllerRefreshToken
     * @summary REFRESH TOKEN
     * @request GET:/api/v1/auth/refresh-token
     * @secure
     */
    authControllerRefreshToken: (params: RequestParams = {}) =>
      this.request<RefreshTokenResponseDto, any>({
        path: `/api/v1/auth/refresh-token`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Auth
     * @name AuthControllerForgotPassword
     * @summary REQUEST FORGOT PASSWORD
     * @request POST:/api/v1/auth/forgot-password
     */
    authControllerForgotPassword: (
      data: ForgotPasswordDto,
      params: RequestParams = {},
    ) =>
      this.request<ForgotPasswordResponseDto, any>({
        path: `/api/v1/auth/forgot-password`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Auth
     * @name AuthControllerVerifyForgotPassword
     * @summary VERIFY FORGOT PASSWORD
     * @request POST:/api/v1/auth/forgot-password/verify/{token}
     */
    authControllerVerifyForgotPassword: (
      token: string,
      data: VerifyForgotPasswordDto,
      params: RequestParams = {},
    ) =>
      this.request<SuccessResponseDto, any>({
        path: `/api/v1/auth/forgot-password/verify/${token}`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Auth
     * @name AuthControllerChangePassword
     * @summary CHANGE PASSWORD
     * @request POST:/api/v1/auth/change-password
     * @secure
     */
    authControllerChangePassword: (
      data: ChangePasswordDto,
      params: RequestParams = {},
    ) =>
      this.request<ChangePasswordResponseDto, any>({
        path: `/api/v1/auth/change-password`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Auth
     * @name AuthControllerUploadAvatar
     * @summary UPLOAD AVATAR
     * @request POST:/api/v1/auth/upload
     * @secure
     */
    authControllerUploadAvatar: (data: UploadDto, params: RequestParams = {}) =>
      this.request<UploadResponseDto, any>({
        path: `/api/v1/auth/upload`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Auth
     * @name AuthControllerUpdateProfile
     * @summary UPDATE PROFILE
     * @request PUT:/api/v1/auth/update-profile
     * @secure
     */
    authControllerUpdateProfile: (
      data: UpdateProfileDto,
      params: RequestParams = {},
    ) =>
      this.request<SuccessResponseDto, any>({
        path: `/api/v1/auth/update-profile`,
        method: "PUT",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Auth
     * @name AuthControllerResendOtp
     * @summary RESEND OPT
     * @request POST:/api/v1/auth/resend-otp/{token}
     */
    authControllerResendOtp: (token: string, params: RequestParams = {}) =>
      this.request<SuccessResponseDto, any>({
        path: `/api/v1/auth/resend-otp/${token}`,
        method: "POST",
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags [USER/ADMIN] NOTIFICATION
     * @name NotificationControllerFindAll
     * @summary [USER/ADMIN] FIND ALL NOTIFICATION
     * @request GET:/api/v1/notification
     */
    notificationControllerFindAll: (
      query: {
        /**
         * Page number for pagination
         * @example 1
         */
        page?: number;
        /**
         * Number of item per page for page size
         * @example 10
         */
        pageSize: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<ListNotificationResponseDto, any>({
        path: `/api/v1/notification`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags [USER/ADMIN] NOTIFICATION
     * @name NotificationControllerGetTotalUnreadNotification
     * @summary [USER/ADMIN] GET TOTAL UNREAD NOTIFICATION
     * @request GET:/api/v1/notification/unread-count
     */
    notificationControllerGetTotalUnreadNotification: (
      params: RequestParams = {},
    ) =>
      this.request<TotalUnreadNotificationResponseDto, any>({
        path: `/api/v1/notification/unread-count`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags [USER/ADMIN] NOTIFICATION
     * @name NotificationControllerMarkAllRead
     * @summary [USER/ADMIN] MARK ALL READ
     * @request GET:/api/v1/notification/read
     */
    notificationControllerMarkAllRead: (params: RequestParams = {}) =>
      this.request<SuccessResponseDto, any>({
        path: `/api/v1/notification/read`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags [USER/ADMIN] NOTIFICATION
     * @name NotificationControllerMarkRead
     * @summary [USER/ADMIN] MARK READ
     * @request GET:/api/v1/notification/{notificationId}/read
     */
    notificationControllerMarkRead: (
      notificationId: string,
      params: RequestParams = {},
    ) =>
      this.request<SuccessResponseDto, any>({
        path: `/api/v1/notification/${notificationId}/read`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags [ADMIN] USER MANAGEMENT
     * @name AdminUserControllerFindAll
     * @summary [ADMIN] GET LIST USER
     * @request GET:/api/v1/user
     * @secure
     */
    adminUserControllerFindAll: (
      query: {
        /**
         * Page number for pagination
         * @example 1
         */
        page?: number;
        /**
         * Number of item per page for page size
         * @example 10
         */
        pageSize: number;
        search?: string;
        roleType?: "admin" | "user";
        sortBy?: "name" | "email" | "phoneNumber" | "gender" | "createdAt";
        sortOrder?: "DESC" | "ASC";
      },
      params: RequestParams = {},
    ) =>
      this.request<UserListResponseDto, any>({
        path: `/api/v1/user`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags [ADMIN] USER MANAGEMENT
     * @name AdminUserControllerCreate
     * @summary [ADMIN] CREATE INTERNAL ACCOUNT
     * @request POST:/api/v1/user
     * @secure
     */
    adminUserControllerCreate: (
      data: AdminCreateUserDto,
      params: RequestParams = {},
    ) =>
      this.request<SuccessResponseDto, any>({
        path: `/api/v1/user`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags [ADMIN] CATEGORIES MANAGEMANT
     * @name AdminCategoriesControllerCreate
     * @summary [ADMIN] CREATE CATEGORY
     * @request POST:/api/v1/admin/categories
     * @secure
     */
    adminCategoriesControllerCreate: (
      data: SaveCategoryDto,
      params: RequestParams = {},
    ) =>
      this.request<any, SaveEntityResponseDto>({
        path: `/api/v1/admin/categories`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags [ADMIN] CATEGORIES MANAGEMANT
     * @name AdminCategoriesControllerFindAll
     * @summary [ADMIN] GET LIST CATEGORIES
     * @request GET:/api/v1/admin/categories
     * @secure
     */
    adminCategoriesControllerFindAll: (
      query: {
        /**
         * Page number for pagination
         * @example 1
         */
        page?: number;
        /**
         * Number of item per page for page size
         * @example 10
         */
        pageSize: number;
        /** Keyword for search */
        search?: string;
        /** Available field for sort */
        sortBy?: "title" | "createdAt";
        /** Availabel order direaction for sort */
        orderBy?: "DESC" | "ASC";
      },
      params: RequestParams = {},
    ) =>
      this.request<any, ListCategoryResponseDto>({
        path: `/api/v1/admin/categories`,
        method: "GET",
        query: query,
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags [ADMIN] CATEGORIES MANAGEMANT
     * @name AdminCategoriesControllerUpload
     * @summary [ADMIN] UPLOAD CATEGORY IMAGE
     * @request POST:/api/v1/admin/categories/upload
     * @secure
     */
    adminCategoriesControllerUpload: (
      data: UploadDto,
      params: RequestParams = {},
    ) =>
      this.request<any, UploadResponseDto>({
        path: `/api/v1/admin/categories/upload`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags [USER] CATEGORY
     * @name CategoriesControllerFindAll
     * @summary [USER] GET LIST CATEGORIES
     * @request GET:/api/v1/category
     */
    categoriesControllerFindAll: (
      query: {
        /**
         * Page number for pagination
         * @example 1
         */
        page?: number;
        /**
         * Number of item per page for page size
         * @example 10
         */
        pageSize: number;
        /** Keyword for search */
        search?: string;
        /** Available field for sort */
        sortBy?: "title" | "createdAt";
        /** Availabel order direaction for sort */
        orderBy?: "DESC" | "ASC";
      },
      params: RequestParams = {},
    ) =>
      this.request<any, ListCategoryResponseDto>({
        path: `/api/v1/category`,
        method: "GET",
        query: query,
        ...params,
      }),

    /**
     * No description
     *
     * @tags [ADMIN] PRODUCT MANAGEMENT
     * @name AdminProductControllerCreate
     * @summary [ADMIN] CREATE PRODUCT
     * @request POST:/api/v1/admin/product
     * @secure
     */
    adminProductControllerCreate: (
      data: CreateProductDto,
      params: RequestParams = {},
    ) =>
      this.request<SaveUuidResponseDto, any>({
        path: `/api/v1/admin/product`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags [ADMIN] PRODUCT MANAGEMENT
     * @name AdminProductControllerFindAll
     * @summary [ADMIN] FIND LIST PRODUCT
     * @request GET:/api/v1/admin/product
     * @secure
     */
    adminProductControllerFindAll: (
      query: {
        /**
         * Page number for pagination
         * @example 1
         */
        page?: number;
        /**
         * Number of item per page for page size
         * @example 10
         */
        pageSize: number;
        categoriesIds?: number[];
        search?: string;
        sortBy?: "name" | "description" | "status" | "createdAt" | "updatedAt";
        sortOrder?: "DESC" | "ASC";
      },
      params: RequestParams = {},
    ) =>
      this.request<ListProductResponseDto, any>({
        path: `/api/v1/admin/product`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags [ADMIN] PRODUCT MANAGEMENT
     * @name AdminProductControllerFindOne
     * @summary [ADMIN] FIND ONE PRODUCT BY ID
     * @request GET:/api/v1/admin/product/{id}
     * @secure
     */
    adminProductControllerFindOne: (id: string, params: RequestParams = {}) =>
      this.request<AdminProductDetailResponseDto, any>({
        path: `/api/v1/admin/product/${id}`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags [ADMIN] PRODUCT MANAGEMENT
     * @name AdminProductControllerUpdate
     * @summary [ADMIN] UPDATE PRODUCT BY ID
     * @request PUT:/api/v1/admin/product/{id}
     * @secure
     */
    adminProductControllerUpdate: (
      id: string,
      data: UpdateProductDto,
      params: RequestParams = {},
    ) =>
      this.request<SuccessResponseDto, any>({
        path: `/api/v1/admin/product/${id}`,
        method: "PUT",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags [ADMIN] PRODUCT MANAGEMENT
     * @name AdminProductControllerUpdateStatus
     * @summary [ADMIN] UPDATE PRODUCT STATUS BY ID
     * @request PATCH:/api/v1/admin/product/{id}
     * @secure
     */
    adminProductControllerUpdateStatus: (
      id: string,
      data: UpdateProductStatusDto,
      params: RequestParams = {},
    ) =>
      this.request<SaveUuidResponseDto, any>({
        path: `/api/v1/admin/product/${id}`,
        method: "PATCH",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags [ADMIN] PRODUCT MANAGEMENT
     * @name AdminProductControllerUploadProductImage
     * @summary [ADMIN] GET PRESIGN UPLOAD PRODUCT IMAGE
     * @request POST:/api/v1/admin/product/image/upload
     * @secure
     */
    adminProductControllerUploadProductImage: (
      data: UploadDto,
      params: RequestParams = {},
    ) =>
      this.request<UploadResponseDto, any>({
        path: `/api/v1/admin/product/image/upload`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags [ADMIN] PRODUCT MANAGEMENT
     * @name AdminProductControllerCreateVariant
     * @summary [ADMIN] CREATE VARIANT
     * @request POST:/api/v1/admin/product/option/variant
     * @secure
     */
    adminProductControllerCreateVariant: (
      data: CreateVariantDto,
      params: RequestParams = {},
    ) =>
      this.request<SuccessResponseDto, any>({
        path: `/api/v1/admin/product/option/variant`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags [ADMIN] PRODUCT MANAGEMENT
     * @name AdminProductControllerFindAllVariant
     * @summary [ADMIN] GET LIST VARIANT
     * @request GET:/api/v1/admin/product/option/variant
     * @secure
     */
    adminProductControllerFindAllVariant: (
      query: {
        /**
         * Page number for pagination
         * @example 1
         */
        page?: number;
        /**
         * Number of item per page for page size
         * @example 10
         */
        pageSize: number;
        /** @example "Size" */
        keyword?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<ListVariantResponseDto, any>({
        path: `/api/v1/admin/product/option/variant`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags [ADMIN] PRODUCT MANAGEMENT
     * @name AdminProductControllerCreateVariantValue
     * @summary [ADMIN] CREATE VARIANT VALUE BY VARIANT ID
     * @request POST:/api/v1/admin/product/option/variant-value
     * @secure
     */
    adminProductControllerCreateVariantValue: (
      data: CreateVariantValueDto,
      params: RequestParams = {},
    ) =>
      this.request<SuccessResponseDto, any>({
        path: `/api/v1/admin/product/option/variant-value`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags [ADMIN] PRODUCT MANAGEMENT
     * @name AdminProductControllerFindAllVariantValue
     * @summary [ADMIN] GET LIST VARIANT VALUE
     * @request GET:/api/v1/admin/product/option/variant-value
     * @secure
     */
    adminProductControllerFindAllVariantValue: (
      query: {
        /**
         * Page number for pagination
         * @example 1
         */
        page?: number;
        /**
         * Number of item per page for page size
         * @example 10
         */
        pageSize: number;
        /** @example "M" */
        keyword?: string;
        /** @example 1 */
        variantId: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<ListVariantValueResponseDto, any>({
        path: `/api/v1/admin/product/option/variant-value`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags [ADMIN] CHAT
     * @name AdminChatControllerGetListConversation
     * @summary [ADMIN] GET LIST CONVERSATION
     * @request GET:/api/v1/admin-chat/conversation
     * @secure
     */
    adminChatControllerGetListConversation: (
      query: {
        /**
         * Page number for pagination
         * @example 1
         */
        page?: number;
        /**
         * Number of item per page for page size
         * @example 10
         */
        pageSize: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<AdminListConversationResponseDto, any>({
        path: `/api/v1/admin-chat/conversation`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags [ADMIN] CHAT
     * @name AdminChatControllerGetListMessages
     * @summary [ADMIN] GET LIST MESSAGES BY CONVERSATION ID
     * @request GET:/api/v1/admin-chat/conversation/{id}/messages
     * @secure
     */
    adminChatControllerGetListMessages: (
      id: string,
      query: {
        /**
         * Page number for pagination
         * @example 1
         */
        page?: number;
        /**
         * Number of item per page for page size
         * @example 10
         */
        pageSize: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<ListMessageResponseDto, any>({
        path: `/api/v1/admin-chat/conversation/${id}/messages`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags [ADMIN] CHAT
     * @name AdminChatControllerCreateMessage
     * @summary [ADMIN] CREATE MESSAGE
     * @request POST:/api/v1/admin-chat/message
     * @secure
     */
    adminChatControllerCreateMessage: (
      data: CreateMessageDto,
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/api/v1/admin-chat/message`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags CHAT
     * @name ChatControllerCreateConversation
     * @summary CREATE CONVERSATION
     * @request POST:/api/v1/chat/conversation
     * @secure
     */
    chatControllerCreateConversation: (params: RequestParams = {}) =>
      this.request<SuccessResponseDto, any>({
        path: `/api/v1/chat/conversation`,
        method: "POST",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags CHAT
     * @name ChatControllerGetConversation
     * @summary [USER] GET CONVERSATION
     * @request GET:/api/v1/chat/conversation
     * @secure
     */
    chatControllerGetConversation: (params: RequestParams = {}) =>
      this.request<ConversationResponseDto, any>({
        path: `/api/v1/chat/conversation`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags CHAT
     * @name ChatControllerGetListMessages
     * @summary [USER] GET LIST MESSAGES
     * @request GET:/api/v1/chat/message
     * @secure
     */
    chatControllerGetListMessages: (
      query: {
        /**
         * Page number for pagination
         * @example 1
         */
        page?: number;
        /**
         * Number of item per page for page size
         * @example 10
         */
        pageSize: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<ListMessageResponseDto, any>({
        path: `/api/v1/chat/message`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags CHAT
     * @name ChatControllerCreateMessage
     * @summary CREATE MESSAGE
     * @request POST:/api/v1/chat/message
     * @secure
     */
    chatControllerCreateMessage: (
      data: CreateMessageDto,
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/api/v1/chat/message`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags CHAT
     * @name ChatControllerFindOneConversation
     * @summary GET DETAIL CONVERSATION
     * @request GET:/api/v1/chat/{id}
     * @secure
     */
    chatControllerFindOneConversation: (
      id: string,
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/api/v1/chat/${id}`,
        method: "GET",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags [ADMIN] ORDER
     * @name AdminOrderControllerFindAll
     * @summary [ADMIN] FIND ALL ORDER
     * @request GET:/api/v1/admin-order
     * @secure
     */
    adminOrderControllerFindAll: (
      query: {
        /**
         * Page number for pagination
         * @example 1
         */
        page?: number;
        /**
         * Number of item per page for page size
         * @example 10
         */
        pageSize: number;
        search?: string;
        orderStatusFilter?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<AdminListOrderResponseDto, any>({
        path: `/api/v1/admin-order`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags [ADMIN] ORDER
     * @name AdminOrderControllerGetOrderStatic
     * @summary [ADMIN] ORDER STATIC
     * @request GET:/api/v1/admin-order/static
     * @secure
     */
    adminOrderControllerGetOrderStatic: (params: RequestParams = {}) =>
      this.request<AdminOrderStaticResponseDto, any>({
        path: `/api/v1/admin-order/static`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags [ADMIN] ORDER
     * @name AdminOrderControllerFindOne
     * @summary [ADMIN] FIND ONE ORDER BY ID
     * @request GET:/api/v1/admin-order/{id}
     * @secure
     */
    adminOrderControllerFindOne: (id: string, params: RequestParams = {}) =>
      this.request<AdminOrderDetailResponseDto, any>({
        path: `/api/v1/admin-order/${id}`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags [ADMIN] ORDER
     * @name AdminOrderControllerUpdateOrderStatus
     * @summary [ADMIN] UPDATE ORDER STATUS
     * @request PUT:/api/v1/admin-order/{id}/status
     * @secure
     */
    adminOrderControllerUpdateOrderStatus: (
      id: string,
      data: AdminUpdateOrderStatusDto,
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/api/v1/admin-order/${id}/status`,
        method: "PUT",
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags [ADMIN] ORDER
     * @name AdminOrderControllerUpdatePaymentStatus
     * @summary [ADMIN] UPDATE PAYMENT STATUS
     * @request PUT:/api/v1/admin-order/{id}/payment-status
     * @secure
     */
    adminOrderControllerUpdatePaymentStatus: (
      id: string,
      data: AdminUpdateOrderPaymentStatusDto,
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/api/v1/admin-order/${id}/payment-status`,
        method: "PUT",
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags [ADMIN] CHATBOT
     * @name AdminChatbotControllerCreate
     * @summary [ADMIN] CREATE FAQ
     * @request POST:/api/v1/admin-chatbot
     * @secure
     */
    adminChatbotControllerCreate: (
      data: CreateFaqDto,
      params: RequestParams = {},
    ) =>
      this.request<SuccessResponseDto, any>({
        path: `/api/v1/admin-chatbot`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags [ADMIN] CHATBOT
     * @name AdminChatbotControllerFindAll
     * @summary [ADMIN] FIND ALL FAQ
     * @request GET:/api/v1/admin-chatbot
     * @secure
     */
    adminChatbotControllerFindAll: (
      query: {
        /**
         * Page number for pagination
         * @example 1
         */
        page?: number;
        /**
         * Number of item per page for page size
         * @example 10
         */
        pageSize: number;
        search?: string;
        typeFilter?:
          | "Chính sách đổi trả"
          | "Vận chuyển"
          | "Thanh toán"
          | "Sản phẩm"
          | "Tài khoản"
          | "Khuyến mãi"
          | "Chăm sóc khách hàng"
          | "Đặt hàng"
          | "Bảo mật"
          | "Thành viên"
          | "Nước hoa";
        sortBy?: "question" | "answer" | "type";
        sortOrder?: "DESC" | "ASC";
      },
      params: RequestParams = {},
    ) =>
      this.request<AdminListFaqResponseDto, any>({
        path: `/api/v1/admin-chatbot`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags [ADMIN] CHATBOT
     * @name AdminChatbotControllerRetraining
     * @summary [ADMIN] RETRAINING MODEL
     * @request POST:/api/v1/admin-chatbot/retraining
     * @secure
     */
    adminChatbotControllerRetraining: (params: RequestParams = {}) =>
      this.request<SuccessResponseDto, any>({
        path: `/api/v1/admin-chatbot/retraining`,
        method: "POST",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags [ADMIN] CHATBOT
     * @name AdminChatbotControllerDelete
     * @summary [ADMIN] DELETE FAQ
     * @request DELETE:/api/v1/admin-chatbot/{id}
     * @secure
     */
    adminChatbotControllerDelete: (
      id: string,
      query: {
        id: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<SuccessResponseDto, any>({
        path: `/api/v1/admin-chatbot/${id}`,
        method: "DELETE",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags [ADMIN] CHATBOT
     * @name AdminChatbotControllerUpdate
     * @summary [ADMIN] UPDATE FAQ
     * @request PUT:/api/v1/admin-chatbot/{id}
     * @secure
     */
    adminChatbotControllerUpdate: (
      id: string,
      query: {
        id: number;
      },
      data: CreateFaqDto,
      params: RequestParams = {},
    ) =>
      this.request<SuccessResponseDto, any>({
        path: `/api/v1/admin-chatbot/${id}`,
        method: "PUT",
        query: query,
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags [ADMIN] CHATBOT
     * @name AdminChatbotControllerGetSummary
     * @summary [ADMIN] GET FAQ SUMMARY
     * @request GET:/api/v1/admin-chatbot/summary
     * @secure
     */
    adminChatbotControllerGetSummary: (params: RequestParams = {}) =>
      this.request<AdminFaqSummaryResponseDto, any>({
        path: `/api/v1/admin-chatbot/summary`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags [ADMIN] CHATBOT
     * @name AdminChatbotControllerDownloadTemplate
     * @summary [ADMIN] DOWNLOAD EXCEL FILE TEMPLATE
     * @request GET:/api/v1/admin-chatbot/download-template
     * @secure
     */
    adminChatbotControllerDownloadTemplate: (params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/api/v1/admin-chatbot/download-template`,
        method: "GET",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags [ADMIN] CHATBOT
     * @name AdminChatbotControllerUploadFaqFile
     * @summary [ADMIN] UPLOAD FAQ
     * @request POST:/api/v1/admin-chatbot/upload-faq
     * @secure
     */
    adminChatbotControllerUploadFaqFile: (
      data: {
        /** @format binary */
        file?: File;
      },
      params: RequestParams = {},
    ) =>
      this.request<SuccessResponseDto, any>({
        path: `/api/v1/admin-chatbot/upload-faq`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.FormData,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags ADMIN DASHBOARD
     * @name AdminDashboardControllerGetDashboardStatistic
     * @summary [ADMIN] DASHBOARD STATIC
     * @request GET:/api/v1/admin-dashboard/statistic
     * @secure
     */
    adminDashboardControllerGetDashboardStatistic: (
      query?: {
        statisticBy?: "day" | "month" | "year";
      },
      params: RequestParams = {},
    ) =>
      this.request<AdminDashboardStatisticResponseDto, any>({
        path: `/api/v1/admin-dashboard/statistic`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags ADMIN DASHBOARD
     * @name AdminDashboardControllerGetLastThirtyDayChartData
     * @summary [ADMIN] GET LAST 30 DAY REVENUE CHART DATA
     * @request GET:/api/v1/admin-dashboard/chart-data
     * @secure
     */
    adminDashboardControllerGetLastThirtyDayChartData: (
      params: RequestParams = {},
    ) =>
      this.request<AdminRevenueResponseDto[], any>({
        path: `/api/v1/admin-dashboard/chart-data`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags ADMIN DASHBOARD
     * @name AdminDashboardControllerGetPendingOrder
     * @summary [ADMIN] OVERVIEW PENDING ORDER
     * @request GET:/api/v1/admin-dashboard/pending-order
     * @secure
     */
    adminDashboardControllerGetPendingOrder: (params: RequestParams = {}) =>
      this.request<AdminDashboardPendingOrderResponseDto[], any>({
        path: `/api/v1/admin-dashboard/pending-order`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags ADMIN VOUCHER
     * @name AdminVoucherControllerCreate
     * @summary [ADMIN] CREATE VOUCHER
     * @request POST:/api/v1/admin-voucher
     * @secure
     */
    adminVoucherControllerCreate: (
      data: AdminCreateVoucherDto,
      params: RequestParams = {},
    ) =>
      this.request<SuccessResponseDto, any>({
        path: `/api/v1/admin-voucher`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags ADMIN VOUCHER
     * @name AdminVoucherControllerFindAll
     * @summary [ADMIN] FIND ALL VOUCHER
     * @request GET:/api/v1/admin-voucher
     * @secure
     */
    adminVoucherControllerFindAll: (
      query: {
        /**
         * Page number for pagination
         * @example 1
         */
        page?: number;
        /**
         * Number of item per page for page size
         * @example 10
         */
        pageSize: number;
        search?: string;
        typeFilter?: "fixed" | "percent";
      },
      params: RequestParams = {},
    ) =>
      this.request<AdminListVoucherResponseDto, any>({
        path: `/api/v1/admin-voucher`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags ADMIN ROLE PERMISSION
     * @name AdminRolePermissionControllerFindAll
     * @summary ADMIN FIND ALL ROLE PERMISSION
     * @request GET:/api/v1/admin-role-permission
     * @secure
     */
    adminRolePermissionControllerFindAll: (
      query: {
        /**
         * Page number for pagination
         * @example 1
         */
        page?: number;
        /**
         * Number of item per page for page size
         * @example 10
         */
        pageSize: number;
        role?:
          | "Admin"
          | "User"
          | "Product Manager"
          | "Order Manager"
          | "Technician";
        module?:
          | "Product"
          | "User"
          | "Category"
          | "Order"
          | "Voucher"
          | "Chatbot"
          | "Location";
      },
      params: RequestParams = {},
    ) =>
      this.request<AdminListRolePermissionResponseDto, any>({
        path: `/api/v1/admin-role-permission`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags ADMIN ROLE PERMISSION
     * @name AdminRolePermissionControllerUpdateList
     * @summary ADMIN UPDATE LIST ROLE PERMISSION
     * @request POST:/api/v1/admin-role-permission
     * @secure
     */
    adminRolePermissionControllerUpdateList: (
      data: UpdateRolePermissionDto[],
      params: RequestParams = {},
    ) =>
      this.request<SuccessResponseDto, any>({
        path: `/api/v1/admin-role-permission`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags ADMIN LOCATION
     * @name AdminLocationControllerCreate
     * @summary [ADMIN] CREATE LOCATION
     * @request POST:/api/v1/admin-location
     * @secure
     */
    adminLocationControllerCreate: (
      data: AdminCreateLocationDto,
      params: RequestParams = {},
    ) =>
      this.request<SuccessResponseDto, any>({
        path: `/api/v1/admin-location`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags ADMIN LOCATION
     * @name AdminLocationControllerFindAll
     * @summary [ADMIN] FIND ALL LOCATION
     * @request GET:/api/v1/admin-location
     * @secure
     */
    adminLocationControllerFindAll: (
      query: {
        /**
         * Page number for pagination
         * @example 1
         */
        page?: number;
        /**
         * Number of item per page for page size
         * @example 10
         */
        pageSize: number;
        search?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<AdminListLocationResponseDto, any>({
        path: `/api/v1/admin-location`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags ADMIN LOCATION
     * @name AdminLocationControllerUpdate
     * @summary [ADMIN] UPDATE LOCATION
     * @request PUT:/api/v1/admin-location/{id}
     * @secure
     */
    adminLocationControllerUpdate: (
      id: string,
      data: AdminUpdateLocationDto,
      params: RequestParams = {},
    ) =>
      this.request<SuccessResponseDto, any>({
        path: `/api/v1/admin-location/${id}`,
        method: "PUT",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags [USER] CART
     * @name CartControllerAddItemToCart
     * @summary [USER] ADD PRODUCT TO CART
     * @request POST:/api/v1/carts
     * @secure
     */
    cartControllerAddItemToCart: (
      data: AddItemToCartDto,
      params: RequestParams = {},
    ) =>
      this.request<SuccessResponseDto, any>({
        path: `/api/v1/carts`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags [USER] CART
     * @name CartControllerGetCartSummary
     * @summary [USER] GET CART SUMMARY
     * @request GET:/api/v1/carts
     * @secure
     */
    cartControllerGetCartSummary: (params: RequestParams = {}) =>
      this.request<CartSummaryResponseDto, any>({
        path: `/api/v1/carts`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags [USER] CART
     * @name CartControllerGetAllCartItem
     * @summary [USER] GET LIST CART ITEM
     * @request GET:/api/v1/carts/cart-item
     * @secure
     */
    cartControllerGetAllCartItem: (
      query: {
        /**
         * Page number for pagination
         * @example 1
         */
        page?: number;
        /**
         * Number of item per page for page size
         * @example 10
         */
        pageSize: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<ListCartItemResponseDto, any>({
        path: `/api/v1/carts/cart-item`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags [USER] CART
     * @name CartControllerUpdateQuantityCartItem
     * @summary [USER] UPDATE QUANTITY CART ITEM
     * @request PATCH:/api/v1/carts/cart-item/{id}/quantity
     * @secure
     */
    cartControllerUpdateQuantityCartItem: (
      id: string,
      data: UpdateQuantityCartItemDto,
      params: RequestParams = {},
    ) =>
      this.request<SuccessResponseDto, any>({
        path: `/api/v1/carts/cart-item/${id}/quantity`,
        method: "PATCH",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags [USER] CART
     * @name CartControllerUpdateProductVariantCartItem
     * @summary [USER] UPDATE PRODUCT VARIANT CART ITEM
     * @request PATCH:/api/v1/carts/cart-item/{id}/product-variant
     * @secure
     */
    cartControllerUpdateProductVariantCartItem: (
      id: string,
      data: UpdateProductVariantCartItemDto,
      params: RequestParams = {},
    ) =>
      this.request<SuccessResponseDto, any>({
        path: `/api/v1/carts/cart-item/${id}/product-variant`,
        method: "PATCH",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags [USER] CART
     * @name CartControllerDeleteCartItem
     * @summary [USER] DELETE CART ITEM
     * @request DELETE:/api/v1/carts/cart-item/{id}
     * @secure
     */
    cartControllerDeleteCartItem: (id: string, params: RequestParams = {}) =>
      this.request<SuccessResponseDto, any>({
        path: `/api/v1/carts/cart-item/${id}`,
        method: "DELETE",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags [USER] PRODUCT
     * @name ProductControllerFindAll
     * @summary [USER] FIND ALL PRODUCT
     * @request GET:/api/v1/product
     */
    productControllerFindAll: (
      query: {
        /**
         * Page number for pagination
         * @example 1
         */
        page?: number;
        /**
         * Number of item per page for page size
         * @example 10
         */
        pageSize: number;
        search?: string;
        categoryIds?: number[];
        sortBy?: "name" | "createdAt" | "updatedAt" | "price";
        sortOrder?: "DESC" | "ASC";
        lowPrice?: number;
        highPrice?: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<ListUserProductResponseDto, any>({
        path: `/api/v1/product`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags [USER] PRODUCT
     * @name ProductControllerFindOne
     * @summary [USER] FIND ONE PRODUCT
     * @request GET:/api/v1/product/{id}
     */
    productControllerFindOne: (id: string, params: RequestParams = {}) =>
      this.request<ProductDetailResponseDto, any>({
        path: `/api/v1/product/${id}`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags [USER] PRODUCT
     * @name ProductControllerGetProductVariantValue
     * @summary [USER] GET VARIANT VALUE OF PRODUCT
     * @request GET:/api/v1/product/{id}/variant-value
     */
    productControllerGetProductVariantValue: (
      id: string,
      params: RequestParams = {},
    ) =>
      this.request<ProductVariantValueResponseDto[], any>({
        path: `/api/v1/product/${id}/variant-value`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags [USER] ORDER
     * @name OrderControllerCreateOrderFromCart
     * @summary [USER] CREATE ORDER
     * @request POST:/api/v1/order
     * @secure
     */
    orderControllerCreateOrderFromCart: (
      data: CreateOrderFromCartDto,
      params: RequestParams = {},
    ) =>
      this.request<SaveUuidResponseDto, any>({
        path: `/api/v1/order`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags [USER] ORDER
     * @name OrderControllerGetAllOrder
     * @summary [USER] GET ALL ORDER
     * @request GET:/api/v1/order
     * @secure
     */
    orderControllerGetAllOrder: (
      query: {
        /**
         * Page number for pagination
         * @example 1
         */
        page?: number;
        /**
         * Number of item per page for page size
         * @example 10
         */
        pageSize: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<ListOrderResponseDto, any>({
        path: `/api/v1/order`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags [USER] ORDER
     * @name OrderControllerCancelQrOrder
     * @summary [USER] CANCEL QR ORDER
     * @request POST:/api/v1/order/{orderId}/cancel
     * @secure
     */
    orderControllerCancelQrOrder: (
      orderId: string,
      params: RequestParams = {},
    ) =>
      this.request<SuccessResponseDto, any>({
        path: `/api/v1/order/${orderId}/cancel`,
        method: "POST",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags [USER] ADDRESS
     * @name AddressControllerCreate
     * @summary [USER] CREATE ADDRESS
     * @request POST:/api/v1/address
     * @secure
     */
    addressControllerCreate: (
      data: CreateAddressDto,
      params: RequestParams = {},
    ) =>
      this.request<SuccessResponseDto, any>({
        path: `/api/v1/address`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags [USER] ADDRESS
     * @name AddressControllerFindAll
     * @summary [USER] GET ALL ADDRESS
     * @request GET:/api/v1/address
     * @secure
     */
    addressControllerFindAll: (
      query: {
        /**
         * Page number for pagination
         * @example 1
         */
        page?: number;
        /**
         * Number of item per page for page size
         * @example 10
         */
        pageSize: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<ListAddressResponseDto, any>({
        path: `/api/v1/address`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags [USER] ADDRESS
     * @name AddressControllerUpdate
     * @summary [USER] UPDATE ADDRESS
     * @request PUT:/api/v1/address/{id}
     * @secure
     */
    addressControllerUpdate: (
      id: string,
      data: UpdateAddressDto,
      params: RequestParams = {},
    ) =>
      this.request<SuccessResponseDto, any>({
        path: `/api/v1/address/${id}`,
        method: "PUT",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags [USER] ADDRESS
     * @name AddressControllerUpdateToDefault
     * @summary [USER] UPDATE TO DEFAULT ADDRESS
     * @request PUT:/api/v1/address/{id}/default
     * @secure
     */
    addressControllerUpdateToDefault: (
      id: string,
      params: RequestParams = {},
    ) =>
      this.request<SuccessResponseDto, any>({
        path: `/api/v1/address/${id}/default`,
        method: "PUT",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags [USER] PAYMENT
     * @name PaymentControllerCreate
     * @summary [USER] CREATE PAYMENT
     * @request POST:/api/v1/payment
     * @secure
     */
    paymentControllerCreate: (
      data: CreatePaymentDto,
      params: RequestParams = {},
    ) =>
      this.request<CreatePaymentResponseDto, any>({
        path: `/api/v1/payment`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags [USER] PAYMENT
     * @name PaymentControllerCheckPaymentStatus
     * @summary [USER] CHECK PAYMENT STATUS
     * @request GET:/api/v1/payment/{id}/status
     * @secure
     */
    paymentControllerCheckPaymentStatus: (
      id: string,
      params: RequestParams = {},
    ) =>
      this.request<CheckPaymentStatusResponseDto, any>({
        path: `/api/v1/payment/${id}/status`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags PaymentWebhook
     * @name PaymentWebhookControllerPayment
     * @summary [WEBHOOK] RECEIVED PAYMENT INFORMATION
     * @request POST:/api/v1/webhook/payment
     */
    paymentWebhookControllerPayment: (params: RequestParams = {}) =>
      this.request<SuccessResponseDto, any>({
        path: `/api/v1/webhook/payment`,
        method: "POST",
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags [USER] CHATBOT
     * @name ChatbotControllerAsk
     * @summary [USER] ASK QUESTION
     * @request POST:/api/v1/chatbot/ask
     */
    chatbotControllerAsk: (data: AskDto, params: RequestParams = {}) =>
      this.request<AskResponseDto, any>({
        path: `/api/v1/chatbot/ask`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags [USER] REVIEW
     * @name ReviewControllerCreateReviewForOrderItem
     * @summary [USER] CREATE REVIEW FOR ORDER ITEM
     * @request POST:/api/v1/review/{orderId}/{orderItemId}
     * @secure
     */
    reviewControllerCreateReviewForOrderItem: (
      orderId: string,
      orderItemId: string,
      data: CreateReviewForOrderItemDto,
      params: RequestParams = {},
    ) =>
      this.request<SuccessResponseDto, any>({
        path: `/api/v1/review/${orderId}/${orderItemId}`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags [USER] REVIEW
     * @name ReviewControllerFindAllReviewOfProduct
     * @summary [USER/ADMIN] GET ALL REVIEW OF PRODUCT
     * @request GET:/api/v1/review/{productId}
     * @secure
     */
    reviewControllerFindAllReviewOfProduct: (
      productId: string,
      query: {
        /**
         * Page number for pagination
         * @example 1
         */
        page?: number;
        /**
         * Number of item per page for page size
         * @example 10
         */
        pageSize: number;
        rating?: number;
        hasImages?: "true" | "false";
      },
      params: RequestParams = {},
    ) =>
      this.request<ListReviewResponseDto, any>({
        path: `/api/v1/review/${productId}`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags USER VOUCHER
     * @name VoucherControllerFindAll
     * @summary [USER] FIND ALL VOUCHER
     * @request GET:/api/v1/voucher
     * @secure
     */
    voucherControllerFindAll: (
      query: {
        /**
         * Page number for pagination
         * @example 1
         */
        page?: number;
        /**
         * Number of item per page for page size
         * @example 10
         */
        pageSize: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<ListVoucherResponseDto, any>({
        path: `/api/v1/voucher`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags USER VOUCHER
     * @name VoucherControllerTakeVoucher
     * @summary [USER] TAKE VOUCHER
     * @request POST:/api/v1/voucher
     * @secure
     */
    voucherControllerTakeVoucher: (
      data: TakeVoucherDto,
      params: RequestParams = {},
    ) =>
      this.request<SuccessResponseDto, any>({
        path: `/api/v1/voucher`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags USER VOUCHER
     * @name VoucherControllerFindAllPersonalVoucher
     * @summary [USER] FIND ALL PERSONAL VOUCHER
     * @request GET:/api/v1/voucher/personal
     * @secure
     */
    voucherControllerFindAllPersonalVoucher: (
      query: {
        /**
         * Page number for pagination
         * @example 1
         */
        page?: number;
        /**
         * Number of item per page for page size
         * @example 10
         */
        pageSize: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<ListVoucherResponseDto, any>({
        path: `/api/v1/voucher/personal`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags ROLE PERMISSION
     * @name RolePermissionControllerGetSelfRolePermission
     * @summary [COMMON] GET SELF ROLE PERMISSION
     * @request GET:/api/v1/role-permission/self
     * @secure
     */
    rolePermissionControllerGetSelfRolePermission: (
      params: RequestParams = {},
    ) =>
      this.request<AdminRolePermissionResponseDto[], any>({
        path: `/api/v1/role-permission/self`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),
  };
}
