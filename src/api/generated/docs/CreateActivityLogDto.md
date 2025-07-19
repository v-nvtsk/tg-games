# CreateActivityLogDto


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**userId** | **number** | ID пользователя | [default to undefined]
**action** | **string** | Действие | [default to undefined]
**details** | **object** | Детали действия | [optional] [default to undefined]
**sessionId** | **string** | ID сессии | [optional] [default to undefined]

## Example

```typescript
import { CreateActivityLogDto } from './api';

const instance: CreateActivityLogDto = {
    userId,
    action,
    details,
    sessionId,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
