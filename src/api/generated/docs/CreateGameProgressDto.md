# CreateGameProgressDto


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**score** | **number** | Текущий счет игры | [default to undefined]
**currentScene** | **string** | Текущая сцена | [default to undefined]
**lastPlayed** | **string** | Дата последнего обновления прогресса | [default to undefined]
**hiddenScenes** | **Array&lt;string&gt;** | Скрытые сцены | [optional] [default to undefined]
**currentEpisode** | [**CreateGameProgressDtoCurrentEpisode**](CreateGameProgressDtoCurrentEpisode.md) |  | [optional] [default to undefined]
**data** | **object** | Дополнительные данные прогресса игры (JSONB) | [default to undefined]

## Example

```typescript
import { CreateGameProgressDto } from './api';

const instance: CreateGameProgressDto = {
    score,
    currentScene,
    lastPlayed,
    hiddenScenes,
    currentEpisode,
    data,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
