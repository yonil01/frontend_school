import { Injectable } from '@angular/core';
import gql from 'graphql-tag';
import { Mutation, Query } from 'apollo-angular';
import { Response } from '@app/core/models';

@Injectable({
  providedIn: 'root',
})
export class GetProcessQuery extends Query<Response> {
  document = gql`
    query getProcess {
      getProcess {
        error
        data {
          id
          name
          description
          class
          ans
          project {
            id
          }
          process_root
          percent_alert
          process_doctypes {
            id
            doctype {
              id
              name
            }
          }
          process_roles {
            id
            role {
              id
              name
            }
          }
          queues {
            id
            name
          }
          type_process
          status
          document_id_bpmn
          document_id_svg
          document_id_ans
          version
          is_locked
          locked_info
          is_published
        }
        code
        type
        msg
      }
    }
  `;
}

@Injectable({
  providedIn: 'root',
})
export class GetProcessDistinctProcessRootQuery extends Query<Response> {
  document = gql`
    query getProcessDistinctProcessRoot {
      getProcessDistinctProcessRoot {
        error
        data {
          id
          name
          description
          class
          ans
          project {
            id
          }
          process_root
          percent_alert
          process_doctypes {
            id
            doctype {
              id
              name
            }
          }
          process_roles {
            id
            role {
              id
              name
            }
          }
          queues {
            id
            name
          }
          type_process
          status
          document_id_bpmn
          document_id_svg
          document_id_ans
          version
          is_locked
          locked_info
          is_published
        }
        code
        type
        msg
      }
    }
  `;
}

@Injectable({
  providedIn: 'root',
})
export class GetProcessByProjectIDQuery extends Query<Response> {
  document = gql`
    query getProcessByProjectID($project_id: String!) {
      getProcessByProjectID(project_id: $project_id) {
        error
        data {
          id
          name
          description
          class
          ans
          project {
            id
          }
          process_root
          percent_alert
          process_doctypes {
            id
            doctype {
              id
              name
            }
          }
          process_roles {
            id
            role {
              id
              name
            }
          }
          queues {
            id
            name
          }
          type_process
          status
          document_id_bpmn
          document_id_svg
          document_id_ans
          version
          is_locked
          locked_info
          is_published
        }
        code
        type
        msg
      }
    }
  `;
}

@Injectable({
  providedIn: 'root',
})
export class GetProcessByIDQuery extends Query<Response> {
  document = gql`
    query getProcessByID($id: String!) {
      getProcessByID(id: $id) {
        error
        data {
          id
          name
          description
          class
          ans
          process_root
          percent_alert
          type_process
          status
          project {
            id
          }
          document_id_bpmn
          document_id_svg
          document_id_ans
          version
          is_locked
          locked_info
          is_published
          process_doctypes {
            id
            doctype {
              id
              name
            }
          }
          process_roles {
            id
            role {
              id
              name
            }
          }
          queues {
            id
            name
            sequences
            balance_type
            class
            ans
            percent_alert
            status
            id_bpmn_element
            must_confirm_comment
            description
            comments {
              id
              comment
            }
            queue_attributes {
              id
              attribute {
                id
                name
              }
            }
            queue_roles {
              id
              role {
                id
                name
              }
            }
            executions {
              id
              name
              type
              class
              description
              rules {
                id
                code
                name
                status
                first
                child_true
                child_false
                action
                itemtype_id
                description
                rule_params {
                  id
                  name
                  value
                }
              }
              execution_roles {
                id
                role {
                  id
                  name
                }
              }
            }
          }
        }
        code
        type
        msg
      }
    }
  `;
}

@Injectable({
  providedIn: 'root',
})
export class GetLockInfoQuery extends Query<Response> {
  document = gql`
    query getProcessByID($id: String!) {
      getProcessByID(id: $id) {
        error
        data {
          is_locked
          locked_info
        }
        code
        type
        msg
      }
    }
  `;
}

@Injectable({
  providedIn: 'root',
})
export class CreateProcessQuery extends Mutation {
  document = gql`
    mutation createProcess($request: RequestNewProcess!) {
      createProcess(input: $request) {
        error
        data {
          id
        }
        code
        type
        msg
      }
    }
  `;
}

@Injectable({
  providedIn: 'root',
})
export class UpdateProcessQuery extends Mutation {
  document = gql`
    mutation updateProcess($request: RequestUpdateProcess!) {
      updateProcess(input: $request) {
        error
        data {
          id
        }
        code
        type
        msg
      }
    }
  `;
}

@Injectable({
  providedIn: 'root',
})
export class LockProcessQuery extends Mutation {
  document = gql`
    mutation lockProcess($id: String!) {
      lockProcess(id: $id) {
        error
        code
        type
        msg
      }
    }
  `;
}

