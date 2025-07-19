# ActivityLogsApi

All URIs are relative to *http://localhost*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**activityLogControllerCreate**](#activitylogcontrollercreate) | **POST** /activity-logs | Записать новое действие пользователя|
|[**activityLogControllerFindAll**](#activitylogcontrollerfindall) | **GET** /activity-logs | Получить все логи активности (с фильтрацией по пользователю)|
|[**activityLogControllerFindBySession**](#activitylogcontrollerfindbysession) | **GET** /activity-logs/session/{sessionId} | Получить все логи по session_id|
|[**activityLogControllerFindOne**](#activitylogcontrollerfindone) | **GET** /activity-logs/{id} | Получить лог активности по ID|

# **activityLogControllerCreate**
> ActivityLogResponseDto activityLogControllerCreate(createActivityLogDto)


### Example

```typescript
import {
    ActivityLogsApi,
    Configuration,
    CreateActivityLogDto
} from './api';

const configuration = new Configuration();
const apiInstance = new ActivityLogsApi(configuration);

let createActivityLogDto: CreateActivityLogDto; //

const { status, data } = await apiInstance.activityLogControllerCreate(
    createActivityLogDto
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **createActivityLogDto** | **CreateActivityLogDto**|  | |


### Return type

**ActivityLogResponseDto**

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**201** | Действие успешно записано |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **activityLogControllerFindAll**
> Array<ActivityLogResponseDto> activityLogControllerFindAll()


### Example

```typescript
import {
    ActivityLogsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new ActivityLogsApi(configuration);

let userId: number; // (default to undefined)

const { status, data } = await apiInstance.activityLogControllerFindAll(
    userId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **userId** | [**number**] |  | defaults to undefined|


### Return type

**Array<ActivityLogResponseDto>**

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Список логов активности |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **activityLogControllerFindBySession**
> Array<ActivityLogResponseDto> activityLogControllerFindBySession()


### Example

```typescript
import {
    ActivityLogsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new ActivityLogsApi(configuration);

let sessionId: string; // (default to undefined)

const { status, data } = await apiInstance.activityLogControllerFindBySession(
    sessionId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **sessionId** | [**string**] |  | defaults to undefined|


### Return type

**Array<ActivityLogResponseDto>**

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Список логов по сессии |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **activityLogControllerFindOne**
> ActivityLogResponseDto activityLogControllerFindOne()


### Example

```typescript
import {
    ActivityLogsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new ActivityLogsApi(configuration);

let id: number; // (default to undefined)

const { status, data } = await apiInstance.activityLogControllerFindOne(
    id
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **id** | [**number**] |  | defaults to undefined|


### Return type

**ActivityLogResponseDto**

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Лог активности |  -  |
|**404** | Лог не найден |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

