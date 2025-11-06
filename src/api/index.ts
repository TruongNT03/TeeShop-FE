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

export interface RoleResponseDto {
  id: number;
  name: string;
  /** @format date-time */
  createdAt: string;
  /** @format date-time */
  updatedAt: string;
}

export interface UserResponseDto {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  avatar: string;
  roles: RoleResponseDto[];
  createdAt: string;
  updatedAt: string;
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
  newPassword: string;
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
  firstName: string;
  lastName: string;
  avatar: string;
}

export interface PaginateMetaDto {
  page: number;
  pageSize: number;
  totalItem: number;
  totalPage: number;
}

export interface UserListResponseDto {
  data: UserResponseDto[];
  paginate: PaginateMetaDto;
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

export interface ProductVariantResponseDto {
  /** @example "377a5d99-ee6d-4e6f-9197-713e0699ac93" */
  id: string;
  /** @example 1000 */
  price: number;
  /** @example "AO-THUN-001" */
  sku: string;
  /** @example 50 */
  stock: number;
  variantValues: VariantValuesResponseDto[];
}

export interface ProductResponseDto {
  /** @example "377a5d99-ee6d-4e6f-9197-713e0699ac93" */
  id: string;
  /** @example "Áo thun nam" */
  name: string;
  /** @example "Chất liệu cao cấp" */
  description: string;
  status: "unpublished" | "published";
  hasVariant: boolean;
  productVariants: ProductVariantResponseDto[];
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
  data: ProductResponseDto[];
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

export interface ProductDetailResponseDto {
  /** @example "377a5d99-ee6d-4e6f-9197-713e0699ac93" */
  id: string;
  /** @example "Áo thun nam" */
  name: string;
  /** @example "Chất liệu cao cấp" */
  description: string;
  hasVariant: boolean;
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
  firstName: string;
  lastName: string;
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
  id: string;
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

export interface AddItemToCartDto {
  productVariantId: string;
  quantity: number;
}

export interface CartItemResponseDto {
  id: string;
  productVariant: ProductVariantResponseDto;
  quantity: number;
}

export interface CartResponseDto {
  id: string;
  cartItems: CartItemResponseDto[];
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

export interface UserProductResponseDto {
  id: string;
  name: string;
  description: string;
  price: number;
  productImages: ProductImageDetailResponseDto[];
}

export interface ListUserProductResponseDto {
  data: UserProductResponseDto[];
  paginate: PaginateMetaDto;
}

export interface UserProductDetailResponseDto {
  id: string;
  name: string;
  description: string;
  price: number;
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
}

export interface CreateAddressDto {
  address: string;
}

export interface AddressResponseDto {
  id: string;
  address: string;
}

export interface ListAddressResponseDto {
  data: AddressResponseDto[];
  paginate: PaginateMetaDto;
}

export interface UpdateAddressDto {
  address: string;
}

export interface CreatePaymentDto {
  orderId: string;
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
    securityData: SecurityDataType | null
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
    params2?: AxiosRequestConfig
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
          isFileType ? formItem : this.stringifyFormItem(formItem)
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
  SecurityDataType extends unknown
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
     * @name AuthControllerVerifyRegister
     * @summary VERIFY REGISTER REQUEST
     * @request POST:/api/v1/auth/register/verify/{id}
     */
    authControllerVerifyRegister: (
      id: string,
      data: VerifyRegisterDto,
      params: RequestParams = {}
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
      params: RequestParams = {}
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
      params: RequestParams = {}
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
      params: RequestParams = {}
    ) =>
      this.request<SuccessResponseDto, any>({
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
      params: RequestParams = {}
    ) =>
      this.request<SaveEntityResponseDto, any>({
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
        sortBy?: "email" | "createdAt";
        sortOrder?: "DESC" | "ASC";
      },
      params: RequestParams = {}
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
     * @tags [ADMIN] CATEGORIES MANAGEMANT
     * @name AdminCategoriesControllerCreate
     * @summary [ADMIN] CREATE CATEGORY
     * @request POST:/api/v1/admin/categories
     * @secure
     */
    adminCategoriesControllerCreate: (
      data: SaveCategoryDto,
      params: RequestParams = {}
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
      params: RequestParams = {}
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
      params: RequestParams = {}
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
     * @tags [ADMIN] PRODUCT MANAGEMENT
     * @name AdminProductControllerCreate
     * @summary [ADMIN] CREATE PRODUCT
     * @request POST:/api/v1/admin/product
     * @secure
     */
    adminProductControllerCreate: (
      data: CreateProductDto,
      params: RequestParams = {}
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
        categoriesIds?: string[];
      },
      params: RequestParams = {}
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
      this.request<ProductDetailResponseDto, any>({
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
      params: RequestParams = {}
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
      params: RequestParams = {}
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
      params: RequestParams = {}
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
      params: RequestParams = {}
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
      params: RequestParams = {}
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
      params: RequestParams = {}
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
      params: RequestParams = {}
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
      params: RequestParams = {}
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
      params: RequestParams = {}
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
      params: RequestParams = {}
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
      params: RequestParams = {}
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
      params: RequestParams = {}
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
      params: RequestParams = {}
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
     * @tags [USER] CART
     * @name CartControllerAddItemToCart
     * @summary [USER] ADD PRODUCT TO CART
     * @request POST:/api/v1/carts
     * @secure
     */
    cartControllerAddItemToCart: (
      data: AddItemToCartDto,
      params: RequestParams = {}
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
      this.request<CartResponseDto, any>({
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
      params: RequestParams = {}
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
      params: RequestParams = {}
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
      params: RequestParams = {}
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
      params: RequestParams = {}
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
      this.request<UserProductDetailResponseDto, any>({
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
      params: RequestParams = {}
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
      params: RequestParams = {}
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
     * @tags [USER] ADDRESS
     * @name AddressControllerCreate
     * @summary [USER] CREATE ADDRESS
     * @request POST:/api/v1/address
     * @secure
     */
    addressControllerCreate: (
      data: CreateAddressDto,
      params: RequestParams = {}
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
      params: RequestParams = {}
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
      params: RequestParams = {}
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
     * @tags [USER] PAYMENT
     * @name PaymentControllerCreate
     * @summary [USER] CREATE PAYMENT
     * @request POST:/api/v1/payment
     * @secure
     */
    paymentControllerCreate: (
      data: CreatePaymentDto,
      params: RequestParams = {}
    ) =>
      this.request<void, any>({
        path: `/api/v1/payment`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
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
  };
}
