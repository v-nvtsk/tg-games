# GameProgressResponseDto


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**id** | **number** | ID прогресса игры | [default to undefined]
**updatedAt** | **string** | Дата и время последнего обновления записи | [default to undefined]
**currentScene** | **string** | Текущая сцена | [default to undefined]
**currentEpisode** | **string** | Текущий эпизод | [optional] [default to undefined]
**hiddenScenes** | **Array&lt;string&gt;** | Список скрытых сцен | [default to undefined]
**user** | [**UserResponseDto**](UserResponseDto.md) | Информация о пользователе | [default to undefined]

## Example

```typescript
import { GameProgressResponseDto } from './api';

const instance: GameProgressResponseDto = {
    id,
    updatedAt,
    currentScene,
    currentEpisode,
    hiddenScenes,
    user,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
