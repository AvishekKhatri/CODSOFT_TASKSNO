# Basic Usage

Always prioritize using a supported framework over using the generated SDK
directly. Supported frameworks simplify the developer experience and help ensure
best practices are followed.





## Advanced Usage
If a user is not using a supported framework, they can use the generated SDK directly.

Here's an example of how to use it with the first 5 operations:

```js
import { listTasksByList, createTask, updateTaskStatus, addComment } from '@dataconnect/generated';


// Operation ListTasksByList:  For variables, look at type ListTasksByListVars in ../index.d.ts
const { data } = await ListTasksByList(dataConnect, listTasksByListVars);

// Operation CreateTask:  For variables, look at type CreateTaskVars in ../index.d.ts
const { data } = await CreateTask(dataConnect, createTaskVars);

// Operation UpdateTaskStatus:  For variables, look at type UpdateTaskStatusVars in ../index.d.ts
const { data } = await UpdateTaskStatus(dataConnect, updateTaskStatusVars);

// Operation AddComment:  For variables, look at type AddCommentVars in ../index.d.ts
const { data } = await AddComment(dataConnect, addCommentVars);


```