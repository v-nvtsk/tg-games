# UserInfoDto


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**id** | **number** | ID пользователя в системе | [default to undefined]
**firstName** | **string** | Имя пользователя | [default to undefined]
**lastName** | **object** | Фамилия пользователя (опционально) | [optional] [default to undefined]
**username** | **object** | Username в Telegram (опционально) | [optional] [default to undefined]
**role** | **string** | Роль пользователя | [default to undefined]
**sessionId** | **string** | Идентификатор текущей сессии | [optional] [default to undefined]

## Example

```typescript
import { UserInfoDto } from './api';

const instance: UserInfoDto = {
    id,
    firstName,
    lastName,
    username,
    role,
    sessionId,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
