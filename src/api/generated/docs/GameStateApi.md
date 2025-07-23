# GameStateApi

All URIs are relative to *http://localhost*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**gameStateControllerCreateOrUpdateGameProgress**](#gamestatecontrollercreateorupdategameprogress) | **POST** /game-state/game-progress | Создать или обновить прогресс игры|
|[**gameStateControllerCreateOrUpdatePlayerState**](#gamestatecontrollercreateorupdateplayerstate) | **POST** /game-state/player-state | Создать или обновить состояние игрока|
|[**gameStateControllerDeleteGameProgress**](#gamestatecontrollerdeletegameprogress) | **DELETE** /game-state/game-progress | Удалить прогресс игры|
|[**gameStateControllerDeletePlayerState**](#gamestatecontrollerdeleteplayerstate) | **DELETE** /game-state/player-state | Удалить состояние игрока|
|[**gameStateControllerGetGameProgress**](#gamestatecontrollergetgameprogress) | **GET** /game-state/game-progress | Получить прогресс игры|
|[**gameStateControllerGetPlayerState**](#gamestatecontrollergetplayerstate) | **GET** /game-state/player-state | Получить состояние игрока|
|[**gameStateControllerUpdateGameProgress**](#gamestatecontrollerupdategameprogress) | **PATCH** /game-state/game-progress | Обновить прогресс игры|
|[**gameStateControllerUpdatePlayerState**](#gamestatecontrollerupdateplayerstate) | **PATCH** /game-state/player-state | Обновить состояние игрока|

# **gameStateControllerCreateOrUpdateGameProgress**
> GameProgressResponseDto gameStateControllerCreateOrUpdateGameProgress(createGameProgressDto)


### Example

```typescript
import {
    GameStateApi,
    Configuration,
    CreateGameProgressDto
} from './api';

const configuration = new Configuration();
const apiInstance = new GameStateApi(configuration);

let createGameProgressDto: CreateGameProgressDto; //

const { status, data } = await apiInstance.gameStateControllerCreateOrUpdateGameProgress(
    createGameProgressDto
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **createGameProgressDto** | **CreateGameProgressDto**|  | |


### Return type

**GameProgressResponseDto**

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**201** | Прогресс игры успешно создан/обновлен. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **gameStateControllerCreateOrUpdatePlayerState**
> PlayerStateResponseDto gameStateControllerCreateOrUpdatePlayerState(createPlayerStateDto)


### Example

```typescript
import {
    GameStateApi,
    Configuration,
    CreatePlayerStateDto
} from './api';

const configuration = new Configuration();
const apiInstance = new GameStateApi(configuration);

let createPlayerStateDto: CreatePlayerStateDto; //

const { status, data } = await apiInstance.gameStateControllerCreateOrUpdatePlayerState(
    createPlayerStateDto
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **createPlayerStateDto** | **CreatePlayerStateDto**|  | |


### Return type

**PlayerStateResponseDto**

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**201** | Состояние игрока успешно создано/обновлено. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **gameStateControllerDeleteGameProgress**
> gameStateControllerDeleteGameProgress()


### Example

```typescript
import {
    GameStateApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new GameStateApi(configuration);

const { status, data } = await apiInstance.gameStateControllerDeleteGameProgress();
```

### Parameters
This endpoint does not have any parameters.


### Return type

void (empty response body)

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**204** | Прогресс игры успешно удален. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **gameStateControllerDeletePlayerState**
> gameStateControllerDeletePlayerState()


### Example

```typescript
import {
    GameStateApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new GameStateApi(configuration);

const { status, data } = await apiInstance.gameStateControllerDeletePlayerState();
```

### Parameters
This endpoint does not have any parameters.


### Return type

void (empty response body)

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**204** | Состояние игрока успешно удалено. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **gameStateControllerGetGameProgress**
> GameProgressResponseDto gameStateControllerGetGameProgress()


### Example

```typescript
import {
    GameStateApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new GameStateApi(configuration);

const { status, data } = await apiInstance.gameStateControllerGetGameProgress();
```

### Parameters
This endpoint does not have any parameters.


### Return type

**GameProgressResponseDto**

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Прогресс игры успешно получен. |  -  |
|**404** | Прогресс игры не найден. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **gameStateControllerGetPlayerState**
> PlayerStateResponseDto gameStateControllerGetPlayerState()


### Example

```typescript
import {
    GameStateApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new GameStateApi(configuration);

const { status, data } = await apiInstance.gameStateControllerGetPlayerState();
```

### Parameters
This endpoint does not have any parameters.


### Return type

**PlayerStateResponseDto**

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Состояние игрока успешно получено. |  -  |
|**404** | Состояние игрока не найдено. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **gameStateControllerUpdateGameProgress**
> GameProgressResponseDto gameStateControllerUpdateGameProgress(updateGameProgressDto)


### Example

```typescript
import {
    GameStateApi,
    Configuration,
    UpdateGameProgressDto
} from './api';

const configuration = new Configuration();
const apiInstance = new GameStateApi(configuration);

let updateGameProgressDto: UpdateGameProgressDto; //

const { status, data } = await apiInstance.gameStateControllerUpdateGameProgress(
    updateGameProgressDto
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **updateGameProgressDto** | **UpdateGameProgressDto**|  | |


### Return type

**GameProgressResponseDto**

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Прогресс игры успешно обновлен. |  -  |
|**404** | Прогресс игры не найден. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **gameStateControllerUpdatePlayerState**
> PlayerStateResponseDto gameStateControllerUpdatePlayerState(updatePlayerStateDto)


### Example

```typescript
import {
    GameStateApi,
    Configuration,
    UpdatePlayerStateDto
} from './api';

const configuration = new Configuration();
const apiInstance = new GameStateApi(configuration);

let updatePlayerStateDto: UpdatePlayerStateDto; //

const { status, data } = await apiInstance.gameStateControllerUpdatePlayerState(
    updatePlayerStateDto
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **updatePlayerStateDto** | **UpdatePlayerStateDto**|  | |


### Return type

**PlayerStateResponseDto**

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Состояние игрока успешно обновлено. |  -  |
|**404** | Состояние игрока не найдено. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

