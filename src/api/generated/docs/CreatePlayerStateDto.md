# CreatePlayerStateDto


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**hunger** | **number** | Текущее здоровье игрока | [default to undefined]
**energy** | **number** | Текущая энергия игрока | [default to undefined]
**inventory** | **Array&lt;object&gt;** | Инвентарь игрока (JSONB) | [default to undefined]
**data** | **object** | Дополнительные данные состояния игрока (JSONB) | [default to undefined]

## Example

```typescript
import { CreatePlayerStateDto } from './api';

const instance: CreatePlayerStateDto = {
    hunger,
    energy,
    inventory,
    data,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
