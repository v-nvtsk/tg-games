# UpdatePlayerStateDto


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**hunger** | **number** | Текущее здоровье игрока | [optional] [default to undefined]
**energy** | **number** | Текущая энергия игрока | [optional] [default to undefined]
**inventory** | **Array&lt;object&gt;** | Инвентарь игрока (JSONB) | [optional] [default to undefined]
**data** | **object** | Дополнительные данные состояния игрока (JSONB) | [optional] [default to undefined]

## Example

```typescript
import { UpdatePlayerStateDto } from './api';

const instance: UpdatePlayerStateDto = {
    hunger,
    energy,
    inventory,
    data,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
