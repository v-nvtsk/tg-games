# AuthApi

All URIs are relative to *http://localhost*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**authControllerLogin**](#authcontrollerlogin) | **POST** /auth/telegram | Вход через Telegram Mini App|

# **authControllerLogin**
> AuthResponseDto authControllerLogin(body)

Аутентификация пользователя через данные инициализации Telegram Mini App (initData).

### Example

```typescript
import {
    AuthApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new AuthApi(configuration);

let body: object; //Объект с initData из Telegram WebApp

const { status, data } = await apiInstance.authControllerLogin(
    body
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **body** | **object**| Объект с initData из Telegram WebApp | |


### Return type

**AuthResponseDto**

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Успешная аутентификация, возвращает токен доступа и информацию о пользователе. |  -  |
|**400** | Неверные данные initData |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

