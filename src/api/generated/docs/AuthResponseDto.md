# AuthResponseDto


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**accessToken** | **string** | Токен доступа для аутентифицированного пользователя | [default to undefined]
**user** | [**UserInfoDto**](UserInfoDto.md) | Базовая информация об аутентифицированном пользователе | [default to undefined]
**sessionId** | **string** | Идентификатор текущей сессии | [default to undefined]

## Example

```typescript
import { AuthResponseDto } from './api';

const instance: AuthResponseDto = {
    accessToken,
    user,
    sessionId,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
