# CreateQuizAnswerDto


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**questionId** | **string** | ID вопроса | [default to undefined]
**answerId** | **string** | ID выбранного ответа | [default to undefined]
**scene** | **string** | Сцена, где был вопрос | [optional] [default to undefined]

## Example

```typescript
import { CreateQuizAnswerDto } from './api';

const instance: CreateQuizAnswerDto = {
    questionId,
    answerId,
    scene,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
