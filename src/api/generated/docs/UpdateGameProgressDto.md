# UpdateGameProgressDto


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**score** | **number** | Текущий счет игры | [optional] [default to undefined]
**currentScene** | **string** | Текущая сцена | [optional] [default to undefined]
**lastPlayed** | **string** | Дата последнего обновления прогресса | [optional] [default to undefined]
**data** | **object** | Дополнительные данные прогресса игры (JSONB) | [optional] [default to undefined]

## Example

```typescript
import { UpdateGameProgressDto } from './api';

const instance: UpdateGameProgressDto = {
    score,
    currentScene,
    lastPlayed,
    data,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