@Injectable({
  providedIn: 'root',
})
export class UnlockProcessQuery extends Mutation {
  document = gql`
    mutation unlockProcess($id: String!) {
      unlockProcess(id: $id) {
        error
        code
        type
        msg
      }
    }
  `;
}

@Injectable({
  providedIn: 'root',
})
export class DeleteBpmQuery extends Mutation {
  document = gql`
    mutation deleteBpm($id: String!) {
      deleteBpm(id: $id) {
        error
        code
        type
        msg
      }
    }
  `;
}

@Injectable({
  providedIn: 'root',
})
export class GetProcessByProcessRootIDQuery extends Mutation {
  document = gql`
    query getProcessByProcessRootID($id: String!) {
      getProcessByProcessRootID(process_root: $id) {
        error
        data {
          id
          version
          process_root
        }
        code
        type
        msg
      }
    }
  `;
}

@Injectable({
  providedIn: 'root',
})
export class PublishBpmQuery extends Mutation {
  document = gql`
    mutation publishProcess($id: String!, $processRoot: String!) {
      publishProcess(id: $id, ProcessRoot: $processRoot) {
        error
        data {
          id
        }
        code
        type
        msg
      }
    }
  `;
}

@Injectable({
  providedIn: 'root',
})
export class CreateProcessRoleQuery extends Mutation {
  document = gql`
    mutation createProcessRole($request: RequestNewProcessRole!) {
      createProcessRole(input: $request) {
        error
        data {
          id
        }
        code
        type
        msg
      }
    }
  `;
}

@Injectable({
  providedIn: 'root',
})
export class DeleteProcessRoleQuery extends Mutation {
  document = gql`
    mutation deleteProcessRole($id: String!) {
      deleteProcessRole(id: $id) {
        error
        data {
          id
        }
        code
        type
        msg
      }
    }
  `;
}

@Injectable({
  providedIn: 'root',
})
export class CreateProcessRolesQuery extends Mutation {
  document = gql`
    mutation createProcessRoles($request: RequestNewProcessRoles!) {
      createProcessRoles(input: $request) {
        error
        data {
          id
        }
        code
        type
        msg
      }
    }
  `;
}

@Injectable({
  providedIn: 'root',
})
export class CreateProcessDoctypeQuery extends Mutation {
  document = gql`
    mutation createProcessDoctype($request: RequestNewProcessDoctype!) {
      createProcessDoctype(input: $request) {
        error
        data {
          id
        }
        code
        type
        msg
      }
    }
  `;
}

@Injectable({
  providedIn: 'root',
})
export class DeleteProcessDoctypeQuery extends Mutation {
  document = gql`
    mutation deleteProcessDoctype($id: String!) {
      deleteProcessDoctype(id: $id) {
        error
        data {
          id
        }
        code
        type
        msg
      }
    }
  `;
}

@Injectable({
  providedIn: 'root',
})
export class CreateProcessDoctypesQuery extends Mutation {
  document = gql`
    mutation createProcessDoctypes($request: RequestNewProcessDoctypes!) {
      createProcessDoctypes(input: $request) {
        error
        data {
          id
        }
        code
        type
        msg
      }
    }
  `;
}

@Injectable({
  providedIn: 'root',
})
export class CreateQueueQuery extends Mutation {
  document = gql`
    mutation createQueue($request: RequestNewQueue!) {
      createQueue(input: $request) {
        error
        data {
          id
        }
        code
        type
        msg
      }
    }
  `;
}

@Injectable({
  providedIn: 'root',
})
export class UpdateQueueQuery extends Mutation {
  document = gql`
    mutation updateQueue($request: RequestUpdateQueue!) {
      updateQueue(input: $request) {
        error
        data {
          id
        }
        code
        type
        msg
      }
    }
  `;
}

@Injectable({
  providedIn: 'root',
})
export class DeleteQueueQuery extends Mutation {
  document = gql`
    mutation deleteQueue($id: String!) {
      deleteQueue(id: $id) {
        error
        code
        type
        msg
      }
    }
  `;
}

@Injectable({
  providedIn: 'root',
})
export class CreateQueueCommentQuery extends Mutation {
  document = gql`
    mutation createQueueComment($request: RequestNewQueueComment!) {
      createQueueComment(input: $request) {
        error
        data {
          id
        }
        code
        type
        msg
      }
    }
  `;
}

@Injectable({
  providedIn: 'root',
})
export class UpdateQueueCommentQuery extends Mutation {
  document = gql`
    mutation updateQueueComment($request: RequestUpdateQueueComment!) {
      updateQueueComment(input: $request) {
        error
        data {
          id
        }
        code
        type
        msg
      }
    }
  `;
}

@Injectable({
  providedIn: 'root',
})
export class DeleteQueueCommentQuery extends Mutation {
  document = gql`
    mutation deleteQueueComment($id: String!) {
      deleteQueueComment(id: $id) {
        error
        code
        type
        msg
      }
    }
  `;
}

@Injectable({
  providedIn: 'root',
})
export class CreateQueueRoleQuery extends Mutation {
  document = gql`
    mutation createQueueRole($request: RequestNewQueueRole!) {
      createQueueRole(input: $request) {
        error
        data {
          id
        }
        code
        type
        msg
      }
    }
  `;
}

@Injectable({
  providedIn: 'root',
})
export class DeleteQueueRoleQuery extends Mutation {
  document = gql`
    mutation deleteQueueRole($id: String!) {
      deleteQueueRole(id: $id) {
        error
        data {
          id
        }
        code
        type
        msg
      }
    }
  `;
}

@Injectable({
  providedIn: 'root',
})
export class CreateQueueAttributeQuery extends Mutation {
  document = gql`
    mutation createQueueAttribute($request: RequestNewQueueAttribute!) {
      createQueueAttribute(input: $request) {
        error
        data {
          id
        }
        code
        type
        msg
      }
    }
  `;
}

@Injectable({
  providedIn: 'root',
})
export class DeleteQueueAttributeQuery extends Mutation {
  document = gql`
    mutation deleteQueueAttribute($id: String!) {
      deleteQueueAttribute(id: $id) {
        error
        data {
          id
        }
        code
        type
        msg
      }
    }
  `;
}

@Injectable({
  providedIn: 'root',
})
export class CreateExecutionQuery extends Mutation {
  document = gql`
    mutation createExecution($request: RequestNewExecution!) {
      createExecution(input: $request) {
        error
        data {
          id
        }
        code
        type
        msg
      }
    }
  `;
}

@Injectable({
  providedIn: 'root',
})
export class UpdateExecutionQuery extends Mutation {
  document = gql`
    mutation updateExecution($request: RequestUpdateExecution!) {
      updateExecution(input: $request) {
        error
        data {
          id
        }
        code
        code
        type
        msg
      }
    }
  `;
}

@Injectable({
  providedIn: 'root',
})
export class DeleteExecutionQuery extends Mutation {
  document = gql`
    mutation deleteExecution($id: String!) {
      deleteExecution(id: $id) {
        error
        code
        type
        msg
      }
    }
  `;
}

@Injectable({
  providedIn: 'root',
})
export class CreateExecutionRoleQuery extends Mutation {
  document = gql`
    mutation createExecutionRole($request: RequestNewExecutionRole!) {
      createExecutionRole(input: $request) {
        error
        data {
          id
        }
        code
        type
        msg
      }
    }
  `;
}

@Injectable({
  providedIn: 'root',
})
export class DeleteExecutionRoleQuery extends Mutation {
  document = gql`
    mutation deleteExecutionRole($id: String!) {
      deleteExecutionRole(id: $id) {
        error
        code
        type
        msg
      }
    }
  `;
}

@Injectable({
  providedIn: 'root',
})
export class CreateExecutionRuleQuery extends Mutation {
  document = gql`
    mutation createExecutionRule($request: RequestNewRule!) {
      createExecutionRule(input: $request) {
        error
        data {
          id
          name
        }
        code
        type
        msg
      }
    }
  `;
}

@Injectable({
  providedIn: 'root',
})
export class UpdateExecutionRuleQuery extends Mutation {
  document = gql`
    mutation updateExecutionRule($request: RequestUpdateRule!) {
      updateExecutionRule(input: $request) {
        error
        data {
          id
        }
        code
        type
        msg
      }
    }
  `;
}

@Injectable({
  providedIn: 'root',
})
export class CreateRuleParamsQuery extends Mutation {
  document = gql`
    mutation createRuleParams($request: RequestNewRuleParam!) {
      createRuleParams(input: $request) {
        error
        data {
          id
        }
        code
        type
        msg
      }
    }
  `;
}

@Injectable({
  providedIn: 'root',
})
export class UpdateRuleParamsQuery extends Mutation {
  document = gql`
    mutation updateRuleParams($request: RequestUpdateRuleParam!) {
      updateRuleParams(input: $request) {
        error
        data {
          id
        }
        code
        type
        msg
      }
    }
  `;
}

@Injectable({
  providedIn: 'root',
})
export class DeleteExecutionRuleQuery extends Mutation {
  document = gql`
    mutation deleteExecutionRule($id: String!) {
      deleteExecutionRule(id: $id) {
        error
        code
        type
        msg
      }
    }
  `;
}

@Injectable({
  providedIn: 'root',
})
export class DeleteRuleParamsByRuleIDQuery extends Mutation {
  document = gql`
    mutation deleteRuleParamsByRuleID($rule_id: ID!) {
      deleteRuleParamsByRuleID(rule_id: $rule_id) {
        error
        code
        type
        msg
      }
    }
  `;
}
